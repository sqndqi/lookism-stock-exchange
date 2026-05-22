"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatCurrency, signedPercent } from "@/lib/utils";
import { assetPath } from "@/lib/site-path";

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
  image: string;
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
      whileHover={{ y: -4 }}
      className="group manga-border manhwa-panel relative min-h-[460px] overflow-hidden rounded-2xl bg-black p-4"
    >
      <Image
        src={assetPath(character.image)}
        alt=""
        width={420}
        height={560}
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-[0.18] grayscale transition duration-300 group-hover:scale-105 group-hover:opacity-[0.28]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(215,25,32,.24),transparent_28%),linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.82)_64%,rgba(0,0,0,.94))]" />
      <div className="absolute -right-16 top-12 h-52 w-52 rounded-full blur-3xl opacity-20" style={{ background: character.signatureColor }} />
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: character.signatureColor }} />
      <div className="relative z-10 flex items-start justify-between">
        <div className="rounded-xl border border-white/10 bg-black/55 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-slate-300">
          Rank #{character.rank}
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-black/65 font-comic text-lg text-white">
          {initials}
        </div>
      </div>
      <div className="relative z-10 mt-20 flex items-center justify-between">
        <span className="rounded-full border border-white/10 bg-black/55 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-ice">
          {character.rarity}
        </span>
        <span className={positive ? "text-profit" : "text-danger"}>
          {positive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </span>
      </div>
      <div className="relative z-10 mt-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400">{character.ticker} / {character.faction}</p>
        <h3 className="mt-2 font-comic text-4xl font-black uppercase leading-none text-white text-shadow-red">{character.name}</h3>
        <p className="mt-1 text-sm font-medium text-slate-300">{character.generation}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs uppercase tracking-[0.1em] text-slate-300">
          <div className="rounded-xl border border-white/10 bg-black/55 p-3 backdrop-blur">
            <span className="block text-slate-500">Style</span>
            <strong className="mt-1 block text-white">{character.fightingStyle}</strong>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/55 p-3 backdrop-blur">
            <span className="block text-slate-500">Mastery</span>
            <strong className="mt-1 block text-white">{character.masteryType}</strong>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-400">Street Value</p>
            <p className="text-2xl font-black">{formatCurrency(character.price)}</p>
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
        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-xs uppercase tracking-[0.12em] text-slate-300">
          Current arc: <span className="text-white">{character.currentArc}</span>
        </p>
      </div>
    </motion.article>
  );
}
