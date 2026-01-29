import React, { useState, useEffect } from 'react';
import { IoIosMore } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import MenuHeader from "../../../Components/MenuHeader";
import { useParams } from 'react-router-dom';
import axiosClient from '../../../api';
import { BACKEND_URL } from '../../../Constants';

// --- Types ---
interface WorkItem {
    id: string;
    key: string;
    summary: string;
    workType: 'Bug' | 'Story' | 'Task';
    epic?: string;
    status: 'TO DO' | 'IN PROGRESS' | 'DONE';
    assignee: {
        name: string;
        avatar?: string;
    };
    storyPoints: number;
    scopeChange?: {
        detail: string;
        estimationChange: string;
    };
    updatedAt?: string;
}

interface BurndownData {
    dates: string[];
    idealData: number[];
    actualData: number[];
}

interface SprintType {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
}

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
    const getStyle = (s: string) => {
        switch (s?.toUpperCase()) {
            case 'DONE': return 'bg-green-100 text-green-800';
            case 'IN PROGRESS': 
            case 'DOING': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${getStyle(status)}`}>
            {status}
        </span>
    );
};

const ReportTable = ({ 
    title, 
    items, 
    columns, 
    emptyMessage 
}: { 
    title?: string, 
    items: WorkItem[], 
    columns: string[], 
    emptyMessage?: string 
}) => {
    if (items.length === 0 && emptyMessage) {
        return (
            <div className="mb-8">
                {title && <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>}
                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-md text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
                    <p className="text-sm text-gray-500">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            {title && <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>}
            <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-4 py-2">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <a href="#" className="text-blue-600 hover:underline font-medium">{item.key}</a>
                                </td>
                                <td className="px-4 py-3 text-gray-800">{item.summary}</td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={item.status} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden">
                                            {item.assignee.avatar ? (
                                                <img src={item.assignee.avatar} alt={item.assignee.name} className="w-full h-full object-cover" />
                                            ) : (
                                                item.assignee.name.charAt(0)
                                            )}
                                        </div>
                                        <span>{item.assignee.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center font-medium text-gray-600">
                                    {item.storyPoints}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ScopeChangeTable = ({ items }: { items: WorkItem[] }) => {
    if (items.length === 0) return null;
    
    return (
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Scope changes log</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Key</th>
                            <th className="px-4 py-2">Summary</th>
                            <th className="px-4 py-2">Details</th>
                            <th className="px-4 py-2">Change</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-gray-500">13/Nov/23</td>
                                <td className="px-4 py-3">
                                    <a href="#" className="text-blue-600 hover:underline font-medium">{item.key}</a>
                                </td>
                                <td className="px-4 py-3 text-gray-800">{item.summary}</td>
                                <td className="px-4 py-3 text-gray-600">{item.scopeChange?.detail}</td>
                                <td className="px-4 py-3 text-gray-600">{item.scopeChange?.estimationChange}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function Reports() {
    const { boardId } = useParams();
    const [sprints, setSprints] = useState<SprintType[]>([]);
    const [selectedSprintId, setSelectedSprintId] = useState<string>('');
    const [chartData, setChartData] = useState<any[]>([]);
    const [estimation, setEstimation] = useState('Story Points');
    const [loading, setLoading] = useState(true);
    const [sprintTasks, setSprintTasks] = useState<{
        incomplete: WorkItem[],
        completed: WorkItem[],
        outside: WorkItem[]
    }>({ incomplete: [], completed: [], outside: [] });

    // Fetch Sprints
    useEffect(() => {
        const fetchSprints = async () => {
            console.log("Fetching sprints for boardId:", boardId);
            try {
                const res = await axiosClient.get(`/sprint/${boardId}/list`);
                const data = res as unknown as SprintType[];
                console.log("Sprints fetched:", data);
                setSprints(data);
                // Select active sprint or first sprint by default
                const active = data.find((s: any) => s.status === 'active');
                if (active) {
                    console.log("Setting active sprint:", active.id);
                    setSelectedSprintId(String(active.id));
                } else if (data.length > 0) {
                    console.log("Setting first sprint:", data[0].id);
                    setSelectedSprintId(String(data[0].id));
                } else {
                    console.log("No sprints found");
                    setLoading(false); // No sprints found
                }
            } catch (error) {
                console.error("Failed to fetch sprints", error);
                setLoading(false);
            }
        };
        if (boardId) fetchSprints();
    }, [boardId]);

    // Fetch Burndown Data & Tasks
    useEffect(() => {
        const fetchData = async () => {
            if (!selectedSprintId) {
                console.log("No selectedSprintId, skipping fetchData");
                return;
            }
            console.log("Fetching data for sprintId:", selectedSprintId);
            setLoading(true);
            try {
                // 1. Fetch Burndown Chart Data
                console.log("Fetching burndown data...");
                const burndownRes = await axiosClient.get(`/sprints/${selectedSprintId}/burndown`);
                const burndownData = burndownRes as unknown as BurndownData;
                console.log("Burndown data fetched:", burndownData);
                
                // Transform data for Recharts
                const transformedData = burndownData.dates.map((date, index) => ({
                    date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                    ideal: burndownData.idealData[index],
                    remaining: burndownData.actualData[index]
                }));
                setChartData(transformedData);

                // 2. Fetch Tasks for Sprint Report Tables
                // Note: Ideally backend should provide a dedicated endpoint for report tables
                // For now, we fetch all tasks and filter client-side or use existing endpoints
                console.log("Fetching tasks for boardId:", boardId);
                const tasksRes = await axiosClient.get(`/tasks/${boardId}/list`);
                const tasks = tasksRes as unknown as any[];
                console.log("Tasks fetched:", tasks.length);
                const currentSprintTasks = tasks.filter((t: any) => String(t.sprintId) === selectedSprintId);
                console.log("Tasks in current sprint:", currentSprintTasks.length);
                
                const selectedSprint = sprints.find(s => String(s.id) === selectedSprintId);
                const sprintStartDate = selectedSprint ? new Date(selectedSprint.startDate) : null;
                const sprintEndDate = selectedSprint ? new Date(selectedSprint.endDate) : null;

                const completed: WorkItem[] = [];
                const incomplete: WorkItem[] = [];
                const outside: WorkItem[] = [];

                currentSprintTasks.forEach((t: any) => {
                    const workItem = mapTaskToWorkItem(t);
                    const isDone = t.status?.toUpperCase() === 'DONE';
                    
                    if (isDone) {
                        // Check if completed outside sprint
                        if (sprintStartDate && sprintEndDate && t.updatedAt) {
                            const completedDate = new Date(t.updatedAt);
                            // Check if completed BEFORE start or AFTER end
                            if (completedDate < sprintStartDate || completedDate > sprintEndDate) {
                                outside.push(workItem);
                            } else {
                                completed.push(workItem);
                            }
                        } else {
                            // If no dates available, assume inside sprint
                            completed.push(workItem);
                        }
                    } else {
                        incomplete.push(workItem);
                    }
                });

                setSprintTasks({ completed, incomplete, outside });

            } catch (error) {
                console.error("Failed to fetch report data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedSprintId, boardId, sprints]);

    const mapTaskToWorkItem = (task: any): WorkItem => ({
        id: String(task.id),
        key: task.taskKey || `SCRUM-${task.id}`,
        summary: task.title,
        workType: 'Story', // Default or map from task type if available
        status: task.status,
        assignee: {
            name: task.assignee?.fullName || task.assigneeName || 'Unassigned',
            avatar: task.assignee?.avatarUrl || task.assigneeAvatar
        },
        storyPoints: task.estimateHours || task.storyPoint || 0,
        updatedAt: task.updatedAt
    });

    const selectedSprint = sprints.find(s => String(s.id) === selectedSprintId);

    const handleTriggerSnapshot = async () => {
        try {
            await axiosClient.post('/sprints/trigger-burndown-snapshot');
            alert("Snapshot triggered! Refreshing data...");
            // Refresh data logic here (similar to useEffect)
            // For brevity, reloading page or re-triggering useEffect via state change is easier
            window.location.reload();
        } catch (error) {
            console.error("Failed to trigger snapshot", error);
            alert("Failed to trigger snapshot");
        }
    };

    if (loading) return <div className="p-8">Loading report...</div>;

    if (!selectedSprint && !loading) {
        return (
            <div className="w-screen h-screen flex flex-col bg-white overflow-hidden">
                <MenuHeader />
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    No sprints found for this project.
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen flex flex-col bg-white overflow-hidden">
            <MenuHeader />
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-[1200px] mx-auto p-8">
                    
                    {/* 1. Page Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-semibold text-[#172b4d]">Sprint Burndown Chart</h1>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleTriggerSnapshot}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors"
                            >
                                Refresh Data (Dev)
                            </button>
                            <a href="#" className="text-sm text-blue-600 hover:underline">How to read this report</a>
                            <button className="p-2 hover:bg-gray-100 rounded text-gray-600">
                                <IoIosMore size={20} />
                            </button>
                        </div>
                    </div>

                    {/* 2. Filters */}
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <select 
                                    className="appearance-none bg-gray-100 hover:bg-gray-200 border border-transparent rounded px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                    value={selectedSprintId}
                                    onChange={(e) => setSelectedSprintId(e.target.value)}
                                >
                                    {sprints.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
                            </div>

                            <div className="relative">
                                <select 
                                    className="appearance-none bg-gray-100 hover:bg-gray-200 border border-transparent rounded px-3 py-1.5 pr-8 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                    value={estimation}
                                    onChange={(e) => setEstimation(e.target.value)}
                                >
                                    <option>Story Points</option>
                                    <option>Issue Count</option>
                                </select>
                                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
                            </div>
                        </div>
                        {selectedSprint && (
                            <div className="text-xs text-gray-500 ml-1">
                                {selectedSprint.startDate ? new Date(selectedSprint.startDate).toLocaleDateString() : 'No start date'} - {selectedSprint.endDate ? new Date(selectedSprint.endDate).toLocaleDateString() : 'No end date'}
                            </div>
                        )}
                    </div>

                    {/* 3. Burndown Chart */}
                    <div className="mb-12 border border-gray-200 rounded-md p-6 bg-white">
                        {chartData.length > 0 ? (
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ebecf0" />
                                        <XAxis 
                                            dataKey="date" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6b778c', fontSize: 12 }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#6b778c', fontSize: 12 }} 
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                            cursor={{ stroke: '#ebecf0', strokeWidth: 2 }}
                                        />
                                        {/* Optional: Reference line for end date if needed */}
                                        
                                        {/* Ideal Burn Line */}
                                        <Line 
                                            type="linear" 
                                            dataKey="ideal" 
                                            stroke="#dfe1e6" 
                                            strokeWidth={2} 
                                            dot={false} 
                                            strokeDasharray="5 5"
                                            name="Guideline"
                                        />
                                        
                                        {/* Remaining Work Line */}
                                        <Line 
                                            type="linear" 
                                            dataKey="remaining" 
                                            stroke="#de350b" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#de350b', strokeWidth: 0 }} 
                                            activeDot={{ r: 6 }}
                                            name="Remaining Work"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[400px] w-full flex items-center justify-center text-gray-400">
                                No chart data available for this sprint.
                            </div>
                        )}
                        
                        <div className="flex justify-center gap-6 mt-4 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-[#de350b]"></div>
                                <span>Remaining Work</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-[#dfe1e6] border-t border-dashed border-gray-400"></div>
                                <span>Guideline</span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Sprint Report */}
                    <div>
                        <h2 className="text-lg font-semibold text-[#172b4d] mb-6">Report: {selectedSprint?.name}</h2>

                        {/* 4.1 Scope Changes (Placeholder - needs backend support) */}
                        <ScopeChangeTable items={[]} />

                        {/* 4.2 Incomplete Work */}
                        <ReportTable 
                            title="Incomplete work" 
                            items={sprintTasks.incomplete} 
                            columns={['Key', 'Summary', 'Status', 'Assignee', 'Story Points']}
                            emptyMessage="All work completed!"
                        />

                        {/* 4.3 Completed Work */}
                        <ReportTable 
                            title="Completed work" 
                            items={sprintTasks.completed} 
                            columns={['Key', 'Summary', 'Status', 'Assignee', 'Story Points']}
                            emptyMessage="No work completed yet."
                        />

                        {/* 4.4 Outside Work (Placeholder) */}
                        <ReportTable 
                            title="Work items completed outside of sprint" 
                            items={sprintTasks.outside}
                            columns={['Key', 'Summary', 'Status', 'Assignee', 'Story Points']}
                            emptyMessage="No work items have been completed outside of the sprint"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
