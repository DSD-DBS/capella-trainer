/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as LessonSplatImport } from './routes/lesson/$'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LessonSplatRoute = LessonSplatImport.update({
  id: '/lesson/$',
  path: '/lesson/$',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/lesson/$': {
      id: '/lesson/$'
      path: '/lesson/$'
      fullPath: '/lesson/$'
      preLoaderRoute: typeof LessonSplatImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/lesson/$': typeof LessonSplatRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/lesson/$': typeof LessonSplatRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/lesson/$': typeof LessonSplatRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/lesson/$'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/lesson/$'
  id: '__root__' | '/' | '/lesson/$'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  LessonSplatRoute: typeof LessonSplatRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LessonSplatRoute: LessonSplatRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/lesson/$"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/lesson/$": {
      "filePath": "lesson/$.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
