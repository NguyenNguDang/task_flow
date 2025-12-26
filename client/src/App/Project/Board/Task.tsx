/* eslint-disable @typescript-eslint/no-explicit-any */
import { Draggable } from "@hello-pangea/dnd";
import { Tags, TaskCard } from "types"; // Import interface mới

const getStyle = (style: any, snapshot: any) => {
    if (!snapshot.isDropAnimating) {
        return style;
    }
    return {
        ...style,
        transitionDuration: `0.001s`,
    };
};

export default function Task({
                                 task,
                                 index,
                             }: Readonly<{task: TaskCard; index: number; }>) {
    // Ép kiểu keyof typeof Tags để tránh lỗi TS nếu tag lạ
    const tagColor = Tags?.[task.tag?.toUpperCase() as keyof typeof Tags] ?? "bg-blue-300";

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                    className={`
                        bg-white rounded-[3px] py-[10px] px-2 font-CircularStdBook text-[14px]
                        select-none cursor-grab w-full
                        hover:bg-gray-50
                        ${snapshot.isDragging ? "shadow-lg ring-2 ring-blue-400 opacity-90 z-50 rotate-1" : "shadow-sm border border-gray-200"}
                    `}
                >
                    {/* SỬA: Giờ đây task.content đã hợp lệ */}
                    {task.content.title}

                    <div className="flex flex-row items-center justify-between mt-2">
                        <div className="flex flex-row items-center">
                            <div
                                className={`w-fit px-2 rounded-sm h-fit text-[10px] flex items-center justify-center ${tagColor}`}
                            >
                                {task.tag}
                            </div>
                        </div>
                        <div className="flex flex-row items-center">
                            {/* SỬA: Thêm kiểu dữ liệu cho tham số map để fix lỗi TS7006 */}
                            {task.assignees.map((assignee, idx) => (
                                <div
                                    key={idx}
                                    title={assignee.name} // Hiện tên khi hover
                                    className="size-6 rounded-full mr-[-5px] box-border bg-orange-300 bg-cover border-2 border-solid border-white flex items-center justify-center text-[10px] text-white font-bold uppercase"
                                >
                                    {/* Nếu có avatar thì hiện ảnh, không thì hiện chữ cái đầu */}
                                    {assignee.avatar ? (
                                        <img src={assignee.avatar} alt="" className="w-full h-full rounded-full"/>
                                    ) : (
                                        assignee.name.charAt(0)
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}