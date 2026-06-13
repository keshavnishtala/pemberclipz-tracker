"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { format } from "date-fns";
import type { Snapshot } from "@/lib/storage";

interface Props {
  snapshots: Snapshot[];
}

export default function SubscriberChart({ snapshots }: Props) {
  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
      <h2 className="text-base font-semibold uppercase tracking-widest text-[#aaa] mb-4">Subscriber Growth</h2>

      {snapshots.length < 2 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3 text-center">
          <span className="text-4xl">📊</span>
          <p className="text-[#555] text-xs max-w-xs leading-relaxed">
            The chart will appear once a few days of data have been collected. Check back soon.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={snapshots.map((s) => ({
            date: format(new Date(s.timestamp), "MMM d"),
            subscribers: s.subscriber_count,
          }))}>
            <defs>
              <linearGradient id="subGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 11, fill: "#717171" }} axisLine={false} tickLine={false} />
            <YAxis stroke="#555" tick={{ fontSize: 11, fill: "#717171" }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
              width={36}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", fontSize: "12px" }}
              labelStyle={{ color: "#aaa", marginBottom: "4px" }}
              itemStyle={{ color: "#ef4444" }}
              cursor={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Area type="monotone" dataKey="subscribers" stroke="#ef4444" strokeWidth={2} fill="url(#subGradient)" dot={false} activeDot={{ r: 4, fill: "#ef4444", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
