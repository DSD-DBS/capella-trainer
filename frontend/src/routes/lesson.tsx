import Navigation from "@/components/navigation.tsx";
import Layout from "@/components/layout.tsx";
import Content from "@/components/content.tsx";
import { useParams } from "react-router-dom";

const Lesson = () => {
  const { "*": path } = useParams();
  if (!path) {
    return null;
  }
  return (
    <Layout>
      <div className="flex h-screen max-w-md flex-col justify-between gap-2 border-r-2 py-4">
        <Navigation path={path} />
        <Content path={path} />
      </div>
    </Layout>
  );
};

export default Lesson;
