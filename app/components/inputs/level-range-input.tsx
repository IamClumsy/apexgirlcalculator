"use client";

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
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-widest text-slate-400">
          {fromLabel}
        </label>
        <input
          type="number"
          min={min}
          max={max}
          value={from}
          onChange={(e) => onFromChange(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs uppercase tracking-widest text-slate-400">
          {toLabel}
        </label>
        <input
          type="number"
          min={min}
          max={max}
          value={to}
          onChange={(e) => onToChange(Number(e.target.value))}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
        />
      </div>
    </div>
  );
}
