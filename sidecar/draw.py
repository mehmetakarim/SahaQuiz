"""
sidecar/draw.py - 2D Karikatür Futbol Tuvali & Çizim Modülü
Pillow ile düz yeşil zemin, beyaz saha çizgileri, kel kafa, yüzsüz, numarasız, kalın siyah konturlu 2D spritelar ve 1080x1920 dikey format overlayleri çizer.
"""

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    Image = None
    ImageDraw = None
    ImageFont = None

CANVAS_WIDTH = 1080
CANVAS_HEIGHT = 1920

# Renk sabitleri
COLOR_PITCH_1 = "#1F7A3A"
COLOR_PITCH_2 = "#2E8B4A"
COLOR_CHALK = (255, 255, 255, 200)
COLOR_SKIN = "#FCD5B5"
COLOR_CONTOUR = (0, 0, 0, 255)
COLOR_YELLOW = "#F5C518"
COLOR_DARK = "#141816"


def hex_to_rgb(hex_str, default=(200, 200, 200)):
    if not hex_str or not isinstance(hex_str, str):
        return default
    hex_str = hex_str.lstrip("#")
    if len(hex_str) == 6:
        try:
            return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
        except ValueError:
            return default
    return default


def get_default_font(size=24):
    try:
        # Standart sistem fontları
        for font_name in ["Arial.ttf", "DejaVuSans.ttf", "Helvetica.ttc", "SFPro.ttf", "/System/Library/Fonts/SFPro.ttf"]:
            try:
                return ImageFont.truetype(font_name, size)
            except Exception:
                continue
    except Exception:
        pass
    return ImageFont.load_default()


def draw_pitch_background(draw):
    """1080x1920 dikey yeşil saha zemini ve beyaz taktik çizgileri çizer"""
    # Yeşil çim şeritleri
    stripe_height = CANVAS_HEIGHT // 12
    for i in range(12):
        color = COLOR_PITCH_1 if i % 2 == 0 else COLOR_PITCH_2
        draw.rectangle([0, i * stripe_height, CANVAS_WIDTH, (i + 1) * stripe_height], fill=color)

    # Saha sınır çizgileri (margin 60px)
    margin_x = 60
    margin_y = 280
    field_w = CANVAS_WIDTH - 2 * margin_x
    field_h = CANVAS_HEIGHT - 2 * margin_y

    draw.rectangle([margin_x, margin_y, margin_x + field_w, margin_y + field_h], outline=(255, 255, 255, 180), width=6)

    # Orta çizgi ve daire
    mid_y = margin_y + field_h // 2
    draw.line([margin_x, mid_y, margin_x + field_w, mid_y], fill=(255, 255, 255, 180), width=5)
    center_r = 130
    draw.ellipse(
        [CANVAS_WIDTH // 2 - center_r, mid_y - center_r, CANVAS_WIDTH // 2 + center_r, mid_y + center_r],
        outline=(255, 255, 255, 180),
        width=5
    )
    draw.ellipse([CANVAS_WIDTH // 2 - 8, mid_y - 8, CANVAS_WIDTH // 2 + 8, mid_y + 8], fill=(255, 255, 255, 220))

    # Ceza sahaları
    box_w = 480
    box_h = 240
    # Üst ceza sahası
    box_x1 = (CANVAS_WIDTH - box_w) // 2
    draw.rectangle([box_x1, margin_y, box_x1 + box_w, margin_y + box_h], outline=(255, 255, 255, 180), width=5)
    # Alt ceza sahası
    draw.rectangle([box_x1, margin_y + field_h - box_h, box_x1 + box_w, margin_y + field_h], outline=(255, 255, 255, 180), width=5)


def draw_player_sprite(draw, cx, cy, height, shirt_color, shorts_color, socks_color, is_gk=False, style="quiz"):
    """
    Kel kafa, yüz yok, kalın siyah kontur, düz forma ve şort çizer.
    """
    scale = max(0.4, min(2.5, height / 180.0))
    contour_w = 4 if style == "quiz" else 2

    head_r = int(18 * scale)
    body_w = int(36 * scale)
    body_h = int(48 * scale)
    leg_w = int(12 * scale)
    leg_h = int(40 * scale)

    head_center_y = cy - int(45 * scale)
    body_top_y = head_center_y + head_r
    shorts_top_y = body_top_y + body_h - int(12 * scale)
    legs_top_y = shorts_top_y + int(24 * scale)

    # Alt gölge
    if style == "quiz":
        shadow_rx = int(28 * scale)
        shadow_ry = int(9 * scale)
        draw.ellipse(
            [cx - shadow_rx, legs_top_y + leg_h - 4, cx + shadow_rx, legs_top_y + leg_h + shadow_ry],
            fill=(0, 0, 0, 80)
        )

    # Bacaklar / Tozluklar
    # Sol bacak
    draw.rectangle([cx - int(16 * scale), legs_top_y, cx - int(4 * scale), legs_top_y + leg_h], fill=socks_color, outline=COLOR_CONTOUR, width=contour_w)
    # Sağ bacak
    draw.rectangle([cx + int(4 * scale), legs_top_y, cx + int(16 * scale), legs_top_y + leg_h], fill=socks_color, outline=COLOR_CONTOUR, width=contour_w)

    # Şort
    draw.rectangle([cx - int(20 * scale), shorts_top_y, cx + int(20 * scale), legs_top_y + int(10 * scale)], fill=shorts_color, outline=COLOR_CONTOUR, width=contour_w)

    # Gövde / Forma (Düz renk, numara yok, sponsor yok)
    shirt_c = (43, 248, 83) if is_gk else shirt_color
    draw.polygon([
        (cx - int(22 * scale), body_top_y),
        (cx + int(22 * scale), body_top_y),
        (cx + int(18 * scale), shorts_top_y + int(5 * scale)),
        (cx - int(18 * scale), shorts_top_y + int(5 * scale))
    ], fill=shirt_c, outline=COLOR_CONTOUR)
    draw.line([
        (cx - int(22 * scale), body_top_y),
        (cx + int(22 * scale), body_top_y),
        (cx + int(18 * scale), shorts_top_y + int(5 * scale)),
        (cx - int(18 * scale), shorts_top_y + int(5 * scale)),
        (cx - int(22 * scale), body_top_y)
    ], fill=COLOR_CONTOUR, width=contour_w)

    # Kollar
    draw.rectangle([cx - int(28 * scale), body_top_y + 4, cx - int(20 * scale), body_top_y + int(28 * scale)], fill=shirt_c, outline=COLOR_CONTOUR, width=contour_w)
    draw.rectangle([cx + int(20 * scale), body_top_y + 4, cx + int(28 * scale), body_top_y + int(28 * scale)], fill=shirt_c, outline=COLOR_CONTOUR, width=contour_w)

    # Kafa (Kel, yüz yok, kalın siyah kontur)
    draw.ellipse(
        [cx - head_r, head_center_y - head_r, cx + head_r, head_center_y + head_r],
        fill=hex_to_rgb(COLOR_SKIN),
        outline=COLOR_CONTOUR,
        width=contour_w
    )


def draw_ball(draw, bx, by, radius=18):
    """Futbol topu çizer"""
    draw.ellipse([bx - radius - 2, by + radius - 4, bx + radius + 2, by + radius + 8], fill=(0, 0, 0, 90))
    draw.ellipse([bx - radius, by - radius, bx + radius, by + radius], fill=(255, 255, 255), outline=COLOR_CONTOUR, width=3)
    # İç desen
    inner_r = radius // 2
    draw.rectangle([bx - inner_r, by - inner_r, bx + inner_r, by + inner_r], fill=(20, 20, 20), outline=COLOR_CONTOUR, width=2)


def draw_overlays(draw, badge_text, question_text, difficulty, timer_sec, current_sec=0.0):
    """Üst rozet, zorluk seviyesi, geri sayım ve alt soru kartı metinlerini çizer"""
    font_bold_lg = get_default_font(42)
    font_bold_md = get_default_font(32)
    font_regular_sm = get_default_font(24)

    # 1. Üst Rozet Bandı (SAHAQUIZ • ZOR SEVİYE)
    badge_bg = [80, 100, 480, 190]
    draw.rectangle(badge_bg, fill=(16, 20, 18, 230), outline=(245, 197, 24, 255), width=3)
    draw.text((105, 122), badge_text.upper(), fill=hex_to_rgb(COLOR_YELLOW), font=font_bold_md)
    draw.text((320, 126), f"• {difficulty.upper()}", fill=(255, 255, 255), font=font_regular_sm)

    # 2. Geri Sayım Sayacı (Üst Sağ)
    timer_box = [CANVAS_WIDTH - 280, 100, CANVAS_WIDTH - 80, 190]
    draw.rectangle(timer_box, fill=(16, 20, 18, 230), outline=(245, 197, 24, 255), width=3)
    remaining = max(0, timer_sec - int(current_sec))
    draw.text((CANVAS_WIDTH - 245, 122), f"⏱ {remaining}s", fill=hex_to_rgb(COLOR_YELLOW), font=font_bold_md)

    # 3. Alt Viral Soru Kartı
    q_box = [60, CANVAS_HEIGHT - 380, CANVAS_WIDTH - 60, CANVAS_HEIGHT - 120]
    draw.rectangle(q_box, fill=hex_to_rgb(COLOR_YELLOW), outline=COLOR_CONTOUR, width=5)

    # Soru kutusu başlığı
    draw.rectangle([q_box[0] + 20, q_box[1] + 18, q_box[0] + 240, q_box[1] + 62], fill=(20, 24, 22))
    draw.text((q_box[0] + 35, q_box[1] + 24), "GOLÜ TAHMİN ET", fill=hex_to_rgb(COLOR_YELLOW), font=font_regular_sm)

    # Soru metni
    draw.text((q_box[0] + 30, q_box[1] + 85), question_text, fill=(20, 24, 22), font=font_bold_lg)

    # Küçük telif bilgilendirme dipnotu (yayın görüntüsü türev eserdir uyarısı)
    warning_text = "Yayın görüntüsü türev eserdir. Bu araç telif hakkını kaldırmaz. Orijinal ses dışa aktarılmaz."
    font_warning = get_default_font(18)
    draw.text((80, CANVAS_HEIGHT - 80), warning_text, fill=(200, 200, 200, 180), font=font_warning)


def render_cartoon_frame(
    detections,
    home_colors,
    away_colors,
    style="quiz",
    badge_text="SAHAQUIZ",
    question_text="Bu golü hangi efsane 9 numara attı?",
    difficulty="ZOR",
    timer_sec=5,
    current_sec=0.0,
    orig_w=1920,
    orig_h=1080
):
    """
    Tek bir kareyi 1080x1920 dikey 2D karikatür olarak oluşturur ve PIL Image nesnesi döner.
    """
    img = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), color=COLOR_PITCH_1)
    draw = ImageDraw.Draw(img)

    # Arka plan saha
    draw_pitch_background(draw)

    # Oyuncuları çiz
    players = detections.get("players", [])
    scale_x = CANVAS_WIDTH / float(orig_w) if orig_w > 0 else 1.0
    scale_y = (CANVAS_HEIGHT - 600) / float(orig_h) if orig_h > 0 else 1.0
    offset_y = 300

    home_shirt = hex_to_rgb(home_colors.get("shirt", "#DE0B1E"))
    home_shorts = hex_to_rgb(home_colors.get("shorts", "#FDB913"))
    home_socks = hex_to_rgb(home_colors.get("socks", "#FFFFFF"))

    away_shirt = hex_to_rgb(away_colors.get("shirt", "#00205B"))
    away_shorts = hex_to_rgb(away_colors.get("shorts", "#FFFFFF"))
    away_socks = hex_to_rgb(away_colors.get("socks", "#00205B"))

    for i, p in enumerate(players):
        box = p["box"]
        x1, y1, x2, y2 = box
        orig_cx = (x1 + x2) / 2.0
        orig_cy = (y1 + y2) / 2.0
        orig_h_box = y2 - y1

        target_cx = int(orig_cx * scale_x)
        target_cy = int(orig_cy * scale_y + offset_y)
        target_h = int(orig_h_box * scale_y)

        # Takım ayrımı (yarısı ev, yarısı deplasman, ilki kaleci)
        if i == 0:
            draw_player_sprite(draw, target_cx, target_cy, target_h, home_shirt, home_shorts, home_socks, is_gk=True, style=style)
        elif i % 2 == 0:
            draw_player_sprite(draw, target_cx, target_cy, target_h, home_shirt, home_shorts, home_socks, is_gk=False, style=style)
        else:
            draw_player_sprite(draw, target_cx, target_cy, target_h, away_shirt, away_shorts, away_socks, is_gk=False, style=style)

    # Topu çiz
    ball = detections.get("ball")
    if ball is not None:
        bx = int(ball[0] * scale_x)
        by = int(ball[1] * scale_y + offset_y)
        draw_ball(draw, bx, by)

    # Üst ve alt overlayler
    draw_overlays(draw, badge_text, question_text, difficulty, timer_sec, current_sec)

    return img
