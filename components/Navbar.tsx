"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Menu, Moon, Music2, Search, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readAccount, type Account } from "@/lib/account";

const links = [
  ["Market", "#market"],
  ["Fighters", "#fighters"],
  ["Crews", "#crews"],
  ["Predictions", "#predictions"],
  ["Portfolio", "#portfolio"],
  ["Intel", "#intel"]
];

export function Navbar() {
  const [light, setLight] = useState(false);
  const [audio, setAudio] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("light", light);
  }, [light]);

  useEffect(() => {
    setAccount(readAccount());

    function accountUpdated(event: Event) {
      setAccount(((event as CustomEvent<Account | null>).detail ?? null));
    }

    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => window.removeEventListener("ptj-account-updated", accountUpdated);
  }, []);

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
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav className="section-wrap terminal-shell relative flex h-16 items-center justify-between rounded-lg px-3 backdrop-blur-xl md:px-4">
        <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-md border border-crimson/40 bg-crimson/10 font-display text-lg font-black text-crimson shadow-[0_0_28px_rgba(239,35,60,.18)]">
            AX
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-bold tracking-wide">AURA EXCHANGE</span>
            <span className="terminal-label hidden text-[0.56rem] sm:block">Seoul fighter market terminal</span>
          </span>
        </a>
        <div className="hidden items-center gap-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-300 lg:flex">
          {links.map(([label, href]) => (
            <a key={href} className="transition hover:text-ice" href={href}>{label}</a>
          ))}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="status-dot rounded border border-crimson/30 bg-crimson/10 px-3 py-2 font-mono text-[0.64rem] font-bold uppercase tracking-[0.16em] text-crimson">Live</span>
          <Button aria-label="Search fighter assets" asChild variant="ghost" size="sm"><a href="#fighters"><Search size={16} /></a></Button>
          <Button aria-label="Open intelligence alerts" asChild variant="ghost" size="sm"><a href="#intel"><Bell size={16} /></a></Button>
          <Button aria-label="Toggle ambient audio" variant="ghost" size="sm" onClick={() => setAudio((value) => !value)}>
            <Music2 size={16} className={audio ? "text-cyanline" : ""} />
          </Button>
          <Button aria-label="Toggle light mode" variant="ghost" size="sm" onClick={() => setLight((value) => !value)}>
            {light ? <Moon size={16} /> : <Sun size={16} />}
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={account ? "/#portfolio" : "/login"}>{account ? "Desk Open" : "Create Desk"}</Link>
          </Button>
        </div>
        <Button
          className="sm:hidden"
          aria-controls="mobile-market-nav"
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          variant="ghost"
          size="sm"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </Button>
        {open && (
          <div id="mobile-market-nav" className="absolute inset-x-0 top-[calc(100%+8px)] rounded-lg border border-white/10 bg-black/95 p-3 shadow-panel backdrop-blur-xl sm:hidden">
            <div className="grid gap-1">
              {links.map(([label, href]) => (
                <a key={href} className="rounded-md px-3 py-3 text-sm font-bold uppercase tracking-[0.12em] text-slate-200 hover:bg-white/10" href={href} onClick={() => setOpen(false)}>
                  {label}
                </a>
              ))}
              <Link className="rounded-md bg-crimson px-3 py-3 text-sm font-black uppercase tracking-[0.12em] text-white" href={account ? "/#portfolio" : "/login"} onClick={() => setOpen(false)}>
                {account ? "Open Desk" : "Create Desk"}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
