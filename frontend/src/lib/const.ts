/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    env: Record<string, string>;
  }
}

export const API_BASE = window.env.ROUTE_PREFIX;
export const ROUTE_PREFIX = window.env.ROUTE_PREFIX;
export const ENABLE_BUILT_IN_CAPELLA =
  window.env.ENABLE_BUILT_IN_CAPELLA === "true";
