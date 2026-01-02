import { useNavigate } from "react-router-dom";

const TopAppBar = () => {
    const navigate = useNavigate();
    return (
        <>
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200/50 bg-background-light/80 px-4 backdrop-blur-sm dark:border-gray-800/50 dark:bg-background-dark/80">
                <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        view_kanban
                      </span>
                    <h2 className="text-xl font-bold tracking-tighter text-gray-900 dark:text-gray-100">
                        SpringBoard
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate("/login")}>
                        Login
                    </button>
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent text-gray-900 dark:text-gray-100">
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                </div>
            </header>
        </>
    );
};

export default TopAppBar;
