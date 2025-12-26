import App from "App";
import Board, {loadBoardData} from "App/Project/Board";
import {createBrowserRouter, Navigate} from "react-router-dom";
import Backlog from "./App/Project/Backlog";
import Project from "./App/Project";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "project/:id",
                id: "project-detail",
                element: <Project/>,
                loader: loadBoardData,
                children: [
                    {
                        path: "board",
                        element: <Board />
                    },
                    {
                        path: "backlog",
                        element: <Backlog/>
                    },
                    {
                        index: true,
                        element: <Navigate to="board" replace/>
                    }
                ]
            },
        ],
    },
]);
