import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CharacterGrid } from "@/components/CharacterGrid";
import { Dashboard } from "@/components/Dashboard";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MarketNews } from "@/components/MarketNews";
import { Navbar } from "@/components/Navbar";
import { PortfolioSimulator } from "@/components/PortfolioSimulator";
import { TickerTape } from "@/components/TickerTape";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <TickerTape />
      <Dashboard />
      <CharacterGrid />
      <PortfolioSimulator />
      <MarketNews />
      <Footer />
    </main>
  );
}

