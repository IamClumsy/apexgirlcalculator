"use client";

import { useState, useMemo } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { DropdownInput } from "../inputs/dropdown-input";
import { LevelRangeInput } from "../inputs/level-range-input";
import { ResultDisplay } from "../result-display";

const FLOOR_OPTIONS = ["1", "2", "3", "4", "5"];
const HQ_MULTIPLIER = 125;

export function HqFloors() {
  const { tables } = useTables();
  const [tier, setTier] = useState("3");
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(60);

  const tierNum = Number(tier);
  const isHQ = tierNum > 3;

  const wood = useMemo(() => {
    if (!tables?.floors) return null;
    return vlookupDiff(from - 1, to - 1, tables.floors.data, tierNum * 2);
  }, [tables, from, to, tierNum]);

  const steel = useMemo(() => {
    if (!tables?.floors) return null;
    return vlookupDiff(from - 1, to - 1, tables.floors.data, tierNum * 2 + 1);
  }, [tables, from, to, tierNum]);

  return (
    <CalculatorSection
      title="HQ Floors"
      note={tierNum <= 3 ? "*Use Only for Floors 1, 2 and 3" : undefined}
    >
      <DropdownInput label="Floor" value={tier} options={FLOOR_OPTIONS} onChange={setTier} />
      <LevelRangeInput from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ResultDisplay
        results={[
          {
            label: isHQ ? "HQ Wood" : "Wood",
            value: wood,
            equivalent: isHQ && wood != null ? { label: "Wood", value: wood * HQ_MULTIPLIER } : null,
          },
          {
            label: isHQ ? "HQ Steel" : "Steel",
            value: steel,
            equivalent: isHQ && steel != null ? { label: "Steel", value: steel * HQ_MULTIPLIER } : null,
          },
        ]}
      />
    </CalculatorSection>
  );
}
