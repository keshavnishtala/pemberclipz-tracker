"use client";

import { formatDistanceToNow } from "date-fns";
import type { RssVideo } from "@/lib/rss";

interface Props {
  video: RssVideo;
}

export default function LatestVideo({ video }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <h2 className="text-lg font-semibold text-white mb-3">Latest Upload</h2>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-4 items-start hover:opacity-80 transition-opacity"
      >
        <img
          src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.title}
          className="w-36 aspect-video object-cover rounded-lg flex-shrink-0"
        />
        <div className="min-w-0">
          <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
          <p className="text-gray-400 text-xs mt-1">
            {formatDistanceToNow(new Date(video.published), { addSuffix: true })}
          </p>
          <span className="inline-block mt-2 text-xs text-red-500 font-medium">Watch on YouTube →</span>
        </div>
      </a>
    </div>
  );
}
