/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrictMode, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import Lesson from "@/routes/lesson.tsx";
import { createRoot } from "react-dom/client";
import Layout from "@/components/layout.tsx";
import { ROUTE_PREFIX } from "@/lib/const.ts";
import Index from "@/routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense>
      <Layout>
        <Router basename={ROUTE_PREFIX}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lesson/*" element={<Lesson />} />
          </Routes>
        </Router>
      </Layout>
    </Suspense>
  </StrictMode>,
);
