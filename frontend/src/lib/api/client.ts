/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./v1";
import { API_BASE } from "@/lib/const.ts"; // generated by openapi-typescript

export const fetchClient = createFetchClient<paths>({
  baseUrl: `${API_BASE}/`,
});

export const $api = createClient(fetchClient);
