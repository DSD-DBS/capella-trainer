/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { $api } from "@/lib/api/client.ts";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";

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

  const [hasAutoloadedProject, setHasAutoloadedProject] = useState(false);

  useEffect(() => {
    if (!lessonData.start_project || lessonData.show_capella === false) return;
    if (
      (projectStatus === "WRONG_PROJECT" || projectStatus === "UNLOADED") &&
      !hasAutoloadedProject
    ) {
      setHasAutoloadedProject(true);
      loadProject.mutate({
        params: { path: { lesson_path: path } },
      });
    }
  }, [
    hasAutoloadedProject,
    lessonData.show_capella,
    lessonData.start_project,
    loadProject,
    path,
    projectStatus,
  ]);

  useEffect(() => {
    // Reset autoloaded project state when path changes
    setHasAutoloadedProject(false);
  }, [path]);

  if (!lessonData.start_project || lessonData.show_capella === false) {
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
          <Button
            onClick={() =>
              loadProject.mutate({
                params: { path: { lesson_path: path } },
              })
            }
            disabled={loadProject.isPending}
            className="shrink-0"
          >
            Reset Project
          </Button>
        </>
      )}
    </>
  );
};

export default ProjectControl;
