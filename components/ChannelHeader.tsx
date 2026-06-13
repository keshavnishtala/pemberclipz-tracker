"use client";

import { CHANNEL_URL } from "@/lib/constants";

interface Props {
  title: string;
  thumbnail: string;
  subscriber_count: number;
  view_count: number;
  video_count: number;
  description: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function ChannelHeader({ title, thumbnail, subscriber_count, view_count, video_count, description }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/5">
      {/* Banner */}
      <div className="h-28 sm:h-36 bg-gradient-to-br from-red-900/60 via-gray-900 to-gray-950" />

      {/* Content */}
      <div className="bg-[#1a1a1a] px-5 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12 mb-4">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#1a1a1a] object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-[#1a1a1a] bg-gray-800 flex-shrink-0" />
          )}
          <div className="sm:mb-1 flex-1 min-w-0">
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-400 transition-colors truncate">
                {title}
              </h1>
              <svg className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            {description && (
              <p className="text-[#aaa] text-sm mt-0.5 line-clamp-1">{description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-px rounded-xl overflow-hidden border border-white/5">
          <Stat label="Subscribers" value={fmt(subscriber_count)} icon="👥" />
          <Stat label="Total Views" value={fmt(view_count)} icon="👁" />
          <Stat label="Videos" value={fmt(video_count)} icon="🎬" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex-1 min-w-[100px] bg-[#111] px-4 py-3 flex flex-col items-center gap-0.5">
      <span className="text-base">{icon}</span>
      <span className="text-xl font-bold text-white">{value}</span>
      <span className="text-[#717171] text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}
