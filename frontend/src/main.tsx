import { StrictMode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import Chapter from "@/routes/chapter.tsx";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/chapter/:slug" element={<Chapter />} />
      </Routes>
    </Router>
  </StrictMode>,
);
