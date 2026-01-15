import axiosClient from "../api";
import {CreateTaskRequest, Task, Comment} from "../types";

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

    delete: (id: number) => {
        return axiosClient.delete(`/tasks/${id}`);
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
    },

    assignUser: (taskId: number, userId: number) => {
        return axiosClient.put(`/tasks/${taskId}/assign`, { assigneeId: userId });
    },

    createSubtask: (taskId: number, title: string) => {
        return axiosClient.post(`/tasks/${taskId}/subtasks`, { title });
    },

    toggleSubtask: (taskId: number, subtaskId: number) => {
        return axiosClient.patch(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
    },

    deleteSubtask: (taskId: number, subtaskId: number) => {
        return axiosClient.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    },

    getComments: (taskId: number) => {
        return axiosClient.get<Comment[]>(`/tasks/${taskId}/comments`);
    },

    addComment: (taskId: number, content: string) => {
        return axiosClient.post<Comment>(`/tasks/${taskId}/comments`, { content });
    },

    uploadAttachment: (taskId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`/tasks/${taskId}/attachments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    updateStoryPoints: (taskId: number, storyPoints: number) => {
        return axiosClient.put(`/tasks/${taskId}`, { estimateHours: storyPoints });
    },

    moveTaskToSprint: (taskId: number, sprintId: number | null) => {
        return axiosClient.put(`/tasks/${taskId}/move-to-sprint`, { sprintId });
    }
};