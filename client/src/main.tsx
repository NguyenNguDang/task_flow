import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";

const originalWarn = console.warn;
console.warn = (...args) => {
    if (
        typeof args[0] === "string" &&
        args[0].includes("unsupported nested scroll container detected")
    ) {
        return;
    }
    originalWarn(...args); 
};

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
