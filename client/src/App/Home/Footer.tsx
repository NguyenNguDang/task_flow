
const Footer = () => {
    return (
        <>
            <footer className="flex flex-col gap-8 px-5 py-10 text-center">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
                    <a className="text-gray-600 dark:text-gray-400" href="#">
                        Privacy Policy
                    </a>
                    <a className="text-gray-600 dark:text-gray-400" href="#">
                        Terms of Service
                    </a>
                </div>

                <p className="text-gray-600 dark:text-gray-400">
                    © 2024 SpringBoard, Inc.
                </p>
            </footer>
        </>
    );
};

export default Footer;
