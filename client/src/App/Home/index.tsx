import TopAppBar from "./TopAppBar.tsx";
import Footer from "./Footer.tsx";
import HeroSection from "./HeroSection.tsx";
import FeatureSection from "./FeatureSection.tsx";

const Home = () => {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
            {/* TopAppBar */}
            <TopAppBar/>

            <main className="flex-1">
                {/* Hero Section */}
                <HeroSection/>

                {/* FeatureSection */}
               <FeatureSection/>
            </main>

            {/* Footer */}
           <Footer/>
        </div>
    );
};

export default Home;
