"use client";

import { useEffect, useId, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MarketAsset } from "@/lib/market-data";

export function MarketChart({ asset, height = 190 }: { asset: MarketAsset; height?: number }) {
  const [mounted, setMounted] = useState(false);
  const id = useId().replace(/:/g, "");
  const gradientId = `gradient-${asset.symbol}-${id}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="rounded-md bg-white/[0.035]" style={{ height }} />;
  }

  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={asset.chart} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={asset.accent} stopOpacity={0.52} />
              <stop offset="100%" stopColor={asset.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="t" hide />
          <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
          <Tooltip
            cursor={{ stroke: asset.accent, strokeWidth: 1 }}
            contentStyle={{
              background: "rgba(7, 9, 13, 0.92)",
              border: "1px solid rgba(255,255,255,.12)",
              borderRadius: 8,
              color: "white"
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={asset.accent}
            strokeWidth={3}
            fill={`url(#${gradientId})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
