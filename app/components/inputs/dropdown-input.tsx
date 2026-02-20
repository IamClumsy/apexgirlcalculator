"use client";

type Props = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
};

export function DropdownInput({ label, value, options, onChange }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
