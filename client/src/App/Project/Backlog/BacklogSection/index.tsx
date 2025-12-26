import React from "react";
import { Task } from "../../../../types";
import { TaskItem } from "../TaskItem";

interface BacklogSectionProps {
    tasks: Task[]; // Đổi tên prop từ 'task' thành 'tasks' cho đúng ngữ pháp
    renderPriority: (priority: string) => React.ReactNode;
    // Bỏ renderTypeIcon vì đã thống nhất chỉ dùng Task
}

export const BacklogSection = ({ tasks, renderPriority }: BacklogSectionProps) => {
    return (
        <div className="mb-8">
            {/* --- Header của Backlog --- */}
            <div className="flex justify-between items-center px-4 py-2 text-sm text-[#42526e]">
                <div className="font-bold">
                    Backlog
                    <span className="font-normal text-gray-500 ml-2">
                        ({tasks.length} tasks)
                    </span>
                </div>
                {/* Ở đây thường là nút tạo Task, không phải tạo Sprint */}
                {/* Nút Create Sprint đã được đặt ở Backlog.tsx (component cha) */}
            </div>

            {/* --- Danh sách Task (Container) --- */}
            <div className="border border-gray-200 rounded p-1 bg-white min-h-[50px]">

                {/* Map qua danh sách tasks */}
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        renderPriority={renderPriority}
                    />
                ))}

                {/* Empty State (Nếu không có task nào) */}
                {tasks.length === 0 && (
                    <div className="text-center text-gray-400 text-xs py-4 italic">
                        Your backlog is empty.
                    </div>
                )}

                {/* Nút tạo Task nhanh ở cuối danh sách */}
                <div className="p-2 hover:bg-gray-100 cursor-pointer rounded text-[#42526e] text-sm font-medium border border-transparent hover:border-gray-300 transition-all flex items-center group">
                    <span className="text-xl mr-2 mb-1 group-hover:text-gray-600">+</span>
                    Create task
                </div>
            </div>
        </div>
    );
};