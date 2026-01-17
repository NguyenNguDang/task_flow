import { FaProjectDiagram } from "react-icons/fa";

export default function Welcome() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 text-center p-8">
            <div className="bg-white p-10 rounded-2xl shadow-lg max-w-lg w-full border border-gray-100">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaProjectDiagram className="text-blue-600 text-4xl" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Welcome to TaskFlow</h1>
                <p className="text-gray-500 mb-8 text-lg">
                    Select a project from the sidebar to start managing your tasks, or create a new one to get started.
                </p>
                <div className="flex justify-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">👈 Use the sidebar to navigate</span>
                </div>
            </div>
        </div>
    );
}