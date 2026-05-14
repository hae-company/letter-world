import { NextRequest } from "next/server";
import { getLetters, addLetter, type Letter } from "@/lib/redis";
import { getRandomLocation } from "@/lib/random-location";

export async function GET() {
  const letters = await getLetters();
  return Response.json(letters);
}

export async function POST(req: NextRequest) {
  try {
    const { to, body, from } = await req.json();

    if (!body || body.trim().length === 0) {
      return Response.json({ error: "편지 내용을 입력해주세요" }, { status: 400 });
    }

    const location = getRandomLocation();

    const letter: Letter = {
      id: crypto.randomUUID(),
      to: to || "세상 누군가에게",
      body: body.slice(0, 500),
      from: from || "익명의 누군가",
      lat: location.lat,
      lng: location.lng,
      locationName: location.locationName,
      hearts: 0,
      createdAt: new Date().toISOString(),
      stampIdx: Math.floor(Math.random() * 10),
    };

    await addLetter(letter);

    return Response.json(letter);
  } catch (err) {
    console.error("Letter API error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
