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

writeJson("channel.json", channel);
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

console.log("Fetching videos (full metadata — may take a minute)...");
const videosRaw = await ytdlp([
  "--dump-json", "--playlist-end", "50",
  `${CHANNEL}/videos`,
]);

const videos = videosRaw
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const d = JSON.parse(line);
    return {
      id: d.id,
      title: d.title,
      url: `https://www.youtube.com/watch?v=${d.id}`,
      thumbnail: `https://i.ytimg.com/vi/${d.id}/mqdefault.jpg`,
      view_count: d.view_count ?? 0,
      like_count: d.like_count ?? 0,
      duration: d.duration ?? 0,
      upload_date: d.upload_date ?? "",
      description: d.description ?? "",
    };
  });

writeJson("videos.json", videos);
console.log(`Saved ${videos.length} videos`);
console.log("Done.");
