"use client";

import { useState, useMemo } from "react";
import { useTables } from "@/app/lib/tables-context";
import { vlookupDiff } from "@/app/lib/vlookup";
import { CalculatorSection } from "../calculator-section";
import { DropdownInput } from "../inputs/dropdown-input";
import { ResultDisplay } from "../result-display";

export function CarParts() {
  const { tables } = useTables();
  const [from, setFrom] = useState("SS3");
  const [to, setTo] = useState("SS5");

  const ranks = useMemo(() => {
    if (!tables?.carParts) return [];
    return tables.carParts.data.map((row) => String(row[0]));
  }, [tables]);

  const parts = useMemo(() => {
    if (!tables?.carParts) return null;
    return vlookupDiff(from, to, tables.carParts.data, 3);
  }, [tables, from, to]);

  const drawings = useMemo(() => {
    if (!tables?.carParts) return null;
    return vlookupDiff(from, to, tables.carParts.data, 5);
  }, [tables, from, to]);

  return (
    <CalculatorSection title="Car Parts" note="*Available until SSS1">
      <div className="grid grid-cols-2 gap-3">
        <DropdownInput label="From Rank" value={from} options={ranks} onChange={setFrom} />
        <DropdownInput label="To Rank" value={to} options={ranks} onChange={setTo} />
      </div>
      <ResultDisplay
        results={[
          { label: "Parts", value: parts },
          { label: "Advance Drawings", value: drawings },
        ]}
      />
    </CalculatorSection>
  );
}
