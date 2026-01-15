import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosClient from '../../../api';
import MenuHeader from "../../../Components/MenuHeader";

interface ChartItem {
    label: string;
    value: number;
    color: string;
}

interface DashboardData {
    projectId: number;
    totalTasks: number;
    pieChartData: ChartItem[];
}

export default function ProjectDashboard() {
    const { projectId } = useParams();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axiosClient.get<DashboardData>(`/projects/${projectId}/dashboard`);
                setData(response as any);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchDashboardData();
        }
    }, [projectId]);

    if (loading) return <div>Loading dashboard...</div>;
    if (!data) return <div>No data available</div>;

    // Calculate completed vs pending for summary cards if needed, 
    // or just use the pieChartData which already has status breakdown.
    const completedTasks = data.pieChartData.find(item => item.label === 'DONE')?.value || 0;
    const pendingTasks = data.totalTasks - completedTasks;

    return (
        <div className="w-screen h-full flex flex-col">
            <MenuHeader />
            <div className="p-6 flex-grow overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Project Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Tasks</h3>
                        <p className="text-3xl font-bold mt-2">{data.totalTasks}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Completed</h3>
                        <p className="text-3xl font-bold mt-2 text-green-600">{completedTasks}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Pending</h3>
                        <p className="text-3xl font-bold mt-2 text-blue-600">{pendingTasks}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-[400px]">
                    <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.pieChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                nameKey="label"
                            >
                                {data.pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}