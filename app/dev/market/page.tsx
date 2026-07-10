import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getMarketState } from "@/lib/market-engine";
import { getSourceRecords } from "@/lib/sources";
import { ACCOUNT_SCHEMA_VERSION } from "@/lib/account";
import { appConfig, featureFlags } from "@/lib/config";
import snapshot from "@/public/data/market-snapshot.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DevMarketPage() {
  const market = getMarketState();
  const sources = getSourceRecords();
  const missingImages = market.assets.filter((asset) => !asset.image);
  const staleSources = sources.filter((source) => source.status !== "active");
  const apiLinks = ["/api/market", "/api/assets", "/api/sources", "/api/events", "/api/seasons", "/api/indices", "/api/factions", "/api/health", "/api/snapshot"];

  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <AnimatedBackground />
      <Navbar />
      <section className="section-wrap relative z-10 py-10">
        <div className="mb-8">
          <p className="terminal-label text-ice">Safe diagnostics</p>
          <h1 className="mt-3 font-display text-6xl font-bold uppercase leading-none">Market Health</h1>
          {!featureFlags.enableDevDiagnostics ? (
            <p className="mt-3 max-w-2xl text-sm text-amber">Diagnostics are disabled by deployment config. This read-only shell stays public-safe and exposes no secrets.</p>
          ) : null}
        </div>
        {!featureFlags.enableDevDiagnostics ? (
          <Card>
            <CardHeader><CardTitle>Diagnostics Disabled</CardTitle></CardHeader>
            <CardContent className="text-sm text-slate-300">
              Set <code>NEXT_PUBLIC_ENABLE_DEV_DIAGNOSTICS=true</code> to show read-only diagnostics in a hosted environment.
            </CardContent>
          </Card>
        ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Snapshot</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div><p className="terminal-label">Engine</p><p>{market.engineVersion}</p></div>
              <div><p className="terminal-label">Generated</p><p>{market.generatedAt}</p></div>
              <div><p className="terminal-label">Assets</p><p>{market.assets.length}</p></div>
              <div><p className="terminal-label">Sources</p><p>{sources.length}</p></div>
              <div><p className="terminal-label">Events</p><p>{market.events.length}</p></div>
              <div><p className="terminal-label">Indices</p><p>{market.indices.length}</p></div>
              <div><p className="terminal-label">Factions</p><p>{market.factions.length}</p></div>
              <div><p className="terminal-label">Snapshot file</p><p>{snapshot.generatedAt}</p></div>
              <div><p className="terminal-label">Account schema</p><p>v{ACCOUNT_SCHEMA_VERSION}</p></div>
              <div><p className="terminal-label">App mode</p><p>{appConfig.mode}</p></div>
              <div><p className="terminal-label">Stale sources</p><p>{staleSources.length}</p></div>
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
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>API Links</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-sm">
              {apiLinks.map((href) => (
                <a key={href} className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-ice transition hover:border-ice/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice" href={href}>
                  {href}
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
