import { FaTwitter, FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:text-blue-600">Features</a></li>
                            <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-600">Enterprise</a></li>
                            <li><a href="#" className="hover:text-blue-600">Security</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:text-blue-600">Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-600">API Reference</a></li>
                            <li><a href="#" className="hover:text-blue-600">Community</a></li>
                            <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-600">Legal</a></li>
                            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><FaTwitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><FaGithub size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors"><FaLinkedin size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><FaFacebook size={20} /></a>
                        </div>
                    </div>
                </div>
                
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 text-2xl">view_kanban</span>
                        <span className="font-bold text-gray-900 dark:text-white">SpringBoard</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © 2024 SpringBoard, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;