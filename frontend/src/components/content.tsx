import { $api } from "@/lib/api/client.ts";
import { Preview } from "@/components/mdx-container.tsx";
import { ScrollArea } from "./ui/scroll-area";
import Tasks from "@/components/tasks.tsx";
import Quiz from "@/components/quiz.tsx";

const Content = ({ path }: { path: string }) => {
  const { data } = $api.useSuspenseQuery(
    "get",
    "/training/lesson/{lesson_path}",
    {
      params: {
        path: {
          lesson_path: path,
        },
      },
    },
  );

  return (
    <>
      <ScrollArea className="prose max-w-full grow p-4 prose-h1:text-3xl prose-h1:font-bold prose-img:w-96 prose-img:max-w-full">
        <Preview source={data.content} path={path} />
      </ScrollArea>
      {data.has_tasks && <Tasks path={path} />}
      {data.has_quiz && <Quiz path={path} />}
    </>
  );
};

export default Content;
