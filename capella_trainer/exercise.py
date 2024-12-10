# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

from collections.abc import Callable

import capellambse
import httpx
from pydantic import BaseModel, Field

from capella_trainer.constants import CAPELLA_ENDPOINT


class TaskContext:
    model: capellambse.MelodyModel | None
    client: httpx.Client | None

    def __init__(self) -> None:
        self.model = None
        self.client = httpx.Client(base_url=CAPELLA_ENDPOINT)


class BaseTask(BaseModel):
    id: int


class TaskMeta(BaseTask):
    description: str = Field(description="Description of the task")
    hint: str | None = Field(
        default=None, description="Hint for the task in MDX"
    )


class TaskDefinition(BaseTask):
    validator: Callable[[TaskContext], None]


class ExerciseMeta(BaseModel):
    description: str = Field(description="Description of the exercise")
    tasks: list[TaskMeta]


class TaskResult(BaseTask):
    was_executed: bool
    success: bool
    message: str | None


class TaskList:
    def __init__(self, tasks: list[TaskDefinition]):
        self.tasks = tasks
        self.task_context = TaskContext()

    def load_model_from_path(self, path: str) -> None:
        self.task_context.model = capellambse.MelodyModel(path)

    def set_client(self, client: httpx.Client) -> None:
        self.task_context.client = client

    def check_tasks(self) -> list[TaskResult]:
        results = []
        has_failed = False
        for task in self.tasks:
            if has_failed:
                results.append(
                    TaskResult(
                        id=task.id,
                        was_executed=False,
                        success=False,
                        message="Previous task failed",
                    )
                )
                continue

            try:
                task.validator(self.task_context)
                results.append(
                    TaskResult(
                        id=task.id,
                        was_executed=True,
                        success=True,
                        message=None,
                    )
                )
            except Exception as e:
                results.append(
                    TaskResult(
                        id=task.id,
                        was_executed=True,
                        success=False,
                        message=str(e),
                    )
                )
                has_failed = True

        return results
