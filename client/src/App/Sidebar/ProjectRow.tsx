import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaChevronDown, FaPlus, FaRegFolder, FaRegFolderOpen } from "react-icons/fa";
import { BsKanban } from "react-icons/bs";
import { Modal } from "../../Components/Modal.tsx";
import axiosClient from "../../api";
import { toast } from "react-toastify";

interface BoardFormData {
    projectId: number;
    title: string;
    description: string;
}

const ProjectRow = ({ project }: { project: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const boards = project.boards || [];
    const location = useLocation();
    const [formData, setFormData] = useState<BoardFormData>({
        projectId: project.id,
        title: "",
        description: "",
    });

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateBoard = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.title) return toast.error("Vui lòng nhập tên bảng!");
        
        setIsLoading(true);
        try {
            await axiosClient.post("/boards", formData);
            toast.success("Create Board successfully!");
            closeModal();
            // Ideally refresh project data here
        } catch (error) {
            toast.error("Create Board fail!");
        } finally {
            setIsLoading(false);
        }
    }

    const isActiveProject = location.pathname.includes(`/project/${project.id}`);

    return (
        <li className="mb-1 select-none">
            <div
                className={`
                    group flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200
                    ${isActiveProject ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
                `}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className={`text-[10px] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} text-gray-400`}>
                        <FaChevronRight />
                    </span>
                    
                    <div className={`text-lg ${isActiveProject ? 'text-blue-500' : 'text-gray-400'}`}>
                        {isExpanded ? <FaRegFolderOpen /> : <FaRegFolder />}
                    </div>

                    <Link 
                        to={`/project/${project.id}/dashboard`}
                        className="font-medium text-sm truncate hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {project.name}
                    </Link>
                </div>

                <button
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 text-gray-500 transition-all"
                    onClick={(e) => {
                        e.stopPropagation();
                        openModal();
                    }}
                    title="Create Board"
                >
                    <FaPlus size={10} />
                </button>
            </div>

            <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <ul className="ml-4 pl-3 border-l border-gray-200 my-1 space-y-0.5">
                    {boards.length === 0 && (
                        <li className="text-xs text-gray-400 py-1 pl-2 italic">No boards yet</li>
                    )}

                    {boards.map((board: any) => {
                        const isActiveBoard = location.pathname.includes(`/board/${board.id}`);
                        return (
                            <li key={board.id}>
                                <Link
                                    to={`/project/${project.id}/board/${board.id}`}
                                    className={`
                                        flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors
                                        ${isActiveBoard 
                                            ? 'bg-blue-100 text-blue-700 font-medium' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                                    `}
                                >
                                    <BsKanban size={12} className={isActiveBoard ? 'text-blue-600' : 'text-gray-400'} />
                                    <span className="truncate">{board.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {isOpen && (
                <Modal onClose={closeModal} className="max-w-md">
                    <div className="p-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Board</h2>
                        <form onSubmit={handleCreateBoard} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Board Title</label>
                                <input 
                                    value={formData.title} 
                                    onChange={handleChange} 
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
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    type="text" 
                                    name="description" 
                                    placeholder="Optional description"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
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
        </li>
    );
};

export default ProjectRow;