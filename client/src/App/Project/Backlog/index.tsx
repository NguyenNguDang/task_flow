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

    console.log("BoardId", boardId);

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
                    // console.log("Sprint Data", sprintsData);
                    // console.log("TasksData", tasksData);
                    setSprints(sprintsData);
                    setAllTasks(tasksData);
                }
            } catch (error) {
                console.error("Error fetching board data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBoardData();
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
        // Fallback về medium nếu priority null
        const colorClass = colors[priority?.toLowerCase()] || 'text-yellow-500';
        return <span className={`text-xs font-bold uppercase ${colorClass}`}>↑</span>;
    };

    // Hàm callback cập nhật UI khi tạo Sprint mới
    const handleSprintCreated = (newSprint: SprintType) => {
        setSprints([...sprints, newSprint]);
    };

    const handleStartSprint = async (sprintId: number) => {
        console.log("Start sprint:", sprintId);
        const currentSprint= sprints.find(s => s.id === sprintId);
        if(!currentSprint){
            return;
        }

        try {
            await axios.patch(`${BACKEND_URL}/sprint/${sprintId}/start`)
            //Optimistic Update
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
        console.log("Complete sprint:", sprintId);
        // Call API complete sprint
        try {
            const res = await  axios.patch(`${BACKEND_URL}/sprint/${sprintId}/complete`, {},
                {
                    params: {
                        targetSprintId: targetSprintId
                    }
                });
            if (res.status === 204) {
                toast.success("Hoàn thành Sprint thành công!");

                // TODO: Cập nhật state của React ở đây để UI thay đổi ngay lập tức
                // 1. Xóa Sprint vừa xong khỏi UI
                setSprints(prevSprints => prevSprints.filter(s => s.id !== sprintId));

                // 2. Cập nhật Task chưa xong
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

    //TODO: Not finish
    const handleCreateSprint = async (sprintId: number, title: string) => {
        try {
            const payload = {
                sprintId: sprintId,
                title: title,
                columnId: 1,
                projectId: projectId,
                boardId: 1
            }
            const newTask  = await axiosClient.post(`/tasks`, payload) as Task;
            setAllTasks(prevTasks => [...prevTasks, newTask]);
        }catch (error) {
            toast("Failed to create task" + error);
        }
    }

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
                            isAnySprintActive={hasActiveSprint}
                            onStartSprint={handleStartSprint}
                            onCompleteSprint={handleCompleteSprint}
                            onCreateTask={handleCreateSprint}
                        />
                    ))}
                </div>

                {/* --- BACKLOG SECTION --- */}
                <div className="mt-8">
                    <BacklogSection
                        tasks={getBacklogTasks()}
                        renderPriority={renderPriority}
                    />
                </div>
            </div>
        </div>

    );
}