import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../../../api";
import MenuHeader from "../../../Components/MenuHeader";

interface ProjectSettingsInputs {
    name: string;
    description: string;
    projectKey: string;
}

export default function ProjectSettings() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { 
        register, 
        handleSubmit, 
        setValue,
        formState: { errors } 
    } = useForm<ProjectSettingsInputs>();

    useEffect(() => {
        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    const fetchProjectData = async () => {
        setIsLoading(true);
        try {
            const response: any = await axiosClient.get(`/projects`);
            const project = response.content.find((p: any) => p.id === Number(projectId));
            
            if (project) {
                setValue("name", project.name);
                setValue("description", project.description);
                setValue("projectKey", project.projectKey);
            }
        } catch (error) {
            console.error("Failed to load project data", error);
            toast.error("Failed to load project settings");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ProjectSettingsInputs) => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            await axiosClient.put(`/projects/${projectId}`, data);
            toast.success("Project settings updated successfully!");
        } catch (error) {
            console.error("Failed to update project settings", error);
            toast.error("Failed to update project settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            return;
        }
        
        setIsDeleting(true);
        try {
            await axiosClient.delete(`/projects/${projectId}`);
            toast.success("Project deleted successfully");
            navigate("/projects");
        } catch (error) {
            console.error("Failed to delete project", error);
            toast.error("Failed to delete project");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-white">
            <MenuHeader />
            <div className="flex flex-1 overflow-hidden">
                {/* Settings Sidebar */}
                <div className="w-64 border-r border-gray-200 bg-gray-50 p-6 flex-shrink-0 hidden md:block">
                    <h3 className="font-bold text-xs uppercase text-gray-500 mb-4 tracking-wider">Project Settings</h3>
                    <nav className="space-y-1">
                        <div className="block px-3 py-2 rounded-md bg-blue-100 text-blue-700 text-sm font-medium cursor-pointer">
                            General
                        </div>
                        <div className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium cursor-not-allowed opacity-60">
                            Access
                        </div>
                        <div className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium cursor-not-allowed opacity-60">
                            Issue Types
                        </div>
                        <div className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium cursor-not-allowed opacity-60">
                            Notifications
                        </div>
                        <div className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm font-medium cursor-not-allowed opacity-60">
                            Automation
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
                            <p className="text-gray-500 mt-1">Manage your project details and configurations.</p>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                        {...register("name", { required: "Project name is required" })}
                                    />
                                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                                </div>

                                <div>
                                    <label htmlFor="projectKey" className="block text-sm font-medium text-gray-700 mb-1">
                                        Key
                                    </label>
                                    <input
                                        id="projectKey"
                                        type="text"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                        {...register("projectKey")}
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-1">The project key is unique and cannot be changed.</p>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                                        {...register("description")}
                                        placeholder="Describe your project..."
                                    />
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors font-medium"
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Once you delete a project, there is no going back. Please be certain.
                            </p>
                            <button
                                type="button"
                                onClick={handleDeleteProject}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-colors font-medium"
                            >
                                {isDeleting ? "Deleting..." : "Delete Project"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
