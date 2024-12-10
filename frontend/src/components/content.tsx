/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { $api } from "@/lib/api/client.ts";
import { RenderMdx } from "@/components/render-mdx.tsx";
import { ScrollArea } from "./ui/scroll-area";
import Exercise from "@/components/exercise.tsx";
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
      <ScrollArea className="prose mx-auto max-w-screen-md grow rounded-md border-2 p-4 prose-h1:text-3xl prose-h1:font-bold prose-img:max-h-72 prose-img:max-w-full prose-img:object-contain">
        <RenderMdx source={data.content} path={path} />
        {data.has_quiz && <Quiz path={path} />}
        {data.exercise && <Exercise path={path} />}
      </ScrollArea>
    </>
  );
};

export default Content;
