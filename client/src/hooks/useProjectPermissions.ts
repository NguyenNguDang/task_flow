import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api';
import { useAuth } from '../context/AuthContext';

export const useProjectPermissions = () => {
    const { projectId } = useParams();
    const { user } = useAuth();
    const [isProjectManager, setIsProjectManager] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPermission = async () => {
            if (!projectId || !user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch project details to check owner
                // Or fetch project members to check role
                // For simplicity, let's fetch project details and check ownerId
                const res: any = await axiosClient.get(`/projects`);
                const projects = res.content || [];
                const currentProject = projects.find((p: any) => String(p.id) === projectId);

                if (currentProject) {
                    // Check if current user is the owner
                    // Assuming project object has owner object or ownerId
                    // Based on previous responses, project has owner object
                    if (currentProject.owner && currentProject.owner.id === user.id) {
                        setIsProjectManager(true);
                    } else {
                        setIsProjectManager(false);
                    }
                }
            } catch (error) {
                console.error("Failed to check permissions", error);
            } finally {
                setLoading(false);
            }
        };

        checkPermission();
    }, [projectId, user]);

    return { isProjectManager, loading };
};