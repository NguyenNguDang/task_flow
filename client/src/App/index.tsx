import {Outlet, useLoaderData, useLocation} from "react-router-dom";
import {Sidebar} from "./Sidebar";
import {CreateIssue} from "Components/CreateIssue";
import {ToastContainer} from "react-toastify";

export default function App() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modalIssueCreate = queryParams.get("modal-issue-create");
    const Holder = () =>
        (modalIssueCreate === "true") ? <CreateIssue/> : <></>;
    const data = useLoaderData();
    return (
        <div className="flex flex-row h-full w-full">
            <Holder/>
            <Sidebar></Sidebar>
            <Outlet context={data}/>
            <ToastContainer
                position="top-right" // Vị trí: trên cùng bên phải
                autoClose={3000}     // Tự tắt sau 3 giây
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
}