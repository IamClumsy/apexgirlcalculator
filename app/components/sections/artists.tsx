"use client";

import { useState, useMemo } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { LevelRangeInput } from "../inputs/level-range-input";
import { ResultDisplay } from "../result-display";

export function Artists() {
  const { tables } = useTables();
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(160);

  const exp = useMemo(() => {
    if (!tables?.artists) return null;
    return vlookupDiff(from - 1, to - 1, tables.artists.data, 3);
  }, [tables, from, to]);

  const promo = useMemo(() => {
    if (!tables?.artists) return null;
    return vlookupDiff(from - 1, to - 1, tables.artists.data, 5);
  }, [tables, from, to]);

  return (
    <CalculatorSection title="Artists" color="pink">
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
