"use client";

import { useState, useMemo } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { DropdownInput } from "../inputs/dropdown-input";
import { LevelRangeInput } from "../inputs/level-range-input";
import { ResultDisplay } from "../result-display";

const ROOM_OPTIONS = ["1", "2", "3", "4", "5"];
const HQ_MULTIPLIER = 125;

export function MuseumExhibits() {
  const { tables } = useTables();
  const [tier, setTier] = useState("1");
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(2);

  const tierNum = Number(tier);
  const isHQ = tierNum > 3;

  const sandstone = useMemo(() => {
    if (!tables?.exhibits) return null;
    return vlookupDiff(from - 1, to - 1, tables.exhibits.data, tierNum * 2);
  }, [tables, from, to, tierNum]);

  const tile = useMemo(() => {
    if (!tables?.exhibits) return null;
    return vlookupDiff(from - 1, to - 1, tables.exhibits.data, tierNum * 2 + 1);
  }, [tables, from, to, tierNum]);

  return (
    <CalculatorSection title="Museum Exhibits">
      <DropdownInput label="Exhibit Room" value={tier} options={ROOM_OPTIONS} onChange={setTier} />
      <LevelRangeInput from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      <ResultDisplay
        results={[
          {
            label: isHQ ? "HQ Sandstone" : "Sandstone",
            value: sandstone,
            equivalent: isHQ && sandstone != null ? { label: "Sandstone", value: sandstone * HQ_MULTIPLIER } : null,
          },
          {
            label: isHQ ? "HQ Tiles" : "Tiles",
            value: tile,
            equivalent: isHQ && tile != null ? { label: "Tiles", value: tile * HQ_MULTIPLIER } : null,
          },
        ]}
      />
    </CalculatorSection>
  );
}
