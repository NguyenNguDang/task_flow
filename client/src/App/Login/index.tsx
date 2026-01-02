import {  useState } from "react";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 1500);
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email */}
                        <div className="relative">
                            <input
                                type="email"
                                required
                                className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 text-white outline-none backdrop-blur-md transition
                focus:border-cyan-400 focus:bg-white/15"
                            />
                            <label
                                className="absolute left-4 top-4 text-white/70 transition-all
                peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-cyan-400
                peer-valid:-translate-y-3 peer-valid:scale-90"
                            >
                                Email Address
                            </label>
                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all peer-focus:w-full"></span>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 pr-12 text-white outline-none backdrop-blur-md transition
                focus:border-cyan-400 focus:bg-white/15"
                            />
                            <label
                                className="absolute left-4 top-4 text-white/70 transition-all
                peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-cyan-400
                peer-valid:-translate-y-3 peer-valid:scale-90"
                            >
                                Password
                            </label>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                            >
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
              hover:-translate-y-1 hover:shadow-xl disabled:pointer-events-none"
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
                        <a href="#" className="text-cyan-400 hover:text-white">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
