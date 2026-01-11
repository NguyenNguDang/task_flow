import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import "./index.css";
import {AuthProvider} from "./context/AuthContext";
import {ProjectProvider} from "./context/ProjectContext.tsx";

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
    <AuthProvider>
        <ProjectProvider>
            <RouterProvider router={router}/>
        </ProjectProvider>
    </AuthProvider>
);
