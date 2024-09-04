import { $api } from "@/lib/api/client.ts";
import { Button } from "@/components/ui/button.tsx";

const ProjectControl = ({ path }: { path: string }) => {
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

  const { data: projectStatus } = $api.useQuery(
    "get",
    "/training/lesson/{lesson_path}/project_status",
    {
      params: {
        path: {
          lesson_path: path,
        },
      },
    },
    {
      refetchInterval: 1000,
    },
  );

  const loadProject = $api.useMutation(
    "post",
    "/training/lesson/{lesson_path}/load_project",
  );

  const resetProject = $api.useMutation(
    "post",
    "/training/lesson/{lesson_path}/reset_project",
  );

  const loadSolutionProject = $api.useMutation(
    "post",
    "/training/lesson/{lesson_path}/load_solution_project",
  );

  if (!lessonData.start_project || !lessonData.show_capella) {
    return null;
  }

  return (
    <>
      {(projectStatus === "WRONG_PROJECT" || projectStatus === "UNLOADED") && (
        <Button
          onClick={() =>
            loadProject.mutate({
              params: { path: { lesson_path: path } },
            })
          }
          disabled={loadProject.isPending}
          className="shrink-0"
        >
          Load Project
        </Button>
      )}
      {projectStatus === "WORKING" && (
        <>
          {lessonData.solution_project && (
            <Button
              onClick={() =>
                loadSolutionProject.mutate({
                  params: { path: { lesson_path: path } },
                })
              }
              disabled={resetProject.isPending || loadSolutionProject.isPending}
              className="shrink-0"
            >
              Show Solution
            </Button>
          )}

          <Button
            onClick={() =>
              resetProject.mutate({
                params: { path: { lesson_path: path } },
              })
            }
            disabled={resetProject.isPending || loadSolutionProject.isPending}
            className="shrink-0"
          >
            Reset Project
          </Button>
        </>
      )}
      {projectStatus === "SOLUTION" && (
        <>
          <Button
            onClick={() =>
              loadProject.mutate({
                params: { path: { lesson_path: path } },
              })
            }
            disabled={loadSolutionProject.isPending || loadProject.isPending}
            className="shrink-0"
          >
            Show Project
          </Button>
          <Button
            onClick={() =>
              loadSolutionProject.mutate({
                params: { path: { lesson_path: path } },
              })
            }
            disabled={loadSolutionProject.isPending || loadProject.isPending}
            className="shrink-0"
          >
            Reset Solution
          </Button>
        </>
      )}
    </>
  );
};

export default ProjectControl;
