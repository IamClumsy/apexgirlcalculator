"use client";

type ResultItem = {
  label: string;
  value: number | null;
  equivalent?: { label: string; value: number | null } | null;
};

type Props = {
  results: ResultItem[];
};

function fmt(v: number | null): string {
  if (v == null) return "—";
  return v.toLocaleString();
}

export function ResultDisplay({ results }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-slate-500">
        You need
      </p>
      {results.map((r) => (
        <div
          key={r.label}
          className="flex items-baseline gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2"
        >
          <span className="text-xl font-semibold text-white tabular-nums">
            {fmt(r.value)}
          </span>
          <span className="text-sm text-slate-400">{r.label}</span>
          {r.equivalent && r.equivalent.value != null && (
            <>
              <span className="text-xs text-slate-600">=</span>
              <span className="text-base font-medium text-slate-300 tabular-nums">
                {fmt(r.equivalent.value)}
              </span>
              <span className="text-sm text-slate-500">
                {r.equivalent.label}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
