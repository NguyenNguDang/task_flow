import React, { useState, useRef, useEffect } from "react";
import { Task } from "../../../../types";
import { TaskItem } from "../TaskItem";
import { Button } from "../../../../Components/Button.tsx";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { HiUserCircle } from "react-icons/hi";
import { CiCalendarDate } from "react-icons/ci";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskDetailModal from "../../Board/TaskDetailModal";
import axiosClient from "../../../../api";
import { useParams } from "react-router-dom";
import { createPortal } from "react-dom";

interface BacklogSectionProps {
    tasks: Task[];
    renderPriority: (priority: string) => React.ReactNode;
    onCreateTask: (title: string, dueDate?: string, assigneeId?: number) => void;
    onUpdateTask?: (taskId: number, updates: Partial<Task>) => void;
    onDeleteTask?: (taskId: number) => void;
}

interface UserInfo {
    id: number;
    fullName: string;
    avatarUrl: string | null;
}

export const BacklogSection = ({ tasks, renderPriority, onCreateTask, onUpdateTask, onDeleteTask }: BacklogSectionProps) => {
    const { projectId } = useParams();
    const [isCreating, setIsCreating] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    // Create Task Options
    const [dueDate, setDueDate] = useState<string>("");
    const [assigneeId, setAssigneeId] = useState<number | undefined>(undefined);
    const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
    const [projectMembers, setProjectMembers] = useState<UserInfo[]>([]);
    const assigneeButtonRef = useRef<HTMLSpanElement>(null);
    const assigneeMenuRef = useRef<HTMLDivElement>(null);
    const [assigneeMenuPosition, setAssigneeMenuPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (showAssigneeMenu && projectMembers.length === 0) {
            const fetchMembers = async () => {
                try {
                    const res = await axiosClient.get(`/projects/${projectId}/members`) as UserInfo[];
                    setProjectMembers(res);
                } catch (e) {
                    console.error("Failed to fetch members", e);
                }
            };
            fetchMembers();
        }
    }, [showAssigneeMenu, projectId]);

    const handleStartCreate = () => {
        setIsCreating(true);
        setDueDate("");
        setAssigneeId(undefined);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setNewTaskTitle("");
        setDueDate("");
        setAssigneeId(undefined);
    };

    const handleSubmitCreate = () => {
        if (!newTaskTitle.trim()) {
            handleCancelCreate();
            return;
        }
        onCreateTask(newTaskTitle, dueDate || undefined, assigneeId);
        setNewTaskTitle("");
        setDueDate("");
        setAssigneeId(undefined);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmitCreate();
        } else if (e.key === 'Escape') {
            handleCancelCreate();
        }
    };

    const handleAssigneeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (assigneeButtonRef.current) {
            const rect = assigneeButtonRef.current.getBoundingClientRect();
            setAssigneeMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX
            });
            setShowAssigneeMenu(!showAssigneeMenu);
        }
    };

    const handleSelectAssignee = (user: UserInfo) => {
        setAssigneeId(user.id);
        setShowAssigneeMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (assigneeMenuRef.current && !assigneeMenuRef.current.contains(event.target as Node) &&
                assigneeButtonRef.current && !assigneeButtonRef.current.contains(event.target as Node)) {
                setShowAssigneeMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getSelectedAssignee = () => {
        return projectMembers.find(u => u.id === assigneeId);
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
            <Droppable droppableId="backlog">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="border border-gray-200 rounded p-1 bg-white min-h-[50px]"
                    >

                        {/* Map qua danh sách tasks */}
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={() => setSelectedTaskId(task.id)}
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
                                    />
                                    <div className="flex items-center gap-2 text-gray-400 relative">
                                        <span className="hover:bg-gray-200 p-1 rounded cursor-pointer relative" title='Due date'>
                                            <input 
                                                type="date" 
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => setDueDate(e.target.value)}
                                            />
                                            <CiCalendarDate size={24} color={dueDate ? "blue" : "black"}/>
                                        </span>
                                        
                                        <span 
                                            ref={assigneeButtonRef}
                                            className="hover:bg-gray-200 p-1 rounded cursor-pointer" 
                                            title="Assignee"
                                            onClick={handleAssigneeClick}
                                        >
                                            {assigneeId ? (
                                                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                                                    {getSelectedAssignee()?.fullName.charAt(0)}
                                                </div>
                                            ) : (
                                                <HiUserCircle size={24} />
                                            )}
                                        </span>

                                        <span onClick={handleSubmitCreate}> 
                                            <Button icon={<MdSubdirectoryArrowLeft />}>Create</Button> 
                                        </span>
                                    </div>
                                </div>
                                <div className="text-[11px] text-gray-500 mt-1 ml-1 flex justify-between">
                                    <span>Press <span className="font-bold">Enter</span> to create, <span className="font-bold">Esc</span> to cancel</span>
                                    {dueDate && <span className="text-blue-600">Due: {dueDate}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>

            {/* Assignee Dropdown Portal */}
            {showAssigneeMenu && createPortal(
                <div
                    ref={assigneeMenuRef}
                    style={{
                        top: assigneeMenuPosition.top,
                        left: assigneeMenuPosition.left,
                        position: 'absolute',
                        zIndex: 9999
                    }}
                    className="bg-white shadow-xl rounded-md border border-gray-200 w-48 max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200"
                >
                    <div className="p-2 text-xs font-bold text-gray-500 border-b bg-gray-50 sticky top-0">Assign to...</div>
                    {projectMembers.map(user => (
                        <div
                            key={user.id}
                            className="flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                            onClick={() => handleSelectAssignee(user)}
                        >
                            <img
                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`}
                                alt={user.fullName}
                                className="w-6 h-6 rounded-full border border-gray-200"
                            />
                            <span className="truncate">{user.fullName}</span>
                        </div>
                    ))}
                </div>,
                document.body
            )}

            {/* --- TASK DETAIL MODAL --- */}
            {selectedTaskId && (
                <TaskDetailModal
                    taskId={selectedTaskId}
                    onClose={() => setSelectedTaskId(null)}
                    onTaskUpdate={() => {
                        if (onUpdateTask) {
                             window.location.reload(); 
                        }
                    }}
                />
            )}
        </div>
    );
};