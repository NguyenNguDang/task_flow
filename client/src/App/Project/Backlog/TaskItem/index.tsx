import React, { useState, useRef, useEffect } from "react";
import { Task } from "../../../../types";
import { IoIosMore } from "react-icons/io";
import { createPortal } from "react-dom";
import { taskService } from "../../../../services/task.service";
import { toast } from "react-toastify";
import { FaChevronDown, FaPencilAlt } from "react-icons/fa";
import axiosClient from "../../../../api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

interface TaskItemProps {
    task: Task;
    renderPriority: (priority: string) => React.ReactNode;
    onUpdateTask?: (taskId: number, updates: Partial<Task>) => void;
    onDeleteTask?: (taskId: number) => void;
}

interface UserInfo {
    id: number;
    fullName: string;
    avatarUrl: string | null;
}

export const TaskItem = ({ task, renderPriority, onUpdateTask, onDeleteTask }: TaskItemProps) => {
    const { projectId } = useParams();
    const { user: currentUser } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Status Menu
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const [statusMenuPosition, setStatusMenuPosition] = useState({ top: 0, left: 0 });
    const statusButtonRef = useRef<HTMLDivElement>(null);
    const statusMenuRef = useRef<HTMLDivElement>(null);

    // Priority Menu
    const [showPriorityMenu, setShowPriorityMenu] = useState(false);
    const [priorityMenuPosition, setPriorityMenuPosition] = useState({ top: 0, left: 0 });
    const priorityButtonRef = useRef<HTMLDivElement>(null);
    const priorityMenuRef = useRef<HTMLDivElement>(null);

    // Assignee Menu
    const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
    const [assigneeMenuPosition, setAssigneeMenuPosition] = useState({ top: 0, left: 0 });
    const assigneeButtonRef = useRef<HTMLDivElement>(null);
    const assigneeMenuRef = useRef<HTMLDivElement>(null);
    const [projectMembers, setProjectMembers] = useState<UserInfo[]>([]);

    // Story Point Edit
    const [isEditingStoryPoint, setIsEditingStoryPoint] = useState(false);
    const [storyPoint, setStoryPoint] = useState(task.estimateHours ?? task.storyPoint ?? 0);
    const storyPointInputRef = useRef<HTMLInputElement>(null);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(task.title);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTitle(task.title);
    }, [task.title]);

    useEffect(() => {
        if (isEditingTitle && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [isEditingTitle]);

    useEffect(() => {
        if (isEditingStoryPoint && storyPointInputRef.current) {
            storyPointInputRef.current.focus();
        }
    }, [isEditingStoryPoint]);

    // Fetch project members when assignee menu opens
    useEffect(() => {
        if (showAssigneeMenu && projectMembers.length === 0) {
            const fetchMembers = async () => {
                try {
                    const res = await axiosClient.get(`/projects/${projectId}/members`) as UserInfo[];
                    // Also fetch project owner to include in the list if not already there
                    const projectRes = await axiosClient.get(`/projects/${projectId}`);
                    const owner = (projectRes as any).owner;
                    
                    let allMembers = [...res];
                    if (owner && !allMembers.some(m => m.id === owner.id)) {
                        allMembers.push({
                            id: owner.id,
                            fullName: owner.name, // Assuming owner object has name
                            avatarUrl: owner.avatarUrl
                        });
                    }
                    setProjectMembers(allMembers);
                } catch (e) {
                    console.error("Failed to fetch members", e);
                }
            };
            fetchMembers();
        }
    }, [showAssigneeMenu, projectId]);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 100
            });
            setShowMenu(!showMenu);
            closeOtherMenus('menu');
        }
    };

    const handleStatusClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (statusButtonRef.current) {
            const rect = statusButtonRef.current.getBoundingClientRect();
            setStatusMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX
            });
            setShowStatusMenu(!showStatusMenu);
            closeOtherMenus('status');
        }
    };

    const handlePriorityClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (priorityButtonRef.current) {
            const rect = priorityButtonRef.current.getBoundingClientRect();
            setPriorityMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 50
            });
            setShowPriorityMenu(!showPriorityMenu);
            closeOtherMenus('priority');
        }
    };

    const handleAssigneeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (assigneeButtonRef.current) {
            const rect = assigneeButtonRef.current.getBoundingClientRect();
            setAssigneeMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 100
            });
            setShowAssigneeMenu(!showAssigneeMenu);
            closeOtherMenus('assignee');
        }
    };

    const closeOtherMenus = (current: string) => {
        if (current !== 'menu') setShowMenu(false);
        if (current !== 'status') setShowStatusMenu(false);
        if (current !== 'priority') setShowPriorityMenu(false);
        if (current !== 'assignee') setShowAssigneeMenu(false);
    };

    const handleStatusChange = async (newStatus: 'todo' | 'doing' | 'done') => {
        setShowStatusMenu(false);
        if (task.status === newStatus) return;

        if (onUpdateTask) {
            onUpdateTask(task.id, { status: newStatus.toUpperCase() });
        } else {
            try {
                await taskService.update(String(task.id), { status: newStatus.toUpperCase() });
                toast.success("Status updated");
                window.location.reload();
            } catch (error) {
                console.error("Failed to update status", error);
                toast.error("Failed to update status");
            }
        }
    };

    const handlePriorityChange = async (newPriority: string) => {
        setShowPriorityMenu(false);
        if (task.priority === newPriority) return;

        if (onUpdateTask) {
            onUpdateTask(task.id, { priority: newPriority });
        } else {
            try {
                await taskService.update(String(task.id), { priority: newPriority });
                toast.success("Priority updated");
                window.location.reload();
            } catch (error) {
                console.error("Failed to update priority", error);
                toast.error("Failed to update priority");
            }
        }
    };

    const handleAssigneeChange = async (user: UserInfo) => {
        setShowAssigneeMenu(false);
        // Optimistic update locally if needed, but usually we rely on parent update
        if (onUpdateTask) {
            onUpdateTask(task.id, { assignee: user });
        }
        
        try {
            await taskService.assignUser(task.id, user.id);
            toast.success("Assignee updated");
            if (!onUpdateTask) window.location.reload();
        } catch (error) {
            console.error("Failed to update assignee", error);
            toast.error("Failed to update assignee");
        }
    };

    const handleStoryPointSubmit = async () => {
        setIsEditingStoryPoint(false);
        if (storyPoint === (task.estimateHours ?? task.storyPoint)) return;

        if (onUpdateTask) {
            onUpdateTask(task.id, { estimateHours: storyPoint });
        }
        
        try {
            await taskService.updateStoryPoints(task.id, storyPoint);
            toast.success("Story points updated");
            if (!onUpdateTask) window.location.reload();
        } catch (error) {
            console.error("Failed to update story points", error);
            toast.error("Failed to update story points");
            setStoryPoint(task.estimateHours ?? task.storyPoint ?? 0);
        }
    };

    const handleTitleSubmit = async () => {
        setIsEditingTitle(false);
        if (title === task.title) return;
        
        if (onUpdateTask) {
            onUpdateTask(task.id, { title });
        } else {
             try {
                await taskService.update(String(task.id), { title });
                toast.success("Title updated");
            } catch (error) {
                console.error("Failed to update title", error);
                toast.error("Failed to update title");
                setTitle(task.title);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: 'title' | 'storyPoint') => {
        if (e.key === 'Enter') {
            if (type === 'title') handleTitleSubmit();
            else handleStoryPointSubmit();
        } else if (e.key === 'Escape') {
            if (type === 'title') {
                setIsEditingTitle(false);
                setTitle(task.title);
            } else {
                setIsEditingStoryPoint(false);
                setStoryPoint(task.estimateHours ?? task.storyPoint ?? 0);
            }
        }
    };

    const handleDelete = async () => {
        if (onDeleteTask) {
            onDeleteTask(task.id);
        } else {
            if (!window.confirm("Are you sure you want to delete this task?")) return;
            try {
                await taskService.delete(task.id);
                toast.success("Task deleted");
                window.location.reload();
            } catch (error) {
                console.error("Failed to delete task", error);
                toast.error("Failed to delete task");
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (menuRef.current && !menuRef.current.contains(target) &&
                menuButtonRef.current && !menuButtonRef.current.contains(target)) {
                setShowMenu(false);
            }
            if (statusMenuRef.current && !statusMenuRef.current.contains(target) &&
                statusButtonRef.current && !statusButtonRef.current.contains(target)) {
                setShowStatusMenu(false);
            }
            if (priorityMenuRef.current && !priorityMenuRef.current.contains(target) &&
                priorityButtonRef.current && !priorityButtonRef.current.contains(target)) {
                setShowPriorityMenu(false);
            }
            if (assigneeMenuRef.current && !assigneeMenuRef.current.contains(target) &&
                assigneeButtonRef.current && !assigneeButtonRef.current.contains(target)) {
                setShowAssigneeMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getAvatar = () => {
        if (task.assignee?.avatarUrl) {
            return <img src={task.assignee.avatarUrl} alt={task.assignee.fullName} className="w-6 h-6 rounded-full border border-white shadow-sm" />;
        }
        if (task.assignee?.fullName) {
            return (
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold uppercase border border-white shadow-sm">
                    {task.assignee.fullName.charAt(0)}
                </div>
            );
        }
        if (task.assigneeName) {
             return (
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold uppercase border border-white shadow-sm">
                    {task.assigneeName.charAt(0)}
                </div>
            );
        }
        return <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs border border-white shadow-sm">?</div>;
    };

    const getStatusBadgeStyles = (status: string) => {
        switch(status?.toUpperCase()) {
            case 'DONE': return 'bg-green-100 text-green-700 hover:bg-green-200';
            case 'DOING': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
            default: return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
        }
    };
    
    const getStatusLabel = (status: string) => {
         switch(status?.toUpperCase()) {
            case 'DONE': return 'DONE';
            case 'DOING': return 'DOING';
            default: return 'TO DO';
        }
    }

    return (
        <div className="group flex items-center justify-between p-2 mb-1 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-sm shadow-sm transition-all">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                {/* Issue Type Icon */}
                <div className="flex-shrink-0 text-blue-500" title="Task">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <path d="M9 12l2 2 4-4"></path>
                    </svg>
                </div>

                {/* Task Key */}
                <span className="text-xs font-medium text-gray-500 min-w-fit font-mono">
                    {task.taskKey ? task.taskKey : `#${task.id}`}
                </span>

                {/* Title Display / Edit */}
                {isEditingTitle ? (
                    <input
                        ref={titleInputRef}
                        className="text-sm text-[#172b4d] font-medium bg-white border border-blue-500 rounded px-2 py-1 flex-1 truncate outline-none shadow-sm"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleSubmit}
                        onKeyDown={(e) => handleKeyDown(e, 'title')}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div className="flex items-center gap-2 flex-1 min-w-0 group/title">
                        <span className={`text-sm text-[#172b4d] font-medium truncate ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingTitle(true);
                            }}
                            className="opacity-0 group-hover/title:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity p-1"
                            title="Edit title"
                        >
                            <FaPencilAlt size={12} />
                        </button>
                    </div>
                )}
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-3 pl-4 flex-shrink-0">
                
                {/* Status Badge */}
                <div 
                    ref={statusButtonRef}
                    onClick={handleStatusClick}
                    className={`cursor-pointer px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${getStatusBadgeStyles(task.status)}`}
                >
                    {getStatusLabel(task.status)}
                    <FaChevronDown size={8} />
                </div>

                {/* Story Points */}
                {isEditingStoryPoint ? (
                    <input
                        ref={storyPointInputRef}
                        type="number"
                        className="w-10 h-6 text-center text-xs border border-blue-500 rounded outline-none"
                        value={storyPoint}
                        onChange={(e) => setStoryPoint(Number(e.target.value))}
                        onBlur={handleStoryPointSubmit}
                        onKeyDown={(e) => handleKeyDown(e, 'storyPoint')}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <div 
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold cursor-pointer hover:bg-gray-200" 
                        title="Story Points (Click to edit)"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingStoryPoint(true);
                        }}
                    >
                        {task.estimateHours ?? task.storyPoint ?? '-'}
                    </div>
                )}

                {/* Priority */}
                <div 
                    ref={priorityButtonRef}
                    className="w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded" 
                    title={`Priority: ${task.priority} (Click to change)`}
                    onClick={handlePriorityClick}
                >
                    {renderPriority(task.priority)}
                </div>

                {/* Assignee */}
                <div 
                    ref={assigneeButtonRef}
                    className="flex items-center justify-center cursor-pointer hover:opacity-80" 
                    title={`Assignee: ${task.assignee?.fullName || task.assigneeName || "Unassigned"} (Click to change)`}
                    onClick={handleAssigneeClick}
                >
                    {getAvatar()}
                </div>

                {/* More Menu */}
                <div 
                    ref={menuButtonRef}
                    onClick={handleMenuClick}
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-500 cursor-pointer transition-colors opacity-0 group-hover:opacity-100"
                >
                    <IoIosMore size={20} />
                </div>
            </div>

            {/* Status Dropdown */}
            {showStatusMenu && createPortal(
                <div 
                    ref={statusMenuRef}
                    style={{ 
                        top: statusMenuPosition.top, 
                        left: statusMenuPosition.left - 80,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-lg rounded border border-gray-200 w-36 py-1 animate-in fade-in zoom-in duration-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase border-b mb-1 bg-gray-50">Transition to</div>
                    <button 
                        className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleStatusChange('todo')}
                    >
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span> TO DO
                    </button>
                    <button 
                        className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleStatusChange('doing')}
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> DOING
                    </button>
                    <button 
                        className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleStatusChange('done')}
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> DONE
                    </button>
                </div>,
                document.body
            )}

            {/* Priority Dropdown */}
            {showPriorityMenu && createPortal(
                <div 
                    ref={priorityMenuRef}
                    style={{ 
                        top: priorityMenuPosition.top, 
                        left: priorityMenuPosition.left,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-lg rounded border border-gray-200 w-32 py-1 animate-in fade-in zoom-in duration-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase border-b mb-1 bg-gray-50">Set Priority</div>
                    <button 
                        className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handlePriorityChange('HIGH')}
                    >
                        {renderPriority('HIGH')} High
                    </button>
                    <button 
                        className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handlePriorityChange('MEDIUM')}
                    >
                        {renderPriority('MEDIUM')} Medium
                    </button>
                    <button 
                        className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handlePriorityChange('LOW')}
                    >
                        {renderPriority('LOW')} Low
                    </button>
                </div>,
                document.body
            )}

            {/* Assignee Dropdown */}
            {showAssigneeMenu && createPortal(
                <div 
                    ref={assigneeMenuRef}
                    style={{ 
                        top: assigneeMenuPosition.top, 
                        left: assigneeMenuPosition.left,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-lg rounded border border-gray-200 w-48 max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase border-b mb-1 bg-gray-50 sticky top-0">Assign to</div>
                    {/* Assign to Me option */}
                    {currentUser && (
                        <div
                            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer text-xs transition-colors border-b border-gray-100"
                            onClick={() => handleAssigneeChange({
                                id: currentUser.id,
                                fullName: currentUser.fullName || currentUser.name || "Me",
                                avatarUrl: currentUser.avatarUrl
                            })}
                        >
                            <img 
                                src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName || currentUser.name || "Me")}&background=random`} 
                                alt="Me" 
                                className="w-5 h-5 rounded-full border border-gray-200" 
                            />
                            <span className="truncate font-medium">Assign to me</span>
                        </div>
                    )}

                    {projectMembers.map(user => (
                        <div
                            key={user.id}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                            onClick={() => handleAssigneeChange(user)}
                        >
                            <img 
                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`} 
                                alt={user.fullName} 
                                className="w-5 h-5 rounded-full border border-gray-200" 
                            />
                            <span className="truncate">{user.fullName}</span>
                        </div>
                    ))}
                </div>,
                document.body
            )}

            {/* Actions Menu */}
            {showMenu && createPortal(
                <div 
                    ref={menuRef}
                    style={{ 
                        top: menuPosition.top, 
                        left: menuPosition.left,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-lg rounded border border-gray-200 w-40 py-1 animate-in fade-in zoom-in duration-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/project/${task.id}`);
                            toast.success("Link copied");
                            setShowMenu(false);
                        }}
                    >
                        Copy Link
                    </button>
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                            setShowMenu(false);
                            handleDelete();
                        }}
                    >
                        Delete
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};
