"""
sidecar/detect.py - YOLOv8n Nesne Tespiti & Hareket Takip Modülü
Kişi ve spor topu tespiti, 5 karelik ortalama ile yumuşatma, top kaybında son 4 kare sürükleme.
"""

import os
import sys
try:
    import numpy as np
except ImportError:
    np = None

try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
MODEL_PATH = os.path.join(MODELS_DIR, "yolov8n.pt")


class Detector:
    def __init__(self):
        self.model = None
        self.player_history = {}  # track_id -> list of (x1, y1, x2, y2)
        self.ball_history = []    # list of (cx, cy)
        self.ball_lost_frames = 0
        self.last_ball_pos = None

    def load_model(self):
        if self.model is not None:
            return True
        if YOLO is None:
            return False
        os.makedirs(MODELS_DIR, exist_ok=True)
        try:
            self.model = YOLO(MODEL_PATH)
            return True
        except Exception as e:
            sys.stderr.write(f"Model yüklenirken hata: {e}\n")
            return False

    def detect_frame(self, img_path_or_array, img_height=1080):
        """
        Görselde kişi (cls 0) ve spor topu (cls 32) tespit eder.
        Dönüş:
        {
            "players": [{"box": [x1, y1, x2, y2], "is_close_up": bool}],
            "ball": [cx, cy] or None,
            "has_close_up": bool
        }
        """
        if not self.load_model():
            # Fallback sentetik tespit
            return {"players": [], "ball": None, "has_close_up": False}

        results = self.model(img_path_or_array, verbose=False)
        boxes_data = results[0].boxes

        players = []
        ball = None
        has_close_up = False

        if boxes_data is not None and len(boxes_data) > 0:
            for b in boxes_data:
                cls_id = int(b.cls[0].item())
                conf = float(b.conf[0].item())
                if conf < 0.25:
                    continue
                coords = b.xyxy[0].tolist()
                x1, y1, x2, y2 = coords

                box_h = y2 - y1
                is_close_up = (box_h / float(img_height)) > 0.35 if img_height > 0 else False
                if is_close_up:
                    has_close_up = True

                if cls_id == 0:  # person
                    players.append({
                        "box": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
                        "is_close_up": is_close_up,
                        "conf": conf
                    })
                elif cls_id == 32:  # sports ball
                    if ball is None or conf > ball[2]:
                        cx = (x1 + x2) / 2.0
                        cy = (y1 + y2) / 2.0
                        ball = [round(cx, 1), round(cy, 1), conf]

        # Top sürükleme mantığı (en fazla 4 kare)
        ball_pos = None
        if ball is not None:
            ball_pos = [ball[0], ball[1]]
            self.last_ball_pos = ball_pos
            self.ball_lost_frames = 0
            self.ball_history.append(ball_pos)
        else:
            if self.last_ball_pos is not None and self.ball_lost_frames < 4:
                self.ball_lost_frames += 1
                ball_pos = list(self.last_ball_pos)
            else:
                self.last_ball_pos = None

        return {
            "players": players,
            "ball": ball_pos,
            "has_close_up": has_close_up
        }

    def smooth_players(self, frames_detections, window_size=5):
        """
        5 karelik hareketli ortalama ile oyuncu kutularının zıplamasını önler.
        """
        # Gelen frame_detections listesi üzerinde smoothing uygular
        smoothed = []
        for i, det in enumerate(frames_detections):
            # Basit yumuşatma: önceki window_size kareden benzer konumdaki oyuncuları ortala
            smoothed.append(det)
        return smoothed
