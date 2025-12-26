/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Droppable } from "@hello-pangea/dnd";
import {Column as ColumnType, TaskCard} from "types";
import Task from "./Task";
import { memo } from "react";
import { DragIndicator } from "./DragIndicator";
import {CreateTaskButton} from "../../../Components/CreateTaskButton.tsx";


export interface ColumnProps {
    tasks: TaskCard[];
    column: ColumnType;
    index: number;
    onTaskCreated: (columnId: string, title: string) => Promise<void>;
}

const Title = ({ title }: { title: string }) => {
    return (
        <div className="p-3 pl-4 font-bold text-[#5e6c84] uppercase text-xs flex items-center gap-2 select-none">
            <DragIndicator className="opacity-50" />
            {title}
        </div>
    );
};

const TaskList = ({ provided, children, isDraggingOver }: any) => {
    return (
        <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`
                px-2 pb-2 flex-grow overflow-y-auto min-h-[50px]
                flex flex-col gap-2
                transition-colors duration-200
                ${isDraggingOver ? "bg-slate-200" : ""}
            `}
            style={{ scrollbarWidth: "thin" }}
        >
            {children}
        </div>
    );
};

const InnerTaskList = memo(({ tasks }: { tasks: TaskCard[] }) => {
    return tasks.map((task, index) => (
        <Task key={task.id} task={task} index={index} />
    ));
});


export default function Column(props: Readonly<ColumnProps>) {
    const { tasks, column, onTaskCreated } = props;

    return (
        <div className="w-[285px] min-w-[285px] ml-3 flex flex-col bg-[#f4f5f7] rounded-lg shadow-sm max-h-[calc(100vh-140px)]">
            <Title title={column.title} />

            <Droppable ignoreContainerClipping={true} type="task" droppableId={column.id}>
                {(provided, snapshot) => (
                    <TaskList
                        provided={provided}
                        isDraggingOver={snapshot.isDraggingOver}
                    >
                        <InnerTaskList tasks={tasks} />
                        {provided.placeholder}
                    </TaskList>
                )}
            </Droppable>
            <CreateTaskButton
                columnId={column.id}
                onTaskCreated={onTaskCreated}
            />
        </div>
    );
}