# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0
import datetime
import logging
import os
import time
import typing as t
from enum import Enum

import httpx
import prometheus_client
import starlette.responses
import starlette.types
import yaml
from fastapi import APIRouter, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from pydantic import BaseModel, Field
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.staticfiles import StaticFiles

from capella_trainer.constants import (
    CAPELLA_ENDPOINT,
    HOST_FRONTEND,
    ROUTE_PREFIX,
    TRAINING_DIR,
)
from capella_trainer.exercise import TaskResult
from capella_trainer.folder import Folder
from capella_trainer.lesson import Lesson
from capella_trainer.quiz import Quiz
from capella_trainer.session import Session

logger = logging.getLogger("uvicorn.error")
app = FastAPI()

instrumentator = Instrumentator()

IDLETIME = prometheus_client.Gauge(
    "idletime_minutes", "Idletime of the Jupyter server in minutes."
)


def get_idletime() -> float:
    if not hasattr(app, "last_request"):
        return -1.0
    idletime = (datetime.datetime.now() - app.last_request).seconds / 60
    return round(idletime, 2)


IDLETIME.set_function(get_idletime)

instrumentator.instrument(app).expose(app)

router = APIRouter(prefix=ROUTE_PREFIX)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Training(BaseModel):
    name: str
    description: str
    author: str
    difficulty: int = Field(ge=1, le=5)
    duration: str
    root: Folder = Field(description="Root folder of the training.")

    @classmethod
    def from_path(cls) -> t.Self:
        """Read the training metadata and resolve the root folder."""
        training_meta_file_path = os.path.join(TRAINING_DIR, "training.yaml")
        if not os.path.exists(training_meta_file_path):
            raise FileNotFoundError("training.yaml not found")

        with open(training_meta_file_path) as f:
            meta = yaml.safe_load(f)
            name = meta["name"]
            description = meta["description"]
            author = meta["author"]
            difficulty = meta["difficulty"]
            duration = meta["duration"]
            root = Folder.from_path([])
            return cls(
                name=name,
                description=description,
                author=author,
                difficulty=difficulty,
                duration=duration,
                root=root,
            )


training = Training.from_path()
print(training)


# This exposes all files in the training directory under /static-training
# Since there's no sensitive information in the training files, this is fine
# So don't store sensitive information in there.
app.mount(
    f"{ROUTE_PREFIX}/static-training",
    StaticFiles(directory=TRAINING_DIR),
    name="static-training",
)


@router.get("/training")
async def get_training() -> Training:
    return training


@router.post("/training/lesson/{lesson_path:path}/exercise")
async def run_training_lesson_checks(lesson_path: str) -> list[TaskResult]:
    lesson = training.root.get_lesson(lesson_path.split("/"))
    try:
        checks = lesson.run_exercise_checks()
    except FileNotFoundError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex
    return checks


@router.get("/training/lesson/{lesson_path:path}/quiz")
async def get_quiz(lesson_path: str) -> Quiz:
    return Quiz.from_path(lesson_path.split("/"))


def close_projects() -> None:
    try:
        logger.debug("Getting all projects to close")
        res = httpx.get(f"{CAPELLA_ENDPOINT}/projects")
        res.raise_for_status()
        projects = res.json()
        logger.debug("Found %s projects to close", projects)
    except httpx.HTTPError as ex:
        logger.exception("Failed to get all projects")
        raise HTTPException(
            status_code=500, detail="Failed to get all projects"
        ) from ex

    for project in projects:
        try:
            logger.debug("Closing project %s", project["name"])
            res = httpx.post(
                f"{CAPELLA_ENDPOINT}/projects/{project['name']}/close"
            )
            res.raise_for_status()
        except httpx.HTTPError as ex:
            logger.exception("Failed to close project %s", project["name"])
            raise HTTPException(
                status_code=500, detail="Failed to close project"
            ) from ex
        else:
            logger.debug("Closed project %s", project["name"])

        try:
            logger.debug("Deleting project %s from workspace", project["name"])
            res = httpx.delete(
                f"{CAPELLA_ENDPOINT}/projects/{project['name']}?deleteContents=false"
            )
            res.raise_for_status()
        except httpx.HTTPError as ex:
            logger.exception(
                "Failed to delete project %s from workspace", project["name"]
            )
            raise HTTPException(
                status_code=500,
                detail="Failed to delete project from workspace",
            ) from ex
        else:
            logger.debug("Deleted project %s from workspace", project["name"])


@router.post("/training/lesson/{lesson_path:path}/load_project")
async def load_lesson_project(lesson_path: str) -> None:
    lesson = training.root.get_lesson(lesson_path.split("/"))
    if not lesson.start_project:
        raise FileNotFoundError("Lesson does not have a start start-project")

    logger.info("Closing all projects")
    close_projects()

    logger.info("Creating working project")
    lesson.create_working_project()

    time.sleep(1)  # Wait for the project to be created

    try:
        logger.info("Loading project")
        res = httpx.post(
            f"{CAPELLA_ENDPOINT}/projects",
            json={"location": lesson.container_working_project_path},
        )
        res.raise_for_status()
    except httpx.HTTPError as ex:
        raise HTTPException(
            status_code=500, detail="Failed to load project"
        ) from ex


class ProjectStatus(Enum):
    UNLOADED = "UNLOADED"
    WORKING = "WORKING"
    WRONG_PROJECT = "WRONG_PROJECT"
    UNKNOWN = "UNKNOWN"


@router.get("/training/lesson/{lesson_path:path}/project_status")
async def get_project_status(lesson_path: str) -> ProjectStatus:
    app.last_request = datetime.datetime.now()  # type: ignore[attr-defined]
    lesson = training.root.get_lesson(lesson_path.split("/"))
    try:
        res = httpx.get(f"{CAPELLA_ENDPOINT}/projects")
        res.raise_for_status()
        projects = res.json()
        logger.debug("Got projects: %s", projects)
    except httpx.HTTPError:
        logger.exception("Failed to get projects")
        return ProjectStatus.UNKNOWN
    if len(projects) == 0:
        return ProjectStatus.UNLOADED

    project_path = projects[0]["location"]
    logger.debug("Open project path is %s", project_path)
    logger.debug("Target path is %s", lesson.container_working_project_path)
    if project_path == lesson.container_working_project_path:
        return ProjectStatus.WORKING
    if project_path.endswith("project"):
        return ProjectStatus.WRONG_PROJECT
    return ProjectStatus.UNKNOWN


@router.get("/training/lesson/{lesson_path:path}")
async def get_training_lesson(lesson_path: str) -> Lesson:
    return training.root.get_lesson(lesson_path.split("/"))


@router.get("/session")
async def get_session() -> Session:
    return Session.read("/".join(training.root.get_first_lesson().path))


@router.post("/session")
async def set_session(session: Session) -> Session:
    session.write()
    return session


class SPAStaticFiles(StaticFiles):
    async def get_response(
        self, path: str, scope: starlette.types.Scope
    ) -> starlette.responses.Response:
        try:
            return await super().get_response(path, scope)
        except (HTTPException, StarletteHTTPException) as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            raise ex


app.include_router(router)

if HOST_FRONTEND:
    app.mount(
        f"{ROUTE_PREFIX}/",
        SPAStaticFiles(directory="/app/frontend/dist", html=True),
        name="spa-static-files",
    )
