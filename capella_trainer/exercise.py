import typing as t
from collections.abc import Callable
from pydantic import Field

import capellambse
import httpx
from pydantic import BaseModel

from capella_trainer.constants import CAPELLA_ENDPOINT


class TaskContext:
    model: t.Optional[capellambse.MelodyModel]
    client: t.Optional[httpx.Client]

    def __init__(self):
        self.model = None
        self.client = httpx.Client(base_url=CAPELLA_ENDPOINT)


class BaseTask(BaseModel):
    id: int


class TaskMeta(BaseTask):
    description: str = Field(description="Description of the task")
    hint: t.Optional[str] = Field(default=None, description="Hint for the task in MDX")


class TaskDefinition(BaseTask):
    validator: Callable[[TaskContext], None]


class ExerciseMeta(BaseModel):
    description: str = Field(description="Description of the exercise")
    tasks: list[TaskMeta]


class TaskResult(BaseTask):
    was_executed: bool
    success: bool
    message: t.Optional[str]


class TaskList:
    def __init__(self, tasks: list[TaskDefinition]):
        self.tasks = tasks
        self.task_context = TaskContext()

    def load_model_from_path(self, path: str):
        self.task_context.model = capellambse.MelodyModel(path)

    def set_client(self, client: httpx.Client):
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
