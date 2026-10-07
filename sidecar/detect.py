import os
import sys
import math
try:
    import numpy as np
    from PIL import Image
except ImportError:
    np = None
    Image = None

try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
MODEL_PATH = os.path.join(MODELS_DIR, "yolov8n.pt")


class Detector:
    def __init__(self):
        self.model = None
        self.next_track_id = 1
        self.active_tracks = {}  # track_id -> {"box": [x1,y1,x2,y2], "last_seen": int, "color": (r,g,b), "team": str, "history": []}
        self.ball_pos = None
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

    def extract_jersey_color(self, img_pil_or_arr, box):
        """Oyuncunun gövde bölgesinden (forma) ortalama RGB rengini çıkarır"""
        try:
            if img_pil_or_arr is None:
                return (128, 128, 128)
            if hasattr(img_pil_or_arr, "crop"):
                w, h = img_pil_or_arr.size
                x1, y1, x2, y2 = box
                bw = x2 - x1
                bh = y2 - y1
                # Göğüs / forma bölgesi: kutunun %20 - %55 yüksekliği
                crop_box = (
                    max(0, int(x1 + bw * 0.2)),
                    max(0, int(y1 + bh * 0.2)),
                    min(w, int(x2 - bw * 0.2)),
                    min(h, int(y1 + bh * 0.55))
                )
                if crop_box[2] > crop_box[0] and crop_box[3] > crop_box[1]:
                    cropped = img_pil_or_arr.crop(crop_box).resize((16, 16))
                    arr = np.array(cropped)
                    if arr.size > 0:
                        mean_rgb = arr[:, :, :3].mean(axis=(0, 1)).astype(int)
                        return (int(mean_rgb[0]), int(mean_rgb[1]), int(mean_rgb[2]))
        except Exception:
            pass
        return (128, 128, 128)

    def detect_frame(self, img_path_or_array, img_height=1080):
        """
        Görselde kişi (cls 0) ve spor topu (cls 32) tespit eder.
        Centroid tracker ile oyuncu kimliklerini korur.
        """
        if not self.load_model():
            return {"players": [], "ball": None, "has_close_up": False}

        # PIL görselini forma rengi için yükle
        pil_img = None
        if isinstance(img_path_or_array, str) and os.path.exists(img_path_or_array):
            try:
                pil_img = Image.open(img_path_or_array).convert("RGB")
                img_height = pil_img.height
            except Exception:
                pil_img = None

        results = self.model(img_path_or_array, verbose=False)
        boxes_data = results[0].boxes

        raw_players = []
        ball = None
        has_close_up = False

        if boxes_data is not None and len(boxes_data) > 0:
            for b in boxes_data:
                cls_id = int(b.cls[0].item())
                conf = float(b.conf[0].item())
                if conf < 0.28:
                    continue
                coords = b.xyxy[0].tolist()
                x1, y1, x2, y2 = coords
                box_h = y2 - y1

                is_close_up = (box_h / float(img_height)) > 0.35 if img_height > 0 else False
                if is_close_up:
                    has_close_up = True

                if cls_id == 0:  # person
                    color = self.extract_jersey_color(pil_img, [x1, y1, x2, y2])
                    raw_players.append({
                        "box": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
                        "is_close_up": is_close_up,
                        "conf": conf,
                        "color": color
                    })
                elif cls_id == 32:  # sports ball
                    if ball is None or conf > ball[2]:
                        cx = (x1 + x2) / 2.0
                        cy = (y1 + y2) / 2.0
                        ball = [round(cx, 1), round(cy, 1), conf]

        # Tracker ile eşleştirme (Centroid matching)
        matched_players = []
        used_tracks = set()

        for p in raw_players:
            bx1, by1, bx2, by2 = p["box"]
            cx = (bx1 + bx2) / 2.0
            cy = (by1 + by2) / 2.0

            best_id = None
            min_dist = 120.0  # Piksel toleransı

            for tid, tinfo in self.active_tracks.items():
                if tid in used_tracks:
                    continue
                tx1, ty1, tx2, ty2 = tinfo["box"]
                tcx = (tx1 + tx2) / 2.0
                tcy = (ty1 + ty2) / 2.0
                dist = math.hypot(cx - tcx, cy - tcy)
                if dist < min_dist:
                    min_dist = dist
                    best_id = tid

            if best_id is not None:
                used_tracks.add(best_id)
                tinfo = self.active_tracks[best_id]
                tinfo["box"] = p["box"]
                tinfo["last_seen"] = 0
                tinfo["history"].append(p["box"])
                if len(tinfo["history"]) > 5:
                    tinfo["history"].pop(0)

                # 5 karelik yumuşatma
                boxes_hist = tinfo["history"]
                avg_box = [
                    round(sum(b[0] for b in boxes_hist) / len(boxes_hist), 1),
                    round(sum(b[1] for b in boxes_hist) / len(boxes_hist), 1),
                    round(sum(b[2] for b in boxes_hist) / len(boxes_hist), 1),
                    round(sum(b[3] for b in boxes_hist) / len(boxes_hist), 1)
                ]
                matched_players.append({
                    "id": best_id,
                    "box": avg_box,
                    "is_close_up": p["is_close_up"],
                    "color": p["color"]
                })
            else:
                new_id = self.next_track_id
                self.next_track_id += 1
                self.active_tracks[new_id] = {
                    "box": p["box"],
                    "last_seen": 0,
                    "color": p["color"],
                    "history": [p["box"]]
                }
                used_tracks.add(new_id)
                matched_players.append({
                    "id": new_id,
                    "box": p["box"],
                    "is_close_up": p["is_close_up"],
                    "color": p["color"]
                })

        # Eski kaybolan trackleri temizle
        dead_tracks = []
        for tid in self.active_tracks:
            if tid not in used_tracks:
                self.active_tracks[tid]["last_seen"] += 1
                if self.active_tracks[tid]["last_seen"] > 10:
                    dead_tracks.append(tid)
        for tid in dead_tracks:
            del self.active_tracks[tid]

        # Top sürükleme mantığı (en fazla 4 kare)
        ball_pos = None
        if ball is not None:
            ball_pos = [ball[0], ball[1]]
            self.last_ball_pos = ball_pos
            self.ball_lost_frames = 0
        else:
            if self.last_ball_pos is not None and self.ball_lost_frames < 4:
                self.ball_lost_frames += 1
                ball_pos = list(self.last_ball_pos)
            else:
                self.last_ball_pos = None

        return {
            "players": matched_players,
            "ball": ball_pos,
            "has_close_up": has_close_up
        }

    def smooth_players(self, frames_detections, window_size=5):
        """Kareler arası tespitleri döner (Centroid tracker anlık olarak yumuşattığı için korur)"""
        return frames_detections
