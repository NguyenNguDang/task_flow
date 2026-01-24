import React, { useState } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { loginService } from "../../services/auth.service";
import { LoginPayload } from "../../types/auth.types";
import {toast} from "react-toastify";
import {useAuth} from "../../context/AuthContext.tsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [formData, setFormData] = useState<LoginPayload>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await loginService(formData);
            console.log(data);
            login(data.user, data.accessToken, data.refreshToken);

            toast('Đăng nhập thành công!');
            navigate('/');

        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data.message || 'Đăng nhập thất bại.');
            } else {
                setError('Lỗi kết nối hoặc lỗi không xác định.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4 font-sans">
            <div className="w-full max-w-[420px] perspective-[1000px]">
                <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-10 shadow-2xl transition-all duration-300 hover:-translate-y-1">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                            Welcome Back
                        </h2>
                        <p className="text-white/80 mt-1">Sign in to your account</p>
                    </div>

                    {/* Hiển thị lỗi */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-white text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Input */}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 text-white outline-none backdrop-blur-md transition
                                focus:border-cyan-400 focus:bg-white/15"
                            />
                            <label className="absolute left-4 top-4 text-white/70 transition-all
                                peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-cyan-400
                                peer-valid:-translate-y-3 peer-valid:scale-90">
                                Email Address
                            </label>
                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all peer-focus:w-full"></span>
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 pr-12 text-white outline-none backdrop-blur-md transition
                                focus:border-cyan-400 focus:bg-white/15"
                            />
                            <label className="absolute left-4 top-4 text-white/70 transition-all
                                peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-cyan-400
                                peer-valid:-translate-y-3 peer-valid:scale-90">
                                Password
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-lg cursor-pointer z-10"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>

                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all peer-focus:w-full"></span>
                        </div>

                        {/* Options */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                            <label className="flex items-center gap-2 text-white/90">
                                <input type="checkbox" className="accent-cyan-400" />
                                Remember me
                            </label>
                            <a href="#" className="text-cyan-400 hover:text-white transition">
                                Forgot password?
                            </a>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 py-4 font-semibold text-white shadow-lg transition
                            hover:-translate-y-1 hover:shadow-xl disabled:pointer-events-none disabled:opacity-70"
                        >
                            <span className={`${loading ? "opacity-0" : "opacity-100"} transition`}>
                                Sign In
                            </span>
                            {loading && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                </span>
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
                        <button className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 text-white hover:bg-white/15 transition">
                            Google
                        </button>
                        <button className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 text-white hover:bg-white/15 transition">
                            GitHub
                        </button>
                    </div>

                    {/* Signup */}
                    <p className="mt-6 text-center text-sm text-white/80">
                        Don&apos;t have an account?{" "}
                        <Link to="/register"  className="text-cyan-400 hover:text-white">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;