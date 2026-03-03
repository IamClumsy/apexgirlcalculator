"use client";

import { ReactNode } from "react";

export type ColorScheme = "violet" | "sky" | "amber" | "emerald" | "pink";

type Props = {
  title: string;
  note?: string;
  color?: ColorScheme;
  children: ReactNode;
};

const schemes: Record<ColorScheme, { card: string; title: string }> = {
  violet: {
    card: "bg-gradient-to-b from-violet-900/30 to-slate-900/70 border-violet-700/40",
    title: "text-violet-300",
  },
  sky: {
    card: "bg-gradient-to-b from-sky-900/30 to-slate-900/70 border-sky-700/40",
    title: "text-sky-300",
  },
  amber: {
    card: "bg-gradient-to-b from-amber-900/30 to-slate-900/70 border-amber-700/40",
    title: "text-amber-300",
  },
  emerald: {
    card: "bg-gradient-to-b from-emerald-900/30 to-slate-900/70 border-emerald-700/40",
    title: "text-emerald-300",
  },
  pink: {
    card: "bg-gradient-to-b from-pink-900/30 to-slate-900/70 border-pink-700/40",
    title: "text-pink-300",
  },
};

export function CalculatorSection({ title, note, color, children }: Props) {
  const scheme = color ? schemes[color] : null;
  return (
    <section
      className={
        scheme
          ? `rounded-2xl border p-5 shadow-xl ${scheme.card}`
          : "rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl"
      }
    >
      <h2 className={`text-lg font-semibold ${scheme ? scheme.title : "text-white"}`}>
        {title}
      </h2>
      {note && <p className="mt-1 text-xs text-slate-400">{note}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
