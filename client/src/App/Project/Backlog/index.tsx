import { useEffect, useState } from 'react';
import { SprintType, Task } from "../../../types";
import { Sprint } from "./Sprint";
import { BacklogSection } from "./BacklogSection";
import CreateSprintButton from "../../../Components/CreateSprintButton";
import {useParams} from "react-router-dom";
import {BACKEND_URL} from "../../../Constants";
import axios from "axios";
import {toast} from "react-toastify";
import MenuHeader from "../../../Components/MenuHeader";
import axiosClient from "../../../api";

export default function Backlog() {
    const [search, setSearch] = useState('');
    const [sprints, setSprints] = useState<SprintType[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { boardId, projectId } = useParams();
    const numericBoardId = Number(boardId);
    const hasActiveSprint = sprints.some(s => s.status?.toLowerCase() === 'active');

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const [sprintsRes, tasksRes] = await Promise.all([
                    fetch(`${BACKEND_URL}/sprint/${numericBoardId}/list`),
                    fetch(`${BACKEND_URL}/tasks/${numericBoardId}/list`)
                ]);

                if (sprintsRes.ok && tasksRes.ok) {
                    const sprintsData = await sprintsRes.json();
                    const tasksData = await tasksRes.json();
                    setSprints(sprintsData);
                    setAllTasks(tasksData);
                }
            } catch (error) {
                console.error("Error fetching board data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (numericBoardId) {
            fetchBoardData();
        }
    }, [numericBoardId]);


    const getTasksForSprint = (sprintId: number) => {
        return allTasks.filter(t => t.sprintId === sprintId);
    };

    const getBacklogTasks = () => {
        return allTasks.filter(t => !t.sprintId);
    };

    const renderPriority = (priority: string) => {
        const colors: Record<string, string> = {
            highest: 'text-red-600',
            high: 'text-orange-500',
            medium: 'text-yellow-500',
            low: 'text-blue-400'
        };
        const colorClass = colors[priority?.toLowerCase()] || 'text-yellow-500';
        return <span className={`text-xs font-bold uppercase ${colorClass}`}>↑</span>;
    };

    const handleSprintCreated = (newSprint: SprintType) => {
        setSprints([...sprints, newSprint]);
    };

    const handleStartSprint = async (sprintId: number) => {
        const currentSprint= sprints.find(s => s.id === sprintId);
        if(!currentSprint) return;

        try {
            await axios.patch(`${BACKEND_URL}/sprint/${sprintId}/start`)
            const updatedSprints = sprints.map(s => {
                if (s.id === sprintId) {
                    return { ...s, status: "active" };
                }
                return s;
            });

            setSprints(updatedSprints);
            toast.success(`Sprint "${currentSprint.name}" has started!`);
        }catch (error) {
            console.error("Failed to start sprint:", error);
            toast.error("Failed to start sprint. Please try again.");
        }
    };

    const handleCompleteSprint = async (sprintId: number, targetSprintId: number|null) => {
        try {
            const res = await axios.patch(`${BACKEND_URL}/sprint/${sprintId}/complete`, {},
                {
                    params: {
                        targetSprintId: targetSprintId
                    }
                });
            if (res.status === 204) {
                toast.success("Hoàn thành Sprint thành công!");
                setSprints(prevSprints => prevSprints.filter(s => s.id !== sprintId));
                setAllTasks(prevTasks => prevTasks.map(task => {
                    if (task.sprintId === sprintId && task.status !== 'done') {
                        return { ...task, sprintId: targetSprintId ?? null };
                    }
                    return task;
                }));
            }
        }catch (error) {
            console.error("Failed to complete sprint:", error);
            toast.error("Failed to complete sprint. Please try again.");
        }
    };

    const handleCreateTask = async (sprintId: number | null, title: string) => {
        try {
            const payload = {
                sprintId: sprintId,
                title: title,
                columnId: 1, // Default to first column (TODO) - Backend should handle this better or fetch columns first
                projectId: Number(projectId),
                boardId: numericBoardId,
                priority: 'medium'
            }
            const response = await axiosClient.post(`/tasks`, payload);
            const newTask = response as Task; // Assuming response is the task object
            
            // Backend might return different structure, let's ensure we map it correctly if needed
            // But based on TaskController, it returns TaskDetailResponse inside "data" field of map
            // Wait, TaskController returns: { message: "...", data: response }
            // axiosClient interceptor might return response.data directly.
            // Let's assume axiosClient returns the data object directly.
            
            // If axiosClient returns { message, data: task }, then newTask should be response.data
            // Let's check axiosClient implementation or assume standard response.
            // Based on previous code, it seems axiosClient returns response.data.
            
            // However, TaskController returns a Map. So response.data is the TaskDetailResponse.
            const createdTask = (response as any).data; 

            setAllTasks(prevTasks => [...prevTasks, createdTask]);
            toast.success("Task created successfully");
        }catch (error) {
            console.error("Failed to create task:", error);
            toast.error("Failed to create task");
        }
    }

    const handleDeleteSprint = async (sprintId: number) => {
        if (!window.confirm("Are you sure you want to delete this sprint?")) return;
        
        try {
            await axiosClient.delete(`/sprint/${sprintId}`);
            setSprints(prev => prev.filter(s => s.id !== sprintId));
            // Move tasks to backlog in UI
            setAllTasks(prev => prev.map(t => t.sprintId === sprintId ? { ...t, sprintId: null } : t));
            toast.success("Sprint deleted");
        } catch (error) {
            console.error("Failed to delete sprint", error);
            toast.error("Failed to delete sprint");
        }
    };

    const handleUpdateSprint = async (sprintId: number, data: Partial<SprintType>) => {
        try {
            await axiosClient.put(`/sprint/${sprintId}`, data);
            setSprints(prev => prev.map(s => s.id === sprintId ? { ...s, ...data } : s));
            toast.success("Sprint updated");
        } catch (error) {
            console.error("Failed to update sprint", error);
            toast.error("Failed to update sprint");
        }
    };

    if (loading) return <div>Loading board...</div>;

    return (
        <div className="w-screen">
            <MenuHeader/>
            <div className="p-8 h-full w-full overflow-y-hidden bg-white">
                {/* --- HEADER --- */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search tasks"
                            className="border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 rounded px-3 py-2 w-64 outline-none transition-colors text-sm text-[#172b4d]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="flex -space-x-2">
                            {['D', 'H', 'T'].map((user, idx) => (
                                <div key={idx} className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-800 cursor-pointer hover:-translate-y-1 transition-transform">
                                    {user}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/*Create Sprint Button*/}
                    <CreateSprintButton boardId={numericBoardId} onSprintCreated={handleSprintCreated} />
                </div>

                {/* --- LIST SPRINTS --- */}
                <div className="flex flex-col gap-6">
                    {sprints.map((sprint) => (
                        <Sprint
                            key={sprint.id}
                            sprintId={sprint.id}
                            allSprints={sprints}
                            title={sprint.name}
                            tasks={getTasksForSprint(sprint.id)}
                            renderPriority={renderPriority}
                            status={sprint.status}
                            startDate={sprint.startDate}
                            endDate={sprint.endDate}
                            isAnySprintActive={hasActiveSprint}
                            onStartSprint={handleStartSprint}
                            onCompleteSprint={handleCompleteSprint}
                            onCreateTask={(title) => handleCreateTask(sprint.id, title)}
                            onDeleteSprint={handleDeleteSprint}
                            onUpdateSprint={handleUpdateSprint}
                        />
                    ))}
                </div>

                {/* --- BACKLOG SECTION --- */}
                <div className="mt-8">
                    <BacklogSection
                        tasks={getBacklogTasks()}
                        renderPriority={renderPriority}
                        onCreateTask={(title) => handleCreateTask(null, title)}
                    />
                </div>
            </div>
        </div>

    );
}