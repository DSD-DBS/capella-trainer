import os

import yaml


from pydantic import BaseModel, Field
import typing as t

from capella_trainer.constants import TRAINING_DIR
from capella_trainer.lesson import Lesson


class BaseQuestion(BaseModel):
    text: str = Field(description="The text of the question")
    explanation: str = Field(description="Explanation of the answer")
    question_type: str = Field(description="Type of the question")
    id: int = Field(description="ID of the question")


class MultipleChoiceQuestion(BaseQuestion):
    options: list[str] = Field(description="List of possible answers")
    correct_options: list[int] = Field(description="List of correct choice indices")
    question_type: t.Literal["multiple_choice"] = Field(
        description="Type of the question"
    )


class SingleChoiceQuestion(BaseQuestion):
    options: list[str] = Field(description="List of possible answers")
    correct_option: int = Field(description="Index of the correct choice")
    question_type: t.Literal["single_choice"] = Field(
        description="Type of the question"
    )


class Quiz(BaseModel):
    questions: list[MultipleChoiceQuestion | SingleChoiceQuestion] = Field(
        description="List of questions"
    )

    @staticmethod
    def from_path(path_name: list[str]):
        """
        Read the quiz content
        :param path_name: quiz name
        """
        lesson = Lesson.from_path(path_name)
        quiz_file_system_path = os.path.join(TRAINING_DIR, *path_name, "quiz.yaml")

        if not os.path.exists(quiz_file_system_path):
            raise FileNotFoundError("Quiz not found")

        with open(quiz_file_system_path) as f:
            quiz = yaml.safe_load(f)
            questions = []
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
            return Quiz(questions=questions)
