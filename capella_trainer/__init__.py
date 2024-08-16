# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0
import importlib

from fastapi import FastAPI
from pydantic import BaseModel, Field
import os
import frontmatter
import yaml

from capella_trainer.tasks import TaskResult

app = FastAPI()

TRAINING_DIR = "C:\\Users\\Tobias\\PycharmProjects\\capella-trainer\\training"


class Training(BaseModel):
    slug: str = Field(description="URL slug. This is the training's folder name")
    name: str
    description: str
    author: str
    difficulty: int = Field(ge=1, le=5)
    duration: str


class Chapter(BaseModel):
    slug: str = Field(description="URL slug. This is the chapter's folder name")
    name: str = Field(
        description="Chapter name. Read from the markdown file's front matter"
    )
    content: str = Field(description="Markdown content")


def run_chapter_checks(chapter_slug: str) -> list[TaskResult]:
    chapter_path = os.path.join(TRAINING_DIR, chapter_slug)

    if not os.path.exists(chapter_path):
        raise FileNotFoundError("Chapter not found")

    tasks_file_path = os.path.join(chapter_path, "tasks.py")
    if not os.path.exists(tasks_file_path):
        raise FileNotFoundError("tasks.py not found")

    tasks_module = importlib.import_module(f"training.{chapter_slug}.tasks")
    return tasks_module.tasks.check_tasks()


def get_training_chapter(chapter_slug: str) -> Chapter:
    chapter_path = os.path.join(TRAINING_DIR, chapter_slug)

    if not os.path.exists(chapter_path):
        raise FileNotFoundError("Chapter not found")

    content_file_path = os.path.join(chapter_path, "content.mdx")
    if not os.path.exists(content_file_path):
        raise FileNotFoundError("content.mdx not found")

    with open(content_file_path, "r") as content_file:
        content = content_file.read()
        post = frontmatter.loads(content)
        chapter = Chapter(slug=chapter_slug, name=post["title"], content=post.content)

    return chapter


def get_training_chapters() -> list[Chapter]:
    chapters = []
    for folder_name in os.listdir(TRAINING_DIR):
        folder_path = os.path.join(TRAINING_DIR, folder_name)
        if os.path.isdir(folder_path):
            chapters.append(get_training_chapter(folder_name))
    return chapters


def get_training() -> Training:
    meta_file_path = os.path.join(TRAINING_DIR, "meta.yaml")
    if not os.path.exists(meta_file_path):
        raise FileNotFoundError("meta.yaml not found")

    with open(meta_file_path, "r") as meta_file:
        meta_data = yaml.safe_load(meta_file)
        training = Training(
            slug="training",
            name=meta_data.get("name"),
            description=meta_data.get("description"),
            author=meta_data.get("author"),
            difficulty=meta_data.get("difficulty"),
            duration=meta_data.get("duration"),
        )

    return training


@app.get("/training")
async def training() -> Training:
    return get_training()


@app.get("/training/chapter/{chapter_slug}")
async def training_chapter(chapter_slug: str) -> Chapter:
    return get_training_chapter(chapter_slug)


@app.post("/training/chapter/{chapter_slug}/checks")
async def training_chapter_checks(chapter_slug: str) -> list[TaskResult]:
    return run_chapter_checks(chapter_slug)
