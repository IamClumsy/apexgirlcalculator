"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  note?: string;
  children: ReactNode;
};

export function CalculatorSection({ title, note, children }: Props) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {note && <p className="mt-1 text-xs text-slate-400">{note}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
