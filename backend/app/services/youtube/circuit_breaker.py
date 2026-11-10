"""
VIRELO YouTube Service - Circuit Breaker & Concurrency Controller.
Protects upstream YouTube extraction against cascading failures, IP bans,
and rate limits on cloud hosting providers.
"""
import time
import threading
from typing import Dict, Optional, Tuple
from backend.app.services.youtube.errors import YouTubeErrorCode, YouTubeError


class YouTubeCircuitBreaker:
    """
    Tracks failure rates per video ID and across the entire YouTube extractor.
    Enforces concurrency limits and fast-fails known cloud-IP-restricted media.
    """
    def __init__(self, failure_threshold: int = 3, cooldown_seconds: float = 120.0, max_concurrent: int = 3):
        self.failure_threshold = failure_threshold
        self.cooldown_seconds = cooldown_seconds
        self.lock = threading.Lock()
        
        # video_id -> (failure_count, last_failure_timestamp, last_error_code)
        self.video_failures: Dict[str, Tuple[int, float, YouTubeErrorCode]] = {}
        
        # Concurrency semaphore for active downloads
        self.semaphore = threading.BoundedSemaphore(value=max_concurrent)
        self._active_count = 0

    def can_attempt(self, video_id: Optional[str]) -> Tuple[bool, Optional[str]]:
        """
        Returns (True, None) if request may proceed, or (False, reason) if circuit is open.
        """
        if not video_id:
            return True, None

        with self.lock:
            if video_id in self.video_failures:
                count, last_time, code = self.video_failures[video_id]
                elapsed = time.time() - last_time
                if count >= self.failure_threshold:
                    if elapsed < self.cooldown_seconds:
                        remaining = int(self.cooldown_seconds - elapsed)
                        return False, (
                            f"Temporary cooldown active for this media ({remaining}s remaining). "
                            "YouTube has restricted automated access to this stream from our server range."
                        )
                    else:
                        # Cooldown expired, half-open state allows a retry
                        del self.video_failures[video_id]

        return True, None

    def record_success(self, video_id: Optional[str]):
        """Resets failure counts upon successful extraction/download."""
        if not video_id:
            return
        with self.lock:
            if video_id in self.video_failures:
                del self.video_failures[video_id]

    def record_failure(self, video_id: Optional[str], code: YouTubeErrorCode):
        """Records failure and opens circuit if threshold is reached."""
        if not video_id:
            return
        with self.lock:
            now = time.time()
            if video_id in self.video_failures:
                count, _, _ = self.video_failures[video_id]
                self.video_failures[video_id] = (count + 1, now, code)
            else:
                self.video_failures[video_id] = (1, now, code)

    def acquire_slot(self, timeout: float = 10.0) -> bool:
        """Acquires a concurrency slot for YouTube download operations."""
        acquired = self.semaphore.acquire(timeout=timeout)
        if acquired:
            with self.lock:
                self._active_count += 1
        return acquired

    def release_slot(self):
        """Releases the concurrency slot."""
        with self.lock:
            if self._active_count > 0:
                self._active_count -= 1
        try:
            self.semaphore.release()
        except ValueError:
            pass

    @property
    def active_downloads_count(self) -> int:
        with self.lock:
            return self._active_count


# Global singleton circuit breaker
circuit_breaker = YouTubeCircuitBreaker()

