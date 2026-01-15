import { useEffect, useState, useRef } from 'react';
import { Comment } from '../../../types';
import { taskService } from '../../../services/task.service';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface TaskCommentsProps {
    taskId: number;
    initialComments?: Comment[];
}

const TaskComments = ({ taskId, initialComments = [] }: TaskCommentsProps) => {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // If initialComments are provided, use them. Otherwise fetch.
        // But usually initialComments might be stale or empty if not passed correctly.
        // Let's fetch to be sure or if we want real-time updates later.
        // For now, we rely on props or fetch if empty/undefined.
        if (initialComments.length > 0) {
            setComments(initialComments);
        } else {
            fetchComments();
        }
    }, [taskId]);

    const fetchComments = async () => {
        try {
            const response = await taskService.getComments(taskId);
            setComments(response as any);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await taskService.addComment(taskId, newComment);
            const addedComment = response as any; // Adjust based on actual API response
            setComments(prev => [addedComment, ...prev]); // Add new comment to top
            setNewComment('');
        } catch (error) {
            console.error("Failed to add comment", error);
            toast.error("Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsSubmitting(true);
            try {
                // Upload file
                const response = await taskService.uploadAttachment(taskId, file);
                // Assuming backend returns the created comment with attachment info or just attachment info
                // If it returns a comment object representing the attachment upload:
                const attachmentComment = response as any; 
                
                // If backend logic is: upload file -> returns file info -> frontend sends comment with file info?
                // Or: upload file -> backend automatically creates a system comment "User uploaded file..."?
                // Based on prompt: "POST /api/v1/tasks/{taskId}/attachments: Upload file".
                // Let's assume it returns a comment object or we need to refresh comments.
                // For simplicity, let's refresh comments or append if response is a comment.
                
                if (attachmentComment && attachmentComment.id) {
                     setComments(prev => [attachmentComment, ...prev]);
                } else {
                    fetchComments(); // Fallback
                }
                toast.success("File uploaded successfully");
            } catch (error) {
                console.error("Failed to upload file", error);
                toast.error("Failed to upload file");
            } finally {
                setIsSubmitting(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    return (
        <div className="mt-4">
            <h4 className="font-semibold mb-3 text-gray-700">Comments</h4>
            
            {/* Input Area */}
            <div className="flex gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                     {/* Current user avatar placeholder - In real app, get from auth context */}
                     <img src="https://via.placeholder.com/32" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        rows={2}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment();
                            }
                        }}
                    />
                    <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-2">
                            <button 
                                className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                                title="Attach file"
                                disabled={isSubmitting}
                            >
                                <FaPaperclip />
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleFileSelect}
                            />
                        </div>
                        <button
                            className={`px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleAddComment}
                            disabled={isSubmitting || !newComment.trim()}
                        >
                            <FaPaperPlane size={12} /> Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {comments.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center italic">No comments yet.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden mt-1">
                                <img 
                                    src={comment.userAvatar || "https://via.placeholder.com/32"} 
                                    alt={comment.userName} 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-semibold text-sm text-gray-800">{comment.userName}</span>
                                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">
                                    {comment.content}
                                </div>
                                {comment.attachmentUrl && (
                                    <div className="mt-2">
                                        <a 
                                            href={comment.attachmentUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-blue-600 hover:underline hover:bg-gray-200 transition-colors"
                                        >
                                            <FaPaperclip size={12} />
                                            {comment.attachmentName || "Attachment"}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskComments;
