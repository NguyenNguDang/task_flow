import {useAuth} from "../../context/AuthContext.tsx";
import {HTMLAttributes} from "react";

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
    avatarTimestamp?: number;
}
export default function Title({ className, avatarTimestamp, ...props }: TitleProps) {
    const { user } = useAuth();


    if (!user) {
        return (
            <div className="flex flex-row items-center w-full h-fit py-6 px-4 ">
                <div className="size-10 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="pt-[3px] pl-[10px] space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`cursor-pointer flex flex-row items-center w-full h-fit py-6 px-4 ${className}`}
             {...props}>
            {/* Avatar User */}
            <div className="size-10 min-w-[40px] rounded-full overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-indigo-500 text-white font-bold text-lg">
                {user.avatarUrl ? (
                    <img
                        src={`${user.avatarUrl}${avatarTimestamp ? `?t=${avatarTimestamp}` : ''}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span>
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                )}
            </div>

            {/* Thông tin tên & Email */}
            <div className="pt-[1px] pl-[10px] overflow-hidden">
                <div className="text-[14px] text-[#172b4d] font-bold truncate">
                    {user.name || "Unknown User"}
                </div>
                <div className="text-[12px] text-[#5e6c84] truncate" title={user.email}>
                    {user.email}
                </div>
            </div>
        </div>
    );
}