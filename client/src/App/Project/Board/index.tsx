/* eslint-disable @typescript-eslint/no-explicit-any */
import {memo, useEffect, useState} from "react";
import Column from "./Column";
import {DragDropContext, DropResult} from "@hello-pangea/dnd";
import {Column as ColumnType, CreateTaskRequest, Data, TaskCard, User} from "types";
import axiosClient from "../../../api"; // Use axiosClient instead of axios
import {BACKEND_URL} from "Constants";
import {convertToAppropriateFormat} from "utils";
import {useLoaderData, useParams} from "react-router-dom";
import {taskService} from "../../../services/task.service.tsx";
import {toast} from "react-toastify";
import {Button} from "../../../Components/Button.tsx";
import AddColumnModal from "../../../Components/AddColumnModal.tsx";
import MenuHeader from "../../../Components/MenuHeader";
import TaskDetailModal from "./TaskDetailModal.tsx";


interface InnerListColumnProps {
    index: number;
    column: ColumnType;
    taskMap: Record<string, TaskCard>;
    onTaskCreated: (columnId: string, title: string) => Promise<void>;
    onTaskClick: (task: TaskCard) => void;
    onAssignUser: (taskId: string, user: User) => void;
}

class TaskAndColumnOrderManager {
    private setState: (...args: any) => void;
    private data;
    private source;
    private destination;
    private draggableId;
    private start;
    private finish;
    private type;

    constructor(result: DropResult, setData: (...args: any) => void, data: Data) {
        const {type, source, destination, draggableId} = result;
        const {columns} = data;

        this.setState = setData;
        this.destination = destination!;
        this.draggableId = draggableId;
        this.source = source;
        this.finish = columns[destination!.droppableId];
        this.start = columns[source.droppableId];
        this.data = data;
        this.type = type;
    }

    public dragColumns = () => {
        const newColumnsOrder = [...this.data.columnOrder];
        newColumnsOrder.splice(this.source.index, 1);
        newColumnsOrder.splice(this.destination.index, 0, this.draggableId);
        const newState = {
            ...this.data,
            columnOrder: newColumnsOrder,
        };
        this.setState(newState);
    };

    public dragTasksInSameColumn = () => {
        const newTaskIds = [...this.start.taskIds];
        newTaskIds.splice(this.source.index, 1);
        newTaskIds.splice(this.destination.index, 0, this.draggableId);
        const newColumn = {...this.start, taskIds: newTaskIds};
        const newState = {
            ...this.data,
            columns: {
                ...this.data.columns,
                [newColumn.id]: newColumn,
            },
        };
        this.setState(newState);
    };

    public dragTasksBetweenColumns = () => {
        const startTasksIds = [...this.start.taskIds];
        const finishTaskIds = [...this.finish.taskIds];
        startTasksIds.splice(this.source.index, 1);
        finishTaskIds.splice(this.destination.index, 0, this.draggableId);
        const newState = {
            ...this.data,
            columns: {
                ...this.data.columns,
                [this.start.id]: {
                    ...this.start,
                    taskIds: startTasksIds,
                },
                [this.finish.id]: {
                    ...this.finish,
                    taskIds: finishTaskIds,
                },
            },
        };
        this.setState(newState);
    };

    public dragEndHandler = () => {
        if (
            !this.destination ||
            (this.destination.droppableId === this.source.droppableId &&
                this.destination.index === this.source.index)
        )
            return () => {
            };

        if (this.type == "column") {
            return this.dragColumns;
        }

        if (this.start == this.finish) {
            return this.dragTasksInSameColumn;
        }

        return this.dragTasksBetweenColumns;
    };
}

const InnerListColumn = memo((props: InnerListColumnProps) => {
    const {index, column, taskMap, onTaskCreated, onTaskClick, onAssignUser} = props;
    const tasks = column.taskIds
        .map((taskId) => taskMap[taskId])
        .filter((task) => task !== undefined);
    return <Column onTaskClick={onTaskClick} index={index} column={column} tasks={tasks}
                   onTaskCreated={onTaskCreated} onAssignUser={onAssignUser}/>;
});

let boardId: number;

export async function loadBoardData({params}: any) {
    try {
        boardId = params.boardId;

        console.log(`Fetching data for board: ${boardId} from ${BACKEND_URL}`);

        const [tasksRes, sprintsRes, columnsRes] = await Promise.all([
            // 1.Call API get All tasks of Active Sprint
            axiosClient.get(`/tasks/${boardId}/active-sprint`),

            // 2. Call API get Sprints
            axiosClient.get(`/sprint/${boardId}/list`),

            // 3. Call API Get columns
            axiosClient.get(`/boards/${boardId}/columns`)
        ]);

        const tasks = tasksRes; // axiosClient returns response.data directly
        console.log("Tasks loaded", tasks);
        const sprints = sprintsRes;
        // console.log("Sprints", sprints);
        const columns = columnsRes;
        // console.log("Columns", columns);

        // Tìm active sprint để hiển thị tên trên UI
        const activeSprintInfo = sprints ? (sprints as any[])
            .find((s: any) => s.status === "active") : null;
        // Gom dữ liệu để convert
        const rawData = {
            tasks: tasks || [],
            columns: columns || []
        };

        const formattedData = convertToAppropriateFormat(rawData);

        return {
            boardData: formattedData,
            activeSprint: activeSprintInfo || null
        };

    } catch (error) {
        console.error("Loader Error:", error);
        throw error;
    }
}

export default function Board() {
    const {boardData, activeSprint} = useLoaderData() as any;
    const [data, setData] = useState(boardData);
    const [isAddColumnModal, setIsAddColumnModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<TaskCard | null>(null);
    const {projectId: projectIdParam, boardId: boardIdParam} = useParams();

    useEffect(() => {
        setData(boardData);
    }, [boardData]);

    const handleTaskClick = (task: TaskCard) => {
        setSelectedTask(task);
    }

    const handleAssignUser = (taskId: string, user: User) => {
        setData((prevData: any) => ({
            ...prevData,
            tasks: {
                ...prevData.tasks,
                [taskId]: {
                    ...prevData.tasks[taskId],
                    assignees: [{
                        name: user.fullName,
                        avatar: user.avatarUrl
                    }]
                }
            }
        }));
    };

    const handleTaskUpdate = async () => {
        try {
            const [tasksRes, columnsRes] = await Promise.all([
                axiosClient.get(`/tasks/${boardIdParam}/active-sprint`),
                axiosClient.get(`/boards/${boardIdParam}/columns`)
            ]);
            
            const newData = convertToAppropriateFormat({
                tasks: tasksRes || [],
                columns: columnsRes || []
            });
            
            setData(newData);

        } catch (error) {
            console.error("Failed to refresh board data", error);
        }
    };

    const handleColumnAdded = ((newColumnBackend: any) => {
        const newColId = String(newColumnBackend.id);
        const newColumnForUI = {
            id: newColId,
            title: newColumnBackend.title,
            taskIds: [],
        };

        setData((prevData: any) => ({
            ...prevData,
            columns: {
                ...prevData.columns,
                [newColId]: newColumnForUI,
            },
            columnOrder: [...prevData.columnOrder, newColId],
        }));

    });

    //Call api create task
    const handleCreateTask = async (columnId: string, title: string) => {
        // Determine status based on column title
        const column = data.columns[columnId];
        let status = 'TODO'; // Default
        if (column) {
            const colTitle = column.title.toLowerCase();
            if (colTitle === 'done') {
                status = 'DONE';
            } else if (colTitle === 'doing' || colTitle === 'in progress') {
                status = 'DOING';
            }
        }

        const payload: CreateTaskRequest = {
            title: title,
            columnId: Number(columnId),
            projectId: Number(projectIdParam),
            priority: 'medium',
            boardId: Number(boardIdParam),
            sprintId: activeSprint?.id || null,
            status: status // Send status to backend
        };

        try {
            const response = await taskService.create(payload);
            const newTask = response.data;

            // Show toast if no active sprint
            if (!activeSprint?.id) {
                toast.info("No active sprint. Task will be moved to Backlog.");
            } else {
                // Only update UI if there is an active sprint (task appears on board)
                setData((prevData: any) => {
                    if (!prevData) return prevData;

                    const newTaskId = String(newTask.id);
                    const colIdStr = String(columnId);

                    const columnToUpdate = prevData.columns[colIdStr];

                    if (!columnToUpdate) return prevData;

                    return {
                        ...prevData,
                        tasks: {
                            ...prevData.tasks,
                            [newTaskId]: newTask,
                        },

                        columns: {
                            ...prevData.columns,
                            [colIdStr]: {
                                ...columnToUpdate,
                                taskIds: [...columnToUpdate.taskIds, newTaskId],
                            },
                        },
                    };
                });
            }

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create task");
        }

    }


    if (!boardData) {
        return <div>Loading board data...</div>;
    }

    const onDragEnd = async (result: DropResult) => {
        const {destination, source, draggableId, type} = result;
        if (!destination ||
            (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const previousData = JSON.parse(JSON.stringify(data));

        //update ui
        const taskAndColumnOrderManager = new TaskAndColumnOrderManager(
            result,
            setData,
            data
        );
        taskAndColumnOrderManager.dragEndHandler()();

        try {
            if (type === "task" || !type) {
                await taskService.updatePosition({
                    taskId: draggableId,
                    newColumnId: destination.droppableId,
                    newIndex: destination.index
                });

                if (source.droppableId !== destination.droppableId) {
                    const destinationColumn = data.columns[destination.droppableId];
                    const columnTitle = destinationColumn.title.toLowerCase();
                    let newStatus: 'todo' | 'doing' | 'done' | undefined;

                    if (columnTitle === 'done') {
                        newStatus = 'done';
                    } else if (columnTitle === 'in progress' || columnTitle === 'doing') {
                        newStatus = 'doing';
                    } else if (columnTitle === 'to do' || columnTitle === 'todo') {
                        newStatus = 'todo';
                    }

                    if (newStatus) {
                        await taskService.update(draggableId, {status: newStatus});

                        setData((prevData: any) => ({
                            ...prevData,
                            tasks: {
                                ...prevData.tasks,
                                [draggableId]: {
                                    ...prevData.tasks[draggableId],
                                    status: newStatus
                                }
                            }
                        }));
                    }
                }
            }

            if (type === "column") {
                const newColumnOrder = [...data.columnOrder];
                newColumnOrder.splice(source.index, 1);
                newColumnOrder.splice(destination.index, 0, draggableId);
                await taskService.updateColumnOrder(newColumnOrder);
            }

        } catch (error: any) {
            console.error("Failed to update position:", error);
            setData(previousData);
            toast.error(error.response?.data?.message || "Could not update position. Please try again!");
        }
    };


    return (<>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col h-full ">
                    <MenuHeader/>
                    <div className="flex justify-end items-center my-3">
                        <div>

                        </div>
                    </div>
                    <div className="flex flex-row bg-white flex-grow items-start p-4">
                        {data.columnOrder.map((columnId: string, index: number) => {
                            const column = data.columns[columnId];
                            return (
                                <InnerListColumn
                                    index={index}
                                    key={columnId}
                                    column={column}
                                    taskMap={data.tasks}
                                    onTaskCreated={handleCreateTask}
                                    onTaskClick={handleTaskClick}
                                    onAssignUser={handleAssignUser}
                                />
                            );
                        })}
                        <Button icon={<span>+</span>} className="mx-4 py-10 px-4"
                                onClick={() => setIsAddColumnModal(true)}>Create column</Button>
                    </div>
                    {isAddColumnModal && (
                        <AddColumnModal boardId={boardId}
                                        onClose={() => setIsAddColumnModal(false)}
                                        onSuccess={handleColumnAdded}/>
                    )}
                </div>
            </DragDropContext>

            {selectedTask && (<TaskDetailModal
                taskId={Number(selectedTask.id)}
                onClose={() => setSelectedTask(null)}
                onTaskUpdate={handleTaskUpdate}
            />)}
        </>
    );
}