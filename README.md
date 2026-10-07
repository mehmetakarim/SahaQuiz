# SahaQuiz ⚽🎬

SahaQuiz, kısa bir futbol klibini viral “tahmin et” formatındaki düz 2D karikatür videoya dönüştüren yerel bir masaüstü uygulamasıdır.

## 🚀 Özellikler ve Mimari
- **Masaüstü Shell:** Tauri v2, React 18, TypeScript, Vite, Tailwind CSS.
- **Tasarım:** "Pitch Precision Utility" stadyum gecesi renk paleti (`#141816`, çim `#1F7A3A`, stadyum sarısı `#F5C518`, 12px yuvarlatılmış köşeler).
- **5 Adımlı Akış:**
  1. **Klip:** Video seçimi, akış ve kare analizi, donanım demux.
  2. **Kes:** In/out hassas kırpma (6–12 sn hedef), kare kare gezinti (-5k, -1k, +1k, +5k), yakın plan heuristik rozeti.
  3. **Takımlar:** Ev/Deplasman forma, şort, çorap ve kaleci renkleri, canlı 2D SVG saha simülasyonu, kilitli numara gizleme.
  4. **Stil:** Quiz (varsayılan), Çizgi ve Yayın Bandı seçenekleri, üst rozet metni, geri sayım süresi, viral alt soru kutusu, canlı 9:16 dikey mobil önizleme.
  5. **Dışa Aktar:** 1080×1920 30 FPS H.264 sessiz MP4 çıktısı, 6 aşamalı işlem sırası.
- **Yerel Görüntü İşleme (Sidecar):**
  - Python sidecar (`sidecar/main.py`, `detect.py`, `draw.py`).
  - OpenCV, YOLOv8n, Pillow, NumPy.
  - Sesi düşürülmüş (sessiz) video borusu, telif güvenliği.

---

## 🛠️ Kurulum ve Gereksinimler

### 1. Ön Koşullar
- **Node.js:** v20+ (`node -v`)
- **Rust Toolchain:** Rust & Cargo (`rustc --version`, `cargo --version`)
- **FFmpeg & FFprobe:** Sistemde kurulu olmalıdır (`ffmpeg -version`)
- **Python:** Python 3.11+

### 2. Bağımlılıkların Kurulması

```bash
# 1. Node bağımlılıkları
npm install

# 2. Python sanal ortamı ve sidecar paketleri
python3 -m venv .venv
source .venv/bin/activate
pip install -r sidecar/requirements.txt
```

### 3. Uygulamayı Geliştirme Modunda Çalıştırma

```bash
# Web arayüzünü tarayıcıda hızlı test etmek için:
npm run dev

# Tauri masaüstü uygulamasını başlatmak için:
npm run tauri dev
```

### 4. Üretim Derlemesi (Build)

```bash
npm run build
npm run tauri build
```

---

## ⚖️ Hukuki & Telif Bilgilendirmesi
*Yayın görüntüsü türev eser olarak kalır. Bu araç telif hakkını kaldırmaz. Orijinal ses dışa aktarılmaz (Sessiz MP4). Tüm işlem cihazınızda çevrimdışı yürütülür.*
