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
  icon: string;
}

function buildTips(channel: Partial<ChannelInfo>, videos: VideoInfo[]): Tip[] {
  const tips: Tip[] = [];
  const subs = channel.subscriber_count ?? 0;
  const videoCount = videos.length;
  const avgDuration = videoCount > 0 ? videos.reduce((s, v) => s + v.duration, 0) / videoCount : 0;
  const avgViews = videoCount > 0 ? videos.reduce((s, v) => s + v.view_count, 0) / videoCount : 0;
  const noDescription = videos.some(v => !v.description || v.description.length < 20);

  if (videoCount < 5) {
    tips.push({
      priority: "high", icon: "🎬", category: "Content",
      tip: "Upload more videos",
      reason: `You have ${videoCount} video${videoCount === 1 ? "" : "s"}. YouTube won't recommend a channel with fewer than ~10 uploads — each video is another chance to be discovered.`,
    });
  }

  if (avgDuration > 0 && avgDuration < 180) {
    tips.push({
      priority: "high", icon: "⏱️", category: "Content",
      tip: "Make longer videos",
      reason: `Your average video is ${Math.round(avgDuration)}s. YouTube prioritises watch time — aim for 3–10 minutes so the algorithm has something to promote.`,
    });
  }

  if (noDescription) {
    tips.push({
      priority: "high", icon: "✍️", category: "Discoverability",
      tip: "Write full video descriptions",
      reason: "Short or missing descriptions hurt search ranking. Add 2–3 sentences explaining the video, the game, and relevant keywords.",
    });
  }

  if (subs < 100) {
    tips.push({
      priority: "high", icon: "🌐", category: "Community",
      tip: "Share in relevant communities",
      reason: "Post your clips in subreddits or Discord servers for the game you play. These audiences already want this content — they just haven't found you yet.",
    });
  }

  tips.push({
    priority: "medium", icon: "🖼️", category: "Discoverability",
    tip: "Add custom thumbnails",
    reason: "Thumbnails are the #1 factor in click-through rate. Bold text + a clear action shot dramatically increases clicks vs the auto-generated frame.",
  });

  if (avgViews > 0 && avgViews < 100) {
    tips.push({
      priority: "medium", icon: "🔍", category: "Discoverability",
      tip: "Use searchable titles",
      reason: "Title your videos the way someone would search for them. Include the game name and the specific trick or topic so they show up in search.",
    });
  }

  tips.push({
    priority: "medium", icon: "📋", category: "Content",
    tip: "Create a series or playlist",
    reason: "A named series (e.g. 'Port Rob Tricks #1, #2…') gives viewers a reason to subscribe and binge, and playlists get their own search results.",
  });

  tips.push({
    priority: "low", icon: "💬", category: "Community",
    tip: "Comment on bigger channels in your niche",
    reason: "Genuine, helpful comments on popular videos in your game get seen by thousands of people already interested in your content.",
  });

  tips.push({
    priority: "low", icon: "📅", category: "Content",
    tip: "Post on a consistent schedule",
    reason: "Even once a week is enough. Subscribers who know when to expect content are more likely to return and watch.",
  });

  return tips;
}

const styles = {
  high:   { bar: "bg-red-500",    badge: "text-red-400 bg-red-500/10 border border-red-500/20",    label: "Priority" },
  medium: { bar: "bg-yellow-500", badge: "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20", label: "Suggested" },
  low:    { bar: "bg-gray-600",   badge: "text-gray-400 bg-gray-500/10 border border-gray-500/20", label: "Nice to have" },
};

export default function GrowthTips({ channel, videos }: Props) {
  const tips = buildTips(channel, videos);
  const groups: Array<{ label: string; priority: Tip["priority"] }> = [
    { label: "Do these first", priority: "high" },
    { label: "Next steps",     priority: "medium" },
    { label: "Nice to have",   priority: "low" },
  ];

  return (
    <div>
      <h2 className="text-base font-semibold uppercase tracking-widest text-[#aaa] mb-4">How to Grow the Channel</h2>
      <div className="space-y-6">
        {groups.map(({ label, priority }) => {
          const group = tips.filter(t => t.priority === priority);
          if (!group.length) return null;
          const s = styles[priority];
          return (
            <div key={priority}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-0.5 w-3 rounded ${s.bar}`} />
                <span className="text-xs uppercase tracking-widest text-[#555] font-medium">{label}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.map((tip, i) => (
                  <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 flex gap-3 hover:border-white/10 transition-colors">
                    <span className="text-xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-white text-sm font-medium">{tip.tip}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${s.badge}`}>{tip.category}</span>
                      </div>
                      <p className="text-[#717171] text-xs leading-relaxed">{tip.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
