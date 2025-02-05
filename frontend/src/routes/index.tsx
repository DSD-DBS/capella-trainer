/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { $api } from "@/lib/api/client.ts";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: session } = $api.useQuery("get", "/session");

  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    if (session?.last_lesson) {
      navigate({ to: "/lesson/$", params: { _splat: session.last_lesson } });
    }
  }, [session, navigate]);

  return (
    <div className="grid h-screen w-screen place-items-center">
      <LoaderCircle className="h-16 w-16 animate-spin" />
    </div>
  );
}
