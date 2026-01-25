import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaPlus, FaRegFolder, FaRegFolderOpen, FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";
import { BsKanban } from "react-icons/bs";
import { Modal } from "../../Components/Modal.tsx";
import axiosClient from "../../api";
import { toast } from "react-toastify";
import { createPortal } from 'react-dom';

interface BoardFormData {
    projectId: number;
    title: string;
    description: string;
    color?: string;
}

interface ProjectFormData {
    name: string;
    description: string;
}

const ProjectRow = ({ project, onProjectUpdate }: { project: any, onProjectUpdate?: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
    const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
    const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Menu state for Project
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Menu state for Board
    const [showBoardMenu, setShowBoardMenu] = useState(false);
    const [boardMenuPosition, setBoardMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
    const boardMenuRef = useRef<HTMLDivElement>(null);

    const boards = project.boards || [];
    const location = useLocation();
    
    const [boardFormData, setBoardFormData] = useState<BoardFormData>({
        projectId: project.id,
        title: "",
        description: "",
    });

    const [editBoardFormData, setEditBoardFormData] = useState<BoardFormData>({
        projectId: project.id,
        title: "",
        description: "",
    });

    const [projectFormData, setProjectFormData] = useState<ProjectFormData>({
        name: project.name,
        description: project.description || "",
    });

    // Handle click outside for menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
                menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
            
            if (boardMenuRef.current && !boardMenuRef.current.contains(event.target as Node)) {
                setShowBoardMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (menuButtonRef.current) {
            const rect = menuButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX
            });
            setShowMenu(!showMenu);
        }
    };

    const handleBoardMenuClick = (e: React.MouseEvent, board: any) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setBoardMenuPosition({
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX
        });
        setSelectedBoardId(board.id);
        setEditBoardFormData({
            projectId: project.id,
            title: board.title,
            description: board.description || "",
        });
        setShowBoardMenu(true);
    };

    const handleBoardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBoardFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditBoardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditBoardFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProjectFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateBoard = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!boardFormData.title) return toast.error("Vui lòng nhập tên bảng!");
        
        setIsLoading(true);
        try {
            await axiosClient.post("/boards", boardFormData);
            toast.success("Create Board successfully!");
            setIsCreateBoardOpen(false);
            onProjectUpdate?.();
        } catch (error) {
            toast.error("Create Board fail!");
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpdateBoard = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!editBoardFormData.title) return toast.error("Board title is required!");

        setIsLoading(true);
        try {
            await axiosClient.put(`/boards/${selectedBoardId}`, editBoardFormData);
            toast.success("Board updated successfully!");
            setIsEditBoardOpen(false);
            onProjectUpdate?.();
        } catch (error) {
            toast.error("Failed to update board!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProject = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!projectFormData.name) return toast.error("Project name is required!");

        setIsLoading(true);
        try {
            await axiosClient.put(`/projects/${project.id}`, projectFormData);
            toast.success("Project updated successfully!");
            setIsEditProjectOpen(false);
            onProjectUpdate?.();
        } catch (error) {
            toast.error("Failed to update project!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm(`Are you sure you want to delete project "${project.name}"?`)) return;

        try {
            await axiosClient.delete(`/projects/${project.id}`);
            toast.success("Project deleted successfully!");
            onProjectUpdate?.();
        } catch (error) {
            toast.error("Failed to delete project!");
        }
    };

    const handleDeleteBoard = async () => {
        if (!selectedBoardId) return;
        if (!window.confirm("Are you sure you want to delete this board?")) return;

        try {
            await axiosClient.delete(`/boards/${selectedBoardId}`);
            toast.success("Board deleted successfully!");
            setShowBoardMenu(false);
            onProjectUpdate?.();
        } catch (error) {
            toast.error("Failed to delete board!");
        }
    };

    const isActiveProject = location.pathname.includes(`/project/${project.id}`);

    return (
        <li className="mb-0.5 select-none">
            <div
                className={`
                    group flex items-center justify-between py-2 px-4 cursor-pointer transition-all duration-200
                    ${isActiveProject ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                `}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2.5 overflow-hidden flex-grow pl-2">
                    <span className={`text-[10px] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} text-gray-400`}>
                        <FaChevronRight />
                    </span>
                    
                    <div className={`text-lg ${isActiveProject ? 'text-blue-500' : 'text-gray-400'}`}>
                        {isExpanded ? <FaRegFolderOpen /> : <FaRegFolder />}
                    </div>

                    <span 
                        className="font-medium text-sm truncate"
                    >
                        {project.name}
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCreateBoardOpen(true);
                        }}
                        title="Create Board"
                    >
                        <FaPlus size={10} />
                    </button>
                    
                    <button
                        ref={menuButtonRef}
                        className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-all"
                        onClick={handleMenuClick}
                        title="More options"
                    >
                        <FaEllipsisH size={10} />
                    </button>
                </div>
            </div>

            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <ul className="my-1 space-y-0.5">
                    {boards.length === 0 && (
                        <li className="text-xs text-gray-400 py-1 pl-10 italic">No boards yet</li>
                    )}

                    {boards.map((board: any) => {
                        const isActiveBoard = location.pathname.includes(`/board/${board.id}`);
                        return (
                            <li key={board.id} className="group/board relative">
                                <Link
                                    to={`/project/${project.id}/board/${board.id}`}
                                    className={`
                                        flex items-center justify-between py-1.5 pl-10 pr-4 text-xs transition-colors
                                        ${isActiveBoard 
                                            ? 'bg-blue-100 text-blue-700 font-medium' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                                    `}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <BsKanban size={12} className={isActiveBoard ? 'text-blue-600' : 'text-gray-400'} />
                                        <span className="truncate">{board.title}</span>
                                    </div>
                                    
                                    <div 
                                        className="opacity-0 group-hover/board:opacity-100 p-1 hover:bg-gray-200 rounded cursor-pointer"
                                        onClick={(e) => handleBoardMenuClick(e, board)}
                                    >
                                        <FaEllipsisH size={10} />
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Project Context Menu Portal */}
            {showMenu && createPortal(
                <div 
                    ref={menuRef}
                    style={{ 
                        top: menuPosition.top, 
                        left: menuPosition.left,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-xl rounded-md border border-gray-200 w-32 py-1 animate-in fade-in zoom-in duration-200"
                >
                    <button 
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => {
                            setShowMenu(false);
                            setIsEditProjectOpen(true);
                        }}
                    >
                        <FaEdit size={12} /> Edit
                    </button>
                    <button 
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                            setShowMenu(false);
                            handleDeleteProject();
                        }}
                    >
                        <FaTrash size={12} /> Delete
                    </button>
                </div>,
                document.body
            )}

            {/* Board Context Menu Portal */}
            {showBoardMenu && createPortal(
                <div 
                    ref={boardMenuRef}
                    style={{ 
                        top: boardMenuPosition.top, 
                        left: boardMenuPosition.left,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-xl rounded-md border border-gray-200 w-32 py-1 animate-in fade-in zoom-in duration-200"
                >
                    <button 
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => {
                            setShowBoardMenu(false);
                            setIsEditBoardOpen(true);
                        }}
                    >
                        <FaEdit size={12} /> Edit Board
                    </button>
                    <button 
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                            handleDeleteBoard();
                        }}
                    >
                        <FaTrash size={12} /> Delete Board
                    </button>
                </div>,
                document.body
            )}

            {/* Create Board Modal */}
            {isCreateBoardOpen && (
                <Modal onClose={() => setIsCreateBoardOpen(false)} className="max-w-md">
                    <div className="p-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Board</h2>
                        <form onSubmit={handleCreateBoard} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Board Title</label>
                                <input 
                                    value={boardFormData.title} 
                                    onChange={handleBoardChange} 
                                    type="text" 
                                    name="title" 
                                    placeholder="e.g. Sprint 1, Kanban Board"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input 
                                    value={boardFormData.description} 
                                    onChange={handleBoardChange} 
                                    type="text" 
                                    name="description" 
                                    placeholder="Optional description"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateBoardOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Creating..." : "Create Board"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}

            {/* Edit Board Modal */}
            {isEditBoardOpen && (
                <Modal onClose={() => setIsEditBoardOpen(false)} className="max-w-md">
                    <div className="p-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Board</h2>
                        <form onSubmit={handleUpdateBoard} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Board Title</label>
                                <input 
                                    value={editBoardFormData.title} 
                                    onChange={handleEditBoardChange} 
                                    type="text" 
                                    name="title" 
                                    placeholder="e.g. Sprint 1, Kanban Board"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input 
                                    value={editBoardFormData.description} 
                                    onChange={handleEditBoardChange} 
                                    type="text" 
                                    name="description" 
                                    placeholder="Optional description"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditBoardOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}

            {/* Edit Project Modal */}
            {isEditProjectOpen && (
                <Modal onClose={() => setIsEditProjectOpen(false)} className="max-w-md">
                    <div className="p-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Project</h2>
                        <form onSubmit={handleUpdateProject} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input 
                                    value={projectFormData.name} 
                                    onChange={handleProjectChange} 
                                    type="text" 
                                    name="name" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input 
                                    value={projectFormData.description} 
                                    onChange={handleProjectChange} 
                                    type="text" 
                                    name="description" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditProjectOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </li>
    );
};

export default ProjectRow;