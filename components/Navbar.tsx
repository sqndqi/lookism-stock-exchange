"use client";

import { useEffect, useState } from "react";
import { Bell, Moon, Music2, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [light, setLight] = useState(false);
  const [audio, setAudio] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("light", light);
  }, [light]);

  useEffect(() => {
    if (!audio) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 74;
    gain.gain.value = 0.025;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    return () => {
      osc.stop();
      ctx.close();
    };
  }, [audio]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-abyss/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-[min(1440px,calc(100%-32px))] items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-cyanline/40 bg-cyanline/10 font-display text-2xl text-cyanline shadow-glow">
            PTJ
          </span>
          <span className="hidden font-display text-2xl tracking-wide sm:block">LOOKISM STOCK EXCHANGE</span>
        </a>
        <div className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.22em] text-slate-300 lg:flex">
          <a className="transition hover:text-cyanline" href="#intel">Intel</a>
          <a className="transition hover:text-cyanline" href="#market">Market</a>
          <a className="transition hover:text-cyanline" href="#characters">Characters</a>
          <a className="transition hover:text-cyanline" href="#predictions">Predictions</a>
          <a className="transition hover:text-cyanline" href="#crews">Crews</a>
          <a className="transition hover:text-cyanline" href="#portfolio">Portfolio</a>
        </div>
        <div className="flex items-center gap-2">
          <Button aria-label="Search" variant="ghost" size="sm"><Search size={16} /></Button>
          <Button aria-label="Alerts" variant="ghost" size="sm"><Bell size={16} /></Button>
          <Button aria-label="Toggle ambient audio" variant="ghost" size="sm" onClick={() => setAudio((value) => !value)}>
            <Music2 size={16} className={audio ? "text-cyanline" : ""} />
          </Button>
          <Button aria-label="Toggle light mode" variant="ghost" size="sm" onClick={() => setLight((value) => !value)}>
            {light ? <Moon size={16} /> : <Sun size={16} />}
          </Button>
        </div>
      </nav>
    </header>
  );
}
