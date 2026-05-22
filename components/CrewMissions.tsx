"use client";

import { useState } from "react";
import { useEffect } from "react";
import { missions } from "@/lib/market-data";
import { formatCurrency } from "@/lib/utils";
import type { Account } from "@/lib/account";
import { readAccount, writeAccount } from "@/lib/account";
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
    const next = {
      ...account,
      cash: account.cash + 300,
      claimedMissions: [...account.claimedMissions, "Daily check-in"]
    };
    setAccount(next);
    writeAccount(next);
  }

  const checkedIn = account?.claimedMissions.includes("Daily check-in") ?? false;
  const cash = account?.cash ?? 0;

  return (
    <section id="crews" className="relative z-10 mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 py-16 lg:grid-cols-[.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge>Daily crew tasks</Badge>
              <CardTitle className="mt-4">Underground Missions</CardTitle>
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 p-3 text-right">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Demo Cash</p>
              <p className="text-3xl font-black">{account ? formatCurrency(cash) : "Locked"}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button className="mb-5 w-full" onClick={checkIn} variant={checkedIn ? "ghost" : "default"} disabled={!account}>
            {!account ? "Create account to unlock missions" : checkedIn ? "Daily check-in claimed" : "Daily crew check-in (+$300)"}
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
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                        Demo reward {formatCurrency(mission.reward)}
                      </p>
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
          <Badge>Crew War</Badge>
          <CardTitle className="mt-4">Crew War Map</CardTitle>
          <p className="text-sm text-slate-400">Lore-aware crew profiles based on leaders, territory, threat level, enemies, and current arc pressure.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {crews.map((crew, index) => (
            <div key={crew.name} className="grid gap-4 rounded-md border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[auto_1fr_auto] md:items-center">
              <div className="text-3xl font-black text-crimson">#{index + 1}</div>
              <div>
                <p className="text-2xl font-black">{crew.name}</p>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                  Leader {crew.leader} / {crew.members} / {crew.territory}
                </p>
                <p className="mt-2 text-sm text-slate-400">{crew.status}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
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
