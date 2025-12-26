import React, { useState } from 'react';
import {SprintType} from "../types";

interface CreateSprintButtonProps {
    boardId: number;
    // Callback để báo cho component cha biết là đã tạo xong
    onSprintCreated: (newSprint: SprintType) => void;
}

const CreateSprintButton: React.FC<CreateSprintButtonProps> = ({ boardId, onSprintCreated }) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleCreateSprint = async () => {
        // 1. Chặn click liên tục
        if (isCreating) return;

        setIsCreating(true);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/sprint/${boardId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // backend tư sinh data
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error('Failed to create sprint');
            }

            const newSprint: SprintType = await response.json();

            onSprintCreated(newSprint);

        } catch (error) {
            console.error("Lỗi tạo sprint:", error);
            alert("Không thể tạo Sprint mới, vui lòng thử lại!");
        } finally {
            // 4. Mở lại nút bấm
            setIsCreating(false);
        }
    };

    return (
        <button
            onClick={handleCreateSprint}
            disabled={isCreating} // Disable khi đang loading
            className={`px-3 py-1 bg-[#ebecf0] hover:bg-gray-300 rounded text-[#42526e] font-medium transition-colors 
        ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`} // Thêm style khi disable
        >
            {isCreating ? 'Creating...' : 'Create sprint'}
        </button>
    );
};

export default CreateSprintButton;