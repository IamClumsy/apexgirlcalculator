"use client";

import { useState, useMemo } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookup, vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { DropdownInput } from "../inputs/dropdown-input";
import { LevelRangeInput } from "../inputs/level-range-input";
import { ResultDisplay } from "../result-display";

const RANK_OPTIONS = ["D", "C", "B", "A", "A+"];
const HQ_MULTIPLIER = 125;

export function CarCore() {
  const { tables } = useTables();
  const [rank, setRank] = useState("A");
  const [from, setFrom] = useState(38);
  const [to, setTo] = useState(60);

  const tierNum = useMemo(() => {
    if (!tables?.carRanks) return null;
    return vlookup(rank, tables.carRanks.data, 2);
  }, [tables, rank]);

  const isEnhanced = rank === "A" || rank === "A+";

  const plugs = useMemo(() => {
    if (!tables?.carCore || tierNum == null) return null;
    return vlookupDiff(from - 1, to - 1, tables.carCore.data, tierNum * 2);
  }, [tables, from, to, tierNum]);

  const coils = useMemo(() => {
    if (!tables?.carCore || tierNum == null) return null;
    return vlookupDiff(from - 1, to - 1, tables.carCore.data, tierNum * 2 + 1);
  }, [tables, from, to, tierNum]);

  return (
    <CalculatorSection title="Car Core">
      <DropdownInput label="Rank" value={rank} options={RANK_OPTIONS} onChange={setRank} />
      <LevelRangeInput from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ResultDisplay
        results={[
          {
            label: isEnhanced ? "Enhanced Plugs" : "Plugs",
            value: plugs,
            equivalent: isEnhanced && plugs != null ? { label: "Plugs", value: plugs * HQ_MULTIPLIER } : null,
          },
          {
            label: isEnhanced ? "Enhanced Coils" : "Coils",
            value: coils,
            equivalent: isEnhanced && coils != null ? { label: "Coils", value: coils * HQ_MULTIPLIER } : null,
          },
        ]}
      />
    </CalculatorSection>
  );
}
