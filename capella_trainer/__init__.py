# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import yaml
from starlette.staticfiles import StaticFiles

from capella_trainer.constants import TRAINING_DIR, CAPELLA_ENDPOINT
from capella_trainer.folder import Folder
from capella_trainer.lesson import Lesson
from capella_trainer.quiz import Quiz
from capella_trainer.tasks import TaskResult

app = FastAPI()

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

    @staticmethod
    def from_path():
        """
        Read the training metadata and resolve the root folder
        """
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
            return Training(
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
app.mount("/static-training", StaticFiles(directory="training"), name="static-training")


@app.get("/training")
async def get_training() -> Training:
    return training


@app.post("/training/lesson/{lesson_path:path}/checks")
async def run_training_lesson_checks(lesson_path: str) -> list[TaskResult]:
    lesson = training.root.get_child(lesson_path.split("/"))
    return lesson.run_checks()


@app.get("/training/lesson/{lesson_path:path}/quiz")
async def get_quiz(lesson_path: str) -> Quiz:
    return Quiz.from_path(lesson_path.split("/"))


@app.post("/training/lesson/{lesson_path:path}/load_project")
async def load_lesson_model(lesson_path: str):
    lesson = training.root.get_child(lesson_path.split("/"))
    if not lesson.has_start_model:
        raise FileNotFoundError("Lesson does not have a start model")

    httpx.post(
        f"{CAPELLA_ENDPOINT}/projects",
        json={"location": os.path.join(TRAINING_DIR, lesson.start_project.path)},
    )

    httpx.post(f"{CAPELLA_ENDPOINT}/projects/{lesson.start_project.name}/open")


@app.post("/training/lesson/{lesson_path:path}/load_solution_project")
async def load_lesson_model_solution(lesson_path: str):
    lesson = training.root.get_child(lesson_path.split("/"))
    if not lesson.solution_project:
        raise FileNotFoundError("Lesson does not have a solution model")

    httpx.post(
        f"{CAPELLA_ENDPOINT}/projects",
        json={"location": os.path.join(TRAINING_DIR, lesson.solution_project.path)},
    )

    httpx.post(f"{CAPELLA_ENDPOINT}/projects/{lesson.solution_project.name}/open")


@app.get("/training/lesson/{lesson_path:path}")
async def get_training_lesson(lesson_path: str) -> Lesson:
    return training.root.get_child(lesson_path.split("/"))
