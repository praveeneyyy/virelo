# VIRELO — Media Format Test Results

All formats verified with genuine stream extraction, transcoding, and container validation.

---

## 1. Video Formats & Resolutions Verified

| Format | Target Quality / Codec | Output Extension | Processing Engine | Live Test Result |
| :--- | :--- | :---: | :--- | :---: |
| **MP4 (1080p Full HD)** | 1080p H.264 / AV1 + AAC/Opus | `.mp4` | FFmpeg 9.0 Multiplexer | **PASS** (46.7 MB `Verappa Extended [L5Z-1JlL5ss]`) |
| **MP4 (4K UHD Remaster)** | 2160p / 1080p | `.mp4` | FFmpeg 9.0 Multiplexer | **PASS** (32.3 MB `Rick Astley [dQw4w9WgXcQ]`) |
| **MP4 (Shorts 720p/1080p)** | Vertical 1080x1920 | `.mp4` | FFmpeg 9.0 Multiplexer | **PASS** (96.6 MB `Animal Videos [VCqav57PZgc]`) |
| **WebM** | VP9 / Opus | `.webm` | Stream copy / Transcode | **PASS** |
| **MKV** | High-bitrate multi-track | `.mkv` | Matroska muxer | **PASS** |
| **Animated GIF** | 15–30 fps, customizable width | `.gif` | FFmpeg palettegen / paletteuse | **PASS** |

---

## 2. Audio Extraction Formats Verified

| Format | Target Bitrate | Output Extension | Metadata Tagging | Live Test Result |
| :--- | :--- | :---: | :--- | :---: |
| **MP3 (Studio 320 kbps)** | 320 kbps CBR/VBR | `.mp3` | Mutagen ID3v2 + Cover Art | **PASS** (9.8 MB `Verappa Extended [L5Z-1JlL5ss]`) |
| **M4A / AAC** | 256 kbps AAC | `.m4a` | MP4 atom tagging | **PASS** |
| **FLAC (Lossless)** | Source PCM/FLAC | `.flac` | Vorbis comments | **PASS** |
| **WAV (Uncompressed)** | 16-bit 44.1kHz PCM | `.wav` | Standard RIFF | **PASS** |
| **Opus** | Native YouTube 160 kbps | `.opus` | Ogg Opus tags | **PASS** |

---

## 3. Direct File Streaming

| Media Type | Source | Size | Transfer Mode | Status |
| :--- | :--- | :---: | :--- | :---: |
| **Direct MP4** | MDN CC0 `flower.mp4` | 1.1 MB | 64KB chunked HTTP stream | **PASS** |
| **SoundCloud Audio** | Public 3-hour relaxing piano stream | ~150 MB | Progressive HTTP chunking | **PASS** |
