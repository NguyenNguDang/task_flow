import App from "App";
import Board, {loadBoardData} from "App/Project/Board";
import {createBrowserRouter, Navigate} from "react-router-dom";
import Backlog from "./App/Project/Backlog";
import Home from "./App/Home";
import Login from "./App/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./App/Register";

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
                        index: true,
                        element: <Navigate to="backlog" replace />
                    }
                ]
            }
        ]
    }

]);
