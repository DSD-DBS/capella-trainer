# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

import os
import runpy
import shutil
import typing as t

import yaml
from pydantic import BaseModel, Field

from capella_trainer.constants import CONTAINER_TRAINING_DIR, TRAINING_DIR
from capella_trainer.element import Element
from capella_trainer.exercise import ExerciseMeta, TaskResult


class LessonMeta(BaseModel):
    title: str
    show_capella: bool | None = Field(default=None)
    start_project: str | None = Field(default=None)
    exercise: ExerciseMeta | None = Field(default=None)
    confetti: bool | None = Field(default=None)
    hide_from_menu: bool | None = Field(default=None)


class Lesson(Element):
    content: str = Field(description="Markdown content")
    exercise: ExerciseMeta | None = Field(
        default=None, description="Metadata for the exercise."
    )
    has_quiz: bool = Field(
        default=False, description="Whether the lesson has a quiz."
    )
    start_project: str | None = Field(
        default=None, description="Project to load at the start of the lesson."
    )

    show_capella: bool | None = Field(
        default=None,
        description="Whether to show Capella or exclusively the lesson.",
    )
    type: str = Field(default="lesson", description="Type of the element.")
    confetti: bool | None = Field(
        default=None,
        description="Whether to show confetti at the end of the lesson.",
    )
    hide_from_menu: bool | None = Field(
        default=None, description="Whether to hide the lesson from the menu."
    )

    @classmethod
    def from_path(cls, path_name: list[str]) -> t.Self:
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
        lesson_meta = os.path.join(file_system_path, "lesson.yaml")
        if os.path.exists(lesson_content) and os.path.exists(lesson_meta):
            with open(lesson_meta, encoding="utf-8") as f:
                meta = LessonMeta(**yaml.safe_load(f))

                exercises_exist = os.path.exists(
                    os.path.join(file_system_path, "exercise.py")
                )

                if exercises_exist ^ bool(meta.exercise):
                    raise ValueError(
                        "Exercise metadata does not match the exercise file."
                    )

            with open(lesson_content, encoding="utf-8") as f:
                content = f.read()
                slug = path_name[-1]

                has_quiz = os.path.exists(
                    os.path.join(file_system_path, "quiz.yaml")
                )

                return cls(
                    name=meta.title,
                    content=content,
                    path=path_name,
                    slug=slug,
                    exercise=meta.exercise,
                    has_quiz=has_quiz,
                    start_project=meta.start_project,
                    show_capella=meta.show_capella,
                    confetti=meta.confetti,
                    hide_from_menu=meta.hide_from_menu,
                )
        else:
            raise FileNotFoundError(f"content.mdx not found in {path_name}")

    @property
    def start_project_path(self) -> str | None:
        if not self.start_project:
            return None
        return os.path.join(TRAINING_DIR, self.start_project)

    @property
    def working_project_path(self) -> str | None:
        if not self.start_project:
            return None
        return os.path.join(TRAINING_DIR, self.start_project, "../project")

    @property
    def container_working_project_path(self) -> str | None:
        if not self.working_project_path:
            return None
        relative_path = os.path.relpath(
            self.working_project_path, TRAINING_DIR
        )
        container_path = os.path.join(CONTAINER_TRAINING_DIR, relative_path)
        return container_path.replace("\\", "/")

    @property
    def tasks_file_path(self) -> str:
        return os.path.join(TRAINING_DIR, *self.path, "exercise.py")

    def create_working_project(self) -> None:
        if (
            not self.start_project_path
            or not os.path.exists(self.start_project_path)
            or not self.working_project_path
        ):
            raise FileNotFoundError("Start project not found")

        shutil.copytree(
            self.start_project_path,
            self.working_project_path,
            dirs_exist_ok=True,
        )

    def run_exercise_checks(self) -> list[TaskResult]:
        """Get the task check results for the lesson's exercise."""
        if not os.path.exists(self.tasks_file_path):
            raise FileNotFoundError("Lesson not found")

        if not self.working_project_path or not os.path.exists(
            self.working_project_path
        ):
            raise FileNotFoundError("Working project not found")

        module = runpy.run_path(self.tasks_file_path)
        module["setup"](self.working_project_path)

        return module["tasks"].check_tasks()
