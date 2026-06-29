"use client";

import React from "react";


export const chartColors = {
  accent: "#3ecf8e",
  accentDim: "#2fb87c",
  ink: "#e4e4e7",
  neutral: "#52525b",
  neutralSoft: "#3f3f46",
  grid: "rgba(255,255,255,0.04)",
  axis: "#6b6b73",
  track: "#232327",
} as const;

export const axisProps = {
  stroke: chartColors.axis,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;


export function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
  labelFormatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: any;
  unit?: string;
  labelFormatter?: (label: any) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-[10px] border border-line-strong bg-elevated px-3 py-2.5 shadow-xl">
      {label !== undefined && (
        <p className="mb-1.5 text-[12px] font-medium text-ink">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-5 text-[12px]">
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: p.color || p.stroke || p.fill }}
              />
              {p.name}
            </span>
            <span className="tnum font-medium text-ink">
              {p.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
