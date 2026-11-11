"""
Persistent SQLite Database for VIRELO.
Thread-safe, zero-external-dependency persistence for jobs, download history, and settings.
"""
import sqlite3
import json
import time
import os
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings


def get_db():
    conn = sqlite3.connect(settings.DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Jobs Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            url TEXT NOT NULL,
            title TEXT,
            platform TEXT,
            media_type TEXT,
            target_format TEXT,
            target_quality TEXT,
            target_bitrate TEXT,
            thumbnail TEXT,
            status TEXT NOT NULL,
            progress REAL DEFAULT 0.0,
            speed_str TEXT DEFAULT '0 B/s',
            eta_str TEXT DEFAULT '--',
            downloaded_bytes INTEGER DEFAULT 0,
            total_bytes INTEGER DEFAULT 0,
            file_path TEXT,
            file_name TEXT,
            file_size_str TEXT,
            error TEXT,
            created_at REAL,
            updated_at REAL,
            completed_at REAL
        )
    """)

    # History Table (persistent record of completed/failed runs)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY,
            job_id TEXT,
            url TEXT,
            title TEXT,
            platform TEXT,
            media_type TEXT,
            format TEXT,
            quality TEXT,
            file_name TEXT,
            file_size_str TEXT,
            file_path TEXT,
            status TEXT,
            error TEXT,
            timestamp REAL
        )
    """)

    # Settings key-value store
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS app_settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)

    conn.commit()
    conn.close()


def save_job(job: Dict[str, Any]):
    conn = get_db()
    cursor = conn.cursor()
    now = time.time()
    cursor.execute("""
        INSERT INTO jobs (
            id, url, title, platform, media_type, target_format, target_quality, target_bitrate,
            thumbnail, status, progress, speed_str, eta_str, downloaded_bytes, total_bytes,
            file_path, file_name, file_size_str, error, created_at, updated_at, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            status=excluded.status,
            progress=excluded.progress,
            speed_str=excluded.speed_str,
            eta_str=excluded.eta_str,
            downloaded_bytes=excluded.downloaded_bytes,
            total_bytes=excluded.total_bytes,
            file_path=excluded.file_path,
            file_name=excluded.file_name,
            file_size_str=excluded.file_size_str,
            error=excluded.error,
            updated_at=excluded.updated_at,
            completed_at=excluded.completed_at
    """, (
        job["id"],
        job.get("url", ""),
        job.get("title", ""),
        job.get("platform", "Unknown"),
        job.get("media_type", "video"),
        job.get("target_format", "mp4"),
        job.get("target_quality", "best"),
        job.get("target_bitrate", "320"),
        job.get("thumbnail", ""),
        job.get("status", "queued"),
        job.get("progress", 0.0),
        job.get("speed_str", "0 B/s"),
        job.get("eta_str", "--"),
        job.get("downloaded_bytes", 0),
        job.get("total_bytes", 0),
        job.get("file_path"),
        job.get("file_name"),
        job.get("file_size_str"),
        job.get("error"),
        job.get("created_at", now),
        now,
        job.get("completed_at")
    ))
    conn.commit()
    conn.close()


def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    if d.get("status") == "completed" or d.get("file_path"):
        d["download_url"] = f"/api/download/{job_id}/file"
    return d


def get_all_jobs() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    jobs = []
    for r in rows:
        d = dict(r)
        if d.get("status") == "completed" or d.get("file_path"):
            d["download_url"] = f"/api/download/{d['id']}/file"
        jobs.append(d)
    return jobs


def delete_job_db(job_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM jobs WHERE id = ?", (job_id,))
    conn.commit()
    conn.close()


def add_history_entry(entry: Dict[str, Any]):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO history (
            id, job_id, url, title, platform, media_type, format, quality,
            file_name, file_size_str, file_path, status, error, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        entry["id"],
        entry.get("job_id"),
        entry.get("url"),
        entry.get("title"),
        entry.get("platform"),
        entry.get("media_type"),
        entry.get("format"),
        entry.get("quality"),
        entry.get("file_name"),
        entry.get("file_size_str"),
        entry.get("file_path"),
        entry.get("status"),
        entry.get("error"),
        entry.get("timestamp", time.time())
    ))
    conn.commit()
    conn.close()


def get_history(limit: int = 100) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM history ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


def purge_expired_jobs_and_files(retention_seconds: int = 1800) -> int:
    """
    Purges jobs, history entries, and physical files older than the retention threshold (default 30 min).
    Ensures download links and file data are not stored unnecessarily.
    """
    cutoff = time.time() - retention_seconds
    conn = get_db()
    cursor = conn.cursor()

    # Find expired jobs to safely delete physical files
    cursor.execute("""
        SELECT id, file_path FROM jobs 
        WHERE (completed_at IS NOT NULL AND completed_at < ?)
           OR (created_at < ? AND status IN ('completed', 'failed', 'cancelled'))
    """, (cutoff, cutoff))
    expired_jobs = cursor.fetchall()

    purged_count = 0
    for row in expired_jobs:
        f_path = row["file_path"]
        if f_path and os.path.exists(f_path):
            try:
                os.remove(f_path)
            except Exception:
                pass
        cursor.execute("DELETE FROM jobs WHERE id = ?", (row["id"],))
        purged_count += 1

    # Also delete expired entries from history table older than cutoff
    cursor.execute("DELETE FROM history WHERE timestamp < ?", (cutoff,))

    conn.commit()
    conn.close()
    return purged_count


def clear_history():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM history")
    conn.commit()
    conn.close()


def save_setting(key: str, value: Any):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)", (key, json.dumps(value)))
    conn.commit()
    conn.close()


def get_all_settings() -> Dict[str, Any]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT key, value FROM app_settings")
    rows = cursor.fetchall()
    conn.close()
    result = {}
    for r in rows:
        try:
            result[r["key"]] = json.loads(r["value"])
        except Exception:
            result[r["key"]] = r["value"]
    return result
