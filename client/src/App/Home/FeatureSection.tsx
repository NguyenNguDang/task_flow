import { FaTasks, FaChartLine, FaUsers, FaRocket, FaRegClock, FaShieldAlt } from "react-icons/fa";

const features = [
    {
        icon: <FaTasks className="w-6 h-6 text-blue-600" />,
        title: "Sprint Planning",
        desc: "Create user stories and issues, plan sprints, and distribute tasks across your software team.",
    },
    {
        icon: <FaUsers className="w-6 h-6 text-purple-600" />,
        title: "Team Collaboration",
        desc: "Improve team performance with real-time collaboration, comments, and file sharing.",
    },
    {
        icon: <FaChartLine className="w-6 h-6 text-green-600" />,
        title: "Agile Reporting",
        desc: "Gain insights into your team's performance with visual real-time reports and burn-down charts.",
    },
    {
        icon: <FaRocket className="w-6 h-6 text-red-600" />,
        title: "Release Management",
        desc: "Ship with confidence and sanity. Track your releases and ensure everything is on schedule.",
    },
    {
        icon: <FaRegClock className="w-6 h-6 text-orange-600" />,
        title: "Time Tracking",
        desc: "Keep track of time spent on tasks and improve your estimation accuracy over time.",
    },
    {
        icon: <FaShieldAlt className="w-6 h-6 text-teal-600" />,
        title: "Enterprise Security",
        desc: "Bank-grade security controls and compliance to keep your data safe and secure.",
    }
];

const FeatureSection = () => {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">Features</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Everything you need to build great software
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Powerful features to help your team plan, track, and release world-class software.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                        >
                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {item.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;