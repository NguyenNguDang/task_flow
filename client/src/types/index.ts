/* eslint-disable @typescript-eslint/no-explicit-any */
export const Tags = {
  HIGH: "bg-red-300",
  LOW: "bg-green-300",
  MEDIUM: "bg-blue-300",
};

export interface Issue {
    id: string;
    title: string;
    type: string;
    priority: string;
    assignee: string | null;
    storyPoint: number;
}

export type Assignee = {
  name: string;
  avatar: string;
};

export interface Task {
    id: number;
    taskKey?: string; // Added taskKey
    title: string;
    description: string;
    position?: number;
    status: 'todo' | 'doing' | 'done';
    sprintId: number | null;
    
    // Updated to match backend response
    assignee?: {
        id: number;
        fullName: string;
        avatarUrl: string | null;
    };
    estimateHours?: number;
    
    // Legacy fields (optional)
    assigneeName?: string | null;
    assigneeAvatar?: string | null;
    storyPoint?: number;

    priority: string;
}

export interface TaskCard {
    id: string;
    title: string;
    description?: string;
    tag: string;
    status?: string; // Added status field
    assignees: { name: string; avatar?: string }[];
    position?: number;
}

export type Column = { id: string; title: string; taskIds: string[] };

export interface Data {
  [x: string]: any;
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

type DTO = {
  column_order: number;
  task_title: string;
  board_id: string;
  user_lastname: string;
  user_id: string;
  column_id: string;
  task_id: string;
  user_name: string;
  task_description: string;
  board_column_title: string;
  task_tag: string;
  project_title: string;
  project_description: string;
};

export type RecievedData = DTO[];

export type SprintType = {
    id: number;
    name: string;
    status: string; // 'future', 'active', 'closed'
    goal?: string;
    startDate?: string;
    endDate?: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    priority: 'high' | 'medium' | 'low';
    columnId: number;
    projectId: number;
    boardId: number;
    sprintId: number;
}

export interface User {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
    roles?: string[];
    bio?: string;
}

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    userName: string;
    userAvatar: string | null;
    attachmentUrl?: string;
    attachmentName?: string;
}
