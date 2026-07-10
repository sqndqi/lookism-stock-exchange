"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, RotateCcw, Shield, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/site-path";
import { clearAccount, createAccount, readAccount, STARTING_CASH, writeAccount } from "@/lib/account";
import { formatCurrency } from "@/lib/utils";

const crewOptions = [
  { name: "J High", note: "Daniel's circle" },
  { name: "Big Deal", note: "Gangseo loyalty" },
  { name: "Workers", note: "Affiliate machine" },
  { name: "Hostel", note: "Family first" },
  { name: "White Tiger", note: "Monster desk" },
  { name: "God Dog", note: "Copy pressure" },
  { name: "Allied", note: "Strike team" }
];

export default function LoginPage() {
  const router = useRouter();
  const [alias, setAlias] = useState("dealer");
  const [crew, setCrew] = useState("J High");
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    const account = readAccount();
    if (!account) return;
    setAlias(account.alias);
    setCrew(account.crew);
    setHasAccount(true);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const existing = readAccount();

    if (existing) {
      router.push("/#portfolio");
      return;
    }

    const next = createAccount(alias.trim() || "dealer", crew);
    writeAccount(next);
    setHasAccount(true);
    router.push("/#portfolio");
  }

  function reset() {
    clearAccount();
    setAlias("dealer");
    setCrew("J High");
    setHasAccount(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-white">
      <Image src={assetPath("/images/seoul-night.svg")} alt="Seoul night background" fill priority className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(215,25,32,.22),transparent_26%),radial-gradient(circle_at_82%_20%,rgba(125,211,252,.18),transparent_24%),linear-gradient(180deg,rgba(3,4,5,.86),rgba(3,4,5,.97))]" />

      <section className="section-wrap relative z-10 grid min-h-screen items-center gap-8 py-10 lg:grid-cols-[1.02fr_.98fr]">
        <div className="terminal-shell relative overflow-hidden rounded-lg p-6 backdrop-blur md:p-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/"><ArrowLeft size={16} /> Back to market</Link>
          </Button>

          <p className="terminal-label mt-8 text-crimson">AURA EXCHANGE desk access</p>
          <h1 className="mt-4 font-display text-[clamp(3.5rem,8vw,7rem)] font-bold uppercase leading-[0.82] tracking-normal">
            {hasAccount ? "Local desk active" : "Open your desk"}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            {hasAccount
              ? "This browser already has an AURA EXCHANGE desk. Jump back into the portfolio simulator or wipe the local desk and start over."
              : `One-time local account setup. Every desk starts with ${formatCurrency(STARTING_CASH)} demo cash and unlocks fake orders, watchlists, scenario contracts, and custom local listings.`}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-black/45 p-4">
              <p className="terminal-label">Demo Cash</p>
              <p className="mt-2 font-display text-4xl font-bold">{formatCurrency(STARTING_CASH)}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/45 p-4">
              <p className="terminal-label">Account Type</p>
              <p className="mt-2 font-display text-4xl font-bold">{hasAccount ? "Local" : "New"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-black/45 p-4">
              <p className="terminal-label">Storage</p>
              <p className="mt-2 font-display text-4xl font-bold">Browser</p>
            </div>
          </div>

          <div className="dossier-panel relative mt-8 h-[340px] rounded-lg bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_12%,rgba(215,25,32,.22),transparent_24%),linear-gradient(90deg,rgba(0,0,0,.88),rgba(0,0,0,.42),rgba(0,0,0,.08))]" />
            <Image
              src={assetPath("/images/fighter-daniel.png")}
              alt="Big Daniel login feature render"
              width={900}
              height={1200}
              priority
              className="absolute bottom-0 right-[-8px] h-full w-auto object-contain object-bottom"
            />
            <div className="relative z-10 flex h-full max-w-sm flex-col justify-between p-5">
              <div className="rounded-md border border-white/10 bg-black/55 px-4 py-3">
                <p className="terminal-label">Desk Feature</p>
                <p className="mt-1 font-display text-3xl font-bold uppercase">Big Daniel</p>
              </div>
              <div className="space-y-3">
                <div className="rounded-md border border-white/10 bg-black/55 p-4">
                  <p className="terminal-label">Why the desk exists</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Keep your one-time local account, crew basket, and chapter positions in the browser without a backend login flow.
                  </p>
                </div>
                <div className="inline-flex rounded-md border border-crimson/30 bg-crimson/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-crimson">
                  No password / no real money
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="terminal-shell rounded-lg p-6 backdrop-blur md:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="terminal-label">Status</p>
              <p className="mt-1 font-display text-4xl font-bold uppercase">{hasAccount ? "Desk active" : "Create desk"}</p>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-md border border-crimson/30 bg-crimson/10 text-crimson">
              {hasAccount ? <Check size={24} /> : <Shield size={24} />}
            </div>
          </div>

          <label className="mt-6 block">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">Dealer alias</span>
            <input
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition focus:border-crimson focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              value={alias}
              disabled={hasAccount}
              aria-label="Dealer alias"
              onChange={(event) => setAlias(event.target.value)}
            />
          </label>

          <div className="mt-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">Crew / school</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {crewOptions.map((option) => {
                const active = crew === option.name;
                return (
                  <button
                    key={option.name}
                    type="button"
                    disabled={hasAccount}
                    onClick={() => setCrew(option.name)}
                    aria-pressed={active}
                    className={`rounded-md border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                      active
                        ? "border-crimson/50 bg-crimson/12 shadow-[0_0_0_1px_rgba(215,25,32,.18)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    } ${hasAccount ? "cursor-default opacity-80" : ""}`}
                  >
                    <p className="text-base font-black uppercase">{option.name}</p>
                    <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-slate-400">{option.note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-md border border-white/10 bg-black/35 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-black/45 text-crimson">
                <Wallet size={18} />
              </div>
              <div>
                <p className="terminal-label">Desk Package</p>
                <p className="text-sm text-slate-300">{hasAccount ? "This desk is already loaded and ready." : `${formatCurrency(STARTING_CASH)} demo cash on creation.`}</p>
              </div>
            </div>
          </div>

          <Button className="mt-7 w-full" size="lg" type="submit">
            {hasAccount ? "Enter portfolio" : "Create local desk"}
          </Button>
          {hasAccount ? (
            <Button className="mt-3 w-full" size="lg" type="button" variant="ghost" onClick={reset}>
              <RotateCcw size={16} /> Reset local desk
            </Button>
          ) : null}
          <p className="mt-4 text-xs leading-6 text-slate-400">
            Local browser account only. No password, no server auth, no real trading.
          </p>
        </form>
      </section>
    </main>
  );
}
