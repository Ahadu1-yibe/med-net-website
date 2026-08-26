import { headers } from "next/headers";

const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  buckets.set(key, timestamps);
  if (buckets.size > 500) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t > windowMs)) buckets.delete(k);
    }
  }
  return true;
}

export async function clientKey(scope: string): Promise<string> {
  let ip = "unknown";
  try {
    const store = await headers();
    const forwarded = store.get("x-forwarded-for");
    ip = forwarded?.split(",")[0]?.trim() || store.get("x-real-ip") || "unknown";
  } catch {}
  return `${scope}:${ip}`;
}
