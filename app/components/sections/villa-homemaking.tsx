"use client";

import { useState, useMemo } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { DropdownInput } from "../inputs/dropdown-input";
import { LevelRangeInput } from "../inputs/level-range-input";
import { ResultDisplay } from "../result-display";

const TIER_OPTIONS = ["1", "2", "3", "4", "5"];
const HQ_MULTIPLIER = 125;

export function VillaHomemaking() {
  const { tables } = useTables();
  const [tier, setTier] = useState("5");
  const [from, setFrom] = useState(32);
  const [to, setTo] = useState(45);

  const tierNum = Number(tier);
  const isHQ = tierNum > 3;

  const coins = useMemo(() => {
    if (!tables?.homemaking) return null;
    return vlookupDiff(from - 1, to - 1, tables.homemaking.data, tierNum * 2);
  }, [tables, from, to, tierNum]);

  const keys = useMemo(() => {
    if (!tables?.homemaking) return null;
    return vlookupDiff(from - 1, to - 1, tables.homemaking.data, tierNum * 2 + 1);
  }, [tables, from, to, tierNum]);

  return (
    <CalculatorSection title="Villa Homemaking">
      <DropdownInput label="Tier" value={tier} options={TIER_OPTIONS} onChange={setTier} />
      <LevelRangeInput from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ResultDisplay
        results={[
          {
            label: isHQ ? "HQ Coins" : "Coins",
            value: coins,
            equivalent: isHQ && coins != null ? { label: "Coins", value: coins * HQ_MULTIPLIER } : null,
          },
          {
            label: isHQ ? "HQ Keys" : "Keys",
            value: keys,
            equivalent: isHQ && keys != null ? { label: "Keys", value: keys * HQ_MULTIPLIER } : null,
          },
        ]}
      />
    </CalculatorSection>
  );
}
