import Navigation from "@/components/navigation.tsx";
import Layout from "@/components/layout.tsx";
import Content from "@/components/content.tsx";
import { useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { Suspense } from "react";

const Lesson = () => {
  const { "*": path } = useParams();
  if (!path) {
    return null;
  }
  return (
    <Layout>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex h-screen flex-col justify-between gap-2 py-4">
          <Suspense>
            <Navigation path={path} />
            <Content path={path} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Capella would be here</ResizablePanel>
      </ResizablePanelGroup>
    </Layout>
  );
};

export default Lesson;
