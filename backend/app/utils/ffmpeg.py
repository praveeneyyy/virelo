"""
FFmpeg & FFprobe detection and configuration module for VIRELO.
Ensures WinGet binaries, system PATH, and fallback packages are resolved and validated.
"""
import os
import shutil
import subprocess
from typing import Dict, Optional, Any

winget_links = os.path.expandvars(r'%LOCALAPPDATA%\Microsoft\WinGet\Links')
if os.path.exists(winget_links) and winget_links not in os.environ.get('PATH', ''):
    os.environ['PATH'] = winget_links + os.pathsep + os.environ.get('PATH', '')

nodejs_dir = r"C:\Program Files\nodejs"
if os.path.exists(nodejs_dir) and nodejs_dir not in os.environ.get('PATH', ''):
    os.environ['PATH'] = nodejs_dir + os.pathsep + os.environ.get('PATH', '')


def get_js_runtime_info() -> Dict[str, Any]:
    """
    Detects available JavaScript runtimes (Deno, Node) required for yt-dlp EJS challenges.
    Deno is preferred by yt-dlp official specification; Node is the fallback.
    """
    # 1. Check Deno (Official yt-dlp preferred runtime)
    sys_deno = shutil.which("deno")
    if sys_deno and os.path.exists(sys_deno):
        return {"available": True, "runtime": "deno", "path": sys_deno}

    deno_candidates = [
        "/usr/local/bin/deno",
        "/usr/bin/deno",
        os.path.expandvars(r"%USERPROFILE%\.deno\bin\deno.exe"),
        r"C:\ProgramData\chocolatey\bin\deno.exe",
    ]
    for c in deno_candidates:
        if os.path.isfile(c):
            return {"available": True, "runtime": "deno", "path": c}

    # 2. Check Node.js
    sys_node = shutil.which("node")
    if sys_node and os.path.exists(sys_node):
        return {"available": True, "runtime": "node", "path": sys_node}

    node_candidates = [
        "/usr/local/bin/node",
        "/usr/bin/node",
        r"C:\Program Files\nodejs\node.exe",
        r"C:\Program Files (x86)\nodejs\node.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\nodejs\node.exe"),
        os.path.expandvars(r"%APPDATA%\npm\node.exe"),
    ]
    for c in node_candidates:
        if os.path.isfile(c):
            return {"available": True, "runtime": "node", "path": c}

    return {"available": False, "runtime": None, "path": None}


def get_node_path() -> Optional[str]:
    """
    Locates JS runtime binary for executing yt-dlp EJS JavaScript challenges.
    """
    return get_js_runtime_info().get("path")


def get_ffmpeg_info() -> Dict[str, Optional[str]]:
    """
    Locates FFmpeg and FFprobe binaries and their containing directory.
    Returns:
        {
            'dir': directory path containing ffmpeg and/or ffprobe,
            'ffmpeg': executable path to ffmpeg,
            'ffprobe': executable path to ffprobe
        }
    """
    ffmpeg_exe = None
    ffprobe_exe = None
    ffmpeg_dir = None

    # 1. Prioritize WinGet directory with complete ffmpeg + ffprobe suite
    wg_ffmpeg = os.path.join(winget_links, 'ffmpeg.exe')
    wg_ffprobe = os.path.join(winget_links, 'ffprobe.exe')
    if os.path.exists(wg_ffmpeg):
        ffmpeg_exe = wg_ffmpeg
        ffmpeg_dir = winget_links
    if os.path.exists(wg_ffprobe):
        ffprobe_exe = wg_ffprobe

    # 2. Check system PATH
    if not ffmpeg_exe:
        sys_ffmpeg = shutil.which("ffmpeg")
        if sys_ffmpeg:
            ffmpeg_exe = sys_ffmpeg
            ffmpeg_dir = os.path.dirname(sys_ffmpeg)

    if not ffprobe_exe:
        sys_ffprobe = shutil.which("ffprobe")
        if sys_ffprobe:
            ffprobe_exe = sys_ffprobe

    # 3. Fallback to imageio-ffmpeg for ffmpeg binary
    if not ffmpeg_exe:
        try:
            import imageio_ffmpeg
            img_exe = imageio_ffmpeg.get_ffmpeg_exe()
            if img_exe and os.path.exists(img_exe):
                ffmpeg_exe = img_exe
                if not ffmpeg_dir:
                    ffmpeg_dir = os.path.dirname(img_exe)
        except Exception:
            pass

    return {
        'dir': ffmpeg_dir,
        'ffmpeg': ffmpeg_exe,
        'ffprobe': ffprobe_exe
    }


def get_ffmpeg_version(binary_path: Optional[str]) -> Optional[str]:
    """Inspect version banner of FFmpeg or FFprobe."""
    if not binary_path or not os.path.exists(binary_path):
        return None
    try:
        res = subprocess.run([binary_path, "-version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=5)
        if res.returncode == 0:
            first_line = res.stdout.splitlines()[0]
            return first_line
    except Exception:
        pass
    return None
