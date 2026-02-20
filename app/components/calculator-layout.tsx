"use client";

import { ReactNode } from "react";

export function CalculatorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {children}
    </div>
  );
}
