import TopAppBar from "./TopAppBar.tsx";
import Footer from "./Footer.tsx";
import HeroSection from "./HeroSection.tsx";
import FeatureSection from "./FeatureSection.tsx";
import TestimonialSection from "./TestimonialSection.tsx";
import PricingSection from "./PricingSection.tsx";

const Home = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-gray-900 font-sans">
            {/* TopAppBar */}
            <TopAppBar/>

            <main className="flex-1">
                {/* Hero Section */}
                <HeroSection/>

                {/* FeatureSection */}
                <FeatureSection/>

                {/* TestimonialSection */}
                <TestimonialSection />

                {/* PricingSection */}
                <PricingSection />
            </main>

            {/* Footer */}
           <Footer/>
        </div>
    );
};

export default Home;