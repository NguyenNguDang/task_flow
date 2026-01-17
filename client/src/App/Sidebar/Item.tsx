import React, {useState} from 'react';
import {Kanban} from "./Icons";
import {useProject} from "../../context/ProjectContext.tsx";
import {useLocation} from "react-router-dom";
import ProjectRow from "./ProjectRow.tsx";
import {FaPlus} from "react-icons/fa";
import {Modal} from "../../Components/Modal.tsx";
import axiosClient from "../../api";

interface ProjectFormData {
    name: string;
    description: string;
    endDate: string;
}

const Item = () => {
    const [isOpen, setIsOpen] = useState(false); // Toggle menu Project to
    const { projects, isLoading, fetchProjects } = useProject();
    const location = useLocation();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
        name: "",
        description: "",
        endDate: ""
    });

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateProject = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();

        if (!formData.name) return alert("Vui lòng nhập tên dự án!");

        setIsCreating(true);
        try {
            await axiosClient.post("/projects", formData);

            alert("Tạo dự án thành công!");
            await fetchProjects();
            setFormData({ name: "", description: "", endDate: "" });
            setIsCreateModalOpen(false);

        } catch (error) {
            console.error(error);
            alert("Tạo thất bại. Vui lòng thử lại.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="w-full">
            {/* Custom Project Header Item */}
            <div className="px-2">
                <div 
                    className={`
                        flex items-center justify-between w-full py-2 px-2 cursor-pointer transition-colors duration-200 group hover:bg-[#ebecf0] text-[#42526e] rounded
                    `}
                    onClick={toggleMenu}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-6 flex justify-center">
                            <Kanban />
                        </div>
                        <span className="font-medium">Projects</span>
                    </div>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCreateModalOpen(true);
                        }}
                        className="p-1.5 rounded hover:bg-gray-300 text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        title="Create Project"
                    >
                        <FaPlus size={12} />
                    </button>
                </div>
            </div>

            {isOpen && (
                <ul className="py-1 transition-all duration-200">
                    {isLoading && <li className="text-gray-400 text-xs px-6 py-2">Loading...</li>}

                    {!isLoading && projects.length === 0 && (
                        <li className="text-gray-400 text-xs px-6 py-2">No projects found</li>
                    )}

                    {/* Render từng dòng Project */}
                    {projects.map((project) => (
                        <ProjectRow 
                            key={project.id} 
                            project={project} 
                            onProjectUpdate={fetchProjects}
                        />
                    ))}
                </ul>
            )}

            {/*Modal Create Project*/}
            {isCreateModalOpen && (
                <Modal
                    className={"max-w-[40%] mx-auto"}
                    coords={{ top: 50, left: 0, right: 0 }}
                    onClose={() => setIsCreateModalOpen(false)}
                >
                    <div className={`text-black`}>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">Create New Project</h2>
                        </div>
                        <form onSubmit={handleCreateProject} action="" className={`flex flex-col items-start justify-center gap-2`}>
                            <label htmlFor="project_name">Project Name</label>
                            <input value={formData.name} onChange={handleChange} placeholder="Enter project name..." type="text" name="name" id="project_name" className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}/>
                            <label htmlFor="description">Description</label>
                            <input value={formData.description} onChange={handleChange}  placeholder="Describe your project..." type="text" name="description" id="description" className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}/>
                            <label htmlFor="finish_date">Finish Date</label>
                            <input value={formData.endDate} onChange={handleChange}  type="date" name="endDate" id="finish_date" className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}/>
                            <div className="flex justify-end mt-6 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                    disabled={isCreating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {isCreating ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Item;