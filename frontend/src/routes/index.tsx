/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { $api } from "@/lib/api/client.ts";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

const Index = () => {
  const { data: session } = $api.useQuery("get", "/session");

  const navigate = useNavigate();

  useEffect(() => {
    if (session?.last_lesson) {
      navigate(`/lesson/${session.last_lesson}`);
    }
  }, [session, navigate]);

  return (
    <div className="grid h-screen w-screen place-items-center">
      <LoaderCircle className="h-16 w-16 animate-spin" />
    </div>
  );
};

export default Index;
