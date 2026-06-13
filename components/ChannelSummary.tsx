"use client";

import type { Snapshot } from "@/lib/storage";

interface Props {
  snapshots: Snapshot[];
  current_subscribers: number;
  current_views: number;
}

export default function ChannelSummary({ snapshots, current_subscribers, current_views }: Props) {
  const oldest = snapshots[0];
  const subGrowth = oldest ? current_subscribers - oldest.subscriber_count : null;
  const viewGrowth = oldest ? current_views - oldest.view_count : null;
  const days = oldest ? Math.max(1, Math.round((Date.now() - oldest.timestamp) / 86400000)) : null;

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
      <h2 className="text-base font-semibold uppercase tracking-widest text-[#aaa] mb-4">Growth</h2>

      {snapshots.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center gap-2">
          <span className="text-3xl">📈</span>
          <p className="text-[#555] text-xs leading-relaxed">
            Growth stats build up over time as the tracker collects daily snapshots.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {subGrowth !== null && days !== null && (
            <Row
              icon="👥"
              label={`Subs · last ${days}d`}
              value={subGrowth >= 0 ? `+${subGrowth.toLocaleString()}` : subGrowth.toLocaleString()}
              positive={subGrowth >= 0}
            />
          )}
          {viewGrowth !== null && days !== null && (
            <Row
              icon="👁"
              label={`Views · last ${days}d`}
              value={viewGrowth >= 0 ? `+${viewGrowth.toLocaleString()}` : viewGrowth.toLocaleString()}
              positive={viewGrowth >= 0}
            />
          )}
          {days !== null && subGrowth !== null && (
            <Row
              icon="📅"
              label="Avg subs / day"
              value={(subGrowth / days).toFixed(1)}
              positive={(subGrowth / days) >= 0}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, value, positive }: { icon: string; label: string; value: string; positive: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-base">{icon}</span>
      <span className="text-[#aaa] text-xs flex-1">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${positive ? "text-green-400" : "text-red-400"}`}>
        {value}
      </span>
    </div>
  );
}
