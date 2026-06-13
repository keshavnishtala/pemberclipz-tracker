"use client";

import { MILESTONES } from "@/lib/constants";

interface Props {
  subscriber_count: number;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export default function MilestoneTracker({ subscriber_count }: Props) {
  const next = MILESTONES.find((m) => m > subscriber_count);
  const prev = [...MILESTONES].reverse().find((m) => m <= subscriber_count);
  const progress = next && prev ? ((subscriber_count - prev) / (next - prev)) * 100 : next ? (subscriber_count / next) * 100 : 100;

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Milestones</h2>
      <div className="space-y-3">
        {MILESTONES.map((m) => {
          const reached = subscriber_count >= m;
          const isNext = m === next;
          return (
            <div key={m} className="flex items-center gap-3">
              <span className={`text-lg ${reached ? "text-green-500" : isNext ? "text-yellow-400" : "text-gray-600"}`}>
                {reached ? "✓" : isNext ? "→" : "○"}
              </span>
              <span className={`text-sm flex-1 ${reached ? "text-white" : isNext ? "text-yellow-400" : "text-gray-600"}`}>
                {fmt(m)} subscribers
              </span>
              {isNext && (
                <span className="text-xs text-gray-400">
                  {(m - subscriber_count).toLocaleString()} to go
                </span>
              )}
            </div>
          );
        })}
      </div>
      {next && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{fmt(prev ?? 0)}</span>
            <span>{Math.round(progress)}%</span>
            <span>{fmt(next)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
