import React, {useState} from 'react';
import {SprintType, Task} from "../../../../types";
import {TaskItem} from "../TaskItem";
import {IoIosMore} from "react-icons/io";
import {Button} from "../../../../Components/Button.tsx";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { HiUserCircle } from "react-icons/hi";
import { CiCalendarDate } from "react-icons/ci";

type ModalType = "EDIT" | null;

type SprintProps = {
    title: string;
    tasks: Task[];
    sprintId: number;
    allSprints: SprintType[];
    renderPriority: (priority: string) => React.ReactNode;
    status: string;
    isAnySprintActive: boolean;
    onStartSprint?: (id: number) => void;
    onCompleteSprint?: (id: number, targetId: number | null) => void;
    onCreateTask: (sprintId: number, title: string) => void;
};

export const Sprint = ({
                           title,
                           tasks,
                           sprintId,
                           allSprints,
                           renderPriority,
                           status,
                           isAnySprintActive,
                           onStartSprint,
                           onCompleteSprint,
                           onCreateTask
                       }: SprintProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [targetSprintInfo, setTargetSprintInfo] = useState<{ id: number | null, name: string }>({
        id: null,
        name: 'Backlog'
    });
    const isCurrentSprintActive = status?.toLowerCase() === 'active';
    const unfinishedTasksCount = tasks.filter(t => t.status !== 'done').length;
    const [isOpen, setIsOpen] = useState<ModalType>(null);
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

        onCreateTask(sprintId, newTaskTitle);
        setNewTaskTitle("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmitCreate();
        } else if (e.key === 'Escape') {
            handleCancelCreate();
        }
    };

    const openModal = (type: ModalType) => {
        setIsOpen(type);
    }

    const closeModal = () => {
        setIsOpen(null);
    }

    const calculateTargetSprint = () => {
        const futureSprints = allSprints.filter(s =>
            s.id !== sprintId &&
            s.status !== 'completed' &&
            s.status !== 'active'
        );

        if (futureSprints.length > 0) {
            return {id: futureSprints[0].id, name: futureSprints[0].name};
        }

        return {id: null, name: 'Backlog'};
    };

    const handleCompleteClick = () => {
        if (!onCompleteSprint) return;

        if (unfinishedTasksCount === 0) {
            onCompleteSprint(sprintId, null);
            return;
        }

        const target = calculateTargetSprint();
        setTargetSprintInfo(target);
        setIsConfirmOpen(true);
    };

    const handleConfirmComplete = () => {
        if (onCompleteSprint) {
            onCompleteSprint(sprintId, targetSprintInfo.id);
        }
        setIsConfirmOpen(false);
    };

    const renderActionButton = () => {
        if (isCurrentSprintActive) {
            // Case 1: Sprint is Active -> Can be Complete
            return (
                <button
                    onClick={handleCompleteClick}
                    className="px-3 py-1 bg-[#ebecf0] hover:bg-gray-300 rounded text-[#42526e] font-medium transition-colors text-xs"
                >
                    Complete sprint
                </button>
            );
        } else {
            // Case 2: Sprint is not Active
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
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#ebecf0] hover:bg-gray-300 text-[#42526e]"
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
                <div className="flex items-center gap-2">
                    {renderActionButton()}
                    <div className="relative inline-block">
    <span
        onClick={() => openModal("EDIT")}
        className="cursor-pointer hover:bg-gray-200 rounded p-1 block"
    >
        <IoIosMore size={20}/>
    </span>

                        {isOpen === "EDIT" && (
                            <>
                                {/* 1. Backdrop ảo: Để click ra ngoài thì đóng menu */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={closeModal}
                                ></div>

                                {/* 2. Menu Dropdown: Dùng div thường thay vì Modal */}
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white shadow-xl rounded-md border border-gray-200 z-50 overflow-hidden">
                                    <div className="py-1">
                                        <button  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Edit Sprint
                                        </button>
                                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            Delete Sprint
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
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

                {/* 3. Drop Zone / Create Task Input */}
                {!isCreating ? (
                    <div
                        onClick={handleStartCreate}
                        className="flex items-center gap-2 p-2 mx-1 mt-1 rounded cursor-pointer transition-colors hover:bg-gray-100 group"
                    >
                        <span className="text-xl text-transparent group-hover:text-gray-500">+</span>
                        <div className="text-sm text-transparent group-hover:text-gray-600 font-medium">
                            Create issue
                        </div>
                    </div>
                ) : (
                    <div className="p-1 mx-1 mt-1">
                        <div className="flex items-center gap-2 bg-white border-2 border-blue-600 rounded-md p-1.5 shadow-sm">
                            {/* Icon loại task (giả lập) */}
                            <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center text-[10px] text-white font-bold">
                                ✓
                            </div>

                            {/* Input nhập tên task */}
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

            {/* --- MODAL CONFIRM --- */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-md shadow-lg w-[400px] p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Complete Sprint: {title}</h3>

                        <div className="text-sm text-gray-600 mb-6 space-y-3">
                            <p>
                                Sprint này còn <span
                                className="font-bold text-red-600">{unfinishedTasksCount}</span> task chưa hoàn
                                thành.
                            </p>
                            <div className="bg-blue-50 p-3 rounded border border-blue-100 text-blue-800">
                                <p className="mb-1 text-xs uppercase font-bold text-blue-600">Hệ thống sẽ tự động
                                    chuyển đến:</p>
                                <p className="font-medium text-lg">👉 {targetSprintInfo.name}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmComplete}
                                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
                            >
                                Confirm Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};