import { $api } from "@/lib/api/client.ts";
import { cn } from "@/lib/utils.ts";
import { CircleXIcon, CircleCheckIcon, Loader2Icon } from "lucide-react";

const Tasks = ({ slug }: { slug: string }) => {
  const {
    data: checks,
    isPending,
    isRefetching,
  } = $api.useQuery(
    "post",
    "/training/chapter/{chapter_slug}/checks",
    {
      params: {
        path: {
          chapter_slug: slug,
        },
      },
    },
    {
      refetchInterval: 3 * 1000,
    },
  );

  return (
    <div className="px-4">
      <div className="flex items-center justify-between px-3">
        <div className="text-lg font-bold">Tasks</div>
        <div>
          {(isPending || isRefetching) && (
            <Loader2Icon className="animate-spin p-0.5" />
          )}
        </div>
      </div>
      <ol>
        {checks &&
          checks.map((check, i) => (
            <li
              key={check.description}
              className={cn(
                "flex items-center rounded-md px-3",
                !check.success && check.was_executed
                  ? "bg-gray-200 py-1"
                  : "py-2",
              )}
            >
              <div className="grow">
                <p
                  className={
                    !check.success && check.was_executed
                      ? "font-bold"
                      : "font-medium"
                  }
                >
                  {i + 1}. {check.description}
                </p>
                {check.was_executed && check.message && (
                  <p>HINT: {check.message}</p>
                )}
              </div>
              {check.success && (
                <CircleCheckIcon className="p-0.5 text-green-700" />
              )}
              {!check.success && check.was_executed && (
                <CircleXIcon className="p-0.5 text-red-700" />
              )}
            </li>
          ))}
      </ol>
    </div>
  );
};

export default Tasks;
