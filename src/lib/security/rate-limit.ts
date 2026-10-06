interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup to avoid memory leaks
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
let lastCleanup = Date.now();

function cleanupExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  rateLimitStore.forEach((record, key) => {
    const valid = record.timestamps.filter((ts: number) => now - ts < windowMs);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = valid;
    }
  });
}

export interface RateLimitOptions {
  windowMs: number; // e.g. 60 * 60 * 1000 (1 hour)
  maxRequests: number; // e.g. 5
}

export function checkRateLimit(
  identifier: string,
  prefix: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetTimeMs: number } {
  cleanupExpired(options.windowMs);

  const key = `${prefix}:${identifier}`;
  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within window
  const windowStart = now - options.windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= options.maxRequests) {
    const oldest = record.timestamps[0];
    const resetTimeMs = oldest + options.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetTimeMs: Math.max(resetTimeMs, 1000),
    };
  }

  record.timestamps.push(now);
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: options.maxRequests - record.timestamps.length,
    resetTimeMs: options.windowMs,
  };
}

/**
 * Extract client IP safely from Next.js request headers
 */
export function getClientIp(headers: Headers): string {
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  return "127.0.0.1";
}
