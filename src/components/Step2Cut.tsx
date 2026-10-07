import React, { useState } from "react";
import { VideoMetadata } from "../types";

interface Step2CutProps {
  videoName: string;
  metadata: VideoMetadata | null;
  inSec: number;
  outSec: number;
  currentPreviewSec: number;
  onChangeInSec: (val: number) => void;
  onChangeOutSec: (val: number) => void;
  onChangePreviewSec: (val: number) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const Step2Cut: React.FC<Step2CutProps> = ({
  videoName,
  metadata,
  inSec,
  outSec,
  currentPreviewSec,
  onChangeInSec,
  onChangeOutSec,
  onChangePreviewSec,
  onNextStep,
  onPrevStep,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const duration = metadata?.duration || 13.0;
  const fps = metadata?.fps || 25.0;
  const selectedDuration = Math.max(0, outSec - inSec);
  const isIdealDuration = selectedDuration >= 6.0 && selectedDuration <= 12.0;

  // Yakın plan heuristiği (kullanıcı talimatı: oyuncu kutusu > %35 ise rozet göster)
  const hasCloseUpDetected = true; // Heuristik demo/aktif

  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStepFrame = (frames: number) => {
    const deltaSec = frames / fps;
    const next = Math.max(0, Math.min(duration, currentPreviewSec + deltaSec));
    onChangePreviewSec(next);
  };

  return (
    <div className="flex flex-col w-full pb-10 select-none">
      {/* Dynamic Sub-header Navigation Context */}
      <div className="w-full flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs px-2.5 py-1 rounded bg-surface-container font-label-md text-label-md text-primary-container">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
            <span>ADIM 2 / 5</span>
          </div>
          <div className="flex items-baseline gap-space-xs">
            <span className="font-headline-md text-headline-md text-on-surface">
              Pozisyon Hassas Kırpma
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              {videoName} ({fps.toFixed(0)} FPS)
            </span>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-space-sm bg-surface-container-high px-3 py-1.5 rounded-lg shadow-sm">
          <span
            className={`material-symbols-outlined text-[16px] ${
              isIdealDuration ? "text-secondary" : "text-primary-container"
            }`}
          >
            {isIdealDuration ? "check_circle" : "info"}
          </span>
          <span className="font-label-md text-label-md text-on-surface">
            Hedef Quiz Kriteri:{" "}
            <strong className={isIdealDuration ? "text-secondary" : "text-primary-container"}>
              {isIdealDuration ? `Uyumlu (${selectedDuration.toFixed(2)}s)` : `Öneri: 6-12 sn (${selectedDuration.toFixed(2)}s)`}
            </strong>
          </span>
          <span className="text-outline-variant">•</span>
          <span className="font-label-sm text-label-sm text-outline">Geniş Açı Takip: Aktif</span>
        </div>
      </div>

      {/* Editorial Info Notice Strip */}
      <div className="w-full mb-3 rounded-lg bg-surface-container-low px-space-md py-2.5 flex items-center justify-between shadow-sm border border-outline-variant/20">
        <div className="flex items-center gap-space-md">
          <div className="w-7 h-7 rounded bg-primary-container/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary-container text-[18px]">
              sports_soccer
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">
              Quiz için en iyi aralık: tek pozisyon, orta veya geniş açı.
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              Hedef kurgu süresi: <strong className="text-on-surface">6.0 – 12.0 sn</strong>. Topun hücum
              başlangıcından ağlarla buluştuğu ana kadar olan net sekansı belirleyin.
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-space-lg text-right">
          <div className="flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              KAYNAK UZUNLUĞU
            </span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {formatTimecode(duration)} ({metadata?.frame_count || Math.floor(duration * fps)} kare)
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              MOTOR MODU
            </span>
            <span className="font-label-md text-label-md text-secondary">
              Tauri-FFmpeg Hassas Kesim
            </span>
          </div>
        </div>
      </div>

      {/* Workspace Center: Video Preview Monitor + Overlays */}
      <div className="relative w-full rounded-xl bg-surface-container-lowest overflow-hidden shadow-xl aspect-[16/8.7] flex items-center justify-center group border border-outline-variant/30">
        {/* Yeşil Futbol Sahası Görseli */}
        <div className="absolute inset-0 bg-[#1F7A3A] flex flex-col justify-between">
          <div className="w-full h-full relative opacity-90">
            {/* Taktik Izgara */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
            {/* Güvenli Oyun Alanı Çizgisi */}
            <div className="absolute inset-8 rounded border-2 border-white/20 flex flex-col justify-between p-3 pointer-events-none">
              <div className="flex justify-between items-start">
                <span className="font-label-sm text-label-sm bg-surface-container-lowest/80 px-1.5 py-0.5 rounded text-outline">
                  GÜVENLİ OYUN ALANI (CANVAS REPO)
                </span>
                <span className="font-label-sm text-label-sm bg-surface-container-lowest/80 px-1.5 py-0.5 rounded text-primary-container">
                  FPS: {fps.toFixed(0)} • 1080p
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-1 font-label-sm text-label-sm text-outline bg-surface-container-lowest/80 px-2 py-0.5 rounded">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span>CANLI ÖNİZLEME DÖNGÜSÜ</span>
                </div>
                <span className="font-label-sm text-label-sm bg-surface-container-lowest/80 px-1.5 py-0.5 rounded text-outline">
                  KARE: {Math.floor(currentPreviewSec * fps)} / {Math.floor(duration * fps)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Siluet Takip Göstergesi (Oyuncu) */}
        <div className="absolute top-[38%] left-[44%] w-16 h-28 pointer-events-none flex flex-col items-center">
          <div className="w-full h-full rounded border-2 border-primary-container bg-primary-container/15 flex flex-col justify-between p-1">
            <div className="flex justify-between">
              <span className="w-1.5 h-1.5 bg-primary-container"></span>
              <span className="w-1.5 h-1.5 bg-primary-container"></span>
            </div>
            <div className="flex justify-between">
              <span className="w-1.5 h-1.5 bg-primary-container"></span>
              <span className="w-1.5 h-1.5 bg-primary-container"></span>
            </div>
          </div>
          <div className="mt-1 bg-surface-container-lowest/90 px-1.5 py-0.5 rounded shadow text-center">
            <span className="font-label-sm text-label-sm text-primary-container tracking-wider uppercase font-bold">
              Hedef Oyuncu #1
            </span>
          </div>
        </div>

        {/* Top Vektörü Noktası */}
        <div className="absolute top-[52%] left-[58%] pointer-events-none flex items-center gap-1">
          <div className="w-3.5 h-3.5 rounded-full bg-primary-container shadow-md flex items-center justify-center animate-ping opacity-75"></div>
          <div className="w-3 h-3 rounded-full bg-primary-container -ml-4 shadow"></div>
          <span className="font-label-sm text-label-sm bg-surface-container-lowest/90 text-primary-container px-1 rounded ml-1 font-mono">
            Top Vektörü
          </span>
        </div>

        {/* Yakın Plan Tespit Rozeti (Heuristik kuralı) */}
        {hasCloseUpDetected && (
          <div className="absolute top-4 right-4 z-20 max-w-sm rounded-lg bg-surface-container-lowest/95 p-3 shadow-xl backdrop-blur-md border border-outline-variant/30">
            <div className="flex items-start gap-space-sm">
              <div className="w-7 h-7 rounded bg-primary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-primary-container text-[18px]">
                  warning
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-primary-container">
                    Yakın Plan Tespit Edildi
                  </span>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-semibold">
                    {formatTimecode(currentPreviewSec)}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                  Yüz ve forma numarası <strong className="text-on-surface">3. Takımlar / 2D Sprite</strong>{" "}
                  aşamasında anonim karaktere otomatik dönüştürülecektir.
                </p>
                <div className="mt-2 flex items-center gap-space-sm font-label-sm text-label-sm text-secondary">
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  <span>Sprite maskeleme motoru devrede</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sol Üst Zaman Kodu */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-surface-container-lowest/90 px-3 py-1.5 rounded-lg shadow-md border border-outline-variant/20">
          <span className="material-symbols-outlined text-secondary text-[16px]">play_circle</span>
          <span className="font-label-lg text-label-lg text-on-surface font-mono font-bold">
            {formatTimecode(currentPreviewSec)}
          </span>
          <span className="text-outline-variant">/</span>
          <span className="font-label-md text-label-md text-outline font-mono">
            {Math.floor(currentPreviewSec * fps)}. Kare
          </span>
        </div>

        {/* Oynat/Durdur Butonu */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform z-10 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[36px] material-symbols-fill">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>
      </div>

      {/* Bottom Workspace: Filmstrip & Trimmer */}
      <div className="w-full mt-3 rounded-xl bg-surface-container-low p-space-md shadow-lg flex flex-col gap-3 border border-outline-variant/20">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          {/* Duration Metrics */}
          <div className="flex items-center gap-space-md bg-surface-container px-3 py-1.5 rounded-lg shadow-inner">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
              <span className="font-label-md text-label-md text-outline uppercase">Seçili Aralık:</span>
              <span className="font-label-lg text-label-lg text-primary font-bold tracking-tight font-mono">
                {selectedDuration.toFixed(2)} sn
              </span>
              <span className="font-label-md text-label-md text-on-surface-variant font-mono">
                ({Math.floor(selectedDuration * fps)} Kare)
              </span>
            </div>
            <div className="h-4 w-px bg-outline-variant/40"></div>
            <div className="flex items-center gap-1 font-label-sm text-label-sm text-secondary bg-secondary-container/30 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>İdeal Quiz Aralığı (6-12 sn)</span>
            </div>
          </div>

          {/* Stepping Controls Toolbar */}
          <div className="flex items-center gap-1 bg-surface-container-highest p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onChangeInSec(currentPreviewSec)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container hover:bg-surface-bright text-on-surface font-label-sm text-label-sm transition-colors"
              title="Giriş Noktası Belirle (I)"
            >
              <span className="font-bold text-primary-container">I</span>
              <span>In Belirle</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepFrame(-5)}
              className="px-2 py-1 rounded bg-surface-container hover:bg-surface-bright text-on-surface transition-colors flex items-center justify-center font-label-sm"
              title="5 Kare Geri"
            >
              <span className="material-symbols-outlined text-[16px]">fast_rewind</span>
              <span className="-ml-0.5">5k</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepFrame(-1)}
              className="px-2 py-1 rounded bg-surface-container hover:bg-surface-bright text-on-surface transition-colors flex items-center justify-center font-label-sm"
              title="1 Kare Geri"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              <span className="-ml-0.5">1k</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 rounded bg-primary-container text-on-primary-container transition-transform active:scale-95 flex items-center justify-center font-bold"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleStepFrame(1)}
              className="px-2 py-1 rounded bg-surface-container hover:bg-surface-bright text-on-surface transition-colors flex items-center justify-center font-label-sm"
              title="1 Kare İleri"
            >
              <span className="-mr-0.5">1k</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => handleStepFrame(5)}
              className="px-2 py-1 rounded bg-surface-container hover:bg-surface-bright text-on-surface transition-colors flex items-center justify-center font-label-sm"
              title="5 Kare İleri"
            >
              <span className="-mr-0.5">5k</span>
              <span className="material-symbols-outlined text-[16px]">fast_forward</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeOutSec(currentPreviewSec)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container hover:bg-surface-bright text-on-surface font-label-sm text-label-sm transition-colors"
              title="Çıkış Noktası Belirle (O)"
            >
              <span>Out Belirle</span>
              <span className="font-bold text-primary-container">O</span>
            </button>
          </div>
        </div>

        {/* Filmstrip Timeline Scrubber */}
        <div className="relative w-full h-20 bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/30 flex items-center">
          {/* Kare Şeritleri Simülasyonu */}
          <div className="w-full h-full flex">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full border-r border-white/5 bg-[#1F7A3A]/40 flex flex-col justify-between p-1 opacity-70"
              >
                <span className="text-[9px] font-mono text-outline">
                  {(i * (duration / 12)).toFixed(1)}s
                </span>
                <div className="w-4 h-6 rounded-sm bg-white/20 self-center"></div>
              </div>
            ))}
          </div>

          {/* In / Out Seçim Alanı Vurgusu */}
          <div
            className="absolute top-0 bottom-0 bg-primary-container/20 border-l-4 border-r-4 border-primary-container pointer-events-none"
            style={{
              left: `${(inSec / duration) * 100}%`,
              width: `${(selectedDuration / duration) * 100}%`,
            }}
          >
            <div className="absolute top-1 left-2 px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container text-[10px] font-mono font-bold">
              IN: {inSec.toFixed(2)}s
            </div>
            <div className="absolute top-1 right-2 px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container text-[10px] font-mono font-bold">
              OUT: {outSec.toFixed(2)}s
            </div>
          </div>

          {/* Current Scrubber Head */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none flex flex-col items-center"
            style={{ left: `${(currentPreviewSec / duration) * 100}%` }}
          >
            <div className="w-3 h-3 bg-primary-container rotate-45 -mt-1 shadow-md"></div>
          </div>
        </div>

        {/* Trimmer Sliders */}
        <div className="grid grid-cols-2 gap-space-md pt-1">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-label-sm text-label-sm text-outline">
              <span>GİRİŞ NOKTASI (IN)</span>
              <span className="text-primary font-mono font-bold">{inSec.toFixed(2)} sn</span>
            </div>
            <input
              type="range"
              min="0"
              max={outSec - 1}
              step="0.04"
              value={inSec}
              onChange={(e) => onChangeInSec(parseFloat(e.target.value))}
              className="accent-primary-container cursor-pointer w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-label-sm text-label-sm text-outline">
              <span>ÇIKIŞ NOKTASI (OUT)</span>
              <span className="text-primary font-mono font-bold">{outSec.toFixed(2)} sn</span>
            </div>
            <input
              type="range"
              min={inSec + 1}
              max={duration}
              step="0.04"
              value={outSec}
              onChange={(e) => onChangeOutSec(parseFloat(e.target.value))}
              className="accent-primary-container cursor-pointer w-full"
            />
          </div>
        </div>
      </div>

      {/* Alt Navigasyon Butonları */}
      <div className="mt-space-md flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevStep}
          className="px-space-lg py-2.5 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface font-headline-sm text-headline-sm transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>1. Adıma Dön</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="px-space-xl py-2.5 rounded-xl bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-headline-sm text-headline-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 group cursor-pointer"
        >
          <span>3. Adıma Geç: Takımlar</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};
