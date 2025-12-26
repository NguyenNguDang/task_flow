import React from 'react';
import { Task } from "../../../../types";
import { TaskItem } from "../TaskItem";

type SprintProps = {
    title: string;
    tasks: Task[];
    sprintId: number;
    renderPriority: (priority: string) => React.ReactNode;
    status: string;
    isAnySprintActive: boolean;
    onStartSprint?: (id: number) => void;
    onCompleteSprint?: (id: number) => void;
};

export const Sprint = ({ title, tasks, sprintId, renderPriority, status, isAnySprintActive, onStartSprint, onCompleteSprint }: SprintProps) => {
    const isCurrentSprintActive = status?.toLowerCase() === 'active';

    const renderActionButton = () => {
        if (isCurrentSprintActive) {
            // Case 1: Sprint này ĐANG chạy -> Hiện nút Complete
            return (
                <button
                    onClick={() => onCompleteSprint && onCompleteSprint(sprintId)}
                    className="px-3 py-1 bg-[#ebecf0] hover:bg-gray-300 rounded text-[#42526e] font-medium transition-colors text-xs"
                >
                    Complete sprint
                </button>
            );
        } else {
            // Case 2: Sprint này CHƯA chạy (Planning)
            return (
                <button
                    onClick={() => {
                        if (!isAnySprintActive && onStartSprint) {
                            onStartSprint(sprintId);
                        }
                    }}
                    disabled={isAnySprintActive} // Disable nếu có sprint khác đang active
                    className={`px-3 py-1 rounded font-medium transition-colors text-xs
                        ${isAnySprintActive
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" // Style khi bị disable
                        : "bg-[#ebecf0] hover:bg-gray-300 text-[#42526e]" // Style khi được bấm
                    }
                    `}
                    title={isAnySprintActive ? "A sprint is already active" : "Start this sprint"}
                >
                    Start sprint
                </button>
            );
        }
    };

    return (
        <div className="mb-8">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center bg-[#f4f5f7] px-4 py-3 rounded-t-md text-sm">
                <div className="font-bold text-[#42526e]">
                    {title}
                    <span className="font-normal text-gray-500 ml-2">
                        ({tasks.length} tasks)
                    </span>
                </div>
                <div className="flex gap-2">
                    {renderActionButton()}
                </div>
            </div>

            {/* --- BODY --- */}
            <div className="border border-t-0 border-gray-200 rounded-b-md min-h-[50px] p-1 bg-white">
                {/* 1. Render danh sách Task */}
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        renderPriority={renderPriority}
                    />
                ))}

                {/* 2. Hiển thị khi Sprint rỗng (Optional - giúp UI đẹp hơn) */}
                {tasks.length === 0 && (
                    <div className="text-center text-gray-400 text-xs py-4 italic">
                        No tasks in this sprint
                    </div>
                )}

                {/* 3. Drop Zone (Vùng thả task) */}
                <div className="border-2 border-dashed border-transparent hover:border-gray-300 rounded p-2 text-center text-transparent hover:text-gray-400 text-sm transition-all cursor-pointer">
                    + Drop tasks here  {/* Sửa text thành tasks */}
                </div>
            </div>
        </div>
    );
};