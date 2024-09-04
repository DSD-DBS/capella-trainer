import importlib
import os
import shutil


import yaml
from pydantic import Field, BaseModel

from capella_trainer.constants import TRAINING_DIR
from capella_trainer.element import Element
from capella_trainer.tasks import TaskResult


class LessonMeta(BaseModel):
    title: str
    show_capella: bool = Field(default=True)


class Lesson(Element):
    content: str = Field(description="Markdown content")
    has_tasks: bool = Field(default=False, description="Whether the lesson has tasks.")
    has_quiz: bool = Field(default=False, description="Whether the lesson has a quiz.")
    start_project: bool = Field(
        default=False, description="Project to load at the start of the lesson."
    )
    solution_project: bool = Field(
        default=False, description="Project for the solution of the lesson."
    )

    show_capella: bool = Field(
        default=True, description="Whether to show Capella or exclusively the lesson."
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
        lesson_meta = os.path.join(file_system_path, "lesson.yaml")
        if os.path.exists(lesson_content) and os.path.exists(lesson_meta):
            with open(lesson_meta, encoding="utf-8") as f:
                meta = LessonMeta(**yaml.safe_load(f))

            with open(lesson_content, encoding="utf-8") as f:
                content = f.read()
                slug = path_name[-1]

                has_tasks = os.path.exists(os.path.join(file_system_path, "tasks.py"))
                has_quiz = os.path.exists(os.path.join(file_system_path, "quiz.yaml"))
                start_project = os.path.exists(
                    os.path.join(file_system_path, "start-project")
                )
                solution_project = os.path.exists(
                    os.path.join(file_system_path, "solution-project")
                )

                return Lesson(
                    name=meta.title,
                    content=content,
                    path=path_name,
                    slug=slug,
                    has_tasks=has_tasks,
                    has_quiz=has_quiz,
                    start_project=start_project,
                    solution_project=solution_project,
                    show_capella=meta.show_capella,
                )
        else:
            raise FileNotFoundError(f"content.mdx not found in {path_name}")

    def working_project_exists(self):
        return os.path.exists(os.path.join(TRAINING_DIR, *self.path, "project"))

    def create_working_project(self, recreate=False):
        start_project_path = os.path.join(TRAINING_DIR, *self.path, "start-project")
        working_project_path = os.path.join(TRAINING_DIR, *self.path, "project")

        if not os.path.exists(start_project_path):
            raise FileNotFoundError("Start project not found")

        if os.path.exists(working_project_path) and not recreate:
            raise FileExistsError("Working project already exists")

        shutil.copytree(start_project_path, working_project_path, dirs_exist_ok=True)

    def recreate_solution_project(self):
        solution_project_path = os.path.join(
            TRAINING_DIR, *self.path, "solution-project"
        )
        active_solution_project_path = os.path.join(
            TRAINING_DIR, *self.path, "active-solution-project"
        )

        if not os.path.exists(solution_project_path):
            raise FileNotFoundError("Solution project not found")

        if os.path.exists(active_solution_project_path):
            shutil.rmtree(active_solution_project_path)

        shutil.copytree(solution_project_path, active_solution_project_path)

    def run_checks(self) -> list[TaskResult]:
        """
        Get the task results for the lesson
        """

        tasks_file_system_path = os.path.join(TRAINING_DIR, *self.path, "tasks.py")

        if not os.path.exists(tasks_file_system_path):
            raise FileNotFoundError("Lesson not found")

        tasks_module_name = f"training.{'.'.join(self.path)}.tasks"

        tasks_module = importlib.import_module(tasks_module_name)

        return tasks_module.tasks.check_tasks()
