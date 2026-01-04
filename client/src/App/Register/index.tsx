import {Link} from "react-router-dom";

const Register = () => {
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

                    {/* Form */}
                    <form  className="space-y-6">
                        {/* Name Input */}
                        <div className="relative">
                            <input
                                type="text"
                                name="name"
                                required
                                className="peer w-full rounded-xl border border-white/20 bg-white/10 px-4 pt-5 pb-2 text-white outline-none backdrop-blur-md transition
                                focus:border-cyan-400 focus:bg-white/15"
                            />
                            <label className="absolute left-4 top-4 text-white/70 transition-all
                                peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-cyan-400
                                peer-valid:-translate-y-3 peer-valid:scale-90">
                                Your full name
                            </label>
                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all peer-focus:w-full"></span>
                        </div>

                        {/* Email Input */}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                required
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
                                name="password"
                                required
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
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs uppercase font-bold tracking-wider"
                            >
                            </button>

                            <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all peer-focus:w-full"></span>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="relative w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 py-4 font-semibold text-white shadow-lg transition
                            hover:-translate-y-1 hover:shadow-xl disabled:pointer-events-none disabled:opacity-70"
                        >
                        Register
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
                       You have an account{" "}
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
