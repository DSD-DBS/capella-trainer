import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";
import { $api } from "@/lib/api/client.ts";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils.ts";
import { components } from "@/lib/api/v1";

function getAllLessons(
  root: components["schemas"]["Folder"],
): components["schemas"]["Lesson"][] {
  const lessons: components["schemas"]["Lesson"][] = [];

  function traverse(
    element: components["schemas"]["Folder"] | components["schemas"]["Lesson"],
  ) {
    if (element?.type === "lesson") {
      lessons.push(element as components["schemas"]["Lesson"]);
    } else if (element?.type === "folder") {
      (element as components["schemas"]["Folder"]).children.forEach(traverse);
    }
  }

  traverse(root);
  return lessons;
}

const Navigation = ({ path }: { path: string }) => {
  const { data } = $api.useSuspenseQuery("get", "/training");
  const navigate = useNavigate();

  function updateLesson(lessonPath: string) {
    navigate(`/lesson/${lessonPath}`);
  }

  const flattenedLessons = getAllLessons(data.root);

  const lessonIndex = flattenedLessons.findIndex(
    (lesson) => lesson.path.join("/") === path,
  );

  const previousLesson =
    lessonIndex > 0 ? flattenedLessons[lessonIndex - 1].path.join("/") : null;

  const nextLesson =
    lessonIndex < flattenedLessons.length - 1
      ? flattenedLessons[lessonIndex + 1].path.join("/")
      : null;

  return (
    <div className="flex gap-1 px-4">
      <Select value={path} onValueChange={updateLesson}>
        <SelectTrigger className="w-[70%]">
          <SelectValue placeholder="Pick a Lesson" />
        </SelectTrigger>
        <SelectContent>
          {flattenedLessons.map((lesson) => (
            <SelectItem
              key={lesson.path.join("/")}
              value={lesson.path.join("/")}
            >
              {lesson.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Link
        className={cn(
          buttonVariants({ size: "icon" }),
          !previousLesson && "pointer-events-none opacity-50",
        )}
        to={previousLesson ? `/lesson/${previousLesson}` : "#"}
      >
        <ArrowLeft className="size-4" />
      </Link>
      <Link
        className={cn(
          buttonVariants({ size: "icon" }),
          !nextLesson && "pointer-events-none opacity-50",
        )}
        to={nextLesson ? `/lesson/${nextLesson}` : "#"}
      >
        <ArrowRight className="size-4" />
      </Link>
      <Button className="grow" size="icon">
        <RefreshCcw className="size-4" />
      </Button>
    </div>
  );
};

export default Navigation;
