import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft, ArrowRight, RefreshCcw } from "lucide-react";
import { $api } from "@/lib/api/client.ts";

const Navigation = ({ slug }: { slug: string }) => {
  const { data } = $api.useSuspenseQuery("get", "/training");

  return (
    <div className="flex gap-1 px-4">
      <Select value={slug}>
        <SelectTrigger className="w-[70%]">
          <SelectValue placeholder="Pick a chapter" />
        </SelectTrigger>
        <SelectContent>
          {data.chapters.map((chapter) => (
            <SelectItem key={chapter.slug} value={chapter.slug}>
              {chapter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="grow" size="icon">
        <ArrowLeft className="size-4" />
      </Button>
      <Button className="grow" size="icon">
        <ArrowRight className="size-4" />
      </Button>
      <Button className="grow" size="icon">
        <RefreshCcw className="size-4" />
      </Button>
    </div>
  );
};

export default Navigation;
