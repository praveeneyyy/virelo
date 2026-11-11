"""
Unit tests for VIRELO IP Rate Limiter.
"""
import unittest
from unittest.mock import MagicMock
from fastapi import HTTPException
from backend.app.core.rate_limiter import IPRateLimiter


class TestIPRateLimiter(unittest.TestCase):

    def setUp(self):
        self.limiter = IPRateLimiter(max_requests=3, window_seconds=2)

    def test_allowed_requests(self):
        req = MagicMock()
        req.headers = {}
        req.client.host = "1.2.3.4"

        # 3 requests should pass
        self.limiter.check(req)
        self.limiter.check(req)
        self.limiter.check(req)

        # 4th request should raise HTTP 429
        with self.assertRaises(HTTPException) as ctx:
            self.limiter.check(req)
        self.assertEqual(ctx.exception.status_code, 429)

    def test_different_ips_have_separate_limits(self):
        req1 = MagicMock()
        req1.headers = {}
        req1.client.host = "1.1.1.1"

        req2 = MagicMock()
        req2.headers = {}
        req2.client.host = "2.2.2.2"

        for _ in range(3):
            self.limiter.check(req1)

        # req1 is blocked
        with self.assertRaises(HTTPException):
            self.limiter.check(req1)

        # req2 should still be allowed
        self.limiter.check(req2)

    def test_proxy_headers_recognized(self):
        req = MagicMock()
        req.headers = {"CF-Connecting-IP": "203.0.113.195"}
        req.client.host = "10.0.0.1"

        ip = self.limiter.get_client_ip(req)
        self.assertEqual(ip, "203.0.113.195")


if __name__ == '__main__':
    unittest.main()
