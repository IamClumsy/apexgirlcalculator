"use client";

import { useState, useMemo } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { DropdownInput } from "../inputs/dropdown-input";
import { ResultDisplay } from "../result-display";

export function VillaSuite() {
  const { tables } = useTables();
  const [from, setFrom] = useState("Summit Villa-1");
  const [to, setTo] = useState("Summit Villa-3");

  const villas = useMemo(() => {
    if (!tables?.villa) return [];
    return tables.villa.data.map((row) => String(row[0]));
  }, [tables]);

  const drones = useMemo(() => {
    if (!tables?.villa) return null;
    return vlookupDiff(from, to, tables.villa.data, 3);
  }, [tables, from, to]);

  const drafts = useMemo(() => {
    if (!tables?.villa) return null;
    return vlookupDiff(from, to, tables.villa.data, 5);
  }, [tables, from, to]);

  return (
    <CalculatorSection title="Villa Suite" note="*Until Urban Heights-0">
      <div className="grid grid-cols-2 gap-3">
        <DropdownInput label="From Villa" value={from} options={villas} onChange={setFrom} />
        <DropdownInput label="To Villa" value={to} options={villas} onChange={setTo} />
      </div>
      <ResultDisplay
        results={[
          { label: "Drones", value: drones },
          { label: "Design Drafts", value: drafts },
        ]}
      />
    </CalculatorSection>
  );
}
