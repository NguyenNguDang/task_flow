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
        // Prevent double click
        if (isCreating) return;
        setIsCreating(true);

        try {
            const response = await axiosClient.post(`/sprint/${boardId}`, {});

            const newSprint: SprintType = response as unknown as SprintType;

            onSprintCreated(newSprint);
            toast.success("Sprint created successfully!");

        } catch (error: any) {
            console.error("Failed to create sprint:", error);
            toast.error(error.response?.data?.message || "Failed to create sprint. Please try again!");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <button
            onClick={handleCreateSprint}
            disabled={isCreating} // Disable when loading
            className={`px-3 py-1 bg-[#ebecf0] hover:bg-gray-300 rounded text-[#42526e] font-medium transition-colors 
        ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {isCreating ? 'Creating...' : 'Create sprint'}
        </button>
    );
};

export default CreateSprintButton;
