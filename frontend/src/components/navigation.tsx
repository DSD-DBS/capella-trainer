/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Book,
  BookCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { $api } from "@/lib/api/client.ts";
import { cn } from "@/lib/utils.ts";
import { components } from "@/lib/api/v1";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button, buttonVariants } from "@/components/ui/button";
import ProjectControl from "@/components/project-control.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Link, useNavigate } from "@tanstack/react-router";

function FolderNode({
  node,
  path,
}: {
  node: components["schemas"]["Folder"];
  path: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li>
      <div
        className="flex cursor-pointer items-center rounded px-2 py-1 hover:bg-secondary"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronDown className="mr-1 h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="mr-1 h-4 w-4 shrink-0" />
        )}
        <span className="font-medium">{node.name}</span>
      </div>
      {isExpanded && node.children && (
        <ul className="ml-4">
          {node.children.map((child, index) =>
            child.type === "folder" ? (
              <FolderNode
                key={index}
                node={child as components["schemas"]["Folder"]}
                path={path}
              />
            ) : (
              <LessonNode
                key={index}
                node={child as components["schemas"]["Lesson"]}
                path={path}
              />
            ),
          )}
        </ul>
      )}
    </li>
  );
}

function LessonNode({
  node,
  path,
}: {
  node: components["schemas"]["Lesson"];
  path: string;
}) {
  const navigate = useNavigate({ from: "/lesson/$" });
  const isActive = path === node.path.join("/");
  const { data: session } = $api.useSuspenseQuery("get", "/session");
  const isCompleted = session.completed_lessons.includes(node.path.join("/"));

  if (node.hide_from_menu) return null;
  return (
    <li
      className={cn(
        "flex cursor-pointer items-center rounded px-2 py-1",
        isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
      )}
      onClick={() =>
        navigate({ to: "/lesson/$", params: { _splat: node.path.join("/") } })
      }
    >
      {isCompleted ? (
        <BookCheck className="mr-2 h-4 w-4 shrink-0" />
      ) : (
        <Book className="mr-2 h-4 w-4 shrink-0" />
      )}

      <span>{node.name}</span>
    </li>
  );
}

function getAllLessons(root: components["schemas"]["Folder"]): {
  lessons: components["schemas"]["Lesson"][];
  progressRoot: components["schemas"]["Folder"] | null;
} {
  const lessons: components["schemas"]["Lesson"][] = [];
  let progressRoot: components["schemas"]["Folder"] | null = null;

  function traverse(
    element: components["schemas"]["Folder"] | components["schemas"]["Lesson"],
    currentPath: string[] = [],
  ) {
    if (element?.type === "lesson") {
      lessons.push(element as components["schemas"]["Lesson"]);
    } else if (element?.type === "folder") {
      const folder = element as components["schemas"]["Folder"];
      if (folder.progress_root) {
        progressRoot = folder;
      }
      folder.children.forEach((child) =>
        traverse(child, [...currentPath, folder.name]),
      );
    }
  }

  traverse(root);
  return { lessons, progressRoot };
}

export function getNavigationData(
  training: components["schemas"]["Training"],
  path: string,
) {
  const { lessons: flattenedLessons, progressRoot } = getAllLessons(
    training.root,
  );

  const lessonIndex = flattenedLessons.findIndex(
    (lesson) => lesson.path.join("/") === path,
  );

  const previousLesson =
    lessonIndex > 0 ? flattenedLessons[lessonIndex - 1].path.join("/") : null;

  const nextLesson =
    lessonIndex < flattenedLessons.length - 1
      ? flattenedLessons[lessonIndex + 1].path.join("/")
      : null;

  return {
    flattenedLessons,
    previousLesson,
    nextLesson,
    progressRoot,
    lessonIndex,
  };
}

const Navigation = ({ path }: { path: string }) => {
  const { data } = $api.useSuspenseQuery("get", "/training");

  const {
    flattenedLessons,
    previousLesson,
    nextLesson,
    progressRoot,
    lessonIndex,
  } = getNavigationData(data, path);

  let progress = 0;
  if (progressRoot) {
    const progressLessons = getAllLessons(progressRoot).lessons;
    const currentLessonIndex = progressLessons.findIndex(
      (lesson) => lesson.path.join("/") === path,
    );
    if (currentLessonIndex !== -1) {
      progress = ((currentLessonIndex + 1) / progressLessons.length) * 100;
    }
  }

  return (
    <div className="flex w-full flex-col gap-1 px-4">
      <div className="flex gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="block grow overflow-hidden overflow-ellipsis whitespace-nowrap text-left"
              variant="outline"
            >
              {flattenedLessons[lessonIndex]?.name}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <div className="p-2">
              <ul className="space-y-1">
                {data.root.children.map((child) =>
                  child.type === "folder" ? (
                    <FolderNode
                      key={child.name}
                      node={child as components["schemas"]["Folder"]}
                      path={path}
                    />
                  ) : (
                    <LessonNode
                      key={child.name}
                      node={child as components["schemas"]["Lesson"]}
                      path={path}
                    />
                  ),
                )}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
        <ProjectControl path={path} />

        <Link
          className={cn(
            buttonVariants({ size: "icon" }),
            !previousLesson && "pointer-events-none opacity-50",
            "shrink-0",
          )}
          to="/lesson/$"
          params={{ _splat: previousLesson! }}
          disabled={!previousLesson}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <Link
          className={cn(
            buttonVariants({ size: "icon" }),
            !nextLesson && "pointer-events-none opacity-50",
            "shrink-0",
          )}
          to="/lesson/$"
          params={{ _splat: nextLesson! }}
          disabled={!nextLesson}
        >
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <Progress value={progress} />
    </div>
  );
};

export default Navigation;
