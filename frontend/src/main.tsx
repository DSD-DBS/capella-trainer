import { StrictMode, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import Lesson from "@/routes/lesson.tsx";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense>
      <Router>
        <Routes>
          <Route path="/lesson/*" element={<Lesson />} />
        </Routes>
      </Router>
    </Suspense>
  </StrictMode>,
);
