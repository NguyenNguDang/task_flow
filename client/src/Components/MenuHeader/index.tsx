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
import { FaUsers } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { BsFileBarGraph } from "react-icons/bs";

type ModalType = "MENU" | "ADD_PEOPLE" | "USERS" | null;

interface UserSummary {
    id: number;
    username: string;
    fullName: string;
    avatarUrl: string;
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

    useEffect(() => {
        const fetchProjectData = async () => {
            if (projectId) {
                try {
                    const res = await axiosClient.get(`/projects`);
                    const projects = (res as any).content || [];
                    const currentProject = projects.find((p: any) => String(p.id) === projectId);

                    if (currentProject) {
                        setProjectName(currentProject.name);
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

    return (
        <div className="mx-4 pt-4 pl-4 border-b border-gray-300">
            <div>
                <p className={`flex justify-start items-center gap-4 font-bold uppercase`}>{projectName} <span onClick={() => {openModal("MENU")}} className={`rounded cursor-pointer hover:bg-gray-100`}><AiOutlineEllipsis size={40} /></span></p>
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
                    <p onClick={() => handleNavigate(`dashboard`)} className={`w-full flex items-center gap-2 cursor-pointer hover:bg-gray-100 py-2 px-4`}><MdDashboard />Overview</p>
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
                                                <p className="text-sm font-medium text-gray-900">{member.fullName}</p>
                                                <p className="text-xs text-gray-500">{member.username}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                            title="Remove member"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </Modal>)}
        </div>
    );
};

export default MenuHeader;
