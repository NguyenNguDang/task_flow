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
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { taskService } from "../../../services/task.service";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import { Modal } from "../../../Components/Modal";

export default function Backlog() {
    const [search, setSearch] = useState('');
    const [sprints, setSprints] = useState<SprintType[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { boardId, projectId } = useParams();
    const numericBoardId = Number(boardId);
    const hasActiveSprint = sprints.some(s => s.status?.toLowerCase() === 'active');

    // Start Sprint Modal State
    const [isStartSprintModalOpen, setIsStartSprintModalOpen] = useState(false);
    const [sprintToStart, setSprintToStart] = useState<SprintType | null>(null);
    const [startSprintData, setStartSprintData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        duration: '2' // Default 2 weeks
    });

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const [sprintsRes, tasksRes] = await Promise.all([
                    axiosClient.get(`/sprint/${numericBoardId}/list`),
                    axiosClient.get(`/tasks/${numericBoardId}/list`)
                ]);

                const sprintsData = sprintsRes as unknown as SprintType[];
                const tasksData = tasksRes as unknown as Task[];
                // Filter out completed sprints for Backlog view
                const activeAndFutureSprints = sprintsData.filter((s: SprintType) => s.status !== 'completed');
                setSprints(activeAndFutureSprints);
                setAllTasks(tasksData);
                
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

    // --- FILTER TASKS BY SEARCH ---
    const filterTasks = (tasks: Task[]) => {
        if (!search.trim()) return tasks;
        return tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    };

    const getTasksForSprint = (sprintId: number) => {
        return filterTasks(allTasks.filter(t => t.sprintId === sprintId));
    };

    const getBacklogTasks = () => {
        return filterTasks(allTasks.filter(t => !t.sprintId));
    };

    const renderPriority = (priority: string) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return (
                    <div className="flex flex-col gap-[1px]" title="High Priority">
                        <div className="w-3 h-[2px] bg-red-500"></div>
                        <div className="w-3 h-[2px] bg-red-500"></div>
                        <div className="w-3 h-[2px] bg-red-500"></div>
                    </div>
                );
            case 'medium':
                return (
                    <div className="flex flex-col gap-[1px]" title="Medium Priority">
                        <div className="w-3 h-[2px] bg-orange-400"></div>
                        <div className="w-3 h-[2px] bg-orange-400"></div>
                    </div>
                );
            case 'low':
                return (
                    <div className="flex flex-col gap-[1px]" title="Low Priority">
                        <div className="w-3 h-[2px] bg-green-500"></div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col gap-[1px]" title="Medium Priority">
                        <div className="w-3 h-[2px] bg-gray-400"></div>
                        <div className="w-3 h-[2px] bg-gray-400"></div>
                    </div>
                );
        }
    };

    const handleSprintCreated = (newSprint: SprintType) => {
        setSprints([...sprints, newSprint]);
    };

    const openStartSprintModal = (sprintId: number) => {
        const sprint = sprints.find(s => s.id === sprintId);
        if (!sprint) return;

        const today = new Date().toISOString().split('T')[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 14); // Default 2 weeks
        const endDateStr = endDate.toISOString().split('T')[0];

        setSprintToStart(sprint);
        setStartSprintData({
            name: sprint.name,
            startDate: today,
            endDate: endDateStr,
            duration: '2'
        });
        setIsStartSprintModalOpen(true);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const duration = e.target.value;
        const startDate = new Date(startSprintData.startDate);
        let endDateStr = startSprintData.endDate;

        if (duration !== 'custom') {
            const weeks = parseInt(duration);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + (weeks * 7));
            endDateStr = endDate.toISOString().split('T')[0];
        }

        setStartSprintData({
            ...startSprintData,
            duration: duration,
            endDate: endDateStr
        });
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value;
        let endDateStr = startSprintData.endDate;

        if (startSprintData.duration !== 'custom') {
            const weeks = parseInt(startSprintData.duration);
            const startDate = new Date(newStartDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + (weeks * 7));
            endDateStr = endDate.toISOString().split('T')[0];
        }

        setStartSprintData({
            ...startSprintData,
            startDate: newStartDate,
            endDate: endDateStr
        });
    };

    const handleConfirmStartSprint = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sprintToStart) return;

        try {
            // Update sprint details first (name, dates)
            await axiosClient.put(`/sprint/${sprintToStart.id}`, {
                name: startSprintData.name,
                startDate: startSprintData.startDate,
                endDate: startSprintData.endDate
            });

            // Then start the sprint
            await axiosClient.patch(`/sprint/${sprintToStart.id}/start`);

            const updatedSprints = sprints.map(s => {
                if (s.id === sprintToStart.id) {
                    return { 
                        ...s, 
                        status: "active",
                        name: startSprintData.name,
                        startDate: startSprintData.startDate,
                        endDate: startSprintData.endDate
                    };
                }
                return s;
            });

            setSprints(updatedSprints);
            toast.success(`Sprint "${startSprintData.name}" has started!`);
            setIsStartSprintModalOpen(false);
        } catch (error) {
            console.error("Failed to start sprint:", error);
            toast.error("Failed to start sprint. Please try again.");
        }
    };

    const handleCompleteSprint = async (sprintId: number, targetSprintId: number|null) => {
        try {
            await axiosClient.patch(`/sprint/${sprintId}/complete`, {},
                {
                    params: {
                        targetSprintId: targetSprintId
                    }
                });
            
            toast.success("Sprint completed successfully!");
            
            // 1. Remove completed sprint from UI
            setSprints(prevSprints => prevSprints.filter(s => s.id !== sprintId));
            
            // 2. Update tasks:
            // - Tasks that are DONE: Remove from UI (or keep them but they won't show in any active sprint)
            // - Tasks that are NOT DONE: Move to target sprint (or backlog if target is null)
            setAllTasks(prevTasks => {
                // Filter out tasks that were in the completed sprint AND are DONE
                // These tasks are now "archived" in the completed sprint and shouldn't appear in backlog/active sprints
                const remainingTasks = prevTasks.filter(task => {
                    if (task.sprintId === sprintId && task.status?.toLowerCase() === 'done') {
                        return false; // Remove DONE tasks of completed sprint from view
                    }
                    return true;
                });

                // Update sprintId for unfinished tasks
                return remainingTasks.map(task => {
                    if (task.sprintId === sprintId && task.status?.toLowerCase() !== 'done') {
                        return { ...task, sprintId: targetSprintId ?? null };
                    }
                    return task;
                });
            });

        }catch (error) {
            console.error("Failed to complete sprint:", error);
            toast.error("Failed to complete sprint. Please try again.");
        }
    };

    const handleCreateTask = async (sprintId: number | null, title: string, dueDate?: string, assigneeId?: number) => {
        try {
            // Fetch columns to get the first column ID
            const columnsRes = await axiosClient.get(`/boards/${numericBoardId}/columns`);
            const columns = (columnsRes as any);
            const firstColumnId = columns.length > 0 ? columns[0].id : 1; 

            const payload = {
                sprintId: sprintId,
                title: title,
                columnId: firstColumnId, 
                projectId: Number(projectId),
                boardId: numericBoardId,
                priority: 'medium',
                dueDate: dueDate,
                assigneeId: assigneeId
            }
            const response = await axiosClient.post(`/tasks`, payload);
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

    const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
        try {
            // Optimistic update
            setAllTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
            
            await taskService.update(String(taskId), updates);
            toast.success("Task updated");
        } catch (error) {
            console.error("Failed to update task", error);
            toast.error("Failed to update task");
            // Revert logic could be added here
        }
    };

    const handleDeleteTask = async (taskId: number) => {
         if (!window.confirm("Are you sure you want to delete this task?")) return;
         try {
             await taskService.delete(taskId);
             setAllTasks(prev => prev.filter(t => t.id !== taskId));
             toast.success("Task deleted");
         } catch (error) {
             console.error("Failed to delete task", error);
             toast.error("Failed to delete task");
         }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const taskId = Number(draggableId);
        const destSprintId = destination.droppableId === 'backlog' ? null : Number(destination.droppableId);

        // Optimistic update
        const updatedTasks = allTasks.map(t => {
            if (t.id === taskId) {
                return { ...t, sprintId: destSprintId };
            }
            return t;
        });
        setAllTasks(updatedTasks);

        try {
            await taskService.moveTaskToSprint(taskId, destSprintId);
        } catch (error) {
            console.error("Failed to move task", error);
            toast.error("Failed to move task");
            // Revert on error
            setAllTasks(allTasks);
        }
    };

    if (loading) return <div>Loading board...</div>;

    return (
        <div className="w-screen h-full overflow-y-auto custom-scrollbar">
            <MenuHeader/>
            <div className="p-8 h-full w-full bg-white">
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
                    </div>

                    {/*Create Sprint Button*/}
                    <CreateSprintButton boardId={numericBoardId} onSprintCreated={handleSprintCreated} />
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
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
                                onStartSprint={openStartSprintModal}
                                onCompleteSprint={handleCompleteSprint}
                                onCreateTask={(title, dueDate, assigneeId) => handleCreateTask(sprint.id, title, dueDate, assigneeId)}
                                onDeleteSprint={handleDeleteSprint}
                                onUpdateSprint={handleUpdateSprint}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                            />
                        ))}
                    </div>

                    {/* --- BACKLOG SECTION --- */}
                    <div className="mt-8">
                        <BacklogSection
                            tasks={getBacklogTasks()}
                            renderPriority={renderPriority}
                            onCreateTask={(title, dueDate, assigneeId) => handleCreateTask(null, title, dueDate, assigneeId)}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                        />
                    </div>
                </DragDropContext>

                {/* --- START SPRINT MODAL --- */}
                {isStartSprintModalOpen && (
                    <Modal onClose={() => setIsStartSprintModalOpen(false)} className="max-w-md">
                        <div className="p-2">
                            <h3 className="text-lg font-bold mb-4 text-[#172b4d]">Start Sprint</h3>
                            <p className="text-sm text-gray-500 mb-4">{getTasksForSprint(sprintToStart?.id || 0).length} issues will be included in this sprint.</p>
                            
                            <form onSubmit={handleConfirmStartSprint} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sprint Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-2 border-gray-100 bg-gray-50 rounded px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors"
                                        value={startSprintData.name}
                                        onChange={(e) => setStartSprintData({...startSprintData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                                    <select 
                                        className="w-full border-2 border-gray-100 bg-gray-50 rounded px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors"
                                        value={startSprintData.duration}
                                        onChange={handleDurationChange}
                                    >
                                        <option value="1">1 week</option>
                                        <option value="2">2 weeks</option>
                                        <option value="3">3 weeks</option>
                                        <option value="4">4 weeks</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full border-2 border-gray-100 bg-gray-50 rounded px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors"
                                            value={startSprintData.startDate}
                                            onChange={handleStartDateChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full border-2 border-gray-100 bg-gray-50 rounded px-3 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none transition-colors"
                                            value={startSprintData.endDate}
                                            onChange={(e) => setStartSprintData({...startSprintData, endDate: e.target.value, duration: 'custom'})}
                                            min={startSprintData.startDate}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsStartSprintModalOpen(false)} 
                                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                    >
                                        Start
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                )}
            </div>
        </div>

    );
}