"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/site-path";
import { clearAccount, createAccount, readAccount, STARTING_CASH, writeAccount } from "@/lib/account";

export default function LoginPage() {
  const router = useRouter();
  const [alias, setAlias] = useState("dealer");
  const [crew, setCrew] = useState("J High");
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    const account = readAccount();
    if (account) {
      setAlias(account.alias);
      setCrew(account.crew);
      setHasAccount(true);
    }
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const existing = readAccount();
    if (existing) {
      setHasAccount(true);
      router.push("/#portfolio");
      return;
    }

    writeAccount(createAccount(alias.trim() || "dealer", crew));
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
      <Image src={assetPath("/images/seoul-night.svg")} alt="Seoul night terminal background" fill priority className="object-cover opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(239,35,60,.2),transparent_28%),linear-gradient(90deg,#030405_0%,rgba(3,4,5,.84)_52%,rgba(3,4,5,.96)_100%)]" />

      <section className="relative z-10 mx-auto grid min-h-screen w-[min(1080px,calc(100%-32px))] items-center gap-8 py-12 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/"><ArrowLeft size={16} /> Back to market</Link>
          </Button>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.22em] text-crimson">PTJ private desk</p>
          <h1 className="mt-4 font-comic text-[clamp(3.2rem,8vw,7rem)] font-black uppercase leading-[0.88] tracking-tight">
            Crew access
            <span className="block text-slate-400">terminal</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            One-time local account setup for PTJ-Stocks. Every new desk starts with {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(STARTING_CASH)} demo cash for the crew market.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-black/55 p-5 shadow-2xl backdrop-blur md:p-8">
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
              <p className="mt-1 text-3xl font-black uppercase">{hasAccount ? "Desk active" : "New desk"}</p>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-crimson/30 bg-crimson/10 text-crimson">
              {hasAccount ? <Check size={24} /> : <Shield size={24} />}
            </div>
          </div>

          <label className="block">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">Dealer alias</span>
            <input
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition focus:border-crimson"
              value={alias}
              disabled={hasAccount}
              onChange={(event) => setAlias(event.target.value)}
            />
          </label>

          <label className="mt-5 block">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">Crew / school</span>
            <select
              className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black px-4 text-sm outline-none transition focus:border-crimson"
              value={crew}
              disabled={hasAccount}
              onChange={(event) => setCrew(event.target.value)}
            >
              {["J High", "Big Deal", "Workers", "Hostel", "White Tiger", "God Dog", "Allied"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <Button className="mt-7 w-full" size="lg" type="submit">{hasAccount ? "Continue to crew basket" : "Create account"}</Button>
          {hasAccount ? (
            <Button className="mt-3 w-full" size="lg" type="button" variant="ghost" onClick={reset}>
              <RotateCcw size={16} /> Reset local desk
            </Button>
          ) : null}
          <p className="mt-4 text-xs leading-6 text-slate-500">
            This account is saved in this browser. No real trading, no password, no server account.
          </p>
        </form>
      </section>
    </main>
  );
}
