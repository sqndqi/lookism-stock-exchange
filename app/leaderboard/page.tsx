import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { LeaderboardTerminal } from "@/components/LeaderboardTerminal";
import { Navbar } from "@/components/Navbar";

export default function LeaderboardPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <AnimatedBackground />
      <Navbar />
      <LeaderboardTerminal />
      <Footer />
    </main>
  );
}
