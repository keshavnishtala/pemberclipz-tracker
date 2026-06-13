"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from "date-fns";
import type { Snapshot } from "@/lib/storage";

interface Props {
  snapshots: Snapshot[];
}

export default function SubscriberChart({ snapshots }: Props) {
  if (snapshots.length < 2) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Subscriber Growth</h2>
        <p className="text-gray-500 text-sm">
          Not enough data yet. Check back after a few days as snapshots accumulate.
        </p>
      </div>
    );
  }

  const data = snapshots.map((s) => ({
    date: format(new Date(s.timestamp), "MMM d"),
    subscribers: s.subscriber_count,
  }));

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Subscriber Growth</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
            labelStyle={{ color: "#e5e7eb" }}
            itemStyle={{ color: "#ef4444" }}
          />
          <Line type="monotone" dataKey="subscribers" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
