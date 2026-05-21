"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency, signedPercent } from "@/lib/utils";

type Character = {
  name: string;
  ticker: string;
  rank: number;
  price: number;
  change: number;
  power: number;
  faction: string;
  rarity: string;
  aura: number;
  generation: string;
  fightingStyle: string;
  masteryType: string;
  currentArc: string;
  signatureColor: string;
};

export function CharacterCard({ character, index }: { character: Character; index: number }) {
  const positive = character.change >= 0;
  const initials = character.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.035 }}
      whileHover={{ y: -14, rotateX: 3, rotateY: -3 }}
      className="group manga-border relative min-h-[520px] overflow-hidden rounded-[30px] bg-gradient-to-b from-white/12 via-white/[0.045] to-black/70 p-5"
    >
      <div className="absolute inset-0 bg-scanline opacity-10" />
      <div className="absolute inset-x-0 top-0 h-1 shadow-[0_0_34px_rgba(239,35,60,.85)]" style={{ background: character.signatureColor }} />
      <div className="aura-ring absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full opacity-0 transition duration-700 group-hover:opacity-90" />
      <div className="absolute bottom-24 left-1/2 h-[56%] w-[52%] -translate-x-1/2 rounded-t-full bg-black transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-[42%] left-1/2 grid h-28 w-28 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-black/70 text-5xl font-black text-white/85 shadow-[0_0_44px_rgba(0,0,0,.8)] backdrop-blur-xl transition-transform duration-700 group-hover:scale-110">
        {initials}
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-ice">
          #{character.rank} {character.rarity}
        </span>
        <span className={positive ? "text-profit" : "text-danger"}>
          {positive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </span>
      </div>
      <div className="relative z-10 mt-56">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{character.ticker} / {character.faction} / {character.generation}</p>
        <h3 className="mt-2 font-display text-6xl uppercase leading-[0.86] text-shadow-ice">{character.name}</h3>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.14em] text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <span className="block text-slate-500">Style</span>
            <strong className="mt-1 block text-white">{character.fightingStyle}</strong>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <span className="block text-slate-500">Mastery</span>
            <strong className="mt-1 block text-white">{character.masteryType}</strong>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-400">Aura price</p>
            <p className="font-display text-4xl">{formatCurrency(character.price)}</p>
          </div>
          <p className={positive ? "text-profit" : "text-danger"}>{signedPercent(character.change)}</p>
        </div>
        <div className="mt-4 space-y-2">
          {([
            ["Aura", character.aura],
            ["Power", character.power]
          ] as Array<[string, number]>).map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between font-mono text-[0.64rem] uppercase tracking-[0.18em] text-slate-500">
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full shadow-[0_0_18px_rgba(155,231,255,.5)]" style={{ width: `${value}%`, background: character.signatureColor }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-xs uppercase tracking-[0.16em] text-slate-300">
          Current arc: <span className="text-white">{character.currentArc}</span>
        </p>
      </div>
    </motion.article>
  );
}
