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
import { FaTrash } from "react-icons/fa";
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

const Title = ({ title }: { title: string }) => {
    return (
        <div className="p-3 pl-4 font-bold text-[#5e6c84] uppercase text-xs flex items-center gap-2 select-none">
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
                ${isDraggingOver ? "bg-slate-200" : ""}
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


export default function Column(props: Readonly<ColumnProps>) {
    const { tasks, column, onTaskCreated, onTaskClick, onAssignUser } = props;
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    
    // Check if this is the DONE column
    const isDoneColumn = column.title.toUpperCase() === 'DONE';

    // Handle click outside for menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
                setShowMenu(false);
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
        }
    };

    const handleDeleteColumn = async () => {
        if (!window.confirm(`Are you sure you want to delete column "${column.title}"? All tasks in this column will be deleted.`)) return;

        try {
            await axiosClient.delete(`/board-column/${column.id}`);
            toast.success("Column deleted successfully");
            // Reload page or trigger parent update (ideally parent update, but reload is simpler for now)
            window.location.reload(); 
        } catch (error) {
            console.error("Failed to delete column", error);
            toast.error("Failed to delete column");
        }
    };

    return (
        <div className="w-[285px] min-w-[285px] ml-3 flex flex-col bg-[#f4f5f7] rounded-lg shadow-sm max-h-[calc(100vh-140px)]">
            <div className={"flex justify-between items-center"}>
                <Title title={column.title} />
                <button 
                    ref={menuButtonRef}
                    className={"pr-2 p-1 hover:bg-gray-200 rounded m-1"}
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
                    className="bg-white shadow-xl rounded-md border border-gray-200 w-40 py-1 animate-in fade-in zoom-in duration-200"
                >
                    <button 
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                            setShowMenu(false);
                            handleDeleteColumn();
                        }}
                    >
                        <FaTrash size={12} /> Delete Column
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
}