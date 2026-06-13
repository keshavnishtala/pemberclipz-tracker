import { readFileSync } from "fs";
import { join } from "path";
import type { ChannelInfo, VideoInfo } from "./ytdlp";

const DATA = join(process.cwd(), "data");

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(join(DATA, file), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export interface Snapshot {
  timestamp: number;
  subscriber_count: number;
  view_count: number;
  video_count: number;
}

export function getSnapshots(): Snapshot[] {
  return readJson<Snapshot[]>("snapshots.json", []);
}

export function getChannel(): Partial<ChannelInfo> {
  return readJson<Partial<ChannelInfo>>("channel.json", {});
}

export function getVideos(): VideoInfo[] {
  return readJson<VideoInfo[]>("videos.json", []);
}
