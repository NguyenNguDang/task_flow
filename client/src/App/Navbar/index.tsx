import { Link } from "react-router-dom";
import { Logo } from "./Icons/Logo";
import { Plus } from "./Icons/Plus";
import React, {useState} from "react";
import {Modal} from "../../Components/Modal.tsx";
import axiosClient from "../../api";
import {useProject} from "../../context/ProjectContext.tsx";

interface ProjectFormData {
    name: string;
    description: string;
    endDate: string;
}

const NavItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="w-full flex flex-row items-center flex-nowrap hover:bg-[#ffffff1a] hover:cursor-pointer py-1 relative">
        {/* Icon Container */}
        <div className="min-w-16 min-h-[42px] flex flex-col items-center justify-center">
            {icon}
        </div>
        <div className="text-nowrap text-[#deebff] uppercase font-CircularStdBold font-bold text-[12px] select-none opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200">
            {label}
        </div>
    </div>
);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProjectFormData>({
        name: "",
        description: "",
        endDate: ""
    });
    const { fetchProjects } = useProject();
    const openModalCreateProject = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(true);
    };

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

        setIsLoading(true);
        try {
            await axiosClient.post("/projects", formData);

            alert("Tạo dự án thành công!");
            await fetchProjects();
            setFormData({ name: "", description: "", endDate: "" });
            setIsOpen(false);

        } catch (error) {
            console.error(error);
            alert("Tạo thất bại. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group fixed top-0 left-0 w-16 bg-[#0747a6] h-full hover:w-[200px] transition-all duration-100 ease-in-out shadow-2xl text-[#c1d6f2] overflow-hidden z-50">

            <div className="w-full h-16 flex items-center justify-center mb-4">
                <Logo size={28} />
            </div>

            <div className="flex flex-col w-full">

                <Link to={{ search: "modal-issue-create=true" }}>
                    <NavItem icon={<Plus />} label="create issue" />
                </Link>

                <Link onClick={openModalCreateProject} to={""}>
                    <NavItem icon={<Plus />} label="create project" />
                </Link>

                <Link to="/projects">
                    <NavItem icon={<Plus />} label="All Projects" />
                </Link>

            </div>

            {/*Modal Create Project*/}
            {isOpen && (<Modal  className={"max-w-[40%] mx-auto"}
                                coords={{ top: 50, left: 0, right: 0 }}
                                onClose={() => setIsOpen(false)}>
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
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {isLoading ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>

            </Modal>)}
        </div>


    );
}