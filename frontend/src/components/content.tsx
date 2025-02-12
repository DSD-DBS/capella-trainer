/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import { $api } from "@/lib/api/client.ts";
import { RenderMdx } from "@/components/render-mdx.tsx";
import { ScrollArea } from "./ui/scroll-area";
import Exercise from "@/components/exercise.tsx";
import Quiz from "@/components/quiz.tsx";
import Confetti from "react-confetti";

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

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [path]);

  return (
    <div className="flex h-full w-full justify-center px-4">
      <ScrollArea
        viewportRef={scrollAreaRef}
        className="prose h-full w-full max-w-screen-md rounded-md border-2 p-4 prose-h1:text-3xl prose-h1:font-bold prose-img:max-h-72 prose-img:max-w-full prose-img:object-contain"
      >
        <RenderMdx source={data.content} path={path} />
        {data.has_quiz && <Quiz path={path} />}
        {data.exercise && <Exercise path={path} />}
        {data.confetti && <Confetti />}
      </ScrollArea>
    </div>
  );
};

export default Content;
