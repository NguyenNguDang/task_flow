/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Droppable } from "@hello-pangea/dnd";
import {Column as ColumnType, TaskCard, User} from "types";
import Task from "./Task";
import { memo, useState, useRef, useEffect } from "react";
import { DragIndicator } from "./DragIndicator";
import {CreateTaskButton} from "../../../Components/CreateTaskButton.tsx";
import { IoIosMore } from "react-icons/io";
import { createPortal } from "react-dom";
import { FaTrash, FaEdit, FaPalette } from "react-icons/fa";
import axiosClient from "../../../api";
import { toast } from "react-toastify";


export interface ColumnProps {
    tasks: TaskCard[];
    column: ColumnType;
    index: number;
    onTaskCreated: (columnId: string, title: string) => Promise<void>;
    onTaskClick: (task: TaskCard) => void;
    onAssignUser: (taskId: string, user: User) => void;
}

const Title = ({ title, isEditing, onRename, onBlur }: { title: string, isEditing: boolean, onRename: (newTitle: string) => void, onBlur: () => void }) => {
    const [value, setValue] = useState(title);

    useEffect(() => {
        setValue(title);
    }, [title]);

    if (isEditing) {
        return (
            <input
                autoFocus
                className="p-2 pl-4 font-bold text-[#5e6c84] uppercase text-xs w-full bg-white border border-blue-500 rounded outline-none"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={() => {
                    onRename(value);
                    onBlur();
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onRename(value);
                        onBlur();
                    }
                }}
            />
        );
    }

    return (
        <div className="p-3 pl-4 font-bold text-[#5e6c84] uppercase text-xs flex items-center gap-2 select-none truncate">
            <DragIndicator className="opacity-50" />
            {title}
        </div>
    );
};

const TaskList = ({ provided, children, isDraggingOver }: any) => {
    return (
        <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`
                px-2 pb-2 flex-grow overflow-y-auto min-h-[50px]
                flex flex-col gap-2
                transition-colors duration-200
                ${isDraggingOver ? "bg-slate-200/50" : ""}
            `}
            style={{ scrollbarWidth: "thin" }}
        >
            {children}
        </div>
    );
};

const InnerTaskList = memo(({ tasks, onTaskClick, onAssignUser, isDoneColumn }: { tasks: TaskCard[], onTaskClick: (task: TaskCard) => void, onAssignUser: (taskId: string, user: User) => void, isDoneColumn: boolean }) => {
    return tasks.map((task, index) => (
        <Task 
            key={task.id} 
            task={task} 
            onTaskClick={onTaskClick} 
            index={index} 
            onAssignUser={onAssignUser} 
            isDoneColumn={isDoneColumn}
        />
    ));
});

const PASTEL_COLORS = [
    '#dfe1e6', // Default Gray
    '#deebff', // Blue
    '#e3fcef', // Green
    '#fffae6', // Yellow
    '#ffebe6', // Red
    '#eae6ff', // Purple
    '#e6fcff', // Cyan
    '#ffedd5', // Orange
];

export default function Column(props: Readonly<ColumnProps>) {
    const { tasks, column, onTaskCreated, onTaskClick, onAssignUser } = props;
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Check if this is the DONE column
    const isDoneColumn = column.title.toUpperCase() === 'DONE';
    
    // Use column color from backend or default
    const backgroundColor = column.color || '#f4f5f7';

    // Handle click outside for menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
                setShowMenu(false);
                setShowColorPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuClick = () => {
        if (menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX - 100 // Adjust left to align better
            });
            setShowMenu(!showMenu);
            setShowColorPicker(false);
        }
    };

    const handleRename = async (newTitle: string) => {
        if (newTitle === column.title || !newTitle.trim()) return;

        try {
            await axiosClient.put(`/board-column/${column.id}`, { title: newTitle });
            toast.success("Column renamed");
            window.location.reload();
        } catch (error) {
            console.error("Failed to rename column", error);
            toast.error("Failed to rename column");
        }
    };

    const handleColorChange = async (color: string) => {
        try {
            await axiosClient.put(`/board-column/${column.id}`, { color: color });
            toast.success("Column color updated");
            window.location.reload();
        } catch (error) {
            console.error("Failed to update color", error);
            toast.error("Failed to update color");
        }
    };

    const handleDeleteColumn = async () => {
        if (!window.confirm(`Are you sure you want to delete column "${column.title}"? All tasks in this column will be deleted.`)) return;

        try {
            await axiosClient.delete(`/board-column/${column.id}`);
            toast.success("Column deleted successfully");
            window.location.reload(); 
        } catch (error) {
            console.error("Failed to delete column", error);
            toast.error("Failed to delete column");
        }
    };

    return (
        <div 
            className="w-[285px] min-w-[285px] ml-3 flex flex-col rounded-lg shadow-sm max-h-[calc(100vh-140px)] transition-colors duration-300"
            style={{ backgroundColor: backgroundColor }}
        >
            <div className={"flex justify-between items-center"}>
                <Title 
                    title={column.title} 
                    isEditing={isEditingTitle}
                    onRename={handleRename}
                    onBlur={() => setIsEditingTitle(false)}
                />
                <button 
                    ref={menuButtonRef}
                    className={"pr-2 p-1 hover:bg-black/10 rounded m-1 transition-colors"}
                    onClick={handleMenuClick}
                >
                    <IoIosMore size={20}/>
                </button>
            </div>


            <Droppable ignoreContainerClipping={true} type="task" droppableId={column.id}>
                {(provided, snapshot) => (
                    <TaskList
                        provided={provided}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        <InnerTaskList 
                            tasks={tasks} 
                            onTaskClick={onTaskClick} 
                            onAssignUser={onAssignUser}
                            isDoneColumn={isDoneColumn}
                        />
                        {provided.placeholder}
                    </TaskList>
                )}
            </Droppable>
            <CreateTaskButton
                columnId={column.id}
                onTaskCreated={onTaskCreated}
            />

            {/* Column Menu Portal */}
            {showMenu && createPortal(
                <div 
                    ref={menuRef}
                    style={{ 
                        top: menuPosition.top, 
                        left: menuPosition.left,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-xl rounded-md border border-gray-200 w-48 py-1 animate-in fade-in zoom-in duration-200"
                >
                    {!showColorPicker ? (
                        <>
                            <button 
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => {
                                    setShowMenu(false);
                                    setIsEditingTitle(true);
                                }}
                            >
                                <FaEdit size={12} /> Rename Column
                            </button>
                            <button 
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowColorPicker(true);
                                }}
                            >
                                <FaPalette size={12} /> Change Color
                            </button>
                            <div className="border-t my-1"></div>
                            <button 
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                onClick={() => {
                                    setShowMenu(false);
                                    handleDeleteColumn();
                                }}
                            >
                                <FaTrash size={12} /> Delete Column
                            </button>
                        </>
                    ) : (
                        <div className="p-2">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Select Color</span>
                                <button 
                                    className="text-xs text-blue-600 hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowColorPicker(false);
                                    }}
                                >
                                    Back
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {PASTEL_COLORS.map(color => (
                                    <div 
                                        key={color}
                                        className={`w-8 h-8 rounded cursor-pointer border border-gray-200 hover:scale-110 transition-transform ${backgroundColor === color ? 'ring-2 ring-blue-500' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleColorChange(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}
