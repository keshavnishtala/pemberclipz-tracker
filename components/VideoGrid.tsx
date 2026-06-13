"use client";

import { formatDistanceToNow } from "date-fns";
import type { VideoInfo } from "@/lib/ytdlp";

interface Props {
  videos: VideoInfo[];
}

function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

function fmtDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function parseUploadDate(d: string): Date | null {
  if (!d || d.length !== 8) return null;
  return new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`);
}

export default function VideoGrid({ videos }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">Recent Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v) => {
          const date = parseUploadDate(v.upload_date);
          return (
            <a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-red-500 transition-all group"
            >
              <div className="relative">
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-full aspect-video object-cover"
                />
                {v.duration > 0 && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {fmtDuration(v.duration)}
                  </span>
                )}
              </div>
              <div className="p-3 space-y-1">
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-400 transition-colors">
                  {v.title}
                </p>
                <p className="text-gray-400 text-xs">
                  {v.view_count > 0 ? fmtViews(v.view_count) : ""}
                  {date && ` · ${formatDistanceToNow(date, { addSuffix: true })}`}
                </p>
                {v.description && (
                  <p className="text-gray-500 text-xs line-clamp-3 pt-1 border-t border-gray-800">
                    {v.description.split("\n")[0]}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
