import { NextRequest } from "next/server";
import { addHeart } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { letterId } = await req.json();
    if (!letterId) return Response.json({ error: "letterId required" }, { status: 400 });
    const hearts = await addHeart(letterId);
    return Response.json({ hearts });
  } catch (err) {
    console.error("Heart API error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
