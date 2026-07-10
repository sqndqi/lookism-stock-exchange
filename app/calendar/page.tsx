import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SeasonEventPanel } from "@/components/SeasonEventPanel";

export default function CalendarPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <AnimatedBackground />
      <Navbar />
      <section className="section-wrap relative z-10 py-10">
        <div className="mb-8">
          <p className="terminal-label text-ice">Market calendar</p>
          <h1 className="mt-3 font-display text-6xl font-bold uppercase leading-none">Events & Seasons</h1>
        </div>
        <SeasonEventPanel />
      </section>
      <Footer />
    </main>
  );
}
