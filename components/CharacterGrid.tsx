import { characterRoster } from "@/lib/market-data";
import { CharacterCard } from "@/components/CharacterCard";

export function CharacterGrid() {
  return (
    <section id="characters" className="relative z-10 border-y border-white/10 bg-white/[0.025] py-24">
      <div className="mx-auto w-[min(1440px,calc(100%-32px))]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyanline">Character equities</p>
            <h2 className="mt-3 font-display text-6xl uppercase leading-none md:text-8xl">Power Cards</h2>
          </div>
          <p className="max-w-xl text-slate-400">
            Original silhouette cards with manga-panel borders, glow accents, and momentum pricing for the main Lookism names.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {characterRoster.map((character, index) => (
            <CharacterCard key={character.name} character={character} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

