/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    env: Record<string, string>;
  }
}

export const API_BASE = import.meta.env.VITE_API_BASE || window.env.API_BASE;

export const ROUTE_PREFIX =
  import.meta.env.VITE_ROUTE_PREFIX || window.env.ROUTE_PREFIX;

export const ENABLE_BUILT_IN_CAPELLA =
  import.meta.env.VITE_ENABLE_BUILT_IN_CAPELLA !== undefined
    ? import.meta.env.VITE_ENABLE_BUILT_IN_CAPELLA === "true"
    : window.env.ENABLE_BUILT_IN_CAPELLA === "true";
