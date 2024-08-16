import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Root from "@/routes/root.tsx";
import { createRoot } from "react-dom/client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
