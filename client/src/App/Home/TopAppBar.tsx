import { useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import { FaUserCircle } from "react-icons/fa";
import {useState} from "react";
import {Modal} from "../../Components/Modal.tsx";

const TopAppBar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const { isAuthenticated, user } = useAuth();
    return (
        <>
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200/50 bg-background-light/80 px-4 mx-4 backdrop-blur-sm dark:border-gray-800/50 dark:bg-background-dark/80">
                <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        view_kanban
                      </span>
                    <h2 className="text-xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
                        SpringBoard
                    </h2>
                </div>
                <div className="cursor-pointer flex items-center gap-2 text-xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
                    {isAuthenticated ? <p className='flex gap-2 items-center justify-center ' onClick={() => setIsOpen(true)}><FaUserCircle color='#0D69F2' size="30px"/>{user?.name}</p>
                        : <button onClick={() => navigate("/login")}>Login</button>}
                </div>

                {isOpen && (
                    <Modal className={"max-w-[400px]"} coords={{ top: 50, right: 0 }} onClose={() => setIsOpen(false)}>
                        <div className="flex flex-col items-start gap-2">
                            <h2 className="font-bold">{user?.email}</h2>
                            <p className="cursor-pointer" onClick={() => navigate("/project/1/board")}>Dashboard</p>
                            <p  className="cursor-pointer"  onClick={handleLogout}> Logout</p>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setIsOpen(false)}>Close</button>
                        </div>
                    </Modal>
                )}
            </header>
        </>
    );
};

export default TopAppBar;
