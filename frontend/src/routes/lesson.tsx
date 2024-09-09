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

const Lesson = () => {
  const { "*": path } = useParams();
  const capellaRef = useRef(null);

  if (!path) {
    return null;
  }

  // TODO: evil duplication, remove this
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

export default Lesson;
