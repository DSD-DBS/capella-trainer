import { StrictMode, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import Lesson from "@/routes/lesson.tsx";
import { createRoot } from "react-dom/client";
import Layout from "@/components/layout.tsx";
import { ROUTE_PREFIX } from "@/lib/const.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense>
      <Layout>
        <Router basename={ROUTE_PREFIX}>
          <Routes>
            <Route path="/lesson/*" element={<Lesson />} />
          </Routes>
        </Router>
      </Layout>
    </Suspense>
  </StrictMode>,
);
