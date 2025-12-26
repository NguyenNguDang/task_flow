import axiosClient from "../api";
import {CreateTaskRequest, Task} from "../types";

interface MoveTaskPayload {
    taskId: string;
    newColumnId: string;
    newIndex: number;
}

export const taskService = {

    create: (payload: CreateTaskRequest) => {
        return axiosClient.post<Task>("/tasks", payload);
    },

    update: (id: string, data: Partial<Task>) => {
        return axiosClient.put<Task>(`/tasks/${id}`, data);
    },

    getAll: (boardId: string) => {
        return axiosClient.get<Task[]>(`/boards/${boardId}/tasks`);
    },

    updatePosition: (payload: MoveTaskPayload) => {
        const url = '/tasks/update-position';
        return axiosClient.put(url, payload);
    },

    updateColumnOrder: (newOrder: string[]) => {
        const url = '/boards/reorder-columns';
        return axiosClient.put(url, { columnOrder: newOrder });
    }
};