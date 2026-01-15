import { FaCheck } from "react-icons/fa";

const plans = [
    {
        name: "Free",
        price: "$0",
        desc: "For small teams starting out",
        features: ["Up to 10 users", "2GB storage", "Community support", "Basic Kanban boards"],
        cta: "Start Free",
        popular: false
    },
    {
        name: "Standard",
        price: "$7",
        desc: "For growing teams",
        features: ["Up to 50 users", "250GB storage", "Standard support", "Advanced reporting", "Custom workflows"],
        cta: "Start Trial",
        popular: true
    },
    {
        name: "Premium",
        price: "$14",
        desc: "For organizations",
        features: ["Unlimited users", "Unlimited storage", "24/7 Premium support", "SSO & Security", "Admin insights"],
        cta: "Contact Sales",
        popular: false
    }
];

const PricingSection = () => {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Choose the plan that's right for your team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div 
                            key={index} 
                            className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border ${plan.popular ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                    MOST POPULAR
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-4">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                                <span className="text-gray-500 ml-2">/user/mo</span>
                            </div>
                            <p className="text-gray-500 mb-6 text-sm">{plan.desc}</p>
                            <button className={`w-full py-3 rounded-lg font-bold mb-8 transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white'}`}>
                                {plan.cta}
                            </button>
                            <ul className="space-y-4">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                        <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;