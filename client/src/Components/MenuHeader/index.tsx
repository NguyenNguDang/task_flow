import {Button} from "../Button.tsx";
import {Kanban} from "../../App/Sidebar/Icons";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import { AiOutlineEllipsis } from "react-icons/ai";
import {useEffect, useState} from "react";
import {Modal} from "../Modal.tsx";
import { FaRegUser } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import axiosClient from "../../api";
import {toast} from "react-toastify";
import { MdDashboard } from "react-icons/md";
import { FaUsers, FaBell } from "react-icons/fa";
import { FaTrash, FaExchangeAlt } from "react-icons/fa";
import { BsFileBarGraph } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

type ModalType = "MENU" | "ADD_PEOPLE" | "USERS" | "NOTIFICATIONS" | null;

interface UserSummary {
    id: number;
    username: string;
    fullName: string;
    avatarUrl: string;
}

interface Notification {
    id: number;
    content: string;
    isRead: boolean;
    type: string;
    referenceLink: string;
    createdAt: string;
}

const MenuHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const projectId = params.projectId;
    const [boardId, setBoardId] = useState<string | undefined>(params.boardId);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [projectName, setProjectName] = useState("MY SCUM PROJECT");
    const [projectMembers, setProjectMembers] = useState<UserSummary[]>([]);
    const [projectOwnerId, setProjectOwnerId] = useState<number | null>(null);
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (projectId) {
                try {
                    const res = await axiosClient.get(`/projects`);
                    const projects = (res as any).content || [];
                    const currentProject = projects.find((p: any) => String(p.id) === projectId);

                    if (currentProject) {
                        setProjectName(currentProject.name);
                        setProjectOwnerId(currentProject.owner?.id);
                        if (!boardId && currentProject.boards && currentProject.boards.length > 0) {
                            setBoardId(currentProject.boards[0].id);
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch project data", e);
                }
            }
        };

        fetchProjectData();
    }, [projectId, boardId]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await axiosClient.get("/notifications");
            const notifs = res as unknown as Notification[];
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleNavigate = (path: string) => {
        if (projectId) {
            navigate(`/project/${projectId}/${path}`);
        }
    };

    const openModal = (type: ModalType) => {
        setActiveModal(type);
        if (type === "USERS") {
            fetchProjectMembers();
        }
        if (type === "NOTIFICATIONS") {
            fetchNotifications();
        }
    }
    const closeModal = () => setActiveModal(null);

    const fetchProjectMembers = async () => {
        if (!projectId) return;
        try {
            const res = await axiosClient.get(`/projects/${projectId}/members`);
            setProjectMembers(res as any);
        } catch (error) {
            console.error("Failed to fetch members", error);
            toast.error("Failed to load members");
        }
    };

    const handleAddPeople = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        const payload = {
            projectId: Number(projectId),
            email: email
        };
        try {
            await axiosClient.post("/projects-member/add", payload );
            toast.success("Add people success!");
            setEmail("");
            if (activeModal === "USERS") {
                fetchProjectMembers(); // Refresh list if in Users modal
            } else {
                closeModal();
            }
        } catch (error: any) {
            console.error("API Error:", error);
            toast.error(error.response?.data?.message || "Failed to add member");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = async (userId: number) => {
        if (!window.confirm("Are you sure you want to remove this member?")) return;

        try {
            await axiosClient.delete(`/projects-member/remove/${projectId}/${userId}`);
            toast.success("Member removed successfully");
            fetchProjectMembers(); // Refresh list
        } catch (error: any) {
            console.error("Failed to remove member", error);
            toast.error(error.response?.data?.message || "Failed to remove member");
        }
    };

    const handleTransferOwnership = async (newOwnerId: number) => {
        if (!window.confirm("Are you sure you want to transfer ownership to this member? You will lose owner privileges.")) return;

        try {
            await axiosClient.post(`/projects-member/transfer-owner`, {
                projectId: Number(projectId),
                newOwnerId: newOwnerId
            });
            toast.success("Ownership transferred successfully");
            setProjectOwnerId(newOwnerId); // Update local state
            fetchProjectMembers(); // Refresh list
        } catch (error: any) {
            console.error("Failed to transfer ownership", error);
            toast.error(error.response?.data?.message || "Failed to transfer ownership");
        }
    };

    const handleLeaveProject = async () => {
        if (window.confirm("Bạn có chắc chắn muốn rời khỏi dự án này không?")) {
            setIsLoading(true);
            try {
                await axiosClient.post("/projects-member/leave", {
                    projectId: Number(projectId)
                });
                toast.success("Rời dự án thành công!");
                navigate("/projects");
            } catch (error: any) {
                console.error("API Error:", error);
                toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
            } finally {
                setIsLoading(false);
                closeModal();
            }
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await axiosClient.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const isOwner = user?.id === projectOwnerId;
    // Check if current user is a member (not owner)
    const isMember = !isOwner && projectMembers.some(m => m.id === user?.id);

    return (
        <div className="mx-4 pt-4 pl-4 border-b border-gray-300">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 via-blue-800 to-slate-800 drop-shadow-sm">
                        {projectName}
                    </h1>
                    <span 
                        onClick={() => {openModal("MENU")}} 
                        className="rounded-full p-1 cursor-pointer hover:bg-gray-100 text-gray-500 transition-all hover:text-blue-600 mt-1"
                    >
                        <AiOutlineEllipsis size={28} />
                    </span>
                </div>
                
                {/* Notification Bell */}
                <div className="relative mr-4">
                    <button 
                        onClick={() => openModal("NOTIFICATIONS")}
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative"
                    >
                        <FaBell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
            <div className="flex justify-start items-center gap-3 py-4">
                <div>
                    <Button
                        icon={<BsFileBarGraph />}
                        active={location.pathname.includes('summary')}
                        onClick={() => handleNavigate(`summary`)}
                        className={`w-full mb-2 justify-start`}
                    >
                        Summary
                    </Button>
                </div>
                <div>
                    <Button
                        icon={<Kanban />}
                        active={location.pathname.includes('backlog')}
                        onClick={() => boardId && handleNavigate(`backlog/${boardId}`)}
                        className={`w-full mb-2 justify-start ${!boardId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!boardId}
                    >
                        Backlog
                    </Button>
                </div>
                <div>
                    <Button
                        icon={<Kanban />}
                        active={location.pathname.includes('board')}
                        onClick={() => boardId && handleNavigate(`board/${boardId}`)}
                        className={`w-full mb-2 justify-start ${!boardId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!boardId}
                    >
                        Board
                    </Button>
                </div>
                <div>
                    <Button
                        icon={<HiOutlineDocumentReport />}
                        active={location.pathname.includes('reports')}
                        onClick={() => boardId && handleNavigate(`reports/${boardId}`)}
                        className={`w-full mb-2 justify-start ${!boardId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!boardId}
                    >
                        Reports
                    </Button>
                </div>
                <div>
                    <Button
                        icon={<FaUsers />}
                        active={activeModal === "USERS"}
                        onClick={() => openModal("USERS")}
                        className="w-full mb-2 justify-start"
                    >
                        Users
                    </Button>
                </div>
            </div>

            {activeModal == "MENU" && (<Modal className={"max-w-[300px] mx-auto !p-0"}
                               coords={{ top: 50, left: 490}}
                               onClose={closeModal}>
                <div className={`py-5`}>
                    <p onClick={() => handleNavigate(`summary`)} className={`w-full flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-4`}><MdDashboard />Summary</p>
                    <p onClick={() => {openModal("ADD_PEOPLE")}} className={`w-full flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-4`}><FaRegUser />Add people</p>
                    <p onClick={handleLeaveProject} className={`w-full flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-4`}><CiLogout />Leave project</p>
                </div>
            </Modal>)}

            { activeModal == "ADD_PEOPLE" && (<Modal className={"max-w-[50%] mx-auto"}
                               coords={{ top: 50, left: 0, right: 0}}
                               onClose={closeModal}>
                <div className={``}>
                    <form  onSubmit={handleAddPeople} className={`flex flex-col gap-2`} action="">
                        <label  className="font-semibold text-sm" htmlFor="">Email</label>
                        <input  className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                placeholder={"email"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email" name="" id=""/>
                        <div className="flex justify-end mt-6 gap-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                type={"submit"}
                                disabled={isLoading}
                            >
                                {isLoading ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>)}

            { activeModal == "USERS" && (<Modal className={"max-w-[600px] mx-auto"}
                               coords={{ top: 50, left: 0, right: 0}}
                               onClose={closeModal}>
                <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">Project Members</h2>
                    
                    {/* Add Member Form inside Users Modal */}
                    {(isOwner || isMember) && (
                        <form onSubmit={handleAddPeople} className="flex gap-2 mb-6">
                            <input
                                className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Invite by email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                            />
                            <button
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Adding..." : "Add"}
                            </button>
                        </form>
                    )}

                    {/* Members List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {projectMembers.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No members found.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {projectMembers.map((member) => (
                                    <li key={member.id} className="flex items-center justify-between py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {member.avatarUrl ? (
                                                    <img src={member.avatarUrl} alt={member.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-500">{member.fullName?.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {member.fullName} 
                                                    {member.id === projectOwnerId && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Owner</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">{member.username}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {isOwner && member.id !== projectOwnerId && (
                                                <>
                                                    <button
                                                        onClick={() => handleTransferOwnership(member.id)}
                                                        className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                                        title="Transfer Ownership"
                                                    >
                                                        <FaExchangeAlt size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Remove member"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </Modal>)}

            {/* Notifications Modal */}
            {activeModal === "NOTIFICATIONS" && (
                <Modal
                    className="max-w-[400px] absolute right-4 top-16 !p-0"
                    coords={{ top: 60, right: 20 }}
                    onClose={closeModal}
                    zIndex={9999}
                >
                    <div className="flex flex-col max-h-[500px]">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-bold text-lg">Notifications</h3>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No notifications yet
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {notifications.map((notif) => (
                                        <li 
                                            key={notif.id} 
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50' : ''}`}
                                            onClick={() => {
                                                if (!notif.isRead) handleMarkAsRead(notif.id);
                                                // Optional: Navigate to reference link
                                                // if (notif.referenceLink) navigate(notif.referenceLink);
                                            }}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500" style={{ opacity: notif.isRead ? 0 : 1 }}></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-800">{notif.content}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(notif.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MenuHeader;
