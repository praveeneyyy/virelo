# VIRELO — YouTube Test Results Matrix

## Test Suite Execution: `tests/test_youtube.py`

Executed via `python -m unittest tests/test_youtube.py`:
- **Total Tests Run**: 25
- **Passed**: 25 (100%)
- **Failed**: 0
- **Errors**: 0
- **Duration**: 17.013s

---

## Detailed Test Breakdown

| Test Case | Description | Verdict |
| :--- | :--- | :--- |
| `test_valid_youtube_urls_detected` | Validates standard, Shorts, mobile, youtu.be, embed, live, and music URLs | **PASS** |
| `test_non_youtube_urls_rejected` | Confirms non-YouTube platforms and invalid strings are rejected | **PASS** |
| `test_all_14_codes_exist_in_enum` | Validates full 14-code enum completeness | **PASS** |
| `test_cloud_ip_restriction_classification`| Tests raw bot challenge traces map to `CLOUD_IP_RESTRICTED` | **PASS** |
| `test_challenge_required_classification` | Tests CAPTCHA traces map to `CHALLENGE_REQUIRED` | **PASS** |
| `test_private_video_classification` | Tests private video traces map to `PRIVATE_VIDEO` | **PASS** |
| `test_members_only_classification` | Tests members-only traces map to `MEMBERS_ONLY` | **PASS** |
| `test_age_restricted_classification` | Tests age-restriction traces map to `AGE_RESTRICTED` | **PASS** |
| `test_geo_restricted_classification` | Tests geo-blocked traces map to `GEO_RESTRICTED` | **PASS** |
| `test_rate_limited_classification` | Tests HTTP 429 traces map to `RATE_LIMITED` | **PASS** |
| `test_format_unavailable_classification` | Tests format missing traces map to `FORMAT_UNAVAILABLE` | **PASS** |
| `test_video_unavailable_classification` | Tests deleted/removed traces map to `VIDEO_UNAVAILABLE` | **PASS** |
| `test_premiere_unplayed_classification` | Tests unplayed premiere traces map to `PREMIERE_UNPLAYED` | **PASS** |
| `test_live_stream_classification` | Tests active stream traces map to `LIVE_STREAM_UNSUPPORTED`| **PASS** |
| `test_extract_available_qualities` | Tests dynamic resolution extraction & sorting | **PASS** |
| `test_parse_and_sort_formats` | Tests format normalization and stream classification | **PASS** |
| `test_build_video_format_spec` | Tests dynamic format selector construction | **PASS** |
| `test_build_audio_format_spec` | Tests audio format selector construction | **PASS** |
| `test_circuit_breaker_trip_and_cooldown`| Tests 3-strike trip, cooldown, and recovery | **PASS** |
| `test_circuit_breaker_record_success_resets`| Tests success clears failure history | **PASS** |
| `test_concurrency_limiting` | Tests semaphore slot acquisition and release | **PASS** |
| `test_metadata_contract_structure` | Tests UI metadata contract normalization | **PASS** |
| `test_health_check_returns_all_keys` | Tests runtime diagnostics output | **PASS** |
| `test_live_extract_public_video` | Live integration test on YouTube `dQw4w9WgXcQ` | **PASS** |
| `test_non_youtube_platform_isolation` | Verifies isolation of Instagram, TikTok, Pinterest | **PASS** |

---

## End-to-End Download Verification Matrix

| Video URL | Requested Format | Quality / Bitrate | Resulting File | Disk Size | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `https://www.youtube.com/watch?v=jNQXAC9IVRw` | MP3 | 128 kbps | `Me at the zoo [jNQXAC9IVRw].mp3` | 497.0 KB | **COMPLETED (100%)** |
| `https://www.youtube.com/watch?v=jNQXAC9IVRw` | MP4 | 720p | `Me at the zoo [jNQXAC9IVRw].mp4` | 665.5 KB | **COMPLETED (100%)** |
| `https://www.youtube.com/watch?v=L5Z-1JlL5ss` | MP4 | 1080p | `Verappa Extended - Video Song... [L5Z-1JlL5ss].mp4` | 46.7 MB | **COMPLETED (100%)** |
| `https://www.youtube.com/watch?v=k1OU4CqguLw` | MP4 | 1080p | `Tiger Muthuvel Pandian - Theme... [k1OU4CqguLw].mp4` | 16.5 MB | **COMPLETED (100%)** |
