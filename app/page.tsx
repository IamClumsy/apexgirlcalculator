"use client";

import { TablesProvider, useTables } from "@/app/lib/tables-context";
import { CalculatorLayout } from "@/app/components/calculator-layout";
import { HqGlass } from "@/app/components/sections/hq-glass";
import { CollectionGems } from "@/app/components/sections/collection-gems";
import { CarParts } from "@/app/components/sections/car-parts";
import { VillaSuite } from "@/app/components/sections/villa-suite";
import { Artists } from "@/app/components/sections/artists";
import { HqFloors } from "@/app/components/sections/hq-floors";
import { MuseumExhibits } from "@/app/components/sections/museum-exhibits";
import { CarCore } from "@/app/components/sections/car-core";
import { VillaHomemaking } from "@/app/components/sections/villa-homemaking";
import { Assets } from "@/app/components/sections/assets";

function CalculatorContent() {
  const { loading, error } = useTables();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-slate-400">Loading calculator data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <CalculatorLayout>
      {/* Left column */}
      <div className="space-y-6">
        <HqGlass />
        <CollectionGems />
        <CarParts />
        <VillaSuite />
        <Artists />
      </div>
      {/* Right column */}
      <div className="space-y-6">
        <HqFloors />
        <MuseumExhibits />
        <CarCore />
        <VillaHomemaking />
        <Assets />
      </div>
    </CalculatorLayout>
  );
}

export default function Home() {
  return (
    <TablesProvider>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <header className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
              Top Girl Resource Calculator
            </p>
            <h1 className="mt-4 text-4xl font-bold text-white">
              Level Progression Cost Calculator
            </h1>
            <p className="mt-2 text-slate-300">
              Only complete levels are available
            </p>
          </header>
          <CalculatorContent />
        </div>
      </div>
    </TablesProvider>
  );
}
