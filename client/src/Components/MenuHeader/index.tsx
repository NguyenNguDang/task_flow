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

type ModalType = "MENU" | "ADD_PEOPLE" | null;

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
    }
    const closeModal = () => setActiveModal(null);

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
            toast("Add people success!");
            setEmail("");
            closeModal();
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setIsLoading(false);
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
            } catch (error) {
                console.error("API Error:", error);
                toast.error("Có lỗi xảy ra!");
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
                        icon={<MdDashboard />}
                        active={location.pathname.includes('dashboard')}
                        onClick={() => handleNavigate(`dashboard`)}
                        className="w-full mb-2 justify-start"
                    >
                        Overview
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
            </div>

            {activeModal == "MENU" && (<Modal className={"max-w-[300px] mx-auto !p-0"}
                               coords={{ top: 50, left: 490}}
                               onClose={closeModal}>
                <div className={`py-5`}>
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
        </div>
    );
};

export default MenuHeader;
