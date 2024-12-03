import { $api } from "@/lib/api/client.ts";
import { cn } from "@/lib/utils.ts";
import {
  CircleXIcon,
  CircleCheckIcon,
  Loader2Icon,
  MessageCircleWarning,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { components } from "@/lib/api/v1";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { RenderMdx } from "@/components/render-mdx.tsx";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

const Task = ({
  task,
  check,
  path,
}: {
  task: components["schemas"]["TaskMeta"];
  check?: components["schemas"]["TaskResult"];
  path: string;
}) => {
  return (
    <motion.li
      key={task.description}
      layoutId={task.id.toString()}
      layout
      layoutRoot
      className={cn("relative flex items-center rounded-md px-3 py-2")}
    >
      <div className="grow">
        <motion.p
          layout="position"
          className={cn(
            "prose",
            !check?.success && check?.was_executed
              ? "font-bold"
              : "font-medium",
          )}
        >
          <RenderMdx path={path} source={task.description} />
        </motion.p>
        {check?.was_executed && check?.message && (
          <motion.p
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MessageCircleWarning className="mr-1 inline-block size-5" />
            {check.message}
          </motion.p>
        )}
      </div>

      {task.hint && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="mr-2">
              Show Hint
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Hint</DialogTitle>
              <DialogDescription className="prose">
                <RenderMdx path={path} source={task.hint} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <motion.div
        layout="position"
        className={cn(
          check?.success ? "text-green-700" : "text-red-700",
          "transition-colors",
        )}
      >
        {check?.success && <CircleCheckIcon className="p-0.5" />}
        {!check?.success && check?.was_executed && (
          <CircleXIcon className="p-0.5" />
        )}
      </motion.div>
    </motion.li>
  );
};

const Exercise = ({ path }: { path: string }) => {
  const queryClient = useQueryClient();
  const {
    data: checks,
    isPending,
    isRefetching,
  } = $api.useQuery(
    "post",
    "/training/lesson/{lesson_path}/exercise",
    {
      params: {
        path: {
          lesson_path: path,
        },
      },
    },
    {
      refetchInterval: 3 * 1000,
    },
  );
  const { data: session } = $api.useQuery("get", "/session");
  const sessionMutation = $api.useMutation("post", "/session", {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["get", "/session"] });
    },
  });

  useEffect(() => {
    if (!checks || !session || sessionMutation.isPending) return;
    if (checks.every((check) => check.success)) {
      if (!session.completed_lessons.includes(path)) {
        sessionMutation.mutate({
          body: {
            last_lesson: session.last_lesson,
            completed_lessons: [...session.completed_lessons, path],
          },
        });
      }
    }
  }, [checks, path, session, sessionMutation]);

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

  const activeTaskId = checks?.find(
    (check) => !check.success && check.was_executed,
  )?.id;

  if (!data.exercise) return;

  return (
    <div className="not-prose rounded-lg border-2 px-1.5 py-2.5">
      <div className="flex items-center justify-between px-3">
        <div className="text-lg font-bold">Exercise</div>
        <div>
          {(isPending || isRefetching) && (
            <Loader2Icon className="animate-spin p-0.5" />
          )}
        </div>
      </div>

      <div className="prose px-3 pb-2">
        <RenderMdx path={path} source={data.exercise.description} />
      </div>

      <ol className="relative grid">
        {data.exercise.tasks.map((task) => (
          <Task
            task={task}
            check={checks?.find((c) => c.id === task.id)}
            path={path}
          />
        ))}
        <AnimatePresence>
          {activeTaskId !== undefined && activeTaskId >= 0 && (
            <motion.div
              layout
              className="absolute -z-10 h-full w-full rounded-md bg-gray-200"
              style={{
                gridRowStart: activeTaskId,
                gridRowEnd: activeTaskId,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            ></motion.div>
          )}
        </AnimatePresence>
      </ol>
    </div>
  );
};

export default Exercise;
