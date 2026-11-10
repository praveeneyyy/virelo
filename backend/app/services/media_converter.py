"""
High-performance Media Transcoding and Image Conversion Service.
Employs native FFmpeg binaries, Pillow for bitmap assets, and Mutagen for audio metadata/tags.
"""
import os
import subprocess
from typing import Optional, Dict, Any
from PIL import Image
import mutagen
from mutagen.id3 import ID3, APIC, TIT2, TPE1, error as ID3Error
from mutagen.flac import FLAC, Picture
from mutagen.mp4 import MP4, MP4Cover

from backend.app.utils.ffmpeg import get_ffmpeg_info


class MediaConverter:
    def __init__(self):
        info = get_ffmpeg_info()
        self.ffmpeg_binary = info.get('ffmpeg')
        self.ffprobe_binary = info.get('ffprobe')

    def transcode_video(
        self,
        input_file: str,
        target_format: str,
        target_quality: Optional[str] = None
    ) -> str:
        """
        Transcodes video file into MP4, MKV, WebM, MOV, AVI, GIF, or TS using FFmpeg.
        """
        if not self.ffmpeg_binary:
            raise RuntimeError("FFmpeg executable is required for video transcoding.")

        clean_fmt = target_format.lower().strip()
        if clean_fmt == "gif":
            return self.video_to_gif(input_file)

        base_name, _ = os.path.splitext(input_file)
        output_file = f"{base_name}.{clean_fmt}"

        # If already matching format and no quality reduction requested, return as-is
        if input_file == output_file:
            return input_file

        cmd = [self.ffmpeg_binary, "-y", "-i", input_file]

        # Resolution scaling if specified
        if target_quality and target_quality.isdigit():
            h = int(target_quality)
            cmd += ["-vf", f"scale=-2:{h}"]

        if clean_fmt == "mp4":
            cmd += ["-c:v", "libx264", "-c:a", "aac", "-preset", "fast", "-movflags", "+faststart"]
        elif clean_fmt == "mkv":
            cmd += ["-c:v", "copy", "-c:a", "copy"]
        elif clean_fmt == "webm":
            cmd += ["-c:v", "libvpx-vp9", "-c:a", "libopus", "-b:v", "2M"]
        elif clean_fmt == "avi":
            cmd += ["-c:v", "mpeg4", "-c:a", "libmp3lame"]
        elif clean_fmt == "mov":
            cmd += ["-c:v", "libx264", "-c:a", "aac"]
        elif clean_fmt == "ts":
            cmd += ["-c:v", "libx264", "-c:a", "aac"]
        else:
            cmd += ["-c:v", "libx264", "-c:a", "aac"]

        cmd.append(output_file)
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg video conversion error: {res.stderr.strip() if res.stderr else 'Unknown error'}")

        return output_file

    def transcode_audio(
        self,
        input_file: str,
        output_format: str,
        bitrate: str = "320",
        metadata: Optional[Dict[str, str]] = None,
        cover_image_path: Optional[str] = None
    ) -> str:
        """
        Transcodes audio stream into MP3, M4A, AAC, FLAC, WAV, OPUS, OGG, WMA, ALAC, or AIFF.
        Embeds metadata and cover art when available.
        Note: Transcoding lossy audio (e.g. YouTube Opus/AAC) into FLAC/WAV will not restore lost acoustic fidelity.
        """
        if not self.ffmpeg_binary:
            raise RuntimeError("FFmpeg executable is required for audio transcoding.")

        clean_fmt = output_format.lower().strip()
        base_name, _ = os.path.splitext(input_file)
        output_file = f"{base_name}.{clean_fmt}"

        cmd = [self.ffmpeg_binary, "-y", "-i", input_file]

        if clean_fmt == "mp3":
            cmd += ["-c:a", "libmp3lame", "-b:a", f"{bitrate}k"]
        elif clean_fmt in ["m4a", "aac"]:
            cmd += ["-c:a", "aac", "-b:a", f"{bitrate}k"]
        elif clean_fmt == "flac":
            cmd += ["-c:a", "flac"]
        elif clean_fmt == "wav":
            cmd += ["-c:a", "pcm_s16le"]
        elif clean_fmt == "opus":
            cmd += ["-c:a", "libopus", "-b:a", f"{bitrate}k"]
        elif clean_fmt == "ogg":
            cmd += ["-c:a", "libvorbis", "-b:a", f"{bitrate}k"]
        elif clean_fmt == "wma":
            cmd += ["-c:a", "wmav2", "-b:a", f"{bitrate}k"]
        elif clean_fmt == "alac":
            cmd += ["-c:a", "alac"]
        elif clean_fmt == "aiff":
            cmd += ["-c:a", "pcm_s16be"]
        else:
            cmd += ["-b:a", f"{bitrate}k"]

        cmd.append(output_file)
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg audio transcoding error: {res.stderr.strip() if res.stderr else 'Unknown error'}")

        # Embed cover art and ID3 metadata
        if cover_image_path and os.path.exists(cover_image_path):
            self.embed_audio_cover(output_file, cover_image_path, metadata)

        return output_file

    def video_to_gif(
        self,
        input_video: str,
        fps: int = 15,
        scale_width: int = 480,
        start_time: Optional[float] = None,
        duration: Optional[float] = None,
        speed: float = 1.0
    ) -> str:
        """
        High-fidelity 2-pass animated GIF conversion with palette generation,
        precise time clipping, Lanczos scaling, and speed adjustment.
        """
        if not self.ffmpeg_binary:
            raise RuntimeError("FFmpeg executable is required for GIF generation.")

        base_name, _ = os.path.splitext(input_video)
        gif_output = f"{base_name}.gif"

        filter_parts = []
        if speed and speed != 1.0 and speed > 0:
            setpts = 1.0 / speed
            filter_parts.append(f"setpts={setpts}*PTS")
        
        filter_parts.append(f"fps={fps}")
        filter_parts.append(f"scale={scale_width}:-1:flags=lanczos")
        vf_base = ",".join(filter_parts)

        # 2-pass palettegen + paletteuse
        filter_str = f"{vf_base},split[s0][s1];[s0]palettegen=stats_mode=full[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5"

        cmd = [self.ffmpeg_binary, "-y"]
        if start_time is not None and start_time > 0:
            cmd += ["-ss", str(start_time)]
        if duration is not None and duration > 0:
            cmd += ["-t", str(duration)]

        cmd += ["-i", input_video, "-vf", filter_str, gif_output]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            # Fallback to standard paletteuse if bayer fails
            fallback_filter = f"{vf_base},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"
            cmd_fb = [self.ffmpeg_binary, "-y"]
            if start_time is not None and start_time > 0:
                cmd_fb += ["-ss", str(start_time)]
            if duration is not None and duration > 0:
                cmd_fb += ["-t", str(duration)]
            cmd_fb += ["-i", input_video, "-vf", fallback_filter, gif_output]
            res_fb = subprocess.run(cmd_fb, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            if res_fb.returncode != 0:
                raise RuntimeError(f"FFmpeg GIF error: {res_fb.stderr.strip() if res_fb.stderr else res.stderr.strip()}")
        return gif_output

    def extract_frame_image(
        self,
        input_video: str,
        target_format: str = "jpg",
        timestamp: float = 0.0
    ) -> str:
        """Extracts a high-resolution frame image from video at specific timestamp."""
        if not self.ffmpeg_binary:
            raise RuntimeError("FFmpeg is required for frame extraction.")

        clean_fmt = target_format.lower().strip()
        if clean_fmt == "jpeg":
            clean_fmt = "jpg"
        base_name, _ = os.path.splitext(input_video)
        output_file = f"{base_name}_frame.{clean_fmt}"

        cmd = [
            self.ffmpeg_binary, "-y",
            "-ss", str(timestamp),
            "-i", input_video,
            "-vframes", "1",
            "-q:v", "2",
            output_file
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg frame extraction error: {res.stderr.strip() if res.stderr else 'Unknown'}")
        return output_file

    def convert_image(self, input_file: str, target_format: str) -> str:
        """Converts image file (PNG, JPG, WEBP, BMP, GIF) using Pillow."""
        clean_fmt = target_format.lower().strip()
        if clean_fmt == "jpg":
            clean_fmt = "jpeg"

        base_name, _ = os.path.splitext(input_file)
        output_file = f"{base_name}.{'jpg' if clean_fmt == 'jpeg' else clean_fmt}"

        with Image.open(input_file) as im:
            if clean_fmt == "jpeg" and im.mode in ("RGBA", "P"):
                im = im.convert("RGB")
            im.save(output_file, format=clean_fmt.upper())

        return output_file

    def embed_audio_cover(self, audio_file: str, cover_path: str, metadata: Optional[Dict[str, str]] = None):
        """Attaches album artwork and metadata tags to MP3, FLAC, or M4A."""
        try:
            with open(cover_path, "rb") as f:
                img_data = f.read()

            ext = os.path.splitext(audio_file)[1].lower()
            if ext == ".mp3":
                try:
                    audio = ID3(audio_file)
                except ID3Error:
                    audio = ID3()
                audio.add(APIC(
                    encoding=3,
                    mime='image/jpeg' if cover_path.lower().endswith(('.jpg', '.jpeg')) else 'image/png',
                    type=3,
                    desc='Cover',
                    data=img_data
                ))
                if metadata:
                    if metadata.get('title'):
                        audio.add(TIT2(encoding=3, text=metadata['title']))
                    if metadata.get('artist'):
                        audio.add(TPE1(encoding=3, text=metadata['artist']))
                audio.save(audio_file)

            elif ext == ".flac":
                audio = FLAC(audio_file)
                pic = Picture()
                pic.data = img_data
                pic.type = 3
                pic.mime = 'image/jpeg' if cover_path.lower().endswith(('.jpg', '.jpeg')) else 'image/png'
                audio.add_picture(pic)
                if metadata:
                    if metadata.get('title'):
                        audio['title'] = metadata['title']
                    if metadata.get('artist'):
                        audio['artist'] = metadata['artist']
                audio.save()

            elif ext in [".m4a", ".mp4"]:
                audio = MP4(audio_file)
                cover_fmt = MP4Cover.FORMAT_JPEG if cover_path.lower().endswith(('.jpg', '.jpeg')) else MP4Cover.FORMAT_PNG
                audio["covr"] = [MP4Cover(img_data, imageformat=cover_fmt)]
                if metadata:
                    if metadata.get('title'):
                        audio["\xa9nam"] = metadata['title']
                    if metadata.get('artist'):
                        audio["\xa9ART"] = metadata['artist']
                audio.save()
        except Exception:
            # Metadata tagging is a non-fatal enhancement
            pass
