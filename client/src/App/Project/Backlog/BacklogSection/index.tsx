import React, { useState } from "react";
import { Task } from "../../../../types";
import { TaskItem } from "../TaskItem";
import { Button } from "../../../../Components/Button.tsx";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { HiUserCircle } from "react-icons/hi";
import { CiCalendarDate } from "react-icons/ci";

interface BacklogSectionProps {
    tasks: Task[];
    renderPriority: (priority: string) => React.ReactNode;
    onCreateTask: (title: string) => void;
}

export const BacklogSection = ({ tasks, renderPriority, onCreateTask }: BacklogSectionProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    const handleStartCreate = () => {
        setIsCreating(true);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewTaskTitle("");
    };

    const handleSubmitCreate = () => {
        if (!newTaskTitle.trim()) {
            handleCancelCreate();
            return;
        }
        onCreateTask(newTaskTitle);
        setNewTaskTitle("");
        // Keep creating mode open or close it? Usually close it or keep focus.
        // Let's keep focus for rapid entry, but here we just clear title.
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmitCreate();
        } else if (e.key === 'Escape') {
            handleCancelCreate();
        }
    };

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
                {!isCreating ? (
                    <div 
                        onClick={handleStartCreate}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded text-[#42526e] text-sm font-medium border border-transparent hover:border-gray-300 transition-all flex items-center group"
                    >
                        <span className="text-xl mr-2 mb-1 group-hover:text-gray-600">+</span>
                        Create task
                    </div>
                ) : (
                    <div className="p-1 mx-1 mt-1">
                        <div className="flex items-center gap-2 bg-white border-2 border-blue-600 rounded-md p-1.5 shadow-sm">
                            <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center text-[10px] text-white font-bold">
                                ✓
                            </div>
                            <input
                                autoFocus
                                type="text"
                                className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
                                placeholder="What needs to be done?"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() => {
                                    if(!newTaskTitle) setIsCreating(false);
                                }}
                            />
                            <div className="flex items-center gap-2 text-gray-400">
                                <span className="hover:bg-gray-200 p-1 rounded cursor-pointer" title='Due date'><CiCalendarDate size={30} color={"black"}/></span>
                                <span className="hover:bg-gray-200 p-1 rounded cursor-pointer" title="Assignee"><HiUserCircle size={30} /></span>
                                <span> <Button icon={<MdSubdirectoryArrowLeft />}>Create</Button> </span>
                            </div>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1 ml-1">
                            Press <span className="font-bold">Enter</span> to create, <span className="font-bold">Esc</span> to cancel
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};