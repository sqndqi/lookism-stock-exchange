import { characterRoster } from "@/lib/market-data";
import { CharacterCard } from "@/components/CharacterCard";

export function CharacterGrid() {
  return (
    <section id="characters" className="relative z-10 border-y border-white/10 bg-white/[0.02] py-16">
      <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-ice">Character profiles</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none md:text-6xl">Rising Legends</h2>
          </div>
          <p className="max-w-xl text-slate-400">
            Mythic and legendary fighter cards with aura level, generation, mastery type, crew affiliation, current arc, and signature color pressure.
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
