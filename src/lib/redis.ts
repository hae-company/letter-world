import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const LETTERS_KEY = "lw:letters";

export interface Letter {
  id: string;
  to: string;
  body: string;
  from: string;
  lat: number;
  lng: number;
  locationName: string;
  hearts: number;
  createdAt: string;
  stampIdx: number;
}

export async function getLetters(): Promise<Letter[]> {
  const data = await redis.get<Letter[]>(LETTERS_KEY);
  return data || [];
}

export async function addLetter(letter: Letter): Promise<void> {
  const letters = await getLetters();
  letters.unshift(letter);
  // Keep max 500 letters
  if (letters.length > 500) letters.length = 500;
  await redis.set(LETTERS_KEY, letters);
}

export async function addHeart(letterId: string): Promise<number> {
  const letters = await getLetters();
  const letter = letters.find(l => l.id === letterId);
  if (!letter) return 0;
  letter.hearts = (letter.hearts || 0) + 1;
  await redis.set(LETTERS_KEY, letters);
  return letter.hearts;
}
