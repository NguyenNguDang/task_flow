import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const TopAppBar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { logout, isAuthenticated, user } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled 
                ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:bg-gray-900/90 dark:border-gray-800" 
                : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <span className="material-symbols-outlined text-white text-2xl">view_kanban</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        SpringBoard
                    </h2>
                </div>

                {/* Navigation Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-8">
                    {['Features', 'Solutions', 'Pricing', 'Resources'].map((item) => (
                        <a 
                            key={item} 
                            href="#" 
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Auth Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
                            >
                                <FaUserCircle className="text-blue-600 text-2xl" />
                                <span className="font-medium text-sm text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                                    {user?.name}
                                </span>
                                <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                                    </div>
                                    
                                    <div className="py-1">
                                        <button 
                                            onClick={() => navigate("/project/1/dashboard")}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Dashboard
                                        </button>
                                        <button 
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Settings
                                        </button>
                                    </div>

                                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                                        <button 
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate("/login")}
                                className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300"
                            >
                                Log in
                            </button>
                            <button 
                                onClick={() => navigate("/register")}
                                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopAppBar;