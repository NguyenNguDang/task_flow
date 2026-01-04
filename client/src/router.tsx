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
                path: "/project/:id",
                element: <App />,
                loader: loadBoardData,
                children: [
                    {
                        path: "board",
                        element: <Board />
                    },
                    {
                        path: "backlog",
                        element: <Backlog />
                    },
                    {
                        index: true,
                        element: <Navigate to="board" replace />
                    }
                ]
            }
        ]
    }

]);
