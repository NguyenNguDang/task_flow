import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import axiosClient from '../api';
import { FaTrophy, FaTasks, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import SprintBurndownChart from './SprintBurndownChart';

interface SprintReportData {
    sprintId: number;
    sprintName: string;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    mvpUser: {
        id: number;
        username: string;
        fullName: string;
        avatarUrl: string | null;
    } | null;
}

interface SprintReportModalProps {
    sprintId: number;
    onClose: () => void;
}

const SprintReportModal = ({ sprintId, onClose }: SprintReportModalProps) => {
    const [data, setData] = useState<SprintReportData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axiosClient.get<SprintReportData>(`/sprint/${sprintId}/report`);
                setData(response as any);
            } catch (error) {
                console.error("Failed to fetch sprint report", error);
            } finally {
                setLoading(false);
            }
        };

        if (sprintId) {
            fetchReport();
        }
    }, [sprintId]);

    if (loading) return <Modal onClose={onClose}><div>Loading report...</div></Modal>;
    if (!data) return <Modal onClose={onClose}><div>No data available</div></Modal>;

    return (
        <Modal onClose={onClose} className="max-w-4xl">
            <div className="p-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Sprint Report: {data.sprintName}
                </h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col items-center">
                        <FaTasks className="text-blue-500 text-2xl mb-2" />
                        <span className="text-gray-500 text-sm font-medium uppercase">Total Tasks</span>
                        <span className="text-3xl font-bold text-gray-800">{data.totalTasks}</span>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex flex-col items-center">
                        <FaCheckCircle className="text-green-500 text-2xl mb-2" />
                        <span className="text-gray-500 text-sm font-medium uppercase">Completed</span>
                        <span className="text-3xl font-bold text-gray-800">{data.completedTasks}</span>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex flex-col items-center">
                        <FaExclamationCircle className="text-red-500 text-2xl mb-2" />
                        <span className="text-gray-500 text-sm font-medium uppercase">Overdue</span>
                        <span className="text-3xl font-bold text-gray-800">{data.overdueTasks}</span>
                    </div>
                </div>

                {/* Burndown Chart Section */}
                <div className="mb-8">
                    <SprintBurndownChart sprintId={sprintId} />
                </div>

                {/* MVP Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                        <FaTrophy size={120} />
                    </div>
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden bg-white">
                                <img 
                                    src={data.mvpUser?.avatarUrl || "https://via.placeholder.com/150"} 
                                    alt="MVP" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-full shadow-md">
                                <FaTrophy size={16} />
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-yellow-800 font-bold text-sm uppercase tracking-wider mb-1">
                                Sprint MVP
                            </h3>
                            <p className="text-2xl font-bold text-gray-800">
                                {data.mvpUser?.fullName || "No MVP yet"}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                                Most tasks completed in this sprint
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SprintReportModal;
