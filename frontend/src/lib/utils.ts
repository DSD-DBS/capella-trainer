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

type Lesson = components["schemas"]["Lesson"];

interface LessonWithProgressRoot extends Lesson {
  progress_root: components["schemas"]["Folder"] | null;
}

export function getFlatLessons(
  root: components["schemas"]["Folder"],
): LessonWithProgressRoot[] {
  const lessons: LessonWithProgressRoot[] = [];
  let progressRoot: components["schemas"]["Folder"] | null = null;

  function traverse(
    element: components["schemas"]["Folder"] | components["schemas"]["Lesson"],
    currentPath: string[] = [],
  ) {
    if (element?.type === "lesson") {
      lessons.push({
        ...element,
        progress_root: progressRoot,
      } as LessonWithProgressRoot);
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
  return lessons;
}

interface LessonMeta {
  previousLesson: components["schemas"]["Lesson"] | null;
  lesson: components["schemas"]["Lesson"];
  nextLesson: components["schemas"]["Lesson"] | null;
  progress: number | null;
}

export function getLessonMeta(
  training: components["schemas"]["Training"],
  path: string,
): LessonMeta {
  const lessons = getFlatLessons(training.root);
  const index = lessons.findIndex((l) => l.path.join("/") === path);
  const lesson = lessons[index];
  const previousLesson = lessons[index - 1] || null;
  const nextLesson = lessons[index + 1] || null;

  const progressRootForLesson = lessons[index].progress_root;

  if (progressRootForLesson) {
    const lessonsInRoot = getFlatLessons(progressRootForLesson);
    const currentLessonIndex = lessonsInRoot.findIndex(
      (l) => l.path.join("/") === path,
    );
    const progress = ((currentLessonIndex + 1) / lessonsInRoot.length) * 100;
    return { previousLesson, lesson, nextLesson, progress };
  }

  return { previousLesson, lesson, nextLesson, progress: null };
}
