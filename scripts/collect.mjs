#!/usr/bin/env node
import { execFile } from "child_process";
import { promisify } from "util";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data");
const YTDLP = process.env.YTDLP_PATH || "yt-dlp";
const CHANNEL = "https://www.youtube.com/@PemberclipzGaming";
const MAX_SNAPSHOTS = 365;

mkdirSync(DATA, { recursive: true });

function readJson(file, fallback) {
  try { return JSON.parse(readFileSync(join(DATA, file), "utf-8")); }
  catch { return fallback; }
}

function writeJson(file, data) {
  writeFileSync(join(DATA, file), JSON.stringify(data, null, 2));
}

async function ytdlp(args) {
  const { stdout } = await execFileAsync(YTDLP, args, { maxBuffer: 50 * 1024 * 1024 });
  return stdout;
}

console.log("Fetching channel info...");
const channelRaw = await ytdlp(["--dump-single-json", "--playlist-items", "0", CHANNEL]);
const ch = JSON.parse(channelRaw);

const channel = {
  id: ch.channel_id ?? ch.id,
  title: ch.channel ?? ch.title,
  description: ch.description ?? "",
  subscriber_count: ch.channel_follower_count ?? 0,
  view_count: ch.view_count ?? 0,
  video_count: ch.playlist_count ?? 0,
  thumbnail: ch.thumbnails?.at(-1)?.url ?? "",
  uploader_url: ch.uploader_url ?? "",
};

// view_count and video_count are filled in after fetching videos below
console.log(`Channel: ${channel.title} — ${channel.subscriber_count} subscribers`);

const snapshot = {
  timestamp: Date.now(),
  subscriber_count: channel.subscriber_count,
  view_count: channel.view_count,
  video_count: channel.video_count,
};

const snapshots = readJson("snapshots.json", []);
snapshots.push(snapshot);
if (snapshots.length > MAX_SNAPSHOTS) snapshots.splice(0, snapshots.length - MAX_SNAPSHOTS);
writeJson("snapshots.json", snapshots);
console.log(`Snapshot saved (${snapshots.length} total)`);

// Fetch RSS for descriptions, view counts, and like counts (no bot detection)
console.log("Fetching RSS feed...");
const CHANNEL_ID = "UCzwn4hawolG-r7WICjh16fQ";
const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
const rssXml = await rssRes.text();

// Parse RSS entries into a map keyed by video ID
const rssMap = {};
const entryMatches = rssXml.matchAll(/<entry>([\s\S]*?)<\/entry>/g);
for (const [, entry] of entryMatches) {
  const id = (entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) ?? [])[1];
  const desc = (entry.match(/<media:description>([^<]*)<\/media:description>/) ?? [])[1] ?? "";
  const views = parseInt((entry.match(/views="(\d+)"/) ?? [])[1] ?? "0", 10);
  const likes = parseInt((entry.match(/count="(\d+)"/) ?? [])[1] ?? "0", 10);
  if (id) rssMap[id] = { description: desc.trim(), view_count: views, like_count: likes };
}
console.log(`RSS: found ${Object.keys(rssMap).length} entries`);

// Use --flat-playlist to avoid per-video page fetches (bypasses bot detection)
console.log("Fetching video list...");
const videosRaw = await ytdlp([
  "--dump-json", "--flat-playlist", "--playlist-end", "50",
  "--js-runtimes", "node",
  `${CHANNEL}/videos`,
]);

const videos = videosRaw
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const d = JSON.parse(line);
    const rss = rssMap[d.id] ?? {};
    return {
      id: d.id,
      title: d.title,
      url: `https://www.youtube.com/watch?v=${d.id}`,
      thumbnail: `https://i.ytimg.com/vi/${d.id}/mqdefault.jpg`,
      view_count: rss.view_count ?? d.view_count ?? 0,
      like_count: rss.like_count ?? d.like_count ?? 0,
      duration: d.duration ?? 0,
      upload_date: d.upload_date ?? "",
      description: rss.description ?? d.description ?? "",
    };
  });

writeJson("videos.json", videos);
console.log(`Saved ${videos.length} videos`);

// Now we have accurate totals — update channel.json
channel.video_count = videos.length;
channel.view_count = videos.reduce((sum, v) => sum + v.view_count, 0);
writeJson("channel.json", channel);
console.log(`Total views: ${channel.view_count}, Total videos: ${channel.video_count}`);
console.log("Done.");
