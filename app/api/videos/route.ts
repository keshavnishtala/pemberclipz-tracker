import { NextRequest, NextResponse } from "next/server";
import { fetchVideos } from "@/lib/ytdlp";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "50");
  try {
    const videos = await fetchVideos(Math.min(limit, 200));
    return NextResponse.json(videos);
  } catch (err) {
    console.error("Videos fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
