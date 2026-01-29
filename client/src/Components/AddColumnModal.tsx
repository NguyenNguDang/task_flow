import React, {useState} from 'react';
import {toast} from "react-toastify";
import axiosClient from "../api";

interface AddColumnModalProps {
    boardId: number;
    onClose: () => void;
    onSuccess: (newColumn: any) => void;
}

const AddColumnModal = ({ boardId, onClose, onSuccess }: AddColumnModalProps) => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Handle submit modal
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setLoading(true);
        try {
            const res = await axiosClient.post(`/board-column/${boardId}`, {
                title: title
            })

            toast.success("Column added successfully!");
            onSuccess((res as any));
            onClose();
        }catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to add column");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                    <h2 className="text-lg font-bold mb-4 text-[#172b4d]">Add New Column</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Column Name
                            </label>
                            <input
                                type="text"
                                autoFocus
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                placeholder="e.g. QA, Review..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                disabled={loading || !title.trim()}
                            >
                                {loading ? "Saving..." : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddColumnModal;
