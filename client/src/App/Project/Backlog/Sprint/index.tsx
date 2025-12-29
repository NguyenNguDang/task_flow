import React, {useState} from 'react';
import {SprintType, Task} from "../../../../types";
import { TaskItem } from "../TaskItem";

type SprintProps = {
    title: string;
    tasks: Task[];
    sprintId: number;
    allSprints: SprintType[];
    renderPriority: (priority: string) => React.ReactNode;
    status: string;
    isAnySprintActive: boolean;
    onStartSprint?: (id: number) => void;
    onCompleteSprint?: (id: number, targetId: number | null) => void;
};

export const Sprint = ({ title, tasks, sprintId, allSprints, renderPriority, status, isAnySprintActive, onStartSprint, onCompleteSprint }: SprintProps) => {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [targetSprintInfo, setTargetSprintInfo] = useState<{ id: number | null, name: string }>({ id: null, name: 'Backlog' });

    const isCurrentSprintActive = status?.toLowerCase() === 'active';
    const unfinishedTasksCount = tasks.filter(t => t.status !== 'done').length;

    const calculateTargetSprint = () => {
        // Tìm các sprint ở trạng thái Future/Planning (không phải sprint hiện tại, không phải đã đóng)
        const futureSprints = allSprints.filter(s =>
            s.id !== sprintId &&
            s.status !== 'completed' &&
            s.status !== 'active'
        );

        // Lấy thằng đầu tiên trong danh sách (Giả sử list đã sort theo thứ tự tạo)
        if (futureSprints.length > 0) {
            return { id: futureSprints[0].id, name: futureSprints[0].name };
        }

        // Không có thì về Backlog
        return { id: null, name: 'Backlog' };
    };

    const handleCompleteClick = () => {
        if (!onCompleteSprint) return;

        // Nếu KHÔNG CÓ task thừa -> Hoàn thành luôn, không cần hỏi
        if (unfinishedTasksCount === 0) {
            onCompleteSprint(sprintId, null);
            return;
        }

        // Nếu CÓ task thừa -> Tính toán đích đến & Mở modal xác nhận
        const target = calculateTargetSprint();
        setTargetSprintInfo(target);
        setIsConfirmOpen(true);
    };

    const handleConfirmComplete = () => {
        if (onCompleteSprint) {
            onCompleteSprint(sprintId, targetSprintInfo.id);
        }
        setIsConfirmOpen(false);
    };

    const renderActionButton = () => {
        if (isCurrentSprintActive) {
            // Case 1: Sprint is Active -> Can be Complete
            return (
                <button
                    onClick={handleCompleteClick}
                    className="px-3 py-1 bg-[#ebecf0] hover:bg-gray-300 rounded text-[#42526e] font-medium transition-colors text-xs"
                >
                    Complete sprint
                </button>
            );
        } else {
            // Case 2: Sprint is not Active
            return (
                <button
                    onClick={() => {
                        if (!isAnySprintActive && onStartSprint) {
                            onStartSprint(sprintId);
                        }
                    }}
                    disabled={isAnySprintActive} // Disable nếu có sprint khác đang active
                    className={`px-3 py-1 rounded font-medium transition-colors text-xs
                        ${isAnySprintActive
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-[#ebecf0] hover:bg-gray-300 text-[#42526e]" 
                    }
                    `}
                    title={isAnySprintActive ? "A sprint is already active" : "Start this sprint"}
                >
                    Start sprint
                </button>
            );
        }
    };

    return (
        <div className="mb-8">
            {/* --- HEADER --- */}
            <div className="flex justify-between items-center bg-[#f4f5f7] px-4 py-3 rounded-t-md text-sm">
                <div className="font-bold text-[#42526e]">
                    {title}
                    <span className="font-normal text-gray-500 ml-2">
                        ({tasks.length} tasks)
                    </span>
                </div>
                <div className="flex gap-2">
                    {renderActionButton()}
                </div>
            </div>

            {/* --- BODY --- */}
            <div className="border border-t-0 border-gray-200 rounded-b-md min-h-[50px] p-1 bg-white">
                {/* 1. Render danh sách Task */}
                {tasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        renderPriority={renderPriority}
                    />
                ))}

                {/* 2. Hiển thị khi Sprint rỗng (Optional - giúp UI đẹp hơn) */}
                {tasks.length === 0 && (
                    <div className="text-center text-gray-400 text-xs py-4 italic">
                        No tasks in this sprint
                    </div>
                )}

                {/* 3. Drop Zone (Vùng thả task) */}
                <div className="border-2 border-dashed border-transparent hover:border-gray-300 rounded p-2 text-center text-transparent hover:text-gray-400 text-sm transition-all cursor-pointer">
                    + Drop tasks here  {/* Sửa text thành tasks */}
                </div>
            </div>

            {/* --- MODAL CONFIRM (Được thêm mới) --- */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-md shadow-lg w-[400px] p-6 animate-fade-in">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Complete Sprint: {title}</h3>

                        <div className="text-sm text-gray-600 mb-6 space-y-3">
                            <p>
                                Sprint này còn <span className="font-bold text-red-600">{unfinishedTasksCount}</span> task chưa hoàn thành.
                            </p>
                            <div className="bg-blue-50 p-3 rounded border border-blue-100 text-blue-800">
                                <p className="mb-1 text-xs uppercase font-bold text-blue-600">Hệ thống sẽ tự động chuyển đến:</p>
                                <p className="font-medium text-lg">👉 {targetSprintInfo.name}</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmComplete}
                                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
                            >
                                Confirm Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};