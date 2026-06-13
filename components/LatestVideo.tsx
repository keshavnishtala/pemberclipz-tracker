"use client";

import { formatDistanceToNow } from "date-fns";
import type { RssVideo } from "@/lib/rss";

interface Props {
  video: RssVideo;
}

export default function LatestVideo({ video }: Props) {
  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <h2 className="text-base font-semibold uppercase tracking-widest text-[#aaa]">Latest Upload</h2>
      </div>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-4 items-start group"
      >
        <div className="relative flex-shrink-0 rounded-xl overflow-hidden w-40">
          <img
            src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
            alt={video.title}
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-white text-sm font-medium line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
            {video.title}
          </p>
          <p className="text-[#717171] text-xs mt-1.5">
            {formatDistanceToNow(new Date(video.published), { addSuffix: true })}
          </p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs text-red-500 font-medium group-hover:gap-1.5 transition-all">
            Watch on YouTube
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </a>
    </div>
  );
}
