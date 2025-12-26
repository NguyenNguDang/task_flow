import * as React from "react";

interface BtnProps {
    active?: boolean;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    innerText?: string;
    onClick?: () => void;
}

export function Button({ active, icon, children, className, onClick }: BtnProps) {
    const bgColor = active ? "bg-[#ebecf0]" : "bg-[#f4f5f7]";
    const textColor = active ? "text-[#0052cc]" : "text-[#42526e]";

    return (
        <div
            onClick={onClick}
            className={`${className} font-CircularStdBold flex flex-row items-center rounded-[3px] w-full h-10 ${bgColor} ${textColor} px-3 py-2 select-none hover:cursor-pointer hover:bg-[#ebecf0] transition-colors`}
        >
            <div className="flex items-center justify-center w-6">{icon}</div>
            <div className="pl-3">{children}</div>
        </div>
    );
}