const HeroSection = () => {
    return (
        <>
            <section className="relative bg-white dark:bg-gray-900/50">
                <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-4xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-5xl">
                            Manage Projects. Track Sprints. Deliver Faster.
                        </h1>
                        <h2 className="text-base text-gray-600 dark:text-gray-300">
                            The agile workspace for modern software teams.
                        </h2>
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                        <button className="flex h-12 min-w-[84px] items-center justify-center rounded-lg bg-primary px-5 text-base font-bold tracking-wide text-white">
                            Get Started for Free
                        </button>
                        <button className="flex h-12 min-w-[84px] items-center justify-center rounded-lg bg-transparent px-5 text-base font-bold tracking-wide text-gray-900 ring-1 ring-inset ring-gray-300 dark:text-gray-100 dark:ring-gray-700">
                            View Demo
                        </button>
                    </div>
                </div>

                <div className="px-4 pb-16">
                    <img
                        className="mx-auto aspect-[4/3] w-full max-w-lg -rotate-3 rounded-xl object-cover shadow-2xl"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMapoopuFfKtYwoEL0gIE3SilTlS-XLDen8DXjb5ZgEPOP56rqm0SHVBiVxCD4QthFNo9vtA5HOAPg75AK1pqN77UHzZtQDsI0LW1qqTJBF5P1yvjhNQNQObeDALAHsaQON4hLVdO9b_dInuu3zdmxSPYorhEQvPfTxtnoFJUMSiQ25hfuwIF2QDHIXUwoiaXnisR-5SRn23awQgaZpvU_onrIOTWMCAzfMmz3hBgl3L7xouqebL1ridRu8vdZdRlg-W_vvwPYU62T"
                        alt="Kanban board preview"
                    />
                </div>
            </section>
        </>
    );
};

export default HeroSection;
