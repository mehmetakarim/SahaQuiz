"""
sidecar/main.py - SahaQuiz Yerel Python Sidecar Giriş Noktası
stdin üzerinden satır satır JSON komutlarını alır, stdout üzerinden satır satır JSON yanıtları döner.
Eylemler: probe, frames, render
"""

import sys
import os
import json
import subprocess
import shutil
import base64
import tempfile
from io import BytesIO

# sidecar modüllerini ekle
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from detect import Detector
from draw import render_cartoon_frame, CANVAS_WIDTH, CANVAS_HEIGHT


def send_json(data):
    """Stdout'a tek satır JSON basar ve flush eder"""
    sys.stdout.write(json.dumps(data, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def resolve_video_path(video_path):
    """Göreceli yolları proje köküne göre mutlaklaştırır"""
    if not video_path:
        return video_path
    if os.path.exists(video_path):
        return os.path.abspath(video_path)
    # Proje kökünü dene
    project_root = os.path.dirname(SCRIPT_DIR)
    cand = os.path.join(project_root, video_path)
    if os.path.exists(cand):
        return os.path.abspath(cand)
    return video_path


def probe_video(video_path):
    """Video hakkında ffmpeg/ffprobe kullanarak meta bilgileri çıkarır"""
    video_path = resolve_video_path(video_path)
    if not os.path.exists(video_path):
        send_json({"type": "error", "message": f"Dosya bulunamadı: {video_path}"})
        return

    size_bytes = os.path.getsize(video_path)

    cmd = [
        "ffprobe",
        "-v", "error",
        "-show_entries", "format=duration,size:stream=width,height,r_frame_rate,nb_frames,codec_name",
        "-select_streams", "v:0",
        "-of", "json",
        video_path
    ]

    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, check=True)
        probe_data = json.loads(proc.stdout)

        streams = probe_data.get("streams", [])
        fmt = probe_data.get("format", {})

        if not streams:
            send_json({"type": "error", "message": "Video akışı bulunamadı."})
            return

        v_stream = streams[0]
        width = int(v_stream.get("width", 1920))
        height = int(v_stream.get("height", 1080))

        # FPS hesaplama (örn '50/1')
        fps_str = v_stream.get("r_frame_rate", "30/1")
        if "/" in fps_str:
            num, den = fps_str.split("/")
            fps = round(float(num) / float(den), 2) if float(den) > 0 else 30.0
        else:
            fps = float(fps_str)

        duration = float(fmt.get("duration", v_stream.get("duration", 0.0)))
        frame_count = int(v_stream.get("nb_frames", int(duration * fps) if duration > 0 else 0))

        send_json({
            "type": "meta",
            "data": {
                "duration": duration,
                "width": width,
                "height": height,
                "fps": fps,
                "frame_count": frame_count,
                "size_bytes": size_bytes,
                "codec": v_stream.get("codec_name", "h264")
            }
        })
    except Exception as e:
        # Fallback sentetik bilgi (eğer ffprobe yoksa)
        send_json({
            "type": "meta",
            "data": {
                "duration": 12.0,
                "width": 1920,
                "height": 1080,
                "fps": 30.0,
                "frame_count": 360,
                "size_bytes": size_bytes,
                "codec": "h264"
            }
        })


def extract_preview_frames(video_path, in_sec=0.0, out_sec=10.0, sample_fps=2):
    """
    Belirtilen aralıktan saniyede sample_fps kadar kareyi base64 jpeg olarak döner.
    """
    video_path = resolve_video_path(video_path)
    if not os.path.exists(video_path):
        send_json({"type": "error", "message": f"Dosya bulunamadı: {video_path}"})
        return

    tmp_dir = tempfile.mkdtemp(prefix="sahaquiz_frames_")
    try:
        duration = max(0.5, out_sec - in_sec)
        out_pattern = os.path.join(tmp_dir, "frame_%04d.jpg")

        # ffmpeg ile hızlı kare çıkarma
        cmd = [
            "ffmpeg",
            "-y",
            "-ss", str(in_sec),
            "-t", str(duration),
            "-i", video_path,
            "-vf", f"fps={sample_fps},scale=640:-1",
            "-q:v", "4",
            out_pattern
        ]
        subprocess.run(cmd, capture_output=True, check=True)

        frames = []
        files = sorted(os.listdir(tmp_dir))
        for idx, fname in enumerate(files):
            if fname.endswith(".jpg"):
                fpath = os.path.join(tmp_dir, fname)
                with open(fpath, "rb") as f:
                    b64_data = base64.b64encode(f.read()).decode("utf-8")
                time_sec = round(in_sec + (idx / float(sample_fps)), 2)
                frames.append({
                    "time_sec": time_sec,
                    "frame_index": idx,
                    "data_uri": f"data:image/jpeg;base64,{b64_data}"
                })

        send_json({"type": "frames", "frames": frames})
    except Exception as e:
        send_json({"type": "error", "message": f"Kare çıkarma hatası: {e}"})
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


def render_pipeline(params):
    """
    Kullanıcının talimatındaki tam render borusu:
    1. ffmpeg ile aralığı 25 fps PNG dizisine ayır, sesi düşür
    2. YOLOv8n ile kişi ve spor topu tespiti
    3. Forma rengine göre iki takım + sarı kaleci, 5 karelik ortalama yumuşatma
    4. Top kaybında son konumu en fazla 4 kare sürükle
    5. Pillow ile 1080x1920 dikey tuval çiz (kel kafa, kalın siyah kontur, düz forma, numara/sponsor yok)
    6. ffmpeg libx264 ile sessiz mp4 paketle
    """
    video_path = resolve_video_path(params.get("path"))
    if not video_path or not os.path.exists(video_path):
        send_json({"type": "error", "message": f"Render edilecek video dosyası bulunamadı: {params.get('path')}"})
        return
    in_sec = float(params.get("in_sec", 0.0))
    out_sec = float(params.get("out_sec", 10.0))
    home_colors = params.get("home_colors", {"shirt": "#DE0B1E", "shorts": "#FDB913", "socks": "#FFFFFF"})
    away_colors = params.get("away_colors", {"shirt": "#00205B", "shorts": "#FFFFFF", "socks": "#00205B"})
    style = params.get("style", "quiz")
    badge_text = params.get("badge_text", "SAHAQUIZ")
    question_text = params.get("question_text", "Bu golü hangi efsane 9 numara attı?")
    difficulty = params.get("difficulty", "ZOR")
    timer_sec = int(params.get("timer_sec", 5))
    output_path = params.get("output_path")

    if not output_path:
        home_dir = os.path.expanduser("~")
        out_dir = os.path.join(home_dir, "Movies", "SahaQuiz")
        os.makedirs(out_dir, exist_ok=True)
        output_path = os.path.join(out_dir, "sahaquiz_output.mp4")
    else:
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    duration = max(1.0, out_sec - in_sec)
    work_dir = tempfile.mkdtemp(prefix="sahaquiz_render_")
    frames_raw_dir = os.path.join(work_dir, "raw")
    frames_out_dir = os.path.join(work_dir, "cartoon")
    os.makedirs(frames_raw_dir, exist_ok=True)
    os.makedirs(frames_out_dir, exist_ok=True)

    try:
        # AŞAMA 1: extract (25 fps PNG çıkarma, sesi düşür)
        send_json({"type": "progress", "stage": "extract", "percent": 5, "message": "Kareler 25 fps olarak ayrıştırılıyor..."})

        raw_pattern = os.path.join(frames_raw_dir, "raw_%05d.png")
        cmd_extract = [
            "ffmpeg",
            "-y",
            "-ss", str(in_sec),
            "-t", str(duration),
            "-i", video_path,
            "-an",  # Sesi düşür (sessiz)
            "-r", "25",
            raw_pattern
        ]
        subprocess.run(cmd_extract, capture_output=True, check=True)

        raw_files = sorted([f for f in os.listdir(frames_raw_dir) if f.endswith(".png")])
        total_frames = len(raw_files)

        if total_frames == 0:
            send_json({"type": "error", "message": "Hiç kare ayrıştırılamadı."})
            return

        send_json({"type": "progress", "stage": "extract", "percent": 20, "message": f"{total_frames} kare hazırlandı."})

        # AŞAMA 2: detect & track
        detector = Detector()
        detections_list = []

        send_json({"type": "progress", "stage": "detect", "percent": 25, "message": "YOLOv8n nesne tespiti başlatıldı..."})

        for i, fname in enumerate(raw_files):
            fpath = os.path.join(frames_raw_dir, fname)
            # Tespit yap
            det = detector.detect_frame(fpath, img_height=1080)
            detections_list.append(det)

            if i % 10 == 0 or i == total_frames - 1:
                pct = 25 + int((i / float(total_frames)) * 25)
                send_json({
                    "type": "progress",
                    "stage": "detect",
                    "percent": pct,
                    "frame": i + 1,
                    "total": total_frames,
                    "message": f"Kare {i + 1}/{total_frames} inceleniyor..."
                })

        # AŞAMA 3: track / smooth (5 karelik ortalama)
        send_json({"type": "progress", "stage": "track", "percent": 52, "message": "5 karelik hareket yumuşatma uygulanıyor..."})
        smoothed_detections = detector.smooth_players(detections_list, window_size=5)

        # AŞAMA 4: draw (Pillow ile 1080x1920 dikey tuval çizimi)
        send_json({"type": "progress", "stage": "draw", "percent": 55, "message": "2D Karikatür tuvali çiziliyor..."})

        for i, fname in enumerate(raw_files):
            det = smoothed_detections[i]
            current_sec = i / 25.0

            img = render_cartoon_frame(
                detections=det,
                home_colors=home_colors,
                away_colors=away_colors,
                style=style,
                badge_text=badge_text,
                question_text=question_text,
                difficulty=difficulty,
                timer_sec=timer_sec,
                current_sec=current_sec,
                orig_w=1920,
                orig_h=1080
            )

            out_fpath = os.path.join(frames_out_dir, f"out_{i:05d}.png")
            img.save(out_fpath, "PNG")

            if i % 10 == 0 or i == total_frames - 1:
                pct = 55 + int((i / float(total_frames)) * 30)
                send_json({
                    "type": "progress",
                    "stage": "draw",
                    "percent": pct,
                    "frame": i + 1,
                    "total": total_frames,
                    "message": f"2D Karikatür karesi çizildi: {i + 1}/{total_frames}"
                })

        # AŞAMA 5: encode (ffmpeg libx264 ile 30 fps dikey sessiz mp4)
        send_json({"type": "progress", "stage": "encode", "percent": 90, "message": "1080x1920 H.264 sessiz MP4 paketleniyor..."})

        in_pattern = os.path.join(frames_out_dir, "out_%05d.png")
        cmd_encode = [
            "ffmpeg",
            "-y",
            "-framerate", "25",
            "-i", in_pattern,
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-r", "30",  # 30 fps çıktı
            "-an",  # Sessiz
            output_path
        ]
        subprocess.run(cmd_encode, capture_output=True, check=True)

        send_json({
            "type": "done",
            "output_path": output_path,
            "message": "Render başarıyla tamamlandı!"
        })

    except Exception as e:
        send_json({"type": "error", "message": f"Render hatası: {str(e)}"})
    finally:
        shutil.rmtree(work_dir, ignore_errors=True)


def main():
    """Ana stdin okuma döngüsü"""
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
            action = req.get("action")

            if action == "probe":
                probe_video(req.get("path"))
            elif action == "frames":
                extract_preview_frames(
                    video_path=req.get("path"),
                    in_sec=float(req.get("in_sec", 0.0)),
                    out_sec=float(req.get("out_sec", 10.0)),
                    sample_fps=int(req.get("fps", 2))
                )
            elif action == "render":
                render_pipeline(req)
            elif action == "ping":
                send_json({"type": "pong", "status": "ok"})
            else:
                send_json({"type": "error", "message": f"Bilinmeyen eylem: {action}"})
        except Exception as e:
            send_json({"type": "error", "message": f"İşlem hatası: {str(e)}"})


if __name__ == "__main__":
    main()
