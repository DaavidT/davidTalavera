type WindowState = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type ConsumeInput = {
  key: string;
  maxRequests: number;
  windowMs: number;
};

export function createFixedWindowRateLimiter() {
  const windows = new Map<string, WindowState>();

  const consume = (input: ConsumeInput): RateLimitResult => {
    const now = Date.now();
    const maxRequests = Math.max(1, Math.floor(input.maxRequests));
    const windowMs = Math.max(1_000, Math.floor(input.windowMs));
    const key = input.key.trim() || 'unknown';

    sweepExpiredWindows(windows, now);

    const current = windows.get(key);
    if (!current || current.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return {
        allowed: true,
        remaining: Math.max(0, maxRequests - 1),
        retryAfterSeconds: Math.ceil(windowMs / 1_000),
      };
    }

    if (current.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((current.resetAt - now) / 1_000)
        ),
      };
    }

    current.count += 1;
    windows.set(key, current);

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - current.count),
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
    };
  };

  return { consume };
}

function sweepExpiredWindows(windows: Map<string, WindowState>, now: number) {
  for (const [key, windowState] of windows.entries()) {
    if (windowState.resetAt <= now) {
      windows.delete(key);
    }
  }
}

