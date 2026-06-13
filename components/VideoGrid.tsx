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
      <h2 className="text-base font-semibold text-white mb-3 uppercase tracking-widest text-[#aaa]">Recent Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {videos.map((v) => {
          const date = parseUploadDate(v.upload_date);
          return (
            <a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden hover:border-red-500/40 hover:bg-[#1f1f1f] transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden">
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-200">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {v.duration > 0 && (
                  <span className="absolute bottom-1.5 right-1.5 bg-black/90 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    {fmtDuration(v.duration)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 space-y-1.5">
                <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
                  {v.title}
                </p>
                <p className="text-[#717171] text-xs flex items-center gap-1.5">
                  {v.view_count > 0 && <span>{fmtViews(v.view_count)}</span>}
                  {v.view_count > 0 && date && <span>·</span>}
                  {date && <span>{formatDistanceToNow(date, { addSuffix: true })}</span>}
                </p>
                {v.description && (
                  <p className="text-[#555] text-xs line-clamp-2 pt-1.5 border-t border-white/5 leading-relaxed">
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
