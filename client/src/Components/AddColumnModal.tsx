import React, {useState} from 'react';
import axios from "axios";
import {BACKEND_URL} from "../Constants";
import {toast} from "react-toastify";

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
            const res = await axios.post(`${BACKEND_URL}/board-column/${boardId}`, {
                title: title
            })

            toast.success("Thêm cột thành công!");
            onSuccess(res.data);
            onClose();
        }catch (error) {
            console.error(error);
            toast.error("Lỗi khi thêm cột");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                    <h2 className="text-lg font-bold mb-4 text-[#172b4d]">Thêm cột mới</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên cột
                            </label>
                            <input
                                type="text"
                                autoFocus
                                className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500"
                                placeholder="Ví dụ: QA, Review..."
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
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                disabled={loading || !title.trim()}
                            >
                                {loading ? "Đang lưu..." : "Thêm"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddColumnModal;