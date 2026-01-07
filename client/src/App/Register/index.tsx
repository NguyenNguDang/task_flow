import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AxiosError } from "axios";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errorMessage) setErrorMessage("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:8080/api/v1/user", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            console.log("Register Success:", response.data);
            navigate("/login");
        } catch (error) {
        const err = error as AxiosError;
        const data = err.response?.data as { message: string } | undefined;
        const msg = data?.message || "Đăng ký thất bại.";
        setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4 font-sans">
            <div className="w-full max-w-[420px] perspective-[1000px]">
                <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-10 shadow-2xl transition-all duration-300 hover:-translate-y-1">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                            Hello My friend
                        </h2>
                        <p className="text-white/80 mt-1">Register to your account</p>
                    </div>

                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center animate-pulse">
                            {errorMessage}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Input */}
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 text-white outline-none backdrop-blur-md transition
                                focus:border-cyan-400 focus:bg-white/15 placeholder-transparent"
                                placeholder="Name"
                            />
                            <label className="absolute left-4 top-4 text-white/70 transition-all
                                peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-cyan-400
                                peer-valid:-translate-y-3 peer-valid:scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100">
                                Your full name
                            </label>
                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all peer-focus:w-full"></span>
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 text-white outline-none backdrop-blur-md transition
                                focus:border-cyan-400 focus:bg-white/15 placeholder-transparent"
                                placeholder="Email"
                            />
                            <label className="absolute left-4 top-4 text-white/70 transition-all
                                peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-cyan-400
                                peer-valid:-translate-y-3 peer-valid:scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100">
                                Email Address
                            </label>
                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all peer-focus:w-full"></span>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 pr-12 text-white outline-none backdrop-blur-md transition
                                focus:border-cyan-400 focus:bg-white/15 placeholder-transparent"
                                placeholder="Password"
                            />
                            <label className="absolute left-4 top-4 text-white/70 transition-all
                                peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-cyan-400
                                peer-valid:-translate-y-3 peer-valid:scale-90 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100">
                                Password
                            </label>

                            {/* Nút ẩn/hiện mật khẩu */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs uppercase font-bold tracking-wider cursor-pointer z-10"
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>

                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all peer-focus:w-full"></span>
                        </div>

                        {/* Button Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 py-4 font-semibold text-white shadow-lg transition
                            hover:-translate-y-1 hover:shadow-xl disabled:pointer-events-none disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/20"></div>
                        <span className="text-white/70 text-sm">or continue with</span>
                        <div className="h-px flex-1 bg-white/20"></div>
                    </div>

                    {/* Social */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button type="button" className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 text-white hover:bg-white/15 transition">
                            Google
                        </button>
                        <button type="button" className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 text-white hover:bg-white/15 transition">
                            GitHub
                        </button>
                    </div>

                    {/* Signup */}
                    <p className="mt-6 text-center text-sm text-white/80">
                        You have an account?{" "}
                        <Link to={"/login"} className="text-cyan-400 hover:text-white">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;