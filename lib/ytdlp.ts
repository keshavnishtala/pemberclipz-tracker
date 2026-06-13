import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  subscriber_count: number;
  view_count: number;
  video_count: number;
  thumbnail: string;
  uploader_url: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  view_count: number;
  like_count: number;
  duration: number;
  upload_date: string; // YYYYMMDD
  description: string;
}

async function runYtDlp(args: string[]): Promise<string> {
  const ytdlpPath = process.env.YTDLP_PATH || "yt-dlp";
  const { stdout } = await execFileAsync(ytdlpPath, args, { maxBuffer: 50 * 1024 * 1024 });
  return stdout;
}

export async function fetchChannelInfo(): Promise<ChannelInfo> {
  const raw = await runYtDlp([
    "--dump-single-json",
    "--playlist-items", "0",
    "https://www.youtube.com/@PemberclipzGaming",
  ]);
  const data = JSON.parse(raw);
  return {
    id: data.channel_id ?? data.id,
    title: data.channel ?? data.title,
    description: data.description ?? "",
    subscriber_count: data.channel_follower_count ?? 0,
    view_count: data.view_count ?? 0,
    video_count: data.playlist_count ?? 0,
    thumbnail: data.thumbnails?.[0]?.url ?? "",
    uploader_url: data.uploader_url ?? "",
  };
}

export async function fetchVideos(limit = 50): Promise<VideoInfo[]> {
  const raw = await runYtDlp([
    "--dump-json",
    "--flat-playlist",
    "--playlist-end", String(limit),
    "https://www.youtube.com/@PemberclipzGaming/videos",
  ]);

  return raw
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const d = JSON.parse(line);
      return {
        id: d.id,
        title: d.title,
        url: `https://www.youtube.com/watch?v=${d.id}`,
        thumbnail: d.thumbnails?.[0]?.url ?? `https://i.ytimg.com/vi/${d.id}/hqdefault.jpg`,
        view_count: d.view_count ?? 0,
        like_count: d.like_count ?? 0,
        duration: d.duration ?? 0,
        upload_date: d.upload_date ?? "",
        description: d.description ?? "",
      };
    });
}
