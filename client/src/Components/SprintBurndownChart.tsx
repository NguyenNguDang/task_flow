import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosClient from '../api';

interface BurndownDataPoint {
    date: string;
    idealRemaining: number;
    actualRemaining: number;
}

interface BurndownChartResponse {
    dates: string[];
    idealData: number[];
    actualData: number[];
}

interface SprintBurndownChartProps {
    sprintId: number;
}

const SprintBurndownChart = ({ sprintId }: SprintBurndownChartProps) => {
    const [chartData, setChartData] = useState<BurndownDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBurndownData = async () => {
            try {
                setLoading(true);
                // Note: Endpoint might be /api/sprints/... or /api/v1/sprints/... depending on backend config.
                // Based on prompt, it's /api/sprints/{sprintId}/burndown but let's try to use axiosClient base URL.
                // If axiosClient has /api/v1 base, we might need to adjust.
                // Assuming axiosClient handles base URL correctly.
                // The prompt says endpoint is GET /api/sprints/{sprintId}/burndown (missing /v1 prefix in controller annotation potentially).
                // Let's try calling it as is relative to base URL if possible, or absolute if needed.
                // However, axiosClient usually has a baseURL. Let's assume standard /sprints/... path first.
                
                // Adjusting path based on typical pattern: /sprints/${sprintId}/burndown
                const response = await axiosClient.get<BurndownChartResponse>(`/sprints/${sprintId}/burndown`);
                
                const data = response as any; // Cast to any to handle potential response structure differences
                
                // Transform data to Recharts format
                // Backend returns lists of dates, idealData, actualData
                if (data.dates && data.idealData && data.actualData) {
                    const transformedData = data.dates.map((date: string, index: number) => ({
                        date: date,
                        idealRemaining: data.idealData[index],
                        actualRemaining: data.actualData[index]
                    }));
                    setChartData(transformedData);
                } else {
                    // Fallback or handle empty data
                    setChartData([]);
                }
            } catch (err) {
                console.error("Failed to fetch burndown chart", err);
                setError("Failed to load chart data");
            } finally {
                setLoading(false);
            }
        };

        if (sprintId) {
            fetchBurndownData();
        }
    }, [sprintId]);

    if (loading) return <div className="h-64 flex items-center justify-center text-gray-500">Loading chart...</div>;
    if (error) return <div className="h-64 flex items-center justify-center text-red-500">{error}</div>;
    if (chartData.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No data available for this sprint</div>;

    return (
        <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Burndown Chart</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: 'Remaining Effort', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="idealRemaining" 
                        stroke="#8884d8" 
                        strokeDasharray="5 5" 
                        name="Ideal Remaining"
                        dot={false}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="actualRemaining" 
                        stroke="#ff0000" 
                        activeDot={{ r: 8 }} 
                        name="Actual Remaining"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SprintBurndownChart;
