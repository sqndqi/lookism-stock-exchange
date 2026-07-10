"use client";

import type { Account } from "@/lib/account";
import type { MarketAsset } from "@/lib/market-data";
import { achievements, rankForLevel, syncAchievements } from "@/lib/progression";
import { writeAccount } from "@/lib/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProgressionPanel({ account, assets, onAccount }: { account: Account | null; assets: MarketAsset[]; onAccount: (account: Account | null) => void }) {
  const unlocked = new Set(account?.achievements.map((achievement) => achievement.id) ?? []);
  function sync() {
    if (!account) return;
    const result = syncAchievements(account, assets);
    writeAccount(result.account);
    onAccount(result.account);
    window.dispatchEvent(new CustomEvent("aura-toast", { detail: result.newlyUnlocked.length ? `Unlocked ${result.newlyUnlocked.length} achievement(s).` : "No new achievements yet." }));
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle>Progression</CardTitle>
          <p className="text-sm text-slate-400">Cosmetic local XP only. No credit rewards, no pay-to-win.</p>
        </div>
        <Button variant="ghost" onClick={sync} disabled={!account}>Sync Unlocks</Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-md border border-white/10 bg-black/25 p-4">
          <p className="terminal-label">Local rank</p>
          <p className="mt-2 font-display text-3xl font-bold uppercase">{account ? rankForLevel(account.level) : "No desk"}</p>
          <p className="text-sm text-slate-400">{account ? `Level ${account.level} / ${account.xp} XP` : "Open a desk to start cosmetic progression."}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {achievements.map((achievement) => (
            <div key={achievement.id} className={`rounded-md border p-4 ${unlocked.has(achievement.id) ? "border-ice/30 bg-ice/10" : "border-white/10 bg-black/25"}`}>
              <p className="font-display text-xl font-bold uppercase">{achievement.title}</p>
              <p className="mt-1 text-sm text-slate-400">{achievement.description}</p>
              <p className="mt-2 terminal-label">{unlocked.has(achievement.id) ? "Unlocked" : `${achievement.xp} XP`}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
