import { $api } from "@/lib/api/client.ts";
import { Preview } from "@/components/mdx-container.tsx";

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
    <div className="prose grow overflow-y-scroll pl-4 prose-h1:text-3xl prose-h1:font-bold">
      <Preview source={data.content} path={path} />
    </div>
  );
};

export default Content;
