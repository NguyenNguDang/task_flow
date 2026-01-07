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
import axiosClient from "../../api";
import {User} from "../../types";

export const Sidebar = () => {
    const NOT_IMPLEMENTED = `hover:after:content-['NOT_IMPLEMENTED'] hover:text-[11px] hover:font-bold hover:bg-[#dfe1e6] hover:cursor-not-allowed`;
    const [isOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen]);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const user =  await axiosClient.get<User>('/user/me');
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || ""
            });
        } catch (error) {
            console.error("Lỗi lấy thông tin user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await axiosClient.put("http://localhost:8080/api/v1/user/me", formData);
            alert("Cập nhật thành công!");
            setIsOpen(false);
        } catch (error) {
            alert("Cập nhật thất bại");
        }
    };
    return (
        <div
            className="ml-16 border-r font-CircularStdBold text-sm border-r-solid leading-[1.2] border-r-[#dfe1e6] bg-[#f4f5f7] min-w-[230px] w-[230px] flex flex-col items-center h-full px-4">
            <Title className="cursor-pointer" onClick={() => setIsOpen(true)}/>
            <Item/>
            <Button icon={<Settings/>}>Project Settings</Button>
            <div className="h-10 w-full flex flex-col justify-center">
                <div className="bg-[#c1c7d0] h-[1px] w-full"></div>
            </div>
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
                className={`after:content-['Reports'] ${NOT_IMPLEMENTED}`}
                icon={<Stats/>}
            />
            <Button
                className={`after:content-['Components'] ${NOT_IMPLEMENTED}`}
                icon={<Component/>}
            />
            {isOpen && (
                <Modal
                    className={"max-w-[40%] mx-auto"}
                    coords={{ top: 50, left: 0, right: 0 }}
                    onClose={() => setIsOpen(false)}
                >
                    <div className="mb-4">
                        <h2 className="text-xl font-bold">User Profile</h2>
                    </div>

                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">Loading user data...</div>
                    ) : (
                        <form className={`flex flex-col items-start justify-center gap-2`}>
                            <label htmlFor="fullName" className="font-semibold text-sm">Full Name</label>
                            <input
                                className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                id={'fullName'}
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                            />

                            <label htmlFor="email" className="font-semibold text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-100`}
                                value={formData.email}
                                onChange={handleChange}
                                disabled
                            />

                            <label htmlFor="phone" className="font-semibold text-sm">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                value={formData.phone}
                                onChange={handleChange}
                            />

                            <label htmlFor="address" className="font-semibold text-sm">Address</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                className={`w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </form>
                    )}

                    <div className="flex justify-end mt-6 gap-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};
