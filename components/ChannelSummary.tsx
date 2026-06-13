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
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Channel Summary</h2>
      <div className="space-y-3 text-sm">
        {subGrowth !== null && days !== null && (
          <SummaryRow
            label={`Subscribers gained (last ${days}d)`}
            value={subGrowth >= 0 ? `+${subGrowth.toLocaleString()}` : subGrowth.toLocaleString()}
            positive={subGrowth >= 0}
          />
        )}
        {viewGrowth !== null && days !== null && (
          <SummaryRow
            label={`Views gained (last ${days}d)`}
            value={viewGrowth >= 0 ? `+${viewGrowth.toLocaleString()}` : viewGrowth.toLocaleString()}
            positive={viewGrowth >= 0}
          />
        )}
        {days !== null && subGrowth !== null && (
          <SummaryRow
            label="Avg subs/day"
            value={(subGrowth / days).toFixed(1)}
            positive={(subGrowth / days) >= 0}
          />
        )}
        {snapshots.length < 2 && (
          <p className="text-gray-500 text-xs">Growth stats will appear after tracking begins. Visit the page daily to build history.</p>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, positive }: { label: string; value: string; positive: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className={positive ? "text-green-400 font-medium" : "text-red-400 font-medium"}>{value}</span>
    </div>
  );
}
