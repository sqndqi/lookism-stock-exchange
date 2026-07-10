"use client";

import { useState } from "react";
import { useEffect } from "react";
import { missions } from "@/lib/market-data";
import type { Account } from "@/lib/account";
import { addXp, readAccount, writeAccount } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const crews = [
  {
    name: "Allied",
    leader: "Daniel Park",
    territory: "Low territory / high plot impact",
    members: "Small strike team",
    threat: 96,
    betrayalRisk: "Low",
    pressure: "Workers and Charles Choi Network",
    status: "Elite rescue unit, not a mass crew",
    change: "+11.4%"
  },
  {
    name: "Workers / Affiliates",
    leader: "Eugene",
    territory: "Affiliate network",
    members: "High infrastructure",
    threat: 91,
    betrayalRisk: "Extreme",
    pressure: "Internal affiliates, Allied, Big Deal",
    status: "Money, leverage, and criminal systems",
    change: "-4.8%"
  },
  {
    name: "Big Deal",
    leader: "Jake Kim",
    territory: "Gangseo street zone",
    members: "Loyal street crew",
    threat: 84,
    betrayalRisk: "Low",
    pressure: "Workers, Gapryong legacy",
    status: "Street romance, loyalty, Jake identity",
    change: "+8.9%"
  },
  {
    name: "J High Alliance",
    leader: "Daniel's Circle",
    territory: "School alliance",
    members: "Small core group",
    threat: 88,
    betrayalRisk: "Low",
    pressure: "Body mystery, Workers",
    status: "School-side rescue and training arc pressure",
    change: "+6.2%"
  },
  {
    name: "White Tiger",
    leader: "Tom Lee",
    territory: "Mercenary network",
    members: "Contract fighters",
    threat: 94,
    betrayalRisk: "Medium",
    pressure: "Gun proximity, old generation secrets",
    status: "High-end fight labor and old guard influence",
    change: "+5.1%"
  }
];

export function CrewMissions() {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    setAccount(readAccount());

    function accountUpdated(event: Event) {
      setAccount((event as CustomEvent<Account>).detail);
    }

    window.addEventListener("ptj-account-updated", accountUpdated);
    return () => window.removeEventListener("ptj-account-updated", accountUpdated);
  }, []);

  function checkIn() {
    if (!account) return;
    const checkedIn = account.claimedMissions.includes("Daily check-in");
    if (checkedIn) return;
    const next = addXp({
      ...account,
      claimedMissions: [...account.claimedMissions, "Daily check-in"]
    }, 25);
    setAccount(next);
    writeAccount(next);
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: "Daily desk sync logged. Cosmetic XP only." }));
  }

  const checkedIn = account?.claimedMissions.includes("Daily check-in") ?? false;
  const cash = account?.cash ?? 0;

  return (
    <section id="crews" className="section-wrap relative z-10 grid gap-5 py-14 lg:grid-cols-[.82fr_1.18fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge>Desk missions</Badge>
              <CardTitle className="mt-4">Trading Desk Access</CardTitle>
            </div>
            <div className="rounded-md border border-white/10 bg-black/35 p-3 text-right">
              <p className="terminal-label text-[0.58rem]">Demo Cash</p>
              <p className="text-3xl font-black">{account ? `₳${cash.toLocaleString()}` : "Locked"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button className="mb-5 w-full" onClick={checkIn} variant={checkedIn ? "ghost" : "default"} disabled={!account}>
            {!account ? "Create desk to unlock missions" : checkedIn ? "Daily sync logged" : "Log daily desk sync"}
          </Button>
          <div className="space-y-3">
            {missions.map((mission) => (
              <div key={mission.title} className="rounded-md border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-crimson/10 text-crimson">
                      <mission.icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold">{mission.title}</p>
                      <p className="terminal-label text-[0.58rem]">Cosmetic XP track / no credit reward</p>
                    </div>
                  </div>
                  <span className="font-mono text-ice">{mission.progress}%</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-crimson" style={{ width: `${mission.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Badge>Sector board</Badge>
          <CardTitle className="mt-4">Crew / Faction Market</CardTitle>
          <p className="text-sm text-slate-400">Crews behave like sector funds: leaders, territory, influence, betrayal risk, and active catalysts change the price.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {crews.map((crew, index) => (
            <div key={crew.name} className="grid gap-4 rounded-md border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
              <div className="font-display text-4xl font-bold text-crimson">#{index + 1}</div>
              <div>
                <p className="font-display text-3xl font-bold uppercase">{crew.name}</p>
                <p className="terminal-label text-[0.58rem]">
                  Leader {crew.leader} / {crew.members} / {crew.territory}
                </p>
                <p className="mt-2 text-sm text-slate-400">{crew.status}</p>
                <p className="terminal-label mt-2 text-[0.58rem]">
                  Enemies: {crew.pressure} / Betrayal risk: {crew.betrayalRisk}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className={crew.change.startsWith("+") ? "text-profit" : "text-danger"}>{crew.change}</span>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate-500">Threat {crew.threat}/100</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
