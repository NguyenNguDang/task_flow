const testimonials = [
    {
        quote: "SpringBoard has completely transformed how our engineering team works. The sprint planning features are intuitive and powerful.",
        author: "Sarah Chen",
        role: "CTO at TechFlow",
        avatar: "https://i.pravatar.cc/100?img=5"
    },
    {
        quote: "The best project management tool we've used. It's simple enough for our marketing team but powerful enough for our devs.",
        author: "Michael Ross",
        role: "Product Manager at StartUp Inc",
        avatar: "https://i.pravatar.cc/100?img=8"
    },
    {
        quote: "I love the reporting features. Being able to see our velocity and burndown charts in real-time is a game changer.",
        author: "Emily Watson",
        role: "Scrum Master at AgileSoft",
        avatar: "https://i.pravatar.cc/100?img=9"
    }
];

const TestimonialSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">
                    Loved by teams everywhere
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6">
                            <img 
                                src={item.avatar} 
                                alt={item.author} 
                                className="w-20 h-20 rounded-full mb-6 border-4 border-blue-50 dark:border-gray-800"
                            />
                            <blockquote className="text-lg text-gray-600 dark:text-gray-300 italic mb-6">
                                "{item.quote}"
                            </blockquote>
                            <div>
                                <div className="font-bold text-gray-900 dark:text-white">{item.author}</div>
                                <div className="text-sm text-blue-600">{item.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;