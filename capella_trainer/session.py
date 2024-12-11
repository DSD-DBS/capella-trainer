# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

import os
import typing as t

import yaml
from pydantic import BaseModel, Field

from capella_trainer.constants import TRAINING_DIR

session_file_path = os.path.join(TRAINING_DIR, "session.yaml")


class Session(BaseModel):
    last_lesson: str = Field(description="Path of last seen lesson.")
    completed_lessons: list[str] = Field(
        description="List of paths for completed lessons.",
        default=[],
    )

    @classmethod
    def read(cls, default_lesson_path: str) -> t.Self:
        """Read the session data."""
        if not os.path.exists(session_file_path):
            return cls(last_lesson=default_lesson_path)
        with open(session_file_path) as f:
            session = yaml.safe_load(f)
            return cls(
                last_lesson=session.get("last_lesson", default_lesson_path),
                completed_lessons=session.get("completed_lessons", []),
            )

    def write(self) -> None:
        """Write the session data."""
        with open(session_file_path, "w") as f:
            yaml.safe_dump(self.model_dump(), f)
