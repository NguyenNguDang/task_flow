import React, {useState} from 'react';
import {SprintType, Task} from "../../../../types";
import {TaskItem} from "../TaskItem";
import {IoIosMore} from "react-icons/io";
import {Button} from "../../../../Components/Button.tsx";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { HiUserCircle } from "react-icons/hi";
import { CiCalendarDate } from "react-icons/ci";
import SprintReportModal from "../../../../Components/SprintReportModal";
import { Modal } from "../../../../Components/Modal";
import { Droppable, Draggable } from "@hello-pangea/dnd";

type ModalType = "EDIT" | "UPDATE" | null;

type SprintProps = {
    title: string;
    tasks: Task[];
    sprintId: number;
    allSprints: SprintType[];
    renderPriority: (priority: string) => React.ReactNode;
    status: string;
    startDate?: string;
    endDate?: string;
    isAnySprintActive: boolean;
    onStartSprint?: (id: number) => void;
    onCompleteSprint?: (id: number, targetId: number | null) => void;
    onCreateTask: (title: string) => void;
    onDeleteSprint?: (id: number) => void;
    onUpdateSprint?: (id: number, data: Partial<SprintType>) => void;
};

export const Sprint = ({
                           title,
                           tasks,
                           sprintId,
                           allSprints,
                           renderPriority,
                           status,
                           startDate,
                           endDate,
                           isAnySprintActive,
                           onStartSprint,
                           onCompleteSprint,
                           onCreateTask,
                           onDeleteSprint,
                           onUpdateSprint
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
    const [showReport, setShowReport] = useState(false);
    
    // Edit Sprint State
    const [editData, setEditData] = useState({ name: title, startDate: startDate || '', endDate: endDate || '' });

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
        if (type === "UPDATE") {
            setEditData({ name: title, startDate: startDate || '', endDate: endDate || '' });
        }
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

    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onUpdateSprint) {
            onUpdateSprint(sprintId, editData);
        }
        closeModal();
    };

    const renderActionButton = () => {
        if (isCurrentSprintActive) {
            return (
                <button
                    onClick={handleCompleteClick}
                    className="px-3 py-1 bg-[#ebecf0] hover:bg-gray-300 rounded text-[#42526e] font-medium transition-colors text-xs"
                >
                    Complete sprint
                </button>
            );
        } else if (status !== 'completed') {
            return (
                <button
                    onClick={() => {
                        if (!isAnySprintActive && onStartSprint) {
                            onStartSprint(sprintId);
                        }
                    }}
                    disabled={isAnySprintActive}
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
        return null;
    };

    return (
        <div className="mb-8">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center bg-[#f4f5f7] px-4 py-3 rounded-t-md text-sm">
                <div className="flex flex-col">
                    <div className="font-bold text-[#42526e] flex items-center gap-2">
                        {title}
                        <span className="font-normal text-gray-500 text-xs">
                            ({tasks.length} tasks)
                        </span>
                    </div>
                    {(startDate || endDate) && (
                        <div className="text-xs text-gray-500 mt-1">
                            {startDate} - {endDate}
                        </div>
                    )}
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
                                <div className="fixed inset-0 z-40" onClick={closeModal}></div>
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white shadow-xl rounded-md border border-gray-200 z-50 overflow-hidden">
                                    <div className="py-1">
                                        <button 
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => openModal("UPDATE")}
                                        >
                                            Edit Sprint
                                        </button>
                                        <button 
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => {
                                                closeModal();
                                                setShowReport(true);
                                            }}
                                        >
                                            View Report
                                        </button>
                                        <button 
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            onClick={() => {
                                                closeModal();
                                                if (onDeleteSprint) onDeleteSprint(sprintId);
                                            }}
                                        >
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
            <Droppable droppableId={String(sprintId)}>
                {(provided) => (
                    <div 
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="border border-t-0 border-gray-200 rounded-b-md min-h-[50px] p-1 bg-white"
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <TaskItem
                                            task={task}
                                            renderPriority={renderPriority}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}

                        {tasks.length === 0 && (
                            <div className="text-center text-gray-400 text-xs py-4 italic">
                                No tasks in this sprint
                            </div>
                        )}

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
                )}
            </Droppable>

            {/* --- MODAL CONFIRM COMPLETE --- */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-md shadow-lg w-[400px] p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Complete Sprint: {title}</h3>
                        <div className="text-sm text-gray-600 mb-6 space-y-3">
                            <p>
                                Sprint này còn <span className="font-bold text-red-600">{unfinishedTasksCount}</span> task chưa hoàn thành.
                            </p>
                            <div className="bg-blue-50 p-3 rounded border border-blue-100 text-blue-800">
                                <p className="mb-1 text-xs uppercase font-bold text-blue-600">Hệ thống sẽ tự động chuyển đến:</p>
                                <p className="font-medium text-lg">👉 {targetSprintInfo.name}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsConfirmOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">Cancel</button>
                            <button onClick={handleConfirmComplete} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors">Confirm Complete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL EDIT SPRINT --- */}
            {isOpen === "UPDATE" && (
                <Modal onClose={closeModal} className="max-w-md">
                    <div className="p-2">
                        <h3 className="text-lg font-bold mb-4">Edit Sprint: {title}</h3>
                        <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Name</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editData.startDate}
                                        onChange={(e) => setEditData({...editData, startDate: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={editData.endDate}
                                        onChange={(e) => setEditData({...editData, endDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded">Update</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}

            {/* --- SPRINT REPORT MODAL --- */}
            {showReport && (
                <SprintReportModal
                    sprintId={sprintId}
                    onClose={() => setShowReport(false)}
                />
            )}
        </div>
    );
};