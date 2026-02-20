"use client";

import { useState, useMemo } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { LevelRangeInput } from "../inputs/level-range-input";
import { ResultDisplay } from "../result-display";

export function HqGlass() {
  const { tables } = useTables();
  const [from, setFrom] = useState(273);
  const [to, setTo] = useState(370);

  const glass = useMemo(() => {
    if (!tables?.glass) return null;
    return vlookupDiff(from - 1, to - 1, tables.glass.data, 3);
  }, [tables, from, to]);

  return (
    <CalculatorSection title="HQ Glass" note="*Available up to level 426">
      <LevelRangeInput from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ResultDisplay results={[{ label: "Glass", value: glass }]} />
    </CalculatorSection>
  );
}
