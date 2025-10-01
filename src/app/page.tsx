import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import MenuSection from "./components/MenuSection";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <Footer />
    </div>
  );
}
