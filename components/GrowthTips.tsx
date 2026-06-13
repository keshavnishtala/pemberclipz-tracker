"use client";

import type { VideoInfo } from "@/lib/ytdlp";
import type { ChannelInfo } from "@/lib/ytdlp";

interface Props {
  channel: Partial<ChannelInfo>;
  videos: VideoInfo[];
}

interface Tip {
  priority: "high" | "medium" | "low";
  category: string;
  tip: string;
  reason: string;
}

function buildTips(channel: Partial<ChannelInfo>, videos: VideoInfo[]): Tip[] {
  const tips: Tip[] = [];
  const subs = channel.subscriber_count ?? 0;
  const videoCount = videos.length;
  const avgDuration = videoCount > 0
    ? videos.reduce((s, v) => s + v.duration, 0) / videoCount
    : 0;
  const avgViews = videoCount > 0
    ? videos.reduce((s, v) => s + v.view_count, 0) / videoCount
    : 0;
  const noDescription = videos.some(v => !v.description || v.description.length < 20);

  if (videoCount < 5) {
    tips.push({
      priority: "high",
      category: "Content",
      tip: "Upload more videos",
      reason: `You have ${videoCount} video${videoCount === 1 ? "" : "s"}. YouTube won't recommend a channel with fewer than ~10 uploads — each video is another chance to be discovered.`,
    });
  }

  if (avgDuration > 0 && avgDuration < 180) {
    tips.push({
      priority: "high",
      category: "Content",
      tip: "Make longer videos",
      reason: `Your average video length is ${Math.round(avgDuration)}s. YouTube's algorithm prioritises watch time — aim for 3–10 minutes so viewers can actually engage.`,
    });
  }

  if (noDescription) {
    tips.push({
      priority: "high",
      category: "Discoverability",
      tip: "Write full video descriptions",
      reason: "Short or missing descriptions hurt search ranking. Add 2–3 sentences explaining the video, the game, and relevant keywords (e.g. game name, map, strategy).",
    });
  }

  if (subs < 100) {
    tips.push({
      priority: "high",
      category: "Community",
      tip: "Share videos in relevant communities",
      reason: "Post your clips in subreddits or Discord servers for the game you're playing. These audiences already want this content — they just don't know your channel exists yet.",
    });
  }

  tips.push({
    priority: "medium",
    category: "Discoverability",
    tip: "Add custom thumbnails",
    reason: "Thumbnails are the #1 factor in click-through rate. Bold text + a clear image of what happens in the video dramatically increases clicks vs the auto-generated frame.",
  });

  if (avgViews > 0 && avgViews < 100) {
    tips.push({
      priority: "medium",
      category: "Discoverability",
      tip: "Use searchable titles",
      reason: "Title your videos the way someone would search for them. 'How to glitch through warehouse fence – [Game Name]' will rank in search; shorter titles won't.",
    });
  }

  tips.push({
    priority: "medium",
    category: "Content",
    tip: "Create a series or playlist",
    reason: "A named series (e.g. 'Port Rob Tricks #1, #2…') gives viewers a reason to subscribe and binge, and playlists get their own search results.",
  });

  tips.push({
    priority: "low",
    category: "Community",
    tip: "Comment on bigger channels in the same game",
    reason: "Genuine, helpful comments on popular videos in your niche get seen by thousands of people already interested in your content.",
  });

  tips.push({
    priority: "low",
    category: "Content",
    tip: "Post consistently on a schedule",
    reason: "Even once a week is enough. Subscribers who know when to expect content are more likely to return and watch.",
  });

  return tips;
}

const priorityStyles = {
  high: { dot: "bg-red-500", badge: "bg-red-500/10 text-red-400 border border-red-500/20", label: "Priority" },
  medium: { dot: "bg-yellow-500", badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", label: "Suggested" },
  low: { dot: "bg-gray-500", badge: "bg-gray-500/10 text-gray-400 border border-gray-500/20", label: "Nice to have" },
};

export default function GrowthTips({ channel, videos }: Props) {
  const tips = buildTips(channel, videos);
  const high = tips.filter(t => t.priority === "high");
  const medium = tips.filter(t => t.priority === "medium");
  const low = tips.filter(t => t.priority === "low");

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-4">How to Grow the Channel</h2>
      <div className="space-y-3">
        {[...high, ...medium, ...low].map((tip, i) => {
          const style = priorityStyles[tip.priority];
          return (
            <div key={i} className="bg-gray-900 rounded-xl p-4 flex gap-3">
              <div className="mt-1.5 flex-shrink-0">
                <span className={`block w-2 h-2 rounded-full ${style.dot}`} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-white text-sm font-medium">{tip.tip}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${style.badge}`}>
                    {tip.category}
                  </span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{tip.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
