"""
Thread-safe, in-memory sliding-window IP rate limiter for VIRELO.
Protects public endpoints against automated scrapers, denial-of-service,
and upstream platform rate-limiting (e.g., YouTube HTTP 429).
"""
import time
import threading
from collections import defaultdict
from fastapi import Request, HTTPException


class IPRateLimiter:
    """Sliding-window IP rate limiter with automatic garbage collection."""

    def __init__(self, max_requests: int = 30, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
        self.lock = threading.Lock()
        self._last_cleanup = time.time()

    def get_client_ip(self, request: Request) -> str:
        """Extracts the real client IP across reverse proxies (Cloudflare, Render, Nginx)."""
        cf_ip = request.headers.get("CF-Connecting-IP")
        if cf_ip:
            return cf_ip.strip()
        xf_ip = request.headers.get("X-Forwarded-For")
        if xf_ip:
            return xf_ip.split(",")[0].strip()
        if request.client and request.client.host:
            return request.client.host
        return "127.0.0.1"

    def check(self, request: Request, custom_limit: int = None, custom_window: int = None):
        """Checks rate limit for the requesting client IP. Raises HTTP 429 if exceeded."""
        limit = custom_limit or self.max_requests
        window = custom_window or self.window_seconds
        ip = self.get_client_ip(request)
        now = time.time()

        with self.lock:
            # Periodic cleanup of expired IPs every 5 minutes
            if now - self._last_cleanup > 300:
                expired_threshold = now - window
                to_delete = [
                    k for k, timestamps in self.requests.items()
                    if not timestamps or timestamps[-1] < expired_threshold
                ]
                for k in to_delete:
                    del self.requests[k]
                self._last_cleanup = now

            # Filter timestamps within sliding window
            timestamps = self.requests[ip]
            valid_timestamps = [t for t in timestamps if now - t < window]
            self.requests[ip] = valid_timestamps

            if len(valid_timestamps) >= limit:
                retry_after = int(window - (now - valid_timestamps[0])) + 1
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Please wait {retry_after} seconds before making another request.",
                    headers={"Retry-After": str(max(1, retry_after))}
                )

            self.requests[ip].append(now)


# Global rate limiter instances:
# 30 extractions per minute per IP (generous for humans, stops DDoS scripts)
extract_limiter = IPRateLimiter(max_requests=30, window_seconds=60)

# 10 download jobs enqueued per minute per IP
download_limiter = IPRateLimiter(max_requests=10, window_seconds=60)
