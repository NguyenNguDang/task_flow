import React from "react";
import { Task } from "../../../../types";

interface TaskItemProps {
    task: Task;
    renderPriority: (priority: string) => React.ReactNode;
}

export const TaskItem = ({ task, renderPriority }: TaskItemProps) => {
    return (
        <div className="group flex items-center justify-between p-2 mb-1 bg-white hover:bg-gray-50 border border-white hover:border-gray-300 shadow-sm hover:shadow-md cursor-pointer rounded transition-all">
            <div className="flex items-center flex-1 overflow-hidden">
                <div className="w-4 h-4 rounded-[3px] bg-[#4bade8] mr-2 flex items-center justify-center shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>

                <span className="text-[#172b4d] text-sm truncate pr-4">{task.title}</span>
            </div>

            <div className="flex items-center gap-4 min-w-fit">
                <span className="text-xs text-gray-400 font-mono hidden sm:block">#{task.id}</span>
                <div className="flex items-center gap-2">
                    {/* 3. Sửa lỗi: đổi 'issue.storyPoint' thành 'task.storyPoint' */}
                    {task.storyPoint && (
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                            {task.storyPoint}
                        </span>
                    )}

                    <div className="w-5 h-5 flex items-center justify-center">
                        {renderPriority(task.priority)}
                    </div>

                    {task.assignee ? (
                        <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                            {task.assignee.charAt(0)}
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs">?</div>
                    )}
                </div>
            </div>
        </div>
    );
};