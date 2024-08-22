# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0
import importlib
from typing import Self

import capellambse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import frontmatter
import yaml
from starlette.staticfiles import StaticFiles

from capella_trainer.tasks import TaskResult

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TRAINING_DIR = os.path.abspath("./training")


class Element(BaseModel):
    name: str = Field(description="Display name of the element.")
    path: list[str] = Field(description="Path to the element.")
    slug: str = Field(description="Filename of the element.")
    type: str = Field(description="Type of the element.")


class Lesson(Element):
    content: str = Field(description="Markdown content")
    # TODO: temporary fields for testing
    has_tasks: bool = Field(default=False, description="Whether the lesson has tasks.")
    has_start_model: bool = Field(
        default=False, description="Whether the lesson has a start model."
    )
    has_end_model: bool = Field(
        default=False, description="Whether the lesson has an end model."
    )
    type: str = Field(default="lesson", description="Type of the element.")

    @staticmethod
    def from_path(path_name: list[str]):
        """
        Read the content of the lesson
        :param path_name: lesson name
        """
        file_system_path = os.path.join(TRAINING_DIR, *path_name)

        if not os.path.exists(file_system_path):
            raise FileNotFoundError(f"Lesson {path_name} not found.")

        if not os.path.isdir(file_system_path):
            raise NotADirectoryError(f"{path_name} is not a folder.")

        lesson_content = os.path.join(file_system_path, "content.mdx")
        if os.path.exists(lesson_content):
            with open(lesson_content) as f:
                post = frontmatter.load(f)
                name = post["title"]
                content = post.content
                slug = path_name[-1]

                has_tasks = os.path.exists(os.path.join(file_system_path, "tasks.py"))
                has_start_model = os.path.exists(
                    os.path.join(file_system_path, ".start_model")
                )
                has_end_model = os.path.exists(
                    os.path.join(file_system_path, ".end_model")
                )
                return Lesson(
                    name=name,
                    content=content,
                    path=path_name,
                    slug=slug,
                    has_tasks=has_tasks,
                    has_start_model=has_start_model,
                    has_end_model=has_end_model,
                )
        else:
            raise FileNotFoundError(f"content.mdx not found in {path_name}")

    def run_checks(self) -> list[TaskResult]:
        """
        Get the task results for the lesson
        """

        tasks_file_system_path = os.path.join(TRAINING_DIR, *self.path, "tasks.py")

        if not os.path.exists(tasks_file_system_path):
            raise FileNotFoundError("Lesson not found")

        tasks_module_name = f"training.{'.'.join(self.path)}.tasks"

        tasks_module = importlib.import_module(tasks_module_name)
        # TODO: this should use the network-mounted model and also pass the API client
        model = capellambse.MelodyModel(
            "./training/02-first-tests/model/PVMT_Demo.aird"
        )
        return tasks_module.tasks.check_tasks(model)


class Folder(Element):
    children: list[Self | Lesson] = Field(description="List of lessons and folders.")
    type: str = Field(default="folder", description="Type of the element.")

    @staticmethod
    def from_path(path_name: list[str]):
        """
        Resolve the folder and its children
        :param path_name: folder name
        """
        children = []

        filesystem_path = os.path.join(TRAINING_DIR, *path_name)
        if not os.path.exists(filesystem_path):
            raise FileNotFoundError(f"Folder {path_name} not found.")

        if not os.path.isdir(filesystem_path):
            raise NotADirectoryError(f"{path_name} is not a folder.")

        folder_meta = os.path.join(filesystem_path, "meta.yaml")
        slug = len(path_name) > 0 and path_name[-1] or ""
        if os.path.exists(folder_meta):
            with open(folder_meta) as f:
                meta = yaml.safe_load(f)
                name = meta["name"]
        else:
            raise FileNotFoundError(f"meta.yaml not found in {path_name}")

        for file_name in os.listdir(filesystem_path):
            # folders have a meta.yaml file
            # lessons have a content.mdx file
            # ignore other files
            if not os.path.isdir(os.path.join(filesystem_path, file_name)):
                continue

            if os.path.exists(os.path.join(filesystem_path, file_name, "meta.yaml")):
                children.append(Folder.from_path(path_name + [file_name]))
            elif os.path.exists(
                os.path.join(filesystem_path, file_name, "content.mdx")
            ):
                children.append(Lesson.from_path(path_name + [file_name]))

        return Folder(name=name, path=path_name, children=children, slug=slug)

    def get_child(self, path: list[str]) -> Self | Lesson:
        """
        Get the child folder or lesson by path
        :param path: path to the child
        """
        if not path:
            return self

        for child in self.children:
            if isinstance(child, Lesson) and child.slug == path[0]:
                return child
            if isinstance(child, Folder) and child.path == path[:-1]:
                return child.get_child(path[1:])

        raise FileNotFoundError(f"Child {path} not found.")


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
        Read the training meta data and resolve the root folder
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


@app.get("/training/lesson/{lesson_path:path}")
async def training_lesson(lesson_path: str) -> Lesson:
    return training.root.get_child(lesson_path.split("/"))


@app.post("/training/lesson/{lesson_path:path}/checks")
async def run_training_lesson_checks(lesson_path: str) -> list[TaskResult]:
    lesson = training.root.get_child(lesson_path.split("/"))
    return lesson.run_checks()
