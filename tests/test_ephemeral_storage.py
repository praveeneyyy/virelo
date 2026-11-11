"""
Unit tests for VIRELO Ephemeral Zero-Server-Storage Architecture.
Ensures media files downloaded by users are purged from server disk after streaming to client device.
"""
import os
import time
import unittest
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.core.config import settings
from backend.app.core.database import save_job, get_job, delete_job_db
from backend.app.api.endpoints import remove_ephemeral_server_file


class TestEphemeralStorage(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)
        self.test_job_id = "test-ephemeral-job-1234"
        self.test_filename = "test_download_media.mp4"
        self.test_file_path = os.path.join(settings.DOWNLOADS_PATH, self.test_filename)
        
        # Create a mock media file in server downloads directory
        os.makedirs(settings.DOWNLOADS_PATH, exist_ok=True)
        with open(self.test_file_path, "wb") as f:
            f.write(b"SAMPLE_VIDEO_DATA_FOR_EPHEMERAL_STREAMING_TEST" * 10)

        # Register completed job in SQLite database
        now = time.time()
        save_job({
            "id": self.test_job_id,
            "url": "https://example.com/test-video",
            "title": "Test Ephemeral Video",
            "platform": "TestPlatform",
            "media_type": "video",
            "target_format": "mp4",
            "target_quality": "1080",
            "target_bitrate": "320",
            "thumbnail": "https://example.com/thumb.jpg",
            "status": "completed",
            "progress": 100.0,
            "speed_str": "Completed",
            "eta_str": "0s",
            "downloaded_bytes": os.path.getsize(self.test_file_path),
            "total_bytes": os.path.getsize(self.test_file_path),
            "file_path": self.test_file_path,
            "file_name": self.test_filename,
            "file_size_str": "450 B",
            "error": None,
            "created_at": now,
            "updated_at": now,
            "completed_at": now
        })

    def tearDown(self):
        if os.path.exists(self.test_file_path):
            try:
                os.remove(self.test_file_path)
            except Exception:
                pass
        delete_job_db(self.test_job_id)

    def test_direct_ephemeral_purge_function(self):
        """Verify remove_ephemeral_server_file deletes file and clears job record."""
        self.assertTrue(os.path.exists(self.test_file_path))
        remove_ephemeral_server_file(self.test_file_path, self.test_job_id, delay_seconds=0)
        
        # Allow thread to execute
        time.sleep(0.3)
        self.assertFalse(os.path.exists(self.test_file_path), "File should be purged from server disk")
        
        job = get_job(self.test_job_id)
        self.assertIsNotNone(job)
        self.assertIsNone(job.get("file_path"), "Job file_path should be set to None")

    def test_serve_download_file_endpoint_and_headers(self):
        """Verify /api/download/{job_id}/file streams with Content-Disposition headers."""
        resp = self.client.get(f"/api/download/{self.test_job_id}/file")
        self.assertEqual(resp.status_code, 200)
        self.assertIn("Content-Disposition", resp.headers)
        self.assertIn("attachment", resp.headers["Content-Disposition"])
        self.assertIn(self.test_filename, resp.headers["Content-Disposition"])
        self.assertIn("application/octet-stream", resp.headers.get("content-type", ""))
        self.assertEqual(len(resp.content), 460)

    def test_nonexistent_or_expired_job_returns_410(self):
        """Verify accessing expired or non-existent file returns 410 Gone."""
        resp = self.client.get("/api/download/nonexistent-job-xyz/file")
        self.assertEqual(resp.status_code, 410)
        self.assertIn("expired", resp.json().get("detail", "").lower())


if __name__ == '__main__':
    unittest.main()
