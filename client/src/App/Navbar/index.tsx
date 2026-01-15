import { Link } from "react-router-dom";
import { Logo } from "./Icons/Logo";
import { Plus } from "./Icons/Plus";
import React from "react";

const NavItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="w-full flex flex-row items-center flex-nowrap hover:bg-[#ffffff1a] hover:cursor-pointer py-1 relative">
        {/* Icon Container */}
        <div className="min-w-16 min-h-[42px] flex flex-col items-center justify-center">
            {icon}
        </div>
        <div className="text-nowrap text-[#deebff] uppercase font-CircularStdBold font-bold text-[12px] select-none opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-200">
            {label}
        </div>
    </div>
);

export default function Navbar() {
    return (
        <div className="group fixed top-0 left-0 w-16 bg-[#0747a6] h-full hover:w-[200px] transition-all duration-100 ease-in-out shadow-2xl text-[#c1d6f2] overflow-hidden z-50">

            <div className="w-full h-16 flex items-center justify-center mb-4">
                <Logo size={28} />
            </div>

            <div className="flex flex-col w-full">

                <Link to={{ search: "modal-issue-create=true" }}>
                    <NavItem icon={<Plus />} label="create issue" />
                </Link>

                <Link to="/projects">
                    <NavItem icon={<Plus />} label="All Projects" />
                </Link>

            </div>
        </div>
    );
}