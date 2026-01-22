import App from "App";
import Board, {loadBoardData} from "App/Project/Board";
import {createBrowserRouter, Navigate} from "react-router-dom";
import Backlog from "./App/Project/Backlog";
import Home from "./App/Home";
import Login from "./App/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./App/Register";
import ProjectDashboard from "./App/Project/Dashboard";
import ProjectList from "./App/ProjectList";
import Welcome from "./App/Welcome";
import Summary from "./App/Project/Summary";
import Reports from "./App/Project/Reports";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register/>,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/projects",
                element: <ProjectList />
            },
            {
                path: "/project/:projectId",
                element: <App />,
                children: [
                    {
                        path: "board/:boardId",
                        element: <Board />,
                        loader: loadBoardData
                    },
                    {
                        path: "backlog/:boardId",
                        element: <Backlog />
                    },
                    {
                        path: "dashboard",
                        element: <ProjectDashboard />
                    },
                    {
                        path: "summary",
                        element: <Summary />
                    },
                    {
                        path: "reports/:boardId",
                        element: <Reports />
                    },
                    {
                        index: true,
                        element: <Welcome />
                    }
                ]
            }
        ]
    }

]);
