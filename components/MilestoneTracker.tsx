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
  const progress = next && prev
    ? ((subscriber_count - prev) / (next - prev)) * 100
    : next ? (subscriber_count / next) * 100 : 100;

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
      <h2 className="text-base font-semibold uppercase tracking-widest text-[#aaa] mb-4">Milestones</h2>

      <div className="space-y-2">
        {MILESTONES.map((m) => {
          const reached = subscriber_count >= m;
          const isNext = m === next;
          return (
            <div
              key={m}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isNext ? "bg-yellow-500/5 border border-yellow-500/20" : "border border-transparent"
              }`}
            >
              <span className={`text-base flex-shrink-0 ${reached ? "opacity-100" : "opacity-30"}`}>
                {reached ? "✅" : isNext ? "🎯" : "⭕"}
              </span>
              <span className={`text-sm flex-1 font-medium ${
                reached ? "text-white line-through decoration-green-500/50" :
                isNext ? "text-yellow-300" : "text-[#555]"
              }`}>
                {fmt(m)}
              </span>
              {isNext && (
                <span className="text-xs text-yellow-500/70 font-medium tabular-nums">
                  {(m - subscriber_count).toLocaleString()} to go
                </span>
              )}
              {reached && (
                <span className="text-xs text-green-500/60">Done</span>
              )}
            </div>
          );
        })}
      </div>

      {next && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-between text-xs text-[#717171] mb-2">
            <span>{fmt(prev ?? 0)}</span>
            <span className="text-yellow-400 font-medium">{Math.round(progress)}% to {fmt(next)}</span>
            <span>{fmt(next)}</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 to-yellow-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
