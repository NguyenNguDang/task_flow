import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { FaPlus, FaFolder, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { Modal } from '../../Components/Modal';
import axiosClient from '../../api';
import { toast } from 'react-toastify';
import { Sidebar } from '../Sidebar';

interface ProjectFormData {
    name: string;
    description: string;
    endDate: string;
}

const ProjectList = () => {
    const { projects, isLoading, fetchProjects } = useProject();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
        name: "",
        description: "",
        endDate: ""
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateProject = async (e?: React.FormEvent) => {
        if(e) e.preventDefault();

        if (!formData.name) return toast.error("Vui lòng nhập tên dự án!");

        setIsCreating(true);
        try {
            await axiosClient.post("/projects", formData);
            toast.success("Tạo dự án thành công!");
            await fetchProjects();
            setFormData({ name: "", description: "", endDate: "" });
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Tạo thất bại. Vui lòng thử lại.");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex w-full h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-grow bg-white p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
                            <p className="text-gray-500 mt-1">Manage and track all your projects in one place</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <FaPlus size={14} />
                            Create Project
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <FaFolder className="mx-auto text-gray-300 mb-4" size={48} />
                            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                            <p className="text-gray-500 mt-1 mb-6">Get started by creating your first project</p>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Create a new project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    to={`/project/${project.id}`}
                                    className="block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-5 group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                            <FaFolder size={20} />
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            project.projectStatus === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {project.projectStatus || 'Active'}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {project.name}
                                    </h3>
                                    
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">
                                        {project.description || "No description provided"}
                                    </p>
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1.5">
                                            <FaUser size={12} />
                                            <span>{project.ownerName || "Owner"}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaCalendarAlt size={12} />
                                            <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Project Modal */}
                {isCreateModalOpen && (
                    <Modal
                        className={"max-w-[500px] mx-auto"}
                        coords={{ top: 100, left: 0, right: 0 }}
                        onClose={() => setIsCreateModalOpen(false)}
                    >
                        <div className="p-1">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>
                                <p className="text-sm text-gray-500 mt-1">Start a new journey with your team</p>
                            </div>
                            
                            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="project_name" className="block text-sm font-medium text-gray-700 mb-1">Project Name <span className="text-red-500">*</span></label>
                                    <input 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Website Redesign" 
                                        type="text" 
                                        name="name" 
                                        id="project_name" 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea 
                                        value={formData.description} 
                                        onChange={handleChange as any}  
                                        placeholder="What is this project about?" 
                                        name="description" 
                                        id="description" 
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="finish_date" className="block text-sm font-medium text-gray-700 mb-1">Target End Date</label>
                                    <input 
                                        value={formData.endDate} 
                                        onChange={handleChange}  
                                        type="date" 
                                        name="endDate" 
                                        id="finish_date" 
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        disabled={isCreating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
                                    >
                                        {isCreating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                        {isCreating ? "Creating..." : "Create Project"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
};

export default ProjectList;