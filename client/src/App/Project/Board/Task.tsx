/* eslint-disable @typescript-eslint/no-explicit-any */
import { Draggable } from "@hello-pangea/dnd";
import { Tags, TaskCard, User } from "types";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../api";
import { taskService } from "../../../services/task.service";
import { createPortal } from "react-dom";

const getStyle = (style: any, snapshot: any) => {
    if (!snapshot.isDropAnimating) {
        return style;
    }
    return {
        ...style,
        transitionDuration: `0.001s`,
    };
};

// Helper to get initials from name
const getInitials = (name: string) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

// Helper to get consistent color from string
const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const UserAvatar = ({ name, avatarUrl, size = 24 }: { name: string, avatarUrl?: string | null, size?: number }) => {
    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                title={name}
                className="rounded-full border border-gray-200 object-cover"
                style={{ width: size, height: size }}
            />
        );
    }

    if (name && name !== "Unassigned" && name !== "Unknown") {
        const initials = getInitials(name);
        const backgroundColor = stringToColor(name);
        return (
            <div
                className="rounded-full flex items-center justify-center text-white font-bold border border-white shadow-sm"
                style={{ 
                    width: size, 
                    height: size, 
                    backgroundColor, 
                    fontSize: size * 0.4 
                }}
                title={name}
            >
                {initials}
            </div>
        );
    }

    return <FaUserCircle title="Unassigned" size={size} className="text-gray-400" />;
};

export default function Task({
                                 task,
                                 index,
                                 onTaskClick,
                                 onAssignUser,
                                 isDoneColumn
                             }: Readonly<{task: TaskCard; index: number; onTaskClick?: (task: TaskCard) => void; onAssignUser?: (taskId: string, user: User) => void; isDoneColumn?: boolean; }>) {
    const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
    const [projectUsers, setProjectUsers] = useState<User[]>([]);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const { projectId } = useParams();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setShowAssigneeMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleAssigneeClick = async (e: MouseEvent) => {
        e.stopPropagation();
        
        if (!showAssigneeMenu) {
            // Calculate position
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setMenuPosition({
                    top: rect.bottom + window.scrollY + 5,
                    left: rect.left + window.scrollX - 150 // Shift left to align better
                });
            }

            try {
                const res = await axiosClient.get(`/projects/${projectId}/members`) as User[];
                setProjectUsers(res);
            } catch (error) {
                console.error("Failed to fetch project members", error);
            }
        }
        setShowAssigneeMenu(!showAssigneeMenu);
    };

    const handleSelectUser = async (user: User) => {
        try {
            await taskService.assignUser(Number(task.id), user.id);
            if (onAssignUser) {
                onAssignUser(task.id, user);
            }
            setShowAssigneeMenu(false);
        } catch (error) {
            console.error("Failed to assign user", error);
        }
    };

    if (!task) return null;
    const tagColor = Tags?.[task.tag?.toUpperCase() as keyof typeof Tags] ?? "bg-blue-300";
    
    // Check if task is done based on status OR if it's in the DONE column
    const isDone = task.status === 'DONE' || isDoneColumn;

    // Determine what to show for assignee
    // Note: task.assignees is an array of { name: string, avatar?: string }
    const assignee = task.assignees && task.assignees.length > 0 ? task.assignees[0] : null;

    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    onClick={() => onTaskClick?.(task)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                    className={`
                        bg-white rounded-[3px] py-[10px] px-2 font-CircularStdBook text-[14px]
                        select-none cursor-grab w-full relative
                        hover:bg-gray-50
                        ${snapshot.isDragging ? "shadow-lg ring-2 ring-blue-400 opacity-90 z-50 rotate-1" : "shadow-sm border border-gray-200"}
                        ${isDone ? "opacity-60 bg-gray-50" : ""}
                    `}
                >
                    <span className={isDone ? "line-through text-gray-500" : ""}>
                        {task.title}
                    </span>

                    <div className="flex flex-row items-center justify-between mt-2 relative">
                        <div className="flex flex-row items-center">
                            <div
                                className={`w-fit px-2 rounded-sm h-fit text-[10px] flex items-center justify-center ${tagColor} ${isDone ? "opacity-50 grayscale" : ""}`}
                            >
                                {task.tag}
                            </div>
                        </div>
                        <div className="flex flex-row items-center relative">
                            <button ref={buttonRef} onClick={handleAssigneeClick} className={isDone ? "opacity-50 grayscale" : ""}>
                                <UserAvatar 
                                    name={assignee ? assignee.name : "Unassigned"}
                                    avatarUrl={assignee?.avatar} 
                                    size={24} 
                                />
                            </button>
                            
                            {showAssigneeMenu && createPortal(
                                <div 
                                    ref={menuRef} 
                                    style={{ 
                                        top: menuPosition.top, 
                                        left: menuPosition.left,
                                        position: 'absolute',
                                        zIndex: 9999 
                                    }}
                                    className="bg-white shadow-xl rounded-md border border-gray-200 w-48 max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200"
                                >
                                    <div className="p-2 text-xs font-bold text-gray-500 border-b bg-gray-50 sticky top-0">Assign to...</div>
                                    {projectUsers.map(user => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectUser(user);
                                            }}
                                        >
                                            <UserAvatar 
                                                name={user.fullName || user.email} 
                                                avatarUrl={user.avatarUrl} 
                                                size={24} 
                                            />
                                            <span className="truncate">{user.fullName || user.email || "Unknown User"}</span>
                                        </div>
                                    ))}
                                </div>,
                                document.body
                            )}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}