
const FeatureSection = () => {
    return (
        <>
            <section className="py-16">
                <h2 className="px-4 pb-8 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Features
                </h2>

                <div className="flex flex-row gap-6 px-4">
                    {[
                        {
                            icon: "calendar_month",
                            title: "Sprint Planning",
                            desc: "Efficiently organize and prioritize your team's work for each cycle.",
                        },
                        {
                            icon: "groups",
                            title: "Real-time Collaboration",
                            desc: "Work together seamlessly with shared boards and instant updates.",
                        },
                        {
                            icon: "monitoring",
                            title: "Analytics",
                            desc: "Gain valuable insights into your team's performance and project progress.",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50"
                        >
                <span className="material-symbols-outlined text-primary text-3xl">
                  {item.icon}
                </span>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};

export default FeatureSection;
