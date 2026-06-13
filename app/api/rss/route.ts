import { NextResponse } from "next/server";
import { fetchRssFeed } from "@/lib/rss";

export async function GET() {
  try {
    const videos = await fetchRssFeed();
    return NextResponse.json(videos);
  } catch (err) {
    console.error("RSS fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 500 });
  }
}
