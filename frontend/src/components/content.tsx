import { $api } from "@/lib/api/client.ts";
import { Preview } from "@/components/mdx-container.tsx";

const Content = ({ slug }: { slug: string }) => {
  const { data } = $api.useSuspenseQuery(
    "get",
    "/training/chapter/{chapter_slug}",
    {
      params: {
        path: {
          chapter_slug: slug,
        },
      },
    },
  );

  return (
    <div className="prose prose-h1:font-bold prose-h1:text-3xl prose-p:m-0 prose-headings:m-0 grow overflow-y-scroll pl-4">
      <Preview source={data.content} />
    </div>
  );
};

export default Content;
