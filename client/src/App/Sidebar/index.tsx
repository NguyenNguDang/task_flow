import {Button} from "../../Components/Button";
import Title from "./Title";
import {
    Settings,
    Releases,
    Stats,
    Component,
    Pages,
    Issues,
} from "./Icons";
import Item from "./Item.tsx";
import {Modal} from "../../Components/Modal.tsx";
import {useEffect, useState} from "react";
import {User} from "../../types";
import {Link, useNavigate, useParams} from "react-router-dom";
import { useForm } from "react-hook-form";
import { userService } from "../../services/user.service.tsx";
import { toast } from "react-toastify";
import {FaList} from "react-icons/fa";
import { useProjectPermissions } from "../../hooks/useProjectPermissions";
import { CiLogout } from "react-icons/ci";
import axiosClient from "../../api";
import {useAuth} from "../../context/AuthContext.tsx";

interface ProfileFormInputs {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    bio: string;
    avatar: FileList;
}

export const Sidebar = () => {
    const NOT_IMPLEMENTED = `hover:after:content-['NOT_IMPLEMENTED'] hover:text-[11px] hover:font-bold hover:bg-[#dfe1e6] hover:cursor-not-allowed`;
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { isProjectManager } = useProjectPermissions();
    const { setUser } = useAuth();
    const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormInputs>();

    useEffect(() => {
        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen]);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const user = await userService.getMe() ;
            setCurrentUser(user);
            setValue("fullName", user.fullName || "");
            setValue("email", user.email || "");
            setValue("phone", user.phone || "");
            setValue("address", user.address || "");
            setValue("bio", user.bio || "");
        } catch (error) {
            console.error("Lỗi lấy thông tin user:", error);
            toast.error("Failed to load user data");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ProfileFormInputs) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("phone", data.phone);
            formData.append("address", data.address);
            formData.append("bio", data.bio);

            if (data.avatar && data.avatar.length > 0) {
                formData.append("avatarFile", data.avatar[0]);
            }

            // Gọi API và nhận về thông tin user mới nhất (bao gồm avatarUrl mới)
            const response: any = await userService.updateProfile(formData);
            const updatedUser = response.data || response;
            
            // Cập nhật Global State để Title và các nơi khác đổi avatar ngay lập tức
            if (setUser) setUser(updatedUser);

            toast.success("Profile updated successfully!");
            
            setAvatarTimestamp(Date.now()); // Force refresh image
            await fetchUserData();
            
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await axiosClient.post("/auth/logout");
            localStorage.clear();
            toast.success("Đăng xuất thành công!");
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
            localStorage.clear();
            navigate("/login");
        }
    };

    return (
        <div
            className="border-r font-CircularStdBold text-sm border-r-solid leading-[1.2] border-r-[#dfe1e6] bg-[#f4f5f7] min-w-[230px] w-[230px] flex flex-col items-center h-full justify-between pb-4">
            {/* Removed px-4 from parent container to allow full-width hover */}
            
            <div className="w-full flex flex-col items-center">
                <div className="w-full px-4">
                    <Title className="cursor-pointer" onClick={() => setIsOpen(true)} avatarTimestamp={avatarTimestamp}/>
                </div>
                
                <Item/>
                
                <Link to="/projects" className="w-full px-2">
                    <Button icon={<FaList />} className="w-full justify-start mb-2">All Projects</Button>
                </Link>
                
                {isProjectManager && (
                    <div className="w-full px-2">
                        <Button icon={<Settings/>}>Project Settings</Button>
                    </div>
                )}
                
                <div className="h-10 w-full flex flex-col justify-center px-4">
                    <div className="bg-[#c1c7d0] h-[1px] w-full"></div>
                </div>
                
                <div className="w-full px-2 flex flex-col gap-1">
                    <Button
                        className={`after:content-['Releases'] ${NOT_IMPLEMENTED}`}
                        icon={<Releases/>}
                    />
                    <Button
                        className={`after:content-['Issues_and_filters'] ${NOT_IMPLEMENTED}`}
                        icon={<Issues/>}
                    />
                    <Button
                        className={`after:content-['Pages'] ${NOT_IMPLEMENTED}`}
                        icon={<Pages/>}
                    ></Button>
                    <Button
                        className={``}
                        icon={<Stats/>}
                        onClick={() => navigate(`/project/${projectId}/dashboard`)}
                    >
                        Reports
                    </Button>
                    <Button
                        className={`after:content-['Components'] ${NOT_IMPLEMENTED}`}
                        icon={<Component/>}
                    />
                </div>
            </div>

            <div className="w-full px-2">
                <Button 
                    icon={<CiLogout size={20} />} 
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                >
                    Logout
                </Button>
            </div>

            {isOpen && (
                <Modal
                    className={"max-w-[500px] mx-auto"}
                    coords={{ top: 50, left: 0, right: 0 }}
                    onClose={() => setIsOpen(false)}
                >
                    <div className="mb-4 flex items-center gap-4">
                        {currentUser?.avatarUrl && (
                            <img
                                src={`${currentUser.avatarUrl}?t=${avatarTimestamp}`}
                                alt="Avatar"
                                className="w-16 h-16 rounded-full object-cover border border-gray-200"
                            />
                        )}
                        <h2 className="text-xl font-bold">User Profile</h2>
                    </div>

                    {isLoading && !currentUser ? (
                        <div className="p-4 text-center text-gray-500">Loading user data...</div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col gap-3`}>
                            <div>
                                <label htmlFor="fullName" className="font-semibold text-sm block mb-1">Full Name</label>
                                <input
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                    id={'fullName'}
                                    type="text"
                                    {...register("fullName", { required: "Full name is required" })}
                                />
                                {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="email" className="font-semibold text-sm block mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none bg-gray-100 cursor-not-allowed`}
                                    {...register("email")}
                                    disabled
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="font-semibold text-sm block mb-1">Phone</label>
                                <input
                                    type="text"
                                    id="phone"
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                    {...register("phone", { pattern: { value: /^[0-9]+$/, message: "Invalid phone number" } })}
                                />
                                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                            </div>

                            <div>
                                <label htmlFor="address" className="font-semibold text-sm block mb-1">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                    {...register("address")}
                                />
                            </div>

                            <div>
                                <label htmlFor="bio" className="font-semibold text-sm block mb-1">Bio</label>
                                <textarea
                                    id="bio"
                                    rows={3}
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none`}
                                    {...register("bio")}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div>
                                <label htmlFor="avatar" className="font-semibold text-sm block mb-1">Change Avatar</label>
                                <input
                                    type="file"
                                    id="avatar"
                                    accept="image/*"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    {...register("avatar")}
                                />
                            </div>

                            <div className="flex justify-end mt-4 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {isLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </Modal>
            )}
        </div>
    );
};
