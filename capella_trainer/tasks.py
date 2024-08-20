import typing as t
from collections.abc import Callable

import capellambse
from pydantic import BaseModel


class TaskDefinition(BaseModel):
    description: str
    validator: Callable


class TaskResult(BaseModel):
    description: str
    was_executed: bool
    success: bool
    message: t.Optional[str]


class TaskList:
    def __init__(self, tasks: list[TaskDefinition]):
        self.tasks = tasks

    def check_tasks(self, *args) -> list[TaskResult]:
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
                task.validator(*args)
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
                has_failed = True

        return results
