import { XMLParser } from "fast-xml-parser";
import { RSS_URL } from "./constants";

export interface RssVideo {
  id: string;
  title: string;
  url: string;
  published: string;
  thumbnail: string;
  author: string;
}

export async function fetchRssFeed(): Promise<RssVideo[]> {
  const res = await fetch(RSS_URL);
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);
  const entries = doc?.feed?.entry ?? [];

  return (Array.isArray(entries) ? entries : [entries]).map((e: Record<string, unknown>) => {
    const videoId = (e["yt:videoId"] as string) ?? "";
    return {
      id: videoId,
      title: (e.title as string) ?? "",
      url: `https://www.youtube.com/watch?v=${videoId}`,
      published: (e.published as string) ?? "",
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      author: ((e.author as Record<string, unknown>)?.name as string) ?? "",
    };
  });
}
