"use client"
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import MenuSection from "./components/MenuSection";
import Footer from "./components/Footer";
import ConatctForm from "./components/ConatctForm";
import MilkshakeSection from "./components/MilkshakeSection";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <HeroSection />
      <AboutSection />
      <MenuSection />
      <MilkshakeSection />
      <ConatctForm />
      <Footer />
    </div>
  );
}
