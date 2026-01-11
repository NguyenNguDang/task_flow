import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { AiFillCaretRight, AiFillCaretDown } from "react-icons/ai";
import { BsKanban } from "react-icons/bs";
import {Modal} from "../../Components/Modal.tsx";
import axiosClient from "../../api";
import {toast} from "react-toastify";


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
    const [formData, setFormData] = useState<BoardFormData>({
        projectId: project.id,
        title: "",
        description: "",
    });


    const openModal = () => {
        setIsOpen(true);
    }
    const closeModal = () => {
        setIsOpen(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateBoard = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();

        if(!formData.title) return alert("Vui lòng nhập tên bảng!");
        setIsLoading(true);
        console.log(formData);
        try {
            await axiosClient.post("/boards", formData);
            toast("Create Board successfully!");
        }catch (error) {
            toast("Create Board fail!: " + error);
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <li className="mb-1">
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex flex-row items-center p-2 text-black  hover:bg-gray-200 rounded cursor-pointer transition-colors text-sm select-none justify-between"
            >
                <div
                    className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        {isExpanded ? <AiFillCaretDown size={10} /> : <AiFillCaretRight size={10} />}
                        <span className="font-medium">{project.name}</span>
                    </div>

                    <div
                        className="hover:bg-gray-400 rounded px-1 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal();
                            console.log("Create board clicked");
                        }}
                    >
                        <span title="Create Board" className="text-lg font-bold">+</span>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <ul className="pl-6 mt-1 space-y-1 border-l ml-2 border-gray-300">
                    {boards.length === 0 && <li className="text-xs text-gray-400 pl-2">No boards</li>}

                    {boards.map((board: any) => (
                        <li key={board.id}>
                            <Link
                                to={`/project/${project.id}/board/${board.id}`}
                                className="flex items-center gap-2 p-1.5 text-xs text-gray-600 hover:text-white hover:bg-[#ffffff1a] rounded transition-colors"
                            >
                                <BsKanban size={12} />
                                {board.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && (<Modal onClose={closeModal}>
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Create New Board</h2>
                </div>
                <form onSubmit={handleCreateBoard} action="" className={`flex flex-col items-start justify-center gap-2`}>

                    <label htmlFor="">Title</label>
                    <input value={formData.title} onChange={handleChange} type="text" name="title" id="" className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}/>
                    <label htmlFor="">Description</label>
                    <input value={formData.description} onChange={handleChange}  type="text" name="description" id="" className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}/>
                    <div className="flex justify-end mt-6 gap-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>)}
        </li>
    );
};

export default ProjectRow;