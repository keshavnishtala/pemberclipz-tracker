import { fetchRssFeed } from "@/lib/rss";
import { getSnapshots, getChannel, getVideos } from "@/lib/storage";
import ChannelHeader from "@/components/ChannelHeader";
import SubscriberChart from "@/components/SubscriberChart";
import MilestoneTracker from "@/components/MilestoneTracker";
import VideoGrid from "@/components/VideoGrid";
import LatestVideo from "@/components/LatestVideo";
import ChannelSummary from "@/components/ChannelSummary";
import GrowthTips from "@/components/GrowthTips";

export default async function Home() {
  const channelData = getChannel();
  const snapshotData = getSnapshots();
  const videoData = getVideos();
  const rssData = await fetchRssFeed().catch(() => []);

  const hasChannel = channelData && channelData.title;
  const latestRss = rssData[0] ?? null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {hasChannel ? (
          <ChannelHeader
            title={channelData.title!}
            thumbnail={channelData.thumbnail ?? ""}
            subscriber_count={channelData.subscriber_count ?? 0}
            view_count={channelData.view_count ?? 0}
            video_count={channelData.video_count ?? 0}
            description={channelData.description ?? ""}
          />
        ) : (
          <div className="bg-gray-900 rounded-xl p-6 text-gray-400">
            No data yet — run <code className="text-red-400">node scripts/collect.mjs</code> to populate.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SubscriberChart snapshots={snapshotData} />
            {latestRss && <LatestVideo video={latestRss} />}
          </div>
          <div className="space-y-6">
            {hasChannel && <MilestoneTracker subscriber_count={channelData.subscriber_count ?? 0} />}
            {hasChannel && (
              <ChannelSummary
                snapshots={snapshotData}
                current_subscribers={channelData.subscriber_count ?? 0}
                current_views={channelData.view_count ?? 0}
              />
            )}
          </div>
        </div>

        {videoData.length > 0 && <VideoGrid videos={videoData} />}

        <GrowthTips channel={channelData ?? {}} videos={videoData} />
      </div>
    </main>
  );
}
