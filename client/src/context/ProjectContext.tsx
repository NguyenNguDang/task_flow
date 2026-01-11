import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosClient from "../api";

interface Project {
    id: number;
    name: string;
    description: string;
    projectKey: string;
}

interface ProjectContextType {
    projects: Project[];
    isLoading: boolean;
    fetchProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);


    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const data = await axiosClient.get('/projects') as any;
            console.log("Projects", data);
            setProjects(data.content || []);
        } catch (error) {
            console.error("Lỗi tải project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <ProjectContext.Provider value={{ projects, isLoading, fetchProjects }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    const context = useContext(ProjectContext);
    if (!context) throw new Error("useProject must be used within ProjectProvider");
    return context;
};