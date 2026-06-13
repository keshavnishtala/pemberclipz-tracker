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
    <div className="bg-gray-900 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start">
      {thumbnail && (
        <img src={thumbnail} alt={title} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <h1 className="text-2xl font-bold text-white truncate">{title}</h1>
        </a>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>
        <div className="flex gap-6 mt-4">
          <Stat label="Subscribers" value={fmt(subscriber_count)} />
          <Stat label="Total Views" value={fmt(view_count)} />
          <Stat label="Videos" value={fmt(video_count)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-red-500">{value}</p>
      <p className="text-gray-400 text-xs uppercase tracking-wide">{label}</p>
    </div>
  );
}
