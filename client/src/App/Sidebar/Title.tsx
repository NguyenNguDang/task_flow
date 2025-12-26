// 1. Đổi import: Dùng useRouteLoaderData thay vì useOutletContext
import { useRouteLoaderData } from "react-router-dom";

export default function Title() {
    // 2. Lấy dữ liệu dựa trên Router ID "project-detail" mà ta đã cấu hình ở file router
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = useRouteLoaderData("project-detail") as any;

    // 3. Safety Check: Nếu chưa vào project (data null) hoặc đang load thì không render
    if (!data || !data.boardData) {
        return (
            <div className="flex flex-row items-center w-full h-fit py-6 px-4">
                {/* Skeleton loading đơn giản */}
                <div className="size-10 rounded-md bg-gray-200 animate-pulse"></div>
                <div className="pt-[3px] pl-[10px] space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    const { boardData } = data;

    return (
        <div className="flex flex-row items-center w-full h-fit py-6 px-4">
            {/* Icon Project */}
            <div className="size-10 rounded-md bg-red-300 flex items-center justify-center text-white font-bold text-lg">
                {/* Lấy chữ cái đầu của tên project */}
                {boardData.metaData.title.charAt(0).toUpperCase()}
            </div>

            <div className="pt-[3px] pl-[10px]">
                <div className="text-[14px] text-[#42526e] font-CircularStdMedium font-[700]">
                    {boardData.metaData.title}
                </div>
                <div className="text-[14px] text-[#5e6c84] font-CircularStdMedium">
                    Software Project
                </div>
            </div>
        </div>
    );
}