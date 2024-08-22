import { $api } from "@/lib/api/client.ts";
import { cn } from "@/lib/utils.ts";
import { CircleXIcon, CircleCheckIcon, Loader2Icon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Tasks = ({ path }: { path: string }) => {
  const {
    data: checks,
    isPending,
    isRefetching,
  } = $api.useQuery(
    "post",
    "/training/lesson/{lesson_path}/checks",
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

  const activeIndex = checks?.findIndex(
    (check) => !check.success && check.was_executed,
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

      <ol className="relative grid">
        {checks &&
          checks.map((check, i) => (
            <motion.li
              key={check.description}
              layoutId={check.description}
              layout
              layoutRoot
              className={cn("relative flex items-center rounded-md px-3 py-2")}
            >
              <div className="grow">
                <motion.p
                  layout="position"
                  className={cn(
                    !check.success && check.was_executed
                      ? "font-bold"
                      : "font-medium",
                  )}
                >
                  {i + 1}. {check.description}
                </motion.p>
                {check.was_executed && check.message && (
                  <motion.p
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    HINT: {check.message}
                  </motion.p>
                )}
              </div>

              <motion.div
                layout="position"
                className={cn(
                  check.success ? "text-green-700" : "text-red-700",
                  "transition-colors",
                )}
              >
                {check.success && <CircleCheckIcon className="p-0.5" />}
                {!check.success && check.was_executed && (
                  <CircleXIcon className="p-0.5" />
                )}
              </motion.div>
            </motion.li>
          ))}

        <AnimatePresence>
          {activeIndex && activeIndex > 0 && (
            <motion.div
              layout
              className="absolute -z-10 h-full w-full rounded-md bg-gray-200"
              style={{
                gridRowStart: activeIndex + 1,
                gridRowEnd: activeIndex + 1,
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

export default Tasks;
