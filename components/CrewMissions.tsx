"use client";

import { useState } from "react";
import { missions } from "@/lib/market-data";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const crews = [
  { name: "Allied", members: 48210, equity: 18_200_000, change: "+11.4%" },
  { name: "Workers", members: 43890, equity: 16_940_000, change: "-4.8%" },
  { name: "Big Deal", members: 39100, equity: 14_610_000, change: "+8.9%" },
  { name: "White Tiger", members: 31840, equity: 13_200_000, change: "+5.1%" }
];

export function CrewMissions() {
  const [cash, setCash] = useState(1000);
  const [checkedIn, setCheckedIn] = useState(false);

  function checkIn() {
    if (checkedIn) return;
    setCash((value) => value + 300);
    setCheckedIn(true);
  }

  return (
    <section id="crews" className="relative z-10 mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 py-16 lg:grid-cols-[.95fr_1.05fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Badge>Guest desk</Badge>
              <CardTitle className="mt-4">Underground Missions</CardTitle>
            </div>
            <div className="rounded-md border border-white/10 bg-black/25 p-3 text-right">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Cash</p>
              <p className="text-3xl font-black">{formatCurrency(cash)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button className="mb-5 w-full" onClick={checkIn} variant={checkedIn ? "ghost" : "default"}>
            {checkedIn ? "Daily check-in claimed" : "Daily check-in (+$300)"}
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
                        Reward {formatCurrency(mission.reward)}
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
          <Badge>Crews</Badge>
          <CardTitle className="mt-4">Generation Rankings</CardTitle>
          <p className="text-sm text-slate-400">Crew power, member flow, and influence control across the current underground map.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {crews.map((crew, index) => (
            <div key={crew.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-md border border-white/10 bg-white/[0.035] p-4">
              <div className="text-3xl font-black text-crimson">#{index + 1}</div>
              <div>
                <p className="text-2xl font-black">{crew.name}</p>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                  {crew.members.toLocaleString()} members / {formatCurrency(crew.equity)} equity
                </p>
              </div>
              <span className={crew.change.startsWith("+") ? "text-profit" : "text-danger"}>{crew.change}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
