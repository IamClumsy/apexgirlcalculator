"use client";

import { useState, useMemo, useEffect } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { DropdownInput } from "../inputs/dropdown-input";
import { LevelRangeInput } from "../inputs/level-range-input";
import { ResultDisplay } from "../result-display";

type ArtistMod = { name: string; extra: number };

const NONE_OPTION = "None";

export function Artists() {
  const { tables } = useTables();
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(160);
  const [artistMods, setArtistMods] = useState<ArtistMod[]>([]);
  const [selectedArtist, setSelectedArtist] = useState(NONE_OPTION);

  useEffect(() => {
    fetch("/api/artist-mods")
      .then((r) => r.json())
      .then((data: ArtistMod[]) => setArtistMods(data))
      .catch(() => {});
  }, []);

  const multiplier = useMemo(() => {
    if (selectedArtist === NONE_OPTION) return 1;
    const mod = artistMods.find((m) => m.name === selectedArtist);
    return mod ? 1 + mod.extra : 1;
  }, [selectedArtist, artistMods]);

  const artistOptions = useMemo(
    () => [NONE_OPTION, ...artistMods.map((m) => m.name)],
    [artistMods]
  );

  const exp = useMemo(() => {
    if (!tables?.artists) return null;
    const base = vlookupDiff(from - 1, to - 1, tables.artists.data, 3);
    return base != null ? Math.ceil(base * multiplier) : null;
  }, [tables, from, to, multiplier]);

  const promo = useMemo(() => {
    if (!tables?.artists) return null;
    const base = vlookupDiff(from - 1, to - 1, tables.artists.data, 5);
    return base != null ? Math.ceil(base * multiplier) : null;
  }, [tables, from, to, multiplier]);

  return (
    <CalculatorSection title="Artists" color="pink">
      <DropdownInput
        label="Artist"
        value={selectedArtist}
        options={artistOptions}
        onChange={setSelectedArtist}
      />
      <LevelRangeInput from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ResultDisplay
        accentClass="text-pink-300"
        results={[
          { label: "EXP Cards", value: exp },
          { label: "Promotion Cards", value: promo },
        ]}
      />
    </CalculatorSection>
  );
}
