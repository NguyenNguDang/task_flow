import { useState } from "react";

interface Props {
    columnId: string;
    onTaskCreated: (columnId: string, title: string) => void;
}

export const CreateTaskButton = ({ columnId, onTaskCreated }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");

    const handleCreate = () => {
        if (!title.trim()) return;
        onTaskCreated(columnId, title); // Gọi callback để cha xử lý API
        setTitle("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleCreate();
        if (e.key === 'Escape') setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full text-left p-2 m-2 text-gray-500 hover:bg-gray-200 rounded text-sm transition-colors flex items-center gap-2"
            >
                <span>+</span> Create task
            </button>
        );
    }

    return (
        <div className="p-2 m-2 bg-white rounded shadow-sm border border-blue-500">
            <input
                autoFocus
                className="w-full text-sm outline-none mb-2"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => !title && setIsOpen(false)}
            />
            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-700 px-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreate}
                    className="text-xs bg-blue-600 text-white font-bold py-1 px-3 rounded hover:bg-blue-700"
                >
                    Create
                </button>
            </div>
        </div>
    );
};