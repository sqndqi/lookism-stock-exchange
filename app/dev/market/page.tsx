import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getMarketState } from "@/lib/market-engine";
import { getSourceRecords } from "@/lib/sources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DevMarketPage() {
  const market = getMarketState();
  const sources = getSourceRecords();
  const missingImages = market.assets.filter((asset) => !asset.image);

  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <AnimatedBackground />
      <Navbar />
      <section className="section-wrap relative z-10 py-10">
        <div className="mb-8">
          <p className="terminal-label text-ice">Safe diagnostics</p>
          <h1 className="mt-3 font-display text-6xl font-bold uppercase leading-none">Market Health</h1>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Snapshot</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div><p className="terminal-label">Engine</p><p>{market.engineVersion}</p></div>
              <div><p className="terminal-label">Generated</p><p>{market.generatedAt}</p></div>
              <div><p className="terminal-label">Assets</p><p>{market.assets.length}</p></div>
              <div><p className="terminal-label">Sources</p><p>{sources.length}</p></div>
              <div><p className="terminal-label">Events</p><p>{market.events.length}</p></div>
              <div><p className="terminal-label">Missing images</p><p>{missingImages.length}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Commands</CardTitle></CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-300">
              {["npm run validate:data", "npm run audit:images", "npm run update:market", "npm run check"].map((command) => (
                <code key={command} className="rounded-md border border-white/10 bg-black/30 p-3">{command}</code>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </main>
  );
}
