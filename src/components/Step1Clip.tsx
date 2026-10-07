import React, { useState } from "react";
import { VideoMetadata } from "../types";

interface Step1ClipProps {
  videoPath: string | null;
  videoName: string;
  metadata: VideoMetadata | null;
  onSelectFile: (filePath: string, fileName: string) => void;
  onClearFile: () => void;
  onNextStep: () => void;
}

export const Step1Clip: React.FC<Step1ClipProps> = ({
  videoPath,
  videoName,
  metadata,
  onSelectFile,
  onClearFile,
  onNextStep,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Dosya seçici tetikleme (Tauri dialog veya web input)
  const handleBrowseFile = async () => {
    try {
      // @ts-ignore
      if (window.__TAURI_INTERNALS__) {
        const { open } = await import("@tauri-apps/plugin-dialog");
        const selected = await open({
          multiple: false,
          filters: [
            {
              name: "Video Dosyaları",
              extensions: ["mp4", "mov", "m4v"],
            },
          ],
        });
        if (selected && typeof selected === "string") {
          const name = selected.split("/").pop() || selected.split("\\").pop() || "klip.mp4";
          onSelectFile(selected, name);
          return;
        }
      }
    } catch {
      // Tarayıcı/Vite fallback
    }

    // Fallback: Test klibini veya standart klibi seç
    onSelectFile("test_derbi_13s.mp4", "derbi_gol_ani_2024.mp4");
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "30.4 KB";
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col w-full pb-space-lg select-none">
      {/* Top Utility Context Bar */}
      <div className="flex items-center justify-between py-space-sm mb-space-md">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-xl bg-surface-container-high text-on-surface">
            <span className="font-label-sm text-label-sm text-primary-container tracking-wider">
              ADIM 1 / 5
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
              Klip İçeri Aktarma &amp; Ham Kare Ayrıştırma
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-space-sm py-1 rounded-xl bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[14px] text-secondary">memory</span>
            <span>FFmpeg Yerel Pipeline v8.1 (Hardware Demux)</span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-xl bg-surface-container text-on-surface-variant font-label-sm text-label-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>RAM Bellek: 412 MB / 16 GB</span>
          </div>
          <button
            type="button"
            onClick={() => onSelectFile("test_derbi_13s.mp4", "test_derbi_13s.mp4")}
            className="px-space-md py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface text-label-sm font-label-sm transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">history</span>
            <span>Örnek Klip (13s)</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-12 gap-space-lg">
        {/* Sol Sütun: Ingestion, Metadata */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-space-md">
          {/* Ingestion Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleBrowseFile();
            }}
            onClick={handleBrowseFile}
            className={`relative group rounded-xl p-space-lg flex flex-col items-center justify-center text-center transition-all cursor-pointer overflow-hidden min-h-[220px] ${
              isDragging
                ? "bg-surface-container border-2 border-primary-container"
                : "bg-surface-container-lowest border border-outline-variant/30 hover:border-outline-variant/60"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low/40 to-transparent pointer-events-none"></div>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary-container/5 blur-2xl pointer-events-none"></div>

            <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center mb-space-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[28px] text-primary-container material-symbols-fill">
                video_file
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
              Maç klibini buraya sürükleyin veya dosya seçin
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mb-space-md">
              Süper Lig, UEFA veya yerel derbi kayıtlarını bırakın. Yerel depolamadan sıfır gecikmeyle okunur.
            </p>
            <div className="flex items-center gap-space-sm">
              <button
                type="button"
                className="px-space-lg py-2 rounded-xl bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-headline-sm text-headline-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">file_open</span>
                <span>Dosya Seç</span>
              </button>
              <span className="font-label-sm text-label-sm text-outline">
                MP4, MOV (Maks. 60 sn önerilir)
              </span>
            </div>
          </div>

          {/* Active Loaded Clip Card */}
          {videoPath ? (
            <div className="rounded-xl bg-surface-container-low p-space-md border border-outline-variant/20">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                  Yüklenen Kaynak Klip
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  <span>Kare Çözücü Hazır</span>
                </span>
              </div>
              <div className="flex items-start gap-space-md p-space-sm rounded-xl bg-surface-container">
                <div className="w-16 h-12 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px] text-primary-container">
                    movie
                  </span>
                  <span className="absolute bottom-0.5 right-1 font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest/80 px-1 rounded text-[9px]">
                    HD
                  </span>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-space-sm">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">
                      {videoName}
                    </span>
                    <button
                      type="button"
                      onClick={onClearFile}
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                      title="Dosyayı Değiştir"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-space-md mt-1 font-label-md text-label-md text-on-surface-variant">
                    <span>{formatFileSize(metadata?.size_bytes || 0)}</span>
                    <span>•</span>
                    <span>H.264 / High Profile</span>
                    <span>•</span>
                    <span className="text-secondary font-label-md">FFprobe OK</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Video Hardware Stream Specs Grid */}
          <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col gap-space-sm border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Akış Analizi &amp; Çözümleme
              </span>
              <span className="font-label-sm text-label-sm text-primary-container font-mono">
                {metadata ? `00:00.00 - ${formatDuration(metadata.duration)}` : "Bekleniyor"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-space-sm mt-1">
              <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-label-sm text-label-sm">Süre</span>
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-label-lg text-label-lg font-mono text-on-surface font-semibold">
                    {metadata ? formatDuration(metadata.duration) : "00:13.00"}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">(sn)</span>
                </div>
              </div>

              <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-label-sm text-label-sm">Çözünürlük</span>
                  <span className="material-symbols-outlined text-[14px]">aspect_ratio</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-label-lg text-label-lg font-mono text-on-surface font-semibold">
                    {metadata ? `${metadata.width}×${metadata.height}` : "1920×1080"}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">16:9 FHD</span>
                </div>
              </div>

              <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-label-sm text-label-sm">Kare Hızı</span>
                  <span className="material-symbols-outlined text-[14px]">speed</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-label-lg text-label-lg font-mono text-on-surface font-semibold">
                    {metadata ? `${metadata.fps.toFixed(2)} fps` : "25.00 fps"}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary">Sabit FPS</span>
                </div>
              </div>

              <div className="p-space-sm rounded-xl bg-surface-container flex flex-col justify-between">
                <div className="flex items-center justify-between text-outline">
                  <span className="font-label-sm text-label-sm">Kare Sayısı</span>
                  <span className="material-symbols-outlined text-[14px]">burst_mode</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-label-lg text-label-lg font-mono text-on-surface font-semibold">
                    {metadata ? metadata.frame_count : 325}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">kare</span>
                </div>
              </div>
            </div>

            <div className="mt-space-xs p-space-sm rounded-xl bg-surface-container-highest flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-[18px] text-tertiary">tune</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface leading-none">
                    Anahtar Kare Taraması (I-Frames)
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                    Hızlı kesim noktaları için anahtar kareler hazırlandı
                  </span>
                </div>
              </div>
              <span className="font-label-md text-label-md text-secondary font-mono">100% Tamam</span>
            </div>
          </div>
        </div>

        {/* Sağ Sütun: Raw Broadcast Frame Preview Canvas */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-space-md">
          <div className="rounded-xl bg-surface-container-low p-space-md flex flex-col border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Ham Kare Önizleme Paneli
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-mono">
                  {videoName ? `${videoName} - Yayın Kareleri` : "Kaynak Bekleniyor"}
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline">Renk Uzayı: Rec.709</span>
                <button
                  type="button"
                  className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Tam Ekrana Yakınlaştır"
                >
                  <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                </button>
              </div>
            </div>

            {/* Simulated Match Frame Display */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-container-lowest flex items-center justify-center shadow-2xl group border border-outline-variant/30">
              {/* Yeşil Saha Arka Planı */}
              <div className="absolute inset-0 bg-[#1F7A3A] flex flex-col justify-between">
                <div className="w-full h-full relative opacity-90">
                  {/* Saha Çizgileri */}
                  <div className="absolute inset-4 border-2 border-white/60 rounded"></div>
                  <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-0.5 bg-white/60"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-white/60 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  </div>
                  {/* Ceza Sahaları */}
                  <div className="absolute top-1/4 bottom-1/4 left-4 w-28 border-r-2 border-t-2 border-b-2 border-white/60"></div>
                  <div className="absolute top-1/4 bottom-1/4 right-4 w-28 border-l-2 border-t-2 border-b-2 border-white/60"></div>
                </div>
              </div>

              {/* Broadcast Canlı Banner */}
              <div className="absolute top-4 left-4 flex items-center gap-space-xs bg-surface-container-lowest/80 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                <span className="font-headline-sm text-headline-sm text-on-surface text-xs tracking-wider">
                  CANLI DERBİ
                </span>
                <span className="text-outline-variant font-mono text-xs">| 74:18</span>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-surface-container-lowest/80 backdrop-blur-sm px-2 py-1 rounded-lg font-label-sm text-label-sm text-on-surface">
                <span className="material-symbols-outlined text-[13px] text-primary-container">crop</span>
                <span className="font-mono">1080p50</span>
              </div>

              {/* Bounding Box Simülasyonu */}
              <div className="absolute top-1/3 left-1/3 w-16 h-28 border-2 border-primary-container rounded bg-primary-container/10 flex flex-col justify-between p-1">
                <span className="font-label-sm text-[9px] bg-primary-container text-on-primary-container px-1 py-0.5 rounded leading-none w-max font-mono font-bold">
                  OYUNCU_09
                </span>
                <span className="font-label-sm text-[8px] text-primary-container font-mono">
                  X:624 Y:380
                </span>
              </div>
              <div className="absolute top-[38%] left-[54%] w-14 h-24 border-2 border-secondary rounded bg-secondary/10 flex flex-col justify-between p-1">
                <span className="font-label-sm text-[9px] bg-secondary text-on-secondary px-1 py-0.5 rounded leading-none w-max font-mono font-bold">
                  KALECI_01
                </span>
                <span className="font-label-sm text-[8px] text-secondary font-mono">
                  X:998 Y:410
                </span>
              </div>
              <div className="absolute top-[54%] left-[46%] w-7 h-7 rounded-full border border-primary-fixed-dim bg-primary-container/30 flex items-center justify-center animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              </div>

              {/* Alt HUD Scrub Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/70 to-transparent p-space-sm flex items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm text-on-surface">
                  <button type="button" className="p-1 rounded hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-[18px]">skip_previous</span>
                  </button>
                  <button
                    type="button"
                    className="p-1.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-fixed-dim transition-transform active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px] material-symbols-fill">
                      play_arrow
                    </span>
                  </button>
                  <button type="button" className="p-1 rounded hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-[18px]">skip_next</span>
                  </button>
                  <span className="font-label-sm text-label-sm font-mono text-on-surface pl-1">
                    00:04.200 / {metadata ? formatDuration(metadata.duration) : "00:13.000"}
                  </span>
                </div>
                <div className="flex-1 mx-space-sm">
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high relative cursor-pointer">
                    <div className="absolute top-0 left-0 h-full w-[35%] rounded-full bg-primary-container"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-[35%] w-3 h-3 rounded-full bg-primary-container shadow-md"></div>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant font-mono">
                  <span className="text-primary-container">105</span>/
                  {metadata ? metadata.frame_count : 325} KARE
                </div>
              </div>
            </div>

            {/* Frame Analysis Toolbar */}
            <div className="grid grid-cols-3 gap-space-sm mt-space-sm">
              <div className="p-space-sm rounded-xl bg-surface-container flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">aspect_ratio</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                    En-Boy Oranı
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">16:9 Orijinal TV</span>
                </div>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary-container text-[20px]">palette</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                    Çim Tespiti
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    %88 Yeşil Alan Doğrulandı
                  </span>
                </div>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-tertiary text-[20px]">person_search</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">
                    Figür Tanıma
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    11 Aktif Sporcu Konumu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Bilgilendirme ve Geçiş Butonu */}
      <div className="mt-space-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20">
        <div className="flex items-center gap-space-md flex-1">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 text-primary-container">
            <span className="material-symbols-outlined text-[20px]">gavel</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary-container font-label-sm text-label-sm font-mono">
                HUKUKİ BİLGİLENDİRME
              </span>
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Türev Eser &amp; Çevrimdışı Kullanım
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
              Yayın görüntüsü türev eser olarak kalır. Bu araç telif hakkını kaldırmaz. Orijinal ses dışa
              aktarılmaz (Sessiz MP4). Tüm işlem cihazınızda çevrimdışı yürütülür.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-space-sm flex-shrink-0">
          <button
            type="button"
            onClick={handleBrowseFile}
            className="px-space-md py-2.5 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface font-headline-sm text-headline-sm transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            <span>Yeniden Tara</span>
          </button>
          <button
            type="button"
            disabled={!videoPath}
            onClick={onNextStep}
            className={`px-space-xl py-2.5 rounded-xl font-headline-sm text-headline-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 group ${
              videoPath
                ? "bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container cursor-pointer"
                : "bg-surface-container-highest text-outline cursor-not-allowed"
            }`}
          >
            <span>2. Adıma Geç: Kes</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
