import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { MarketScreener } from "@/components/MarketScreener";
import { Navbar } from "@/components/Navbar";

export default function MarketPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <AnimatedBackground />
      <Navbar />
      <MarketScreener />
      <Footer />
    </main>
  );
}
