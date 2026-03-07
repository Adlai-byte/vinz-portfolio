import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST() {
  const count = await redis.incr("page_views");
  return NextResponse.json({ count });
}

export async function GET() {
  const count = (await redis.get<number>("page_views")) ?? 0;
  return NextResponse.json({ count });
}
