import { Clock3, RadioTower, ShieldAlert } from "lucide-react";

export function MarketStatusBanner() {
  return (
    <section className="relative z-20 border-y border-crimson/25 bg-crimson/10 backdrop-blur-xl">
      <div className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-4 py-4 text-sm md:grid-cols-[1fr_auto_auto] md:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-black/40 text-crimson">
            <ShieldAlert size={19} />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-crimson">Chapter halt protocol</p>
            <p className="text-slate-200">New fight intel under review. Aura pricing stays simulated while Reddit sentiment settles.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-300">
          <Clock3 size={16} className="text-ice" />
          Reopen estimate 01:57 KST
        </div>
        <a
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 transition hover:border-ice/60 hover:text-ice"
          href="https://www.reddit.com/r/lookismcomic/"
          target="_blank"
          rel="noreferrer"
        >
          <RadioTower size={16} />
          Reddit feed
        </a>
      </div>
    </section>
  );
}
