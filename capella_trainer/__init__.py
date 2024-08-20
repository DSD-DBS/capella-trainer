# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0
import importlib
import capellambse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import frontmatter
import yaml

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
print(TRAINING_DIR)


class ChapterMeta(BaseModel):
    slug: str = Field(description="URL slug. This is the chapter's folder name")
    name: str = Field(
        description="Chapter name. Read from the markdown file's front matter"
    )


class Chapter(ChapterMeta):
    content: str = Field(description="Markdown content")


class Training(BaseModel):
    slug: str = Field(description="URL slug. This is the training's folder name")
    name: str
    description: str
    author: str
    difficulty: int = Field(ge=1, le=5)
    duration: str
    chapters: list[ChapterMeta] = Field(description="List of chapters")


def run_chapter_checks(chapter_slug: str) -> list[TaskResult]:
    chapter_path = os.path.join(TRAINING_DIR, chapter_slug)

    if not os.path.exists(chapter_path):
        raise FileNotFoundError("Chapter not found")

    tasks_file_path = os.path.join(chapter_path, "tasks.py")
    if not os.path.exists(tasks_file_path):
        raise FileNotFoundError("tasks.py not found")

    tasks_module = importlib.import_module(f"training.{chapter_slug}.tasks")
    model = capellambse.MelodyModel("./training/02-first-tests/model/PVMT_Demo.aird")
    return tasks_module.tasks.check_tasks(model)


def get_training_chapter(chapter_slug: str, meta_only: bool) -> Chapter | ChapterMeta:
    chapter_path = os.path.join(TRAINING_DIR, chapter_slug)

    if not os.path.exists(chapter_path):
        raise FileNotFoundError("Chapter not found")

    content_file_path = os.path.join(chapter_path, "content.mdx")
    if not os.path.exists(content_file_path):
        raise FileNotFoundError("content.mdx not found")

    with open(content_file_path, "r") as content_file:
        content = content_file.read()
        post = frontmatter.loads(content)
        if meta_only:
            return ChapterMeta(slug=chapter_slug, name=post["title"])
        else:
            return Chapter(slug=chapter_slug, name=post["title"], content=post.content)


def get_training_chapters() -> list[Chapter]:
    chapters = []
    for folder_name in os.listdir(TRAINING_DIR):
        folder_path = os.path.join(TRAINING_DIR, folder_name)
        if os.path.isdir(folder_path):
            chapters.append(get_training_chapter(folder_name, meta_only=True))
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
            chapters=get_training_chapters(),
        )

    return training


@app.get("/training")
async def training() -> Training:
    return get_training()


@app.get("/training/chapter/{chapter_slug}")
async def training_chapter(chapter_slug: str) -> Chapter:
    return get_training_chapter(chapter_slug, meta_only=False)


@app.post("/training/chapter/{chapter_slug}/checks")
async def run_training_chapter_checks(chapter_slug: str) -> list[TaskResult]:
    return run_chapter_checks(chapter_slug)
