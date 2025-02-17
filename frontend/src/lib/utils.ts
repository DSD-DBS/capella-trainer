/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { components } from "@/lib/api/v1";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAllLessons(root: components["schemas"]["Folder"]): {
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
