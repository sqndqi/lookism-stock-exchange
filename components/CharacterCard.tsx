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
      whileHover={{ y: -10 }}
      className="group manga-border panel-cut relative min-h-[380px] overflow-hidden bg-gradient-to-b from-white/10 to-black/50 p-5"
    >
      <div className="absolute inset-0 bg-scanline opacity-10" />
      <div className="absolute inset-x-0 top-0 h-1 bg-cyanline shadow-[0_0_22px_rgba(125,211,252,.9)]" />
      <div className="absolute bottom-0 left-1/2 h-[70%] w-[42%] -translate-x-1/2 rounded-t-full bg-black transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute bottom-[22%] left-1/2 grid h-24 w-24 -translate-x-1/2 place-items-center rounded-full border border-white/10 bg-slate-950 text-4xl font-black text-white/80 transition-transform duration-500 group-hover:scale-110">
        {initials}
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-cyanline">Rank #{character.rank}</span>
        <span className={positive ? "text-profit" : "text-danger"}>
          {positive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </span>
      </div>
      <div className="relative z-10 mt-40">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{character.ticker} / {character.faction}</p>
        <h3 className="mt-2 font-display text-5xl uppercase leading-none">{character.name}</h3>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-sm text-slate-400">Market price</p>
            <p className="font-display text-4xl">{formatCurrency(character.price)}</p>
          </div>
          <p className={positive ? "text-profit" : "text-danger"}>{signedPercent(character.change)}</p>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-cyanline" style={{ width: `${character.power}%` }} />
        </div>
      </div>
    </motion.article>
  );
}

