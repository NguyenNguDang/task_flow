import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaPlusCircle, FaExclamationCircle, FaTasks, FaBolt, FaBug, FaUserCircle } from 'react-icons/fa';
import MenuHeader from "../../../Components/MenuHeader";
import { useParams } from 'react-router-dom';
import axiosClient from '../../../api';
import { toast } from 'react-toastify';

// --- Types ---
interface SummaryStats {
    doneLast7Days: number;
    updatedLast7Days: number;
    createdLast7Days: number;
    dueNext7Days: number;
}

interface ChartData {
    label: string;
    value: number;
    color?: string;
}

interface Activity {
    id: number;
    user: string;
    userAvatar: string | null;
    action: string;
    issue: string;
    time: string;
}

interface WorkloadItem {
    name: string;
    avatarUrl: string | null;
    taskCount: number;
    percentage: number;
    isUnassigned: boolean;
}

interface ProjectSummaryData {
    stats: SummaryStats;
    statusOverview: ChartData[];
    priorityBreakdown: ChartData[];
    recentActivities: Activity[];
    workload: WorkloadItem[];
    typeBreakdown: ChartData[];
}

// --- Components ---

const StatCard = ({ label, value, subtext, icon }: any) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <div className="text-3xl font-bold text-gray-800">{value}</div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mt-1">{label}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded-full">{icon}</div>
        </div>
        <div className="text-xs text-gray-500 mt-2">{subtext}</div>
    </div>
);

const DonutChart = ({ data }: { data: ChartData[] }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    let currentAngle = 0;

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                No data available
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-64 relative">
            <svg viewBox="0 0 36 36" className="w-48 h-48 transform -rotate-90">
                {data.map((item, index) => {
                    const percentage = (item.value / total) * 100;
                    const dashArray = `${percentage} ${100 - percentage}`;
                    const offset = 100 - currentAngle;
                    currentAngle += percentage;
                    
                    return (
                        <circle
                            key={index}
                            cx="18" cy="18" r="15.915"
                            fill="transparent"
                            stroke={item.color || '#dfe1e6'}
                            strokeWidth="5"
                            strokeDasharray={dashArray}
                            strokeDashoffset={offset}
                            style={{ strokeDashoffset: 100 - (currentAngle - percentage) + '%' }}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold text-gray-800">{total}</span>
                <span className="text-xs text-gray-500 font-medium uppercase mt-1">Total Issues</span>
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-2">
                 {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color || '#dfe1e6' }}></span>
                        <span className="text-gray-600 font-medium">{item.value}</span>
                        <span className="text-gray-500">{item.label}</span>
                    </div>
                 ))}
            </div>
        </div>
    );
};

const BarChart = ({ data }: { data: ChartData[] }) => {
    const max = Math.max(...data.map(d => d.value));
    
    if (max === 0) {
        return (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                No data available
            </div>
        );
    }

    return (
        <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group">
                    <div className="relative w-full flex justify-center items-end h-32 bg-gray-50 rounded-t-sm overflow-hidden">
                         {item.value > 0 && (
                            <div 
                                className="w-8 rounded-t-sm transition-all duration-500 ease-out group-hover:opacity-80"
                                style={{ 
                                    height: `${(item.value / max) * 100}%`, 
                                    backgroundColor: item.color || '#dfe1e6'
                                }}
                            ></div>
                         )}
                         <div className="absolute -top-6 text-xs font-bold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                             {item.value}
                         </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 font-medium truncate w-full text-center" title={item.label}>
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

const ActivityItem = ({ item }: { item: Activity }) => (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors">
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0 overflow-hidden">
            {item.userAvatar ? (
                <img src={item.userAvatar} alt={item.user} className="w-full h-full object-cover" />
            ) : (
                item.user.charAt(0).toUpperCase()
            )}
        </div>
        <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-800">
                <span className="font-semibold hover:underline cursor-pointer text-blue-700">{item.user}</span>
                <span className="text-gray-600 mx-1">{item.action}</span>
                <span className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer">{item.issue}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{item.time}</div>
        </div>
    </div>
);

const WorkTypeItem = ({ item, total }: { item: ChartData, total: number }) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    
    // Map icon based on label
    let icon = <FaTasks className="text-gray-500" size={16} />;
    if (item.label.toLowerCase() === 'task') icon = <FaCheckCircle className="text-blue-500" size={16} />;
    else if (item.label.toLowerCase() === 'subtask') icon = <FaTasks className="text-cyan-500" size={16} />;
    else if (item.label.toLowerCase() === 'epic') icon = <FaBolt className="text-purple-500" size={16} />;
    else if (item.label.toLowerCase() === 'bug') icon = <FaBug className="text-red-500" size={16} />;

    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2 w-24 flex-shrink-0">
                {icon}
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="text-sm font-bold text-gray-700 w-8 text-right">{item.value}</div>
        </div>
    );
};

const Card = ({ title, linkText, children, className = "", subtitle, subtitleLink }: any) => (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col ${className}`}>
        <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
                {linkText && <a href="#" className="text-xs font-medium text-blue-600 hover:underline">{linkText}</a>}
            </div>
            {(subtitle || subtitleLink) && (
                <div className="text-sm text-gray-500">
                    {subtitle} {subtitleLink && <a href="#" className="text-blue-600 hover:underline">{subtitleLink}</a>}
                </div>
            )}
        </div>
        <div className="p-6 flex-1">
            {children}
        </div>
    </div>
);

const ProgressBar = ({ percentage }: { percentage: number }) => (
    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
            className="h-full bg-gray-500 rounded-full flex items-center justify-end pr-1" 
            style={{ width: `${percentage}%` }}
        >
            {percentage > 10 && <span className="text-[9px] font-bold text-white leading-none">{percentage}%</span>}
        </div>
        {percentage <= 10 && <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-[9px] font-bold text-gray-600">{percentage}%</span>}
    </div>
);

const WorkloadRow = ({ item }: { item: WorkloadItem }) => (
    <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
        <div className="flex items-center gap-3 w-40 flex-shrink-0">
            {item.isUnassigned ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <FaUserCircle size={20} />
                </div>
            ) : (
                <div className={`w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden`}>
                    {item.avatarUrl ? (
                        <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        item.name.charAt(0).toUpperCase()
                    )}
                </div>
            )}
            <span className="text-sm font-medium text-gray-700 truncate">{item.name}</span>
        </div>
        <div className="flex-1">
            <ProgressBar percentage={item.percentage} />
        </div>
    </div>
);

const TeamWorkloadCard = ({ data }: { data: WorkloadItem[] }) => (
    <Card 
        title="Team workload" 
        subtitle="Monitor the capacity of your team."
        subtitleLink="Reassign work items to get the right balance"
        className="h-full"
    >
        <div className="flex flex-col">
            <div className="flex text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pb-2 border-b border-gray-100">
                <div className="w-40">Assignee</div>
                <div className="flex-1">Work distribution</div>
            </div>
            {data.length === 0 ? (
                <p className="text-gray-500 text-sm py-4 text-center">No workload data available.</p>
            ) : (
                data.map((item, idx) => (
                    <WorkloadRow key={idx} item={item} />
                ))
            )}
        </div>
    </Card>
);

const EpicProgressEmptyState = () => (
    <Card 
        title="Epic progress" 
        className="h-full"
    >
        <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="mb-4 relative">
                <div className="flex items-end justify-center gap-1">
                    <div className="w-8 h-12 bg-blue-100 rounded-sm"></div>
                    <div className="w-8 h-16 bg-blue-200 rounded-sm"></div>
                    <div className="w-8 h-10 bg-blue-100 rounded-sm"></div>
                </div>
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <FaPlusCircle size={12} />
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">Use epics to track larger initiatives in your space.</p>
            <a href="#" className="text-sm font-medium text-blue-600 hover:underline">What is an epic?</a>
        </div>
    </Card>
);

export default function Summary() {
    const { projectId } = useParams();
    const [data, setData] = useState<ProjectSummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            if (!projectId) return;
            try {
                const res = await axiosClient.get(`/projects/${projectId}/summary`);
                setData(res as ProjectSummaryData);
            } catch (error) {
                console.error("Failed to fetch summary", error);
                toast.error("Failed to load project summary");
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [projectId]);

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col bg-white">
                <MenuHeader />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">Loading summary...</div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full h-full flex flex-col bg-white">
                <MenuHeader />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">No data available</div>
                </div>
            </div>
        );
    }

    const totalWorkItems = data.typeBreakdown.reduce((acc, item) => acc + item.value, 0);

    return (
        <div className="w-full h-full flex flex-col bg-white">
            <MenuHeader />
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
                <div className="max-w-[1400px] mx-auto p-8">
                    
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Project Summary</h1>
                        <p className="text-gray-500 text-sm mt-1">Overview of project status and recent activity.</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard 
                            label="Done" 
                            value={data.stats.doneLast7Days} 
                            subtext="in the last 7 days" 
                            icon={<FaCheckCircle className="text-green-500" size={24} />} 
                        />
                        <StatCard 
                            label="Updated" 
                            value={data.stats.updatedLast7Days} 
                            subtext="in the last 7 days" 
                            icon={<FaClock className="text-blue-500" size={24} />} 
                        />
                        <StatCard 
                            label="Created" 
                            value={data.stats.createdLast7Days} 
                            subtext="in the last 7 days" 
                            icon={<FaPlusCircle className="text-purple-500" size={24} />} 
                        />
                        <StatCard 
                            label="Due soon" 
                            value={data.stats.dueNext7Days} 
                            subtext="due in the next 7 days" 
                            icon={<FaExclamationCircle className="text-red-500" size={24} />} 
                        />
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        
                        {/* Left Column */}
                        <div className="space-y-6">
                            <Card title="Status Overview" linkText="View all issues">
                                <DonutChart data={data.statusOverview} />
                            </Card>
                            
                            <Card title="Priority Breakdown">
                                <BarChart data={data.priorityBreakdown} />
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <Card title="Recent Activity" className="max-h-[400px]">
                                <div className="overflow-y-auto pr-2 custom-scrollbar max-h-[320px]">
                                    {data.recentActivities.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-4">No recent activity.</p>
                                    ) : (
                                        data.recentActivities.map(activity => (
                                            <ActivityItem key={activity.id} item={activity} />
                                        ))
                                    )}
                                </div>
                            </Card>

                            <Card title="Types of Work" linkText="View all types">
                                <div>
                                    {data.typeBreakdown.length === 0 ? (
                                        <p className="text-gray-500 text-sm text-center py-4">No work items found.</p>
                                    ) : (
                                        data.typeBreakdown.map((type, idx) => (
                                            <WorkTypeItem key={idx} item={type} total={totalWorkItems} />
                                        ))
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Section: Workload & Epics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TeamWorkloadCard data={data.workload} />
                        <EpicProgressEmptyState />
                    </div>
                </div>
            </div>
        </div>
    );
}
