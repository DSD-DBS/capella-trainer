import { useState } from "react";
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

export default function Quiz({ path }: { path: string }) {
  const { data } = $api.useSuspenseQuery(
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

  const [userAnswers, setUserAnswers] = useState<Record<number, number[]>>({});
  const [checkedAnswers, setCheckedAnswers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mx-4" onClick={resetQuiz}>
          Start Knowledge Check
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Knowledge Check</DialogTitle>
          <DialogDescription>
            Test your understanding of the lesson by answering the following
            questions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {data.questions.map((question) => (
            <div key={question.id} className="space-y-4">
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

        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          {!checkedAnswers ? (
            <Button onClick={checkAnswers}>Check Answers</Button>
          ) : (
            <Button
              onClick={() => {
                resetQuiz();
                setCheckedAnswers(false);
              }}
            >
              Try Again
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}