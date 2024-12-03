import yaml
import os
from pydantic import BaseModel, Field
from capella_trainer.constants import TRAINING_DIR


session_file_path = os.path.join(TRAINING_DIR, "session.yaml")


class Session(BaseModel):
    last_lesson: str | None = Field(
        description="Path of last seen lesson.", default=None
    )
    completed_lessons: list[str] = Field(
        description="List of paths for completed lessons.",
        default=[],
    )

    @staticmethod
    def read():
        """
        Read the session data
        """
        if not os.path.exists(session_file_path):
            return Session()
        with open(session_file_path) as f:
            session = yaml.safe_load(f)
            return Session(
                last_lesson=session.get("last_lesson"),
                completed_lessons=session.get("completed_lessons", []),
            )

    def write(self):
        """
        Write the session data
        """
        with open(session_file_path, "w") as f:
            yaml.safe_dump(self.model_dump(), f)
