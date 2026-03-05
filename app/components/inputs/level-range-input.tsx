"use client";

import { useState, useEffect } from "react";

type Props = {
  from: number;
  to: number;
  onFromChange: (v: number) => void;
  onToChange: (v: number) => void;
  min?: number;
  max?: number;
  fromLabel?: string;
  toLabel?: string;
};

function NumericInput({
  value,
  onChange,
  min,
  max,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  label: string;
}) {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    setDisplay(String(value));
  }, [value]);

  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        min={min}
        max={max}
        value={display}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setDisplay(raw);
          const n = parseInt(raw, 10);
          if (!isNaN(n)) onChange(n);
        }}
        onBlur={() => {
          const n = parseInt(display, 10);
          if (isNaN(n)) setDisplay(String(value));
        }}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
      />
    </div>
  );
}

export function LevelRangeInput({
  from,
  to,
  onFromChange,
  onToChange,
  min = 0,
  max = 999,
  fromLabel = "From Level",
  toLabel = "To Level",
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <NumericInput value={from} onChange={onFromChange} min={min} max={max} label={fromLabel} />
      <NumericInput value={to} onChange={onToChange} min={min} max={max} label={toLabel} />
    </div>
  );
}
