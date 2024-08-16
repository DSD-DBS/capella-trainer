import typing as t
from collections.abc import Callable

import capellambse
from pydantic import BaseModel


class TaskDefinition(BaseModel):
    description: str
    validator: Callable[[capellambse.model.MelodyModel], None]


class TaskResult(BaseModel):
    description: str
    was_executed: bool
    success: bool
    message: t.Optional[str]


class TaskList:
    def __init__(self, tasks: list[TaskDefinition]):
        self.tasks = tasks

    def check_tasks(self) -> list[TaskResult]:
        results = []
        has_failed = False
        for task in self.tasks:
            if has_failed:
                results.append(
                    TaskResult(
                        description=task.description,
                        was_executed=False,
                        success=False,
                        message="Previous task failed",
                    )
                )
                continue

            try:
                task.validator()
                results.append(
                    TaskResult(
                        description=task.description,
                        was_executed=True,
                        success=True,
                        message=None,
                    )
                )
            except Exception as e:
                results.append(
                    TaskResult(
                        description=task.description,
                        was_executed=True,
                        success=False,
                        message=str(e),
                    )
                )

        return results
