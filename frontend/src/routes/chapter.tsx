import Navigation from "@/components/navigation.tsx";
import Layout from "@/components/layout.tsx";
import Content from "@/components/content.tsx";
import Tasks from "@/components/tasks.tsx";
import { useParams } from "react-router-dom";

const Chapter = () => {
  const { slug } = useParams();
  if (!slug) {
    return null;
  }
  return (
    <Layout>
      <div className="flex h-screen max-w-md flex-col justify-between gap-2 border-r-2 py-4">
        <Navigation slug={slug} />
        <Content slug={slug} />
        <Tasks slug={slug} />
      </div>
    </Layout>
  );
};

export default Chapter;
