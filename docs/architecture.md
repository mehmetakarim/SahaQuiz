# Sistem Mimarisi ve Teknoloji Yığını

*Bu belge SahaQuiz projesinin doğrulanmış teknik mimarisini, dizin yapısını ve bileşenler arası ilişkilerini açıklar.*

---

## 1. Teknoloji Yığını
- **Masaüstü Shell:** Tauri v2 (`@tauri-apps/api`, `tauri-plugin-shell`, `tauri-plugin-dialog`, `tauri-plugin-fs`)
- **Arayüz Framework:** React 18, TypeScript, Vite 6
- **Stil & Tasarım:** Tailwind CSS v3 ("Pitch Precision Utility" tasarım tokenları)
  - Arka plan / Kök Shell: `#101412` / `#141816`
  - Saha Çimi: `#1F7A3A` (çizgili desen `#2E8B4A`)
  - Vurgu / Primary CTA: `#F5C518` (Stadyum sarısı)
  - Köşe yarıçapı: `12px` (`rounded-xl`)
- **İşlem Motoru (Sidecar):** Python 3.11/3.14
  - `sidecar/requirements.txt`: `opencv-python`, `ultralytics`, `Pillow`, `numpy`
- **Video & Medya:** Sistem FFmpeg & FFprobe (v8.1)
  - Sesi düşürülmüş (sessiz) H.264 1080×1920 30fps dikey MP4 çıktısı.

---

## 2. Dizin Yapısı ve Modül Sorumlulukları

```
.
├── AGENTS.md             # Ortak çalışma kuralları ve hafıza protokolü
├── CLAUDE.md             # Claude Code giriş dosyası
├── brain.md              # Güncel oturum devralma ve durum özeti
├── README.md             # Kurulum ve çalıştırma rehberi
├── package.json          # Node bağımlılıkları ve betikleri
├── vite.config.ts        # Vite konfigürasyonu
├── tailwind.config.js    # Tasarım sistemi renk ve tipografi tokenları
├── src/                  # React kullanıcı arayüzü
│   ├── App.tsx           # Ana uygulama ve durum yöneticisi
│   ├── types.ts          # TypeScript veri modelleri
│   ├── index.css         # Temel CSS ve font kuralları
│   └── components/
│       ├── Header.tsx    # Masaüstü pencere kontrolleri ve donanım barı
│       ├── Sidebar.tsx   # 5 adımlı sol navigasyon
│       ├── Step1Clip.tsx # 1. Adım: Klip seçimi & akış analizi
│       ├── Step2Cut.tsx  # 2. Adım: In/out hassas kesim & yakın plan heuristiği
│       ├── Step3Teams.tsx# 3. Adım: Takım kitleri, mini saha SVG & kilitli no gizleme
│       ├── Step4Style.tsx# 4. Adım: Stil şablonları & 9:16 canlı mobil simülatör
│       └── Step5Export.tsx# 5. Adım: 6 aşamalı işlem sırası & sessiz MP4 render
├── src-tauri/            # Tauri 2 Rust kabuğu
│   ├── Cargo.toml        # Rust bağımlılıkları
│   ├── tauri.conf.json   # Masaüstü pencere ve güvenlik izinleri
│   └── src/
│       ├── lib.rs        # Python sidecar çağırma ve event köprüsü
│       └── main.rs       # Tauri giriş noktası
├── sidecar/              # Yerel görüntü işleme motoru
│   ├── main.py           # stdin/stdout JSON satır sözleşmesi (probe, frames, render)
│   ├── detect.py         # YOLOv8n oyuncu/top tespiti & 5 karelik takip
│   ├── draw.py           # Pillow ile 2D karikatür tuval ve overlay çizimi
│   └── requirements.txt  # Python kütüphane gereksinimleri
├── models/               # YOLOv8 model ağırlıkları
└── design/               # Salt okunur tasarım referansları ve ekran görüntüleri
```

---

## 3. Sidecar İletişim Protokolü (JSON Lines)
- **`probe`:** `{"action": "probe", "path": "..."}` -> süre, fps, çözünürlük, kare sayısı.
- **`frames`:** `{"action": "frames", "path": "...", "in_sec": ..., "out_sec": ...}` -> önizleme kareleri.
- **`render`:** `{"action": "render", ...}` -> olaylar: `extract`, `detect`, `track`, `draw`, `encode`, `done`, `error`.
