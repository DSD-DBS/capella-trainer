/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { $api } from "@/lib/api/client.ts";
import { components } from "@/lib/api/v1";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { getNavigationData } from "./navigation";
import { useNavigate } from "@tanstack/react-router";

export default function Quiz({ path }: { path: string }) {
  const queryClient = useQueryClient();
  const { data: quiz } = $api.useSuspenseQuery(
    "get",
    "/training/lesson/{lesson_path}/quiz",
    {
      params: {
        path: {
          lesson_path: path,
        },
      },
    },
  );

  const { data: training } = $api.useSuspenseQuery("get", "/training");

  const { data: session, isLoading: sessionLoading } = $api.useQuery(
    "get",
    "/session",
  );
  const sessionMutation = $api.useMutation("post", "/session", {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["get", "/session"] });
    },
  });

  const navigate = useNavigate({ from: "/lesson/$" });

  const [userAnswers, setUserAnswers] = useState<Record<number, number[]>>({});
  const [checkedAnswers, setCheckedAnswers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { nextLesson } = getNavigationData(training, path);

  async function navigateToNext() {
    setIsOpen(false);
    await navigate({ to: "/lesson/$", params: { _splat: nextLesson! } });
  }

  const isCorrect = (
    question:
      | components["schemas"]["SingleChoiceQuestion"]
      | components["schemas"]["MultipleChoiceQuestion"],
  ) => {
    if (question.question_type === "single_choice") {
      const userAnswer = userAnswers[question.id]?.[0];
      return userAnswer === question.correct_option;
    } else {
      const userAnswer = userAnswers[question.id] || [];
      return (
        userAnswer.length === question.correct_options.length &&
        userAnswer.every((answer) => question.correct_options.includes(answer))
      );
    }
  };

  const allCorrect = quiz.questions.every((question) => isCorrect(question));

  useEffect(() => {
    if (
      !session ||
      !checkedAnswers ||
      sessionMutation.isPending ||
      sessionLoading
    )
      return;
    if (allCorrect) {
      if (!session.completed_lessons.includes(path)) {
        sessionMutation.mutate({
          body: {
            last_lesson: session.last_lesson,
            completed_lessons: [...session.completed_lessons, path],
          },
        });
      }
    }
  }, [
    quiz,
    path,
    session,
    sessionMutation,
    checkedAnswers,
    allCorrect,
    sessionLoading,
  ]);

  const handleSingleChoice = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: [optionIndex] }));
  };

  const handleMultipleChoice = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      if (currentAnswers.includes(optionIndex)) {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((i) => i !== optionIndex),
        };
      } else {
        return { ...prev, [questionId]: [...currentAnswers, optionIndex] };
      }
    });
  };

  const checkAnswers = () => {
    setCheckedAnswers(true);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setCheckedAnswers(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={resetQuiz}>Start Knowledge Check</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Knowledge Check</DialogTitle>
          <DialogDescription>
            Test your understanding of the lesson by answering the following
            questions.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {quiz.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <h3 className="text-lg font-semibold">{question.text}</h3>
                {question.question_type === "single_choice" ? (
                  <RadioGroup
                    onValueChange={(value) =>
                      handleSingleChoice(question.id, parseInt(value))
                    }
                    disabled={checkedAnswers}
                  >
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={index.toString()}
                          id={`q${question.id}-option${index}`}
                          checked={userAnswers[question.id]?.includes(index)}
                        />
                        <Label htmlFor={`q${question.id}-option${index}`}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2">
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`q${question.id}-option${index}`}
                          checked={userAnswers[question.id]?.includes(index)}
                          onCheckedChange={() =>
                            handleMultipleChoice(question.id, index)
                          }
                          disabled={checkedAnswers}
                        />
                        <Label htmlFor={`q${question.id}-option${index}`}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
                {checkedAnswers && (
                  <div className="mt-2">
                    {isCorrect(question) ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        <span>Correct!</span>
                      </div>
                    ) : (
                      <div className="text-red-600">
                        <div className="flex items-center">
                          <AlertCircle className="mr-2 h-5 w-5" />
                          <span>Incorrect</span>
                        </div>
                        <p className="mt-1">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          {!checkedAnswers ? (
            <>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button onClick={checkAnswers}>Check Answers</Button>
            </>
          ) : allCorrect ? (
            <>
              <Button onClick={() => setIsOpen(false)} variant="secondary">
                Done
              </Button>
              {nextLesson && <Button onClick={navigateToNext}>Next</Button>}
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  resetQuiz();
                  setCheckedAnswers(false);
                }}
              >
                Try Again
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
