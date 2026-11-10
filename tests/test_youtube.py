"""
Automated Test Suite for VIRELO YouTube Service.
Tests URL parsing, 14-category error taxonomy, dynamic format discovery,
metadata parsing, circuit breaker concurrency, and end-to-end extraction/download.
"""
import os
import sys
import unittest
import time
import threading

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.services.youtube.url_parser import (
    is_youtube_url,
    extract_video_id,
    normalize_youtube_url,
)
from backend.app.services.youtube.errors import (
    YouTubeErrorCode,
    YouTubeError,
    classify_youtube_error,
    CLOUD_RESTRICTION_MESSAGE,
    ERROR_DEFINITIONS,
)
from backend.app.services.youtube.formats import (
    parse_and_sort_formats,
    extract_available_qualities,
    build_video_format_spec,
    build_audio_format_spec,
)
from backend.app.services.youtube.metadata import (
    select_best_thumbnail,
    format_youtube_metadata,
)
from backend.app.services.youtube.circuit_breaker import (
    YouTubeCircuitBreaker,
    circuit_breaker,
)
from backend.app.services.youtube.health import check_youtube_health
from backend.app.services.youtube.service import youtube_service
from backend.app.services.extractor import MediaExtractor


class TestYouTubeUrlParser(unittest.TestCase):
    """1. Tests YouTube URL detection, ID extraction, and normalization."""

    def test_valid_youtube_urls_detected(self):
        valid_urls = [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/shorts/dQw4w9WgXcQ",
            "https://m.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://music.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://www.youtube.com/embed/dQw4w9WgXcQ",
            "https://www.youtube.com/live/dQw4w9WgXcQ",
        ]
        for url in valid_urls:
            self.assertTrue(is_youtube_url(url), f"Failed to detect valid URL: {url}")
            self.assertEqual(extract_video_id(url), "dQw4w9WgXcQ", f"Incorrect ID for: {url}")
            self.assertEqual(
                normalize_youtube_url(url),
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            )

    def test_non_youtube_urls_rejected(self):
        invalid_urls = [
            "https://www.instagram.com/reel/C8xyz123/",
            "https://www.tiktok.com/@creator/video/1234567890",
            "https://www.pinterest.com/pin/123456789/",
            "https://www.facebook.com/watch/?v=123456",
            "https://vimeo.com/12345678",
            "https://reddit.com/r/videos/comments/xyz",
            "https://example.com/video.mp4",
            "not a url at all",
            "",
            None,
        ]
        for url in invalid_urls:
            self.assertFalse(is_youtube_url(url), f"Incorrectly marked as YouTube: {url}")
            self.assertIsNone(extract_video_id(url), f"Extracted non-existent ID for: {url}")


class TestYouTubeErrorTaxonomy(unittest.TestCase):
    """2. Tests error classification across all 14 canonical categories."""

    def test_all_14_codes_exist_in_enum(self):
        expected_codes = {
            "YOUTUBE_CLOUD_IP_RESTRICTED",
            "YOUTUBE_INVALID_URL",
            "YOUTUBE_VIDEO_UNAVAILABLE",
            "YOUTUBE_PRIVATE_VIDEO",
            "YOUTUBE_AGE_RESTRICTED",
            "YOUTUBE_GEO_RESTRICTED",
            "YOUTUBE_LIVE_STREAM_UNSUPPORTED",
            "YOUTUBE_MEMBERS_ONLY",
            "YOUTUBE_PREMIERE_UNPLAYED",
            "YOUTUBE_FORMAT_UNAVAILABLE",
            "YOUTUBE_RATE_LIMITED",
            "YOUTUBE_CHALLENGE_REQUIRED",
            "YOUTUBE_DOWNLOAD_FAILED",
            "YOUTUBE_AUTHENTICATION_REQUIRED",
        }
        enum_codes = {e.value for e in YouTubeErrorCode}
        self.assertEqual(enum_codes, expected_codes, "Mismatch in 14-code taxonomy!")

    def test_cloud_ip_restriction_classification(self):
        raw_traces = [
            "Sign in to confirm you’re not a bot. This helps protect our community.",
            "Sign in to confirm you're not a bot",
            "ERROR: [youtube] k1OU4CqguLw: Automated challenge detected on cloud IP",
            "GVS PO Token is required for this stream",
            "playabilityStatus: LOGIN_REQUIRED",
        ]
        for trace in raw_traces:
            code, msg = classify_youtube_error(trace)
            self.assertEqual(code, YouTubeErrorCode.CLOUD_IP_RESTRICTED)
            self.assertEqual(msg, CLOUD_RESTRICTION_MESSAGE)

    def test_challenge_required_classification(self):
        trace = "ERROR: CAPTCHA required to proceed with stream download"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.CHALLENGE_REQUIRED)
        self.assertEqual(msg, CLOUD_RESTRICTION_MESSAGE)

    def test_private_video_classification(self):
        trace = "ERROR: [youtube] xyz: This video is private"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.PRIVATE_VIDEO)
        self.assertIn("Private", msg)

    def test_members_only_classification(self):
        trace = "ERROR: Join this channel to get access to members-only content"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.MEMBERS_ONLY)

    def test_age_restricted_classification(self):
        trace = "ERROR: Sign in to confirm your age. This video may be inappropriate"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.AGE_RESTRICTED)

    def test_geo_restricted_classification(self):
        trace = "ERROR: The uploader has not made this video available in your country"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.GEO_RESTRICTED)

    def test_rate_limited_classification(self):
        trace = "ERROR: HTTP Error 429: Too Many Requests"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.RATE_LIMITED)

    def test_format_unavailable_classification(self):
        trace = "ERROR: Requested format is not available. Use --list-formats"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.FORMAT_UNAVAILABLE)

    def test_video_unavailable_classification(self):
        trace = "ERROR: Video unavailable. This video has been removed by the uploader"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.VIDEO_UNAVAILABLE)

    def test_premiere_unplayed_classification(self):
        trace = "ERROR: Upcoming premiere. Video premieres in 2 hours"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.PREMIERE_UNPLAYED)

    def test_live_stream_classification(self):
        trace = "ERROR: This live event will begin in a few minutes"
        code, msg = classify_youtube_error(trace)
        self.assertEqual(code, YouTubeErrorCode.LIVE_STREAM_UNSUPPORTED)


class TestYouTubeDynamicFormats(unittest.TestCase):
    """3. Tests dynamic format discovery, quality extraction, and selector generation."""

    def setUp(self):
        self.mock_raw_formats = [
            {"format_id": "137", "ext": "mp4", "width": 1920, "height": 1080, "fps": 30, "vcodec": "avc1.640028", "acodec": "none", "filesize": 50000000},
            {"format_id": "248", "ext": "webm", "width": 1920, "height": 1080, "fps": 30, "vcodec": "vp9", "acodec": "none", "filesize": 45000000},
            {"format_id": "136", "ext": "mp4", "width": 1280, "height": 720, "fps": 30, "vcodec": "avc1.4d401f", "acodec": "none", "filesize": 25000000},
            {"format_id": "313", "ext": "webm", "width": 3840, "height": 2160, "fps": 60, "vcodec": "vp9", "acodec": "none", "filesize": 200000000},
            {"format_id": "140", "ext": "m4a", "vcodec": "none", "acodec": "mp4a.40.2", "abr": 128, "filesize": 4000000},
            {"format_id": "251", "ext": "webm", "vcodec": "none", "acodec": "opus", "abr": 160, "filesize": 5000000},
            {"format_id": "18", "ext": "mp4", "width": 640, "height": 360, "vcodec": "avc1.42001E", "acodec": "mp4a.40.2", "filesize": 12000000},
        ]

    def test_extract_available_qualities(self):
        qualities = extract_available_qualities(self.mock_raw_formats)
        self.assertEqual(qualities, [2160, 1080, 720, 360])

    def test_parse_and_sort_formats(self):
        parsed = parse_and_sort_formats(self.mock_raw_formats, duration_seconds=120)
        self.assertEqual(len(parsed), 7)
        # Check first entry
        self.assertEqual(parsed[0]["format_id"], "137")
        self.assertEqual(parsed[0]["height"], 1080)
        self.assertTrue(parsed[0]["is_video"])
        self.assertFalse(parsed[0]["is_audio"])
        # Check audio entry
        audio_entry = next(f for f in parsed if f["format_id"] == "140")
        self.assertTrue(audio_entry["is_audio"])
        self.assertFalse(audio_entry["is_video"])

    def test_build_video_format_spec(self):
        self.assertEqual(build_video_format_spec("best"), "bestvideo+bestaudio/best")
        self.assertEqual(build_video_format_spec("max"), "bestvideo+bestaudio/best")
        self.assertEqual(
            build_video_format_spec("1080p"),
            "bestvideo[height<=1080]+bestaudio/best[height<=1080]/bestvideo+bestaudio/best"
        )
        self.assertEqual(
            build_video_format_spec("720"),
            "bestvideo[height<=720]+bestaudio/best[height<=720]/bestvideo+bestaudio/best"
        )

    def test_build_audio_format_spec(self):
        self.assertEqual(build_audio_format_spec(), "bestaudio/bestvideo+bestaudio/best")


class TestYouTubeCircuitBreaker(unittest.TestCase):
    """4. Tests circuit breaker failure threshold, cooldown, and concurrency limiting."""

    def test_circuit_breaker_trip_and_cooldown(self):
        cb = YouTubeCircuitBreaker(failure_threshold=3, cooldown_seconds=1.0, max_concurrent=2)
        vid = "test_vid_123"

        # Initially allowed
        allowed, _ = cb.can_attempt(vid)
        self.assertTrue(allowed)

        # Record 2 failures -> still allowed
        cb.record_failure(vid, YouTubeErrorCode.CLOUD_IP_RESTRICTED)
        cb.record_failure(vid, YouTubeErrorCode.CLOUD_IP_RESTRICTED)
        allowed, _ = cb.can_attempt(vid)
        self.assertTrue(allowed)

        # 3rd failure -> circuit trips
        cb.record_failure(vid, YouTubeErrorCode.CLOUD_IP_RESTRICTED)
        allowed, reason = cb.can_attempt(vid)
        self.assertFalse(allowed)
        self.assertIn("Temporary cooldown active", reason)

        # Wait for cooldown to expire
        time.sleep(1.1)
        allowed, _ = cb.can_attempt(vid)
        self.assertTrue(allowed)

    def test_circuit_breaker_record_success_resets(self):
        cb = YouTubeCircuitBreaker(failure_threshold=3, cooldown_seconds=60.0)
        vid = "test_vid_success"

        cb.record_failure(vid, YouTubeErrorCode.CLOUD_IP_RESTRICTED)
        cb.record_failure(vid, YouTubeErrorCode.CLOUD_IP_RESTRICTED)
        cb.record_success(vid)

        # After success, count should be reset
        allowed, _ = cb.can_attempt(vid)
        self.assertTrue(allowed)
        self.assertNotIn(vid, cb.video_failures)

    def test_concurrency_limiting(self):
        cb = YouTubeCircuitBreaker(max_concurrent=2)
        self.assertTrue(cb.acquire_slot(timeout=1.0))
        self.assertTrue(cb.acquire_slot(timeout=1.0))
        self.assertEqual(cb.active_downloads_count, 2)

        # 3rd should fail or timeout
        self.assertFalse(cb.acquire_slot(timeout=0.1))

        # Release one slot
        cb.release_slot()
        self.assertEqual(cb.active_downloads_count, 1)
        self.assertTrue(cb.acquire_slot(timeout=0.5))
        cb.release_slot()
        cb.release_slot()
        self.assertEqual(cb.active_downloads_count, 0)


class TestYouTubeMetadataFormatting(unittest.TestCase):
    """5. Tests metadata transformation into clean UI contract."""

    def test_metadata_contract_structure(self):
        raw_info = {
            "id": "dQw4w9WgXcQ",
            "title": "Rick Astley - Never Gonna Give You Up",
            "uploader": "Rick Astley",
            "duration": 213,
            "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            "thumbnails": [
                {"url": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg", "width": 1280, "height": 720, "preference": 1}
            ],
            "formats": [
                {"format_id": "18", "ext": "mp4", "width": 640, "height": 360, "vcodec": "avc1", "acodec": "mp4a", "filesize": 15000000}
            ],
            "subtitles": {"en": [{"ext": "vtt"}]},
            "view_count": 1500000000,
        }

        meta = format_youtube_metadata(raw_info, "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        self.assertEqual(meta["video_id"], "dQw4w9WgXcQ")
        self.assertEqual(meta["title"], "Rick Astley - Never Gonna Give You Up")
        self.assertEqual(meta["uploader"], "Rick Astley")
        self.assertEqual(meta["duration_seconds"], 213)
        self.assertEqual(meta["duration"], "03:33")
        self.assertEqual(meta["thumbnail"], "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg")
        self.assertEqual(meta["available_qualities"], [360])
        self.assertEqual(meta["platform"], "YouTube")
        self.assertFalse(meta["is_direct_file"])


class TestYouTubeRuntimeHealth(unittest.TestCase):
    """6. Tests health diagnostics reporting."""

    def test_health_check_returns_all_keys(self):
        health = check_youtube_health()
        self.assertIn("status", health)
        self.assertIn("ytdlp_version", health)
        self.assertIn("js_runtime", health)
        self.assertIn("js_runtime_available", health)
        self.assertIn("ffmpeg_available", health)
        self.assertIn("ffprobe_available", health)
        self.assertIn("server_cookies_active", health)
        self.assertIn("server_proxy_active", health)


class TestYouTubeLiveExtraction(unittest.TestCase):
    """7. Integration test with live public YouTube video."""

    def test_live_extract_public_video(self):
        url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        data = youtube_service.extract(url)
        self.assertEqual(data["video_id"], "dQw4w9WgXcQ")
        self.assertIn("Rick Astley", data["uploader"])
        self.assertIn("Never Gonna Give You Up", data["title"])
        self.assertTrue(len(data["available_qualities"]) > 0)
        self.assertTrue(len(data["formats"]) > 0)
        self.assertIsNotNone(data["thumbnail"])


class TestNonYouTubePlatformIsolation(unittest.TestCase):
    """8. Verifies non-YouTube extractors operate with zero regression."""

    def test_non_youtube_urls_bypass_youtube_service(self):
        extractor = MediaExtractor()
        # Direct URL
        direct_info = extractor._probe_direct_file("https://example.com/audio.mp3")
        # Ensure is_youtube_url returns False
        self.assertFalse(youtube_service.is_youtube_url("https://www.instagram.com/p/C9xyz/"))
        self.assertFalse(youtube_service.is_youtube_url("https://www.tiktok.com/@user/video/123"))
        self.assertFalse(youtube_service.is_youtube_url("https://pin.it/456"))


if __name__ == "__main__":
    unittest.main()
