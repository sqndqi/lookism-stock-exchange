import { AnimatedBackground } from "@/components/AnimatedBackground";
import { CharacterGrid } from "@/components/CharacterGrid";
import { CrewMissions } from "@/components/CrewMissions";
import { Dashboard } from "@/components/Dashboard";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { IntelligenceHub } from "@/components/IntelligenceHub";
import { MarketStatusBanner } from "@/components/MarketStatusBanner";
import { MarketNews } from "@/components/MarketNews";
import { Navbar } from "@/components/Navbar";
import { PortfolioSimulator } from "@/components/PortfolioSimulator";
import { PredictionMarket } from "@/components/PredictionMarket";
import { TickerTape } from "@/components/TickerTape";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <MarketStatusBanner />
      <TickerTape />
      <IntelligenceHub />
      <Dashboard />
      <CharacterGrid />
      <PredictionMarket />
      <CrewMissions />
      <PortfolioSimulator />
      <MarketNews />
      <Footer />
    </main>
  );
}
