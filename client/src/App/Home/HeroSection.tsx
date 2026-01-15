import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative bg-white dark:bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                            🚀 New: AI-Powered Sprint Planning
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight text-gray-900 dark:text-white mb-6">
                            Manage Projects. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                Deliver Faster.
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            The ultimate agile workspace for modern software teams. Plan, track, and release world-class software with the #1 software development tool used by agile teams.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button 
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-1"
                            >
                                Get Started for Free
                            </button>
                            <button className="px-8 py-4 text-lg font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                                Watch Demo
                            </button>
                        </div>
                        <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <img key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900" src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                ))}
                            </div>
                            <p>Trusted by 10,000+ teams worldwide</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-2xl lg:max-w-none">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                            <img
                                className="relative rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMapoopuFfKtYwoEL0gIE3SilTlS-XLDen8DXjb5ZgEPOP56rqm0SHVBiVxCD4QthFNo9vtA5HOAPg75AK1pqN77UHzZtQDsI0LW1qqTJBF5P1yvjhNQNQObeDALAHsaQON4hLVdO9b_dInuu3zdmxSPYorhEQvPfTxtnoFJUMSiQ25hfuwIF2QDHIXUwoiaXnisR-5SRn23awQgaZpvU_onrIOTWMCAzfMmz3hBgl3L7xouqebL1ridRu8vdZdRlg-W_vvwPYU62T"
                                alt="Dashboard Preview"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;