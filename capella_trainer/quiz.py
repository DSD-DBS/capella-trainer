# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

import os
import typing as t

import yaml
from pydantic import BaseModel, Field

from capella_trainer.constants import TRAINING_DIR
from capella_trainer.lesson import Lesson


class BaseQuestion(BaseModel):
    text: str = Field(description="The text of the question")
    explanation: str = Field(description="Explanation of the answer")
    question_type: str = Field(description="Type of the question")
    id: int = Field(description="ID of the question")


class MultipleChoiceQuestion(BaseQuestion):
    options: list[str] = Field(description="List of possible answers")
    correct_options: list[int] = Field(
        description="List of correct choice indices"
    )
    question_type: t.Literal["multiple_choice"] = Field(
        description="Type of the question"
    )


class SingleChoiceQuestion(BaseQuestion):
    options: list[str] = Field(description="List of possible answers")
    correct_option: int = Field(description="Index of the correct choice")
    question_type: t.Literal["single_choice"] = Field(
        description="Type of the question"
    )


Question = SingleChoiceQuestion | MultipleChoiceQuestion


class Quiz(BaseModel):
    questions: list[Question] = Field(description="List of questions")

    @classmethod
    def from_path(cls, path_name: list[str]) -> t.Self:
        """Read the quiz content :param path_name: quiz name."""
        lesson = Lesson.from_path(path_name)
        assert lesson is not None
        quiz_file_system_path = os.path.join(
            TRAINING_DIR, *path_name, "quiz.yaml"
        )

        if not os.path.exists(quiz_file_system_path):
            raise FileNotFoundError("Quiz not found")

        with open(quiz_file_system_path) as f:
            quiz = yaml.safe_load(f)
            questions: list[Question] = []
            for question in quiz["questions"]:
                if question["question_type"] == "multiple_choice":
                    questions.append(MultipleChoiceQuestion(**question))
                elif question["question_type"] == "single_choice":
                    questions.append(SingleChoiceQuestion(**question))
                else:
                    raise ValueError(
                        f"Unknown question type {question['question_type']}"
                    )
            print(questions)
            return cls(questions=questions)
