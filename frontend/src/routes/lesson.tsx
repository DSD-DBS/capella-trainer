/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import Navigation from "@/components/navigation.tsx";
import Content from "@/components/content.tsx";
import { useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { Suspense, useEffect, useRef } from "react";
import { $api } from "@/lib/api/client.ts";
import { ImperativePanelHandle } from "react-resizable-panels";
import { ENABLE_BUILT_IN_CAPELLA } from "@/lib/const.ts";
import { useQueryClient } from "@tanstack/react-query";

const StaticLesson = () => {
  const { "*": path } = useParams();

  if (!path) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col justify-between gap-2 py-2">
      <Suspense>
        <Navigation path={path} />
        <Content path={path} />
      </Suspense>
    </div>
  );
};

const ResizeableLesson = () => {
  const { "*": path } = useParams();
  const capellaRef = useRef<ImperativePanelHandle>(null);
  const queryClient = useQueryClient();

  const { data: session } = $api.useQuery("get", "/session");
  const sessionMutation = $api.useMutation("post", "/session", {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["get", "/session"] });
    },
  });

  useEffect(() => {
    if (!session || !path || sessionMutation.isPending) return;

    if (session?.last_lesson !== path) {
      sessionMutation.mutate({
        body: {
          last_lesson: path,
          completed_lessons: session.completed_lessons,
        },
      });
    }
  }, [path, session, sessionMutation]);

  if (!path) {
    return null;
  }

  const { data: lessonData } = $api.useSuspenseQuery(
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

  useEffect(() => {
    console.log(lessonData);
    if (!capellaRef.current) return;
    if (lessonData.show_capella === null) {
      if (lessonData.start_project) {
        capellaRef.current.expand();
      } else {
        capellaRef.current.collapse();
      }
    } else if (lessonData.show_capella) {
      capellaRef.current.expand();
    } else {
      capellaRef.current.collapse();
    }
  }, [lessonData]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="flex h-screen flex-col justify-between gap-2 py-2">
        <Suspense>
          <Navigation path={path} />
          <Content path={path} />
        </Suspense>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel collapsible ref={capellaRef}>
        <iframe
          src="http://localhost:8088/"
          className="h-full w-full border-0"
        ></iframe>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

const Lesson = () => {
  if (ENABLE_BUILT_IN_CAPELLA) {
    return <ResizeableLesson />;
  } else {
    return <StaticLesson />;
  }
};

export default Lesson;
