import React, { useState } from 'react';
import {SprintType} from "../types";
import {toast} from "react-toastify";
import axiosClient from "../api";

interface CreateSprintButtonProps {
    boardId: number;
    onSprintCreated: (newSprint: SprintType) => void;
}

const CreateSprintButton: React.FC<CreateSprintButtonProps> = ({ boardId, onSprintCreated }) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleCreateSprint = async () => {
        //Chặn click liên tục
        if (isCreating) return;
        setIsCreating(true);

        try {
            const response = await axiosClient.post(`/sprint/${boardId}`, {});

            const newSprint: SprintType = response as unknown as SprintType;

            onSprintCreated(newSprint);
            toast.success("Tạo Sprint thành công!");

        } catch (error: any) {
            console.error("Lỗi tạo sprint:", error);
            toast.error(error.response?.data?.message || "Không thể tạo Sprint mới, vui lòng thử lại!");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <button
            onClick={handleCreateSprint}
            disabled={isCreating} // Disable khi đang loading
            className={`px-3 py-1 bg-[#ebecf0] hover:bg-gray-300 rounded text-[#42526e] font-medium transition-colors 
        ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isCreating ? 'Creating...' : 'Create sprint'}
        </button>
    );
};

export default CreateSprintButton;
