import {useEffect, useState, useRef} from 'react';
import {Modal} from "../../../Components/Modal.tsx";
import {CiSquareMore, CiSquarePlus} from "react-icons/ci";
import axiosClient from "../../../api";
import {useParams} from "react-router-dom";
import { taskService } from "../../../services/task.service";
import TaskComments from './TaskComments';
import { Comment } from '../../../types';
import { FaTrash, FaUserCircle, FaCheck } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';

interface UserInfo {
    id: number;
    fullName: string;
    avatarUrl: string | null;
}

interface SprintInfo {
    id: number;
    name: string;
}

interface SubtaskInfo {
    id: number;
    title: string;
    completed: boolean;
}

interface TaskDetailType {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    startDate: string | null;
    dueDate: string | null;
    assignee: UserInfo | null;
    reporter: UserInfo | null;
    sprint: SprintInfo | null;
    subtasks: SubtaskInfo[];
    comments: Comment[];
    estimateHours?: number;
}

interface HistoryInfo {
    id: number;
    userName: string;
    userAvatar: string | null;
    field: string;
    oldValue: string;
    newValue: string;
    createdAt: string;
}

const TaskDetailModal = ({ taskId, onClose, onTaskUpdate }: { taskId: number, onClose: () => void, onTaskUpdate?: () => void }) => {
    const [taskDetail, setTaskDetail] = useState<TaskDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
    const [isAddingSubtask, setIsAddingSubtask] = useState(false);
    const [subtaskTitle, setSubtaskTitle] = useState("");
    const { projectId } = useParams();
    
    // Activity Tabs
    const [activeTab, setActiveTab] = useState<'All' | 'Comments' | 'History'>('All');
    const [history, setHistory] = useState<HistoryInfo[]>([]);
    
    // Assignee Dropdown State
    const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const assigneeButtonRef = useRef<HTMLDivElement>(null);
    const assigneeMenuRef = useRef<HTMLDivElement>(null);

    // Task Options Menu State
    const [showTaskMenu, setShowTaskMenu] = useState(false);
    const [taskMenuPosition, setTaskMenuPosition] = useState({ top: 0, left: 0 });
    const taskMenuButtonRef = useRef<HTMLButtonElement>(null);
    const taskMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosClient.get(`/projects/${projectId}/members`) as UserInfo[];
                setAllUsers(res);
            } catch (e) { console.error("Lỗi tải users", e); }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        setTaskDetail(null);
        setLoading(true);

        const fetchDetail = async () => {
            try {
                const data = await axiosClient.get(`/tasks/${taskId}`) as TaskDetailType;
                setTaskDetail(data);
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (taskId !== null && taskId !== undefined) {
            fetchDetail();
        }
    }, [taskId]);

    // Fetch history when tab changes or task loads
    useEffect(() => {
        if (activeTab === 'History' || activeTab === 'All') {
            fetchHistory();
        }
    }, [activeTab, taskId]);

    const fetchHistory = async () => {
        try {
            const res = await axiosClient.get(`/tasks/${taskId}/history`) as HistoryInfo[];
            setHistory(res);
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };

    // Handle click outside for assignee menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (assigneeMenuRef.current && !assigneeMenuRef.current.contains(event.target as Node) &&
                assigneeButtonRef.current && !assigneeButtonRef.current.contains(event.target as Node)) {
                setShowAssigneeMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle click outside for task menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (taskMenuRef.current && !taskMenuRef.current.contains(event.target as Node) &&
                taskMenuButtonRef.current && !taskMenuButtonRef.current.contains(event.target as Node)) {
                setShowTaskMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUpdateTask = async (field: string, value: any) => {
        setTaskDetail(prev => prev ? { ...prev, [field]: value } : null);

        try {
            await taskService.update(String(taskId), { [field]: value });
            onTaskUpdate?.();
            // Refresh history if we are viewing it
            if (activeTab === 'History' || activeTab === 'All') {
                fetchHistory();
            }
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
        }
    };

    const handleChangePriority = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPriority = e.target.value;
        handleUpdateTask('priority', newPriority);
    };

    const getPriorityColor = (p: string) => {
        switch(p?.toUpperCase()) {
            case 'HIGH': return 'text-red-600';
            case 'MEDIUM': return 'text-blue-600';
            case 'LOW': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    const handleAssigneeClick = () => {
        if (assigneeButtonRef.current) {
            const rect = assigneeButtonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX
            });
            setShowAssigneeMenu(!showAssigneeMenu);
        }
    };

    const handleTaskMenuClick = () => {
        if (taskMenuButtonRef.current) {
            const rect = taskMenuButtonRef.current.getBoundingClientRect();
            setTaskMenuPosition({
                top: rect.bottom + window.scrollY + 5,
                left: rect.left + window.scrollX
            });
            setShowTaskMenu(!showTaskMenu);
        }
    };

    const handleSelectAssignee = async (user: UserInfo) => {
        setTaskDetail(prev => prev ? { ...prev, assignee: user } : null);
        setShowAssigneeMenu(false);

        try {
            await taskService.assignUser(taskId, user.id);
            onTaskUpdate?.();
            if (activeTab === 'History' || activeTab === 'All') fetchHistory();
        } catch (error) {
            console.error("Lỗi assign:", error);
        }
    };

    const handleStoryPointsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const points = Number(e.target.value);
        setTaskDetail(prev => prev ? { ...prev, estimateHours: points } : null);
    };

    const handleStoryPointsBlur = async () => {
        if (taskDetail?.estimateHours !== undefined) {
            try {
                await taskService.updateStoryPoints(taskId, taskDetail.estimateHours);
                onTaskUpdate?.();
                if (activeTab === 'History' || activeTab === 'All') fetchHistory();
            } catch (error) {
                console.error("Failed to update story points", error);
            }
        }
    };

    const handleAddSubtask = async () => {
        if (!subtaskTitle.trim()) {
            setIsAddingSubtask(false);
            return;
        }

        try {
            const response = await taskService.createSubtask(taskId, subtaskTitle);
            const newSubtask: SubtaskInfo = (response as any).data || {
                id: Date.now(), 
                title: subtaskTitle,
                completed: false
            };

            setTaskDetail(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    subtasks: [...(prev.subtasks || []), newSubtask]
                };
            });
            
            setSubtaskTitle("");
            setIsAddingSubtask(false);
            onTaskUpdate?.();

        } catch (error) {
            console.error("Failed to create subtask", error);
        }
    };

    const handleToggleSubtask = async (subtaskId: number) => {
        setTaskDetail(prev => {
            if (!prev) return null;
            return {
                ...prev,
                subtasks: prev.subtasks.map(s => 
                    s.id === subtaskId ? { ...s, completed: !s.completed } : s
                )
            };
        });

        try {
            await taskService.toggleSubtask(taskId, subtaskId);
            onTaskUpdate?.();
        } catch (error) {
            console.error("Failed to toggle subtask", error);
        }
    };

    const handleDeleteSubtask = async (subtaskId: number) => {
        if (!window.confirm("Are you sure you want to delete this subtask?")) return;

        setTaskDetail(prev => {
            if (!prev) return null;
            return {
                ...prev,
                subtasks: prev.subtasks.filter(s => s.id !== subtaskId)
            };
        });

        try {
            await taskService.deleteSubtask(taskId, subtaskId);
            onTaskUpdate?.();
        } catch (error) {
            console.error("Failed to delete subtask", error);
        }
    };

    const handleDeleteTask = async () => {
        if (!window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) return;

        try {
            await taskService.delete(taskId);
            toast.success("Task deleted successfully");
            onClose(); 
            onTaskUpdate?.(); 
        } catch (error) {
            console.error("Failed to delete task", error);
            toast.error("Failed to delete task");
        }
    };

    const calculateProgress = () => {
        if (!taskDetail?.subtasks || taskDetail.subtasks.length === 0) return 0;
        const completedCount = taskDetail.subtasks.filter(s => s.completed).length;
        return Math.round((completedCount / taskDetail.subtasks.length) * 100);
    };

    const handleMarkAsDone = async () => {
        if (!taskDetail) return;
        setTaskDetail(prev => prev ? { ...prev, status: 'DONE' } : null);
        
        try {
            await taskService.update(String(taskId), { status: 'DONE' });
            onTaskUpdate?.();
            if (activeTab === 'History' || activeTab === 'All') fetchHistory();
        } catch (error) {
            console.error("Failed to mark as done", error);
            setTaskDetail(prev => prev ? { ...prev, status: taskDetail.status } : null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderHistoryItem = (item: HistoryInfo) => (
        <div key={item.id} className="flex gap-3 mb-4 text-sm">
            <img 
                src={item.userAvatar || "https://via.placeholder.com/32"} 
                alt={item.userName} 
                className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.userName}</span>
                    <span className="text-gray-500 text-xs">
                        {formatDate(item.createdAt)}
                    </span>
                </div>
                <div className="text-gray-700 mt-1">
                    Changed <span className="font-medium">{item.field}</span> from 
                    <span className="line-through mx-1 text-gray-500">{item.oldValue || "empty"}</span> 
                    to <span className="font-medium">{item.newValue}</span>
                </div>
            </div>
        </div>
    );

    if (loading) return <Modal onClose={onClose}><div>Loading...</div></Modal>;
    if (!taskDetail) return <Modal onClose={onClose}><div>Không tìm thấy dữ liệu task!</div></Modal>;
    
    const isDone = taskDetail.status === 'DONE';

    return (
        <Modal onClose={onClose}>
            <div className="grid grid-cols-3 gap-4"> 

                {/* --- CỘT TRÁI (Nội dung chính) --- */}
                <div className="col-span-2 space-y-4">
                    
                    {/* Header with Mark as Done */}
                    <div className="flex items-center gap-3 mb-2">
                        <button 
                            onClick={handleMarkAsDone}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                isDone 
                                ? 'bg-green-100 text-green-700 cursor-default' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            disabled={isDone}
                        >
                            {isDone ? (
                                <>
                                    <FaCheck size={12} />
                                    <span>Done</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-500 rounded-sm"></div>
                                    <span>Mark as Done</span>
                                </>
                            )}
                        </button>
                        <span className="text-xs text-gray-500">#{taskId}</span>
                    </div>

                    {/* Title */}
                    <input
                        className={`text-2xl font-bold w-full border-none focus:ring-0 ${isDone ? 'line-through text-gray-500' : ''}`}
                        defaultValue={taskDetail.title}
                        type="text"
                        onBlur={(e) => handleUpdateTask('title', e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button><CiSquarePlus size={30} color="gray" /></button>
                        <button 
                            ref={taskMenuButtonRef}
                            onClick={handleTaskMenuClick}
                        >
                            <CiSquareMore size={30} color="gray" />
                        </button>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-semibold mb-1">Description</h4>
                        <textarea
                            className="w-full border border-gray-300 rounded p-2 text-sm min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            defaultValue={taskDetail.description}
                            onBlur={(e) => handleUpdateTask('description', e.target.value)}
                            placeholder="Add a description..."
                        />
                    </div>

                    {/* Subtasks (List) */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold">Subtasks</h4>
                            {taskDetail.subtasks?.length > 0 && (
                                <div className="flex items-center gap-2 w-1/3">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                            style={{ width: `${calculateProgress()}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500">{calculateProgress()}%</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            {taskDetail.subtasks?.length > 0 ? (
                                taskDetail.subtasks.map(sub => (
                                    <div key={sub.id} className="flex items-center gap-2 group hover:bg-gray-50 p-1 rounded">
                                        <input 
                                            type="checkbox" 
                                            checked={sub.completed} 
                                            onChange={() => handleToggleSubtask(sub.id)}
                                            className="cursor-pointer"
                                        />
                                        <span className={`flex-grow ${sub.completed ? "line-through text-gray-500" : ""}`}>
                                            {sub.title}
                                        </span>
                                        <button 
                                            onClick={() => handleDeleteSubtask(sub.id)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete subtask"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                !isAddingSubtask && <p className="text-sm text-gray-400">No subtasks</p>
                            )}
                        </div>
                        
                        {isAddingSubtask ? (
                            <div className="mt-2 flex flex-col gap-2">
                                <input
                                    type="text"
                                    className="border rounded px-2 py-1 text-sm w-full"
                                    placeholder="What needs to be done?"
                                    autoFocus
                                    value={subtaskTitle}
                                    onChange={(e) => setSubtaskTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleAddSubtask();
                                        } else if (e.key === 'Escape') {
                                            setIsAddingSubtask(false);
                                            setSubtaskTitle("");
                                        }
                                    }}
                                />
                                <div className="flex gap-2">
                                    <button 
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                        onClick={handleAddSubtask}
                                    >
                                        Add
                                    </button>
                                    <button 
                                        className="text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-100"
                                        onClick={() => {
                                            setIsAddingSubtask(false);
                                            setSubtaskTitle("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                className="text-blue-600 text-sm mt-2 hover:underline"
                                onClick={() => setIsAddingSubtask(true)}
                            >
                                + Add a subtask
                            </button>
                        )}
                    </div>

                    {/* Activity / Comments */}
                    <div>
                        <h4 className="font-semibold mb-2">Activity</h4>
                        <div className="flex gap-2 mb-4 border-b">
                            {['All', 'Comments', 'History'].map(tab => (
                                <button 
                                    key={tab} 
                                    className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                                        activeTab === tab 
                                        ? 'border-blue-600 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => setActiveTab(tab as any)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {activeTab === 'Comments' && (
                                <TaskComments taskId={taskId} initialComments={taskDetail.comments} />
                            )}
                            
                            {activeTab === 'History' && (
                                <div className="space-y-4">
                                    {history.length > 0 ? history.map(renderHistoryItem) : <p className="text-gray-500 text-sm">No history yet.</p>}
                                </div>
                            )}

                            {activeTab === 'All' && (
                                <div className="space-y-6">
                                    {(() => {
                                        const combined = [
                                            ...history.map(h => ({ ...h, type: 'history', date: new Date(h.createdAt) })),
                                            ...(taskDetail.comments || []).map(c => ({ ...c, type: 'comment', date: new Date(c.createdAt) }))
                                        ].sort((a, b) => b.date.getTime() - a.date.getTime());

                                        if (combined.length === 0) return <p className="text-gray-500 text-sm">No activity yet.</p>;

                                        return combined.map((item: any) => {
                                            if (item.type === 'history') return renderHistoryItem(item);
                                            return (
                                                <div key={`comment-${item.id}`} className="flex gap-3 mb-4 text-sm">
                                                     <img 
                                                        src={item.userAvatar || "https://via.placeholder.com/32"} 
                                                        alt={item.userName} 
                                                        className="w-8 h-8 rounded-full flex-shrink-0"
                                                    />
                                                    <div className="flex-grow">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">{item.userName}</span>
                                                            <span className="text-gray-500 text-xs">
                                                                {formatDate(item.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 text-gray-800 bg-gray-50 p-2 rounded">
                                                            {item.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })()}
                                    
                                    <div className="mt-4 pt-4 border-t">
                                         <TaskComments taskId={taskId} initialComments={[]} hideList={true} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI (Thông tin chi tiết) --- */}
                <div>
                    <h3 className="font-bold text-gray-500 text-xs uppercase mb-3">Details</h3>
                    <div className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
                        
                        {/* Status */}
                        <div className="text-gray-500">Status</div>
                        <div className="uppercase font-semibold text-xs px-2 py-1 bg-gray-100 rounded w-fit">
                            {taskDetail.status}
                        </div>

                        {/* Assignee */}
                        <div className="text-gray-500">Assignee</div>
                        <div 
                            ref={assigneeButtonRef}
                            className="flex items-center gap-2 group hover:bg-gray-100 p-1 rounded cursor-pointer -ml-1 transition-colors relative"
                            onClick={handleAssigneeClick}
                        >
                            <img
                                src={taskDetail.assignee?.avatarUrl || "https://via.placeholder.com/24"}
                                className="w-6 h-6 rounded-full border border-gray-300"
                                alt="avatar"
                            />
                            <span className="text-sm text-gray-800">
                                {taskDetail.assignee?.fullName || "Unassigned"}
                            </span>
                        </div>

                        {/* Priority */}
                        <div className="text-gray-500">Priority</div>
                        <div>
                            <select
                                value={taskDetail.priority?.toUpperCase() || "MEDIUM"}
                                onChange={handleChangePriority}
                                className={`font-medium bg-transparent border-none cursor-pointer focus:ring-0 p-0 ${getPriorityColor(taskDetail.priority)}`}
                            >
                                <option value="HIGH" className="text-red-600">HIGH</option>
                                <option value="MEDIUM" className="text-blue-600">MEDIUM</option>
                                <option value="LOW" className="text-green-600">LOW</option>
                            </select>
                        </div>

                        {/* Story Points */}
                        <div className="text-gray-500">Story Points</div>
                        <div>
                            <input
                                type="number"
                                className="bg-transparent border border-transparent hover:border-gray-300 rounded px-2 py-1 w-20 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                value={taskDetail.estimateHours || ''}
                                onChange={handleStoryPointsChange}
                                onBlur={handleStoryPointsBlur}
                                placeholder="Points"
                            />
                        </div>

                        {/* Dates */}
                        <div className="text-gray-500">Start date</div>
                        <div>
                            <input 
                                type="date" 
                                className="bg-transparent border border-transparent hover:border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                value={taskDetail.startDate ? taskDetail.startDate.split('T')[0] : ''}
                                onChange={(e) => handleUpdateTask('startDate', e.target.value)}
                            />
                        </div>

                        {/* Due Date */}
                        <div className="text-gray-500">Due date</div>
                        <div>
                            <input 
                                type="date" 
                                className="bg-transparent border border-transparent hover:border-gray-300 rounded px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                value={taskDetail.dueDate ? taskDetail.dueDate.split('T')[0] : ''}
                                onChange={(e) => handleUpdateTask('dueDate', e.target.value)}
                            />
                        </div>

                        {/* Sprint */}
                        <div className="text-gray-500">Sprint</div>
                        <div className="text-blue-600 cursor-pointer hover:underline">
                            {taskDetail.sprint?.name || "No Sprint"}
                        </div>

                        {/* Reporter */}
                        <div className="text-gray-500">Reporter</div>
                        <div className="flex items-center gap-2">
                            <img
                                src={taskDetail.reporter?.avatarUrl || "https://via.placeholder.com/24"}
                                className="w-6 h-6 rounded-full"
                            />
                            <span>{taskDetail.reporter?.fullName || "Unknown"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assignee Dropdown Portal */}
            {showAssigneeMenu && createPortal(
                <div 
                    ref={assigneeMenuRef}
                    style={{ 
                        top: menuPosition.top, 
                        left: menuPosition.left,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-xl rounded-md border border-gray-200 w-48 max-h-60 overflow-y-auto animate-in fade-in zoom-in duration-200"
                >
                    <div className="p-2 text-xs font-bold text-gray-500 border-b bg-gray-50 sticky top-0">Assign to...</div>
                    {allUsers.map(user => (
                        <div
                            key={user.id}
                            className="flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors"
                            onClick={() => handleSelectAssignee(user)}
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.fullName} className="w-6 h-6 rounded-full border border-gray-200" />
                            ) : (
                                <FaUserCircle size={24} className="text-gray-400" />
                            )}
                            <span className="truncate">{user.fullName}</span>
                        </div>
                    ))}
                </div>,
                document.body
            )}

            {/* Task Options Menu Portal */}
            {showTaskMenu && createPortal(
                <div 
                    ref={taskMenuRef}
                    style={{ 
                        top: taskMenuPosition.top, 
                        left: taskMenuPosition.left,
                        position: 'absolute',
                        zIndex: 9999 
                    }}
                    className="bg-white shadow-xl rounded-md border border-gray-200 w-40 py-1 animate-in fade-in zoom-in duration-200"
                >
                    <button 
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                            setShowTaskMenu(false);
                            handleDeleteTask();
                        }}
                    >
                        <FaTrash size={12} /> Delete Task
                    </button>
                </div>,
                document.body
            )}
        </Modal>
    );
};

export default TaskDetailModal;
