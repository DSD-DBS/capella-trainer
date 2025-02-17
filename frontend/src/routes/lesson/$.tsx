/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import Navigation from "@/components/navigation.tsx";
import Content from "@/components/content.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { useEffect, useRef } from "react";
import { $api } from "@/lib/api/client.ts";
import { ImperativePanelHandle } from "react-resizable-panels";
import { ENABLE_BUILT_IN_CAPELLA, SESSION_ID } from "@/lib/const.ts";
import { useQueryClient } from "@tanstack/react-query";
import FocusIframe from "@/components/focus-iframe.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";

export const Route = createFileRoute("/lesson/$")({
  component: Lesson,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      $api.queryOptions("get", "/training/lesson/{lesson_path}", {
        params: {
          path: {
            lesson_path: params._splat!,
          },
        },
      }),
    ),
  pendingComponent: () => (
    <div className="grid h-dvh w-screen place-items-center">
      <LoaderCircle className="h-16 w-16 animate-spin" />
    </div>
  ),
});

const StaticLesson = ({
  shouldBeMaximized,
}: {
  shouldBeMaximized: boolean;
}) => {
  const { _splat: path } = Route.useParams();

  useEffect(() => {
    window.parent.postMessage(
      {
        type: "setFullscreen",
        fullscreen: shouldBeMaximized,
        sessionId: SESSION_ID,
      },
      "*",
    );
  }, [shouldBeMaximized]);

  if (!path) {
    return null;
  }

  return (
    <div className="flex h-dvh flex-col items-center gap-2 py-2">
      <Navigation path={path} />
      <Content path={path} />
    </div>
  );
};

const ResizeableLesson = ({
  shouldBeMaximized,
}: {
  shouldBeMaximized: boolean;
}) => {
  const { _splat: path } = Route.useParams();
  const capellaRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    if (!capellaRef.current) return;
    if (shouldBeMaximized) {
      capellaRef.current.collapse();
    } else {
      capellaRef.current.expand();
    }
  }, [shouldBeMaximized]);

  if (!path) {
    return null;
  }

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="flex h-dvh flex-col items-center gap-2 py-2">
        <Navigation path={path} />
        <Content path={path} />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel collapsible ref={capellaRef}>
        <FocusIframe src="http://localhost:8088/" />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

function Lesson() {
  const queryClient = useQueryClient();
  const { _splat: path } = Route.useParams();

  const { data: session } = $api.useQuery("get", "/session");
  const sessionMutation = $api.useMutation("post", "/session", {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["get", "/session"] });
    },
  });

  const { data: lessonData } = $api.useSuspenseQuery(
    "get",
    "/training/lesson/{lesson_path}",
    {
      params: {
        path: {
          lesson_path: path!,
        },
      },
    },
  );

  const shouldBeMaximized =
    lessonData?.show_capella === null
      ? !lessonData?.start_project
      : !lessonData?.show_capella;

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

  if (ENABLE_BUILT_IN_CAPELLA) {
    return <ResizeableLesson shouldBeMaximized={shouldBeMaximized} />;
  } else {
    return <StaticLesson shouldBeMaximized={shouldBeMaximized} />;
  }
}
