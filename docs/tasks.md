# Görevler ve Yol Haritası (docs/tasks.md)

Bu dosya proje görevlerini, önceliklerini, kabul kriterlerini ve doğrulama durumlarını takip eder.

---

## Aktif Görevler

*Şu anda devam eden aktif bir geliştirme görevi bulunmamaktadır.*

---

## Tamamlanan Görevler

### [TASK-001] Git ile Sürümlenebilir Çoklu Ajan Hafıza Altyapısının Kurulması
- **Öncelik:** Yüksek
- **Durum:** Tamamlandı
- **Amaç ve Kapsam:** Oturumlar arası bağlam kaybını önleyen hafıza iskeletini oluşturmak.
- **Kabul Kriterleri:**
  - [x] AGENTS.md, CLAUDE.md, brain.md, docs/* oluşturuldu.
- **Yayın Durumu:** Uygulanamaz.

### [TASK-002] SahaQuiz Masaüstü İskeletinin ve Tasarım Sisteminin Kurulması
- **Öncelik:** Yüksek
- **Durum:** Tamamlandı
- **Amaç ve Kapsam:** Design/ klasöründeki Pitch Precision Utility tasarımına uygun Tauri 2 + React + TypeScript + Vite + Tailwind iskeletinin oluşturulması.
- **Kabul Kriterleri:**
  - [x] Tasarım renkleri, tipografisi (Space Grotesk, Work Sans, JetBrains Mono) ve 12px köşe yarıçapı uygulandı.
  - [x] Header ve 5 adımlı Sidebar navigasyonu oluşturuldu.
  - [x] 5 tasarım ekranının bileşenleri oluşturuldu: Step1Clip, Step2Cut, Step3Teams, Step4Style, Step5Export.
  - [x] Tasarımda olmayan ekran veya menü uydurulmadı.
- **Doğrulama Sonucu:** `npm run build` ile TypeScript derlemesi başarıyla doğrulandı.
- **Yayın Durumu:** Yayınlanmadı.

### [TASK-003] Python Sidecar Sözleşmesinin ve Yerel Boru Hattının Kurulması
- **Öncelik:** Yüksek
- **Durum:** Tamamlandı
- **Amaç ve Kapsam:** sidecar/main.py, detect.py, draw.py ile probe, frames ve render sözleşmesinin yazılması.
- **Kabul Kriterleri:**
  - [x] stdin/stdout JSON satır sözleşmesi (probe, frames, render) kuruldu.
  - [x] 13 sn sentetik test futbol videosu üretildi (`test_derbi_13s.mp4`).
  - [x] `probe` ve `frames` eylemleri terminalde test edildi ve doğrulandı.
  - [x] YOLOv8n ve Pillow 2D karikatür çizim borusu hazırlandı.
- **Doğrulama Sonucu:** `echo '{"action": "probe", "path": "test_derbi_13s.mp4"}' | python3 sidecar/main.py` başarıyla JSON meta döndürdü.
- **Yayın Durumu:** Yayınlanmadı.

---

### [TASK-004] Canlı Geliştirme Testleri ve Sidecar Python Ortamının Doğrulanması
- **Öncelik:** Yüksek
- **Durum:** Tamamlandı
- **Amaç ve Kapsam:** Pillow, NumPy ortamının kurulması, tam render borusunun çalıştırılması ve çıktının ffprobe ile doğrulanması.
- **Kabul Kriterleri:**
  - [x] Pillow ve NumPy sanal ortama kuruldu.
  - [x] Sentetik test klibi ile tam render borusu çalıştırıldı.
  - [x] 1080x1920 30 FPS H.264 dikey sessiz video çıktısı başarıyla üretildi (`test_output_cartoon.mp4`).
  - [x] Orijinal sesin dosyada bulunmadığı (sessiz video) ffprobe ile doğrulandı.
  - [x] Rust Tauri bağımlılıkları ve Cargo.lock oluşturuldu.
### [TASK-005] AI Paketleri (PyTorch & Ultralytics) ve Prodüksiyon Derleme Doğrulaması
- **Öncelik:** Normal
- **Durum:** Tamamlandı
- **Amaç ve Kapsam:** .venv sanal ortamına PyTorch, Torchvision, Ultralytics, OpenCV-Python kurulumu ve prodüksiyon frontend build kontrolü.
- **Kabul Kriterleri:**
  - [x] PyTorch, torchvision, ultralytics, opencv-python sanal ortama kuruldu.
  - [x] Frontend `npm run build` prodüksiyon bundle'ı 0 hata ile derlendi (36s).
  - [x] Tüm sistem gereksinimleri ve modeller doğrulandı.
- **Doğrulama Sonucu:** `npm run build` (tsc & vite build) başarıyla 0 hata ile sonuçlandı; PyTorch/Ultralytics başarıyla yüklendi.
- **Yayın Durumu:** Doğrulandı / Yerel test başarılı.

---

## Bekleyen Görevler

*Tüm temel kabul kriterleri tamamlandı.*
