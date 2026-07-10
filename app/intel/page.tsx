import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { IntelligenceHub } from "@/components/IntelligenceHub";
import { Navbar } from "@/components/Navbar";

export default function IntelPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <AnimatedBackground />
      <Navbar />
      <IntelligenceHub />
      <Footer />
    </main>
  );
}
