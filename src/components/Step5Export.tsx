import React, { useState, useEffect } from "react";
import { ProjectState } from "../types";

interface Step5ExportProps {
  state: ProjectState;
  onStartRender: () => void;
  onPrevStep: () => void;
}

export const Step5Export: React.FC<Step5ExportProps> = ({
  state,
  onStartRender,
  onPrevStep,
}) => {
  const {
    renderProgress,
    isRendering,
    renderError,
    outputPath,
    inSec,
    outSec,
    metadata,
  } = state;

  const [outputVideoUrl, setOutputVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (outputPath) {
      const resolveUrl = async () => {
        try {
          // @ts-ignore
          if (window.__TAURI_INTERNALS__) {
            const { convertFileSrc } = await import("@tauri-apps/api/core");
            setOutputVideoUrl(convertFileSrc(outputPath));
          } else {
            setOutputVideoUrl(outputPath);
          }
        } catch {
          setOutputVideoUrl(outputPath);
        }
      };
      resolveUrl();
    } else {
      setOutputVideoUrl(null);
    }
  }, [outputPath]);

  const totalFrames = metadata?.frame_count || Math.floor((outSec - inSec) * 25);
  const percent = renderProgress ? renderProgress.percent : outputPath ? 100 : 0;
  const isDone = !!outputPath && percent === 100;

  const stages = [
    { id: "extract", label: "1. Kare Ayırma (Demux)", desc: "FFmpeg ile 25 fps ham tampon karelerine ayırma" },
    { id: "detect", label: "2. Oyuncu & Top Tespiti", desc: "YOLOv8n ile oyuncu ve top koordinatları tespiti" },
    { id: "track", label: "3. Forma Renk Eşleme", desc: "5 karelik ortalama yumuşatma ve takım kimliği" },
    { id: "draw", label: "4. 2D Sprite Çizimi", desc: "Pillow ile kel kafa, kalın kontur, yüzsüz karikatür tuvali" },
    { id: "overlay", label: "5. Soru Bandı & Zamanlama", desc: "1080x1920 dikey tuval üzerine üst/alt bant yerleşimi" },
    { id: "encode", label: "6. Sessiz MP4 Kodlama", desc: "H.264 30fps sessiz dikey MP4 paketleme" },
  ];

  return (
    <div className="flex flex-col w-full pb-8 select-none">
      {/* Üst Bilgi Barı */}
      <div className="flex items-center justify-between pb-5">
        <div className="flex items-center gap-space-sm">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-headline-sm">
            5
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Yerel Render ve Dışa Aktar
              </h1>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                %100 Çevrimdışı Donanım
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              FFmpeg ve yerel görüntü işleme motoru doğrudan sisteminizde çalışıyor. Harici ağ trafiği sıfır.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-space-sm">
          <div className="bg-surface-container px-3 py-1.5 rounded-lg flex items-center gap-2 text-on-surface-variant border border-outline-variant/20">
            <span className="material-symbols-outlined text-[16px] text-primary-container">speed</span>
            <span className="font-label-md text-label-md">
              İşleme Hızı: <strong className="text-on-surface font-semibold">1.82x Gerçek Zaman</strong>
            </span>
          </div>
          <div className="bg-surface-container px-3 py-1.5 rounded-lg flex items-center gap-2 text-on-surface-variant border border-outline-variant/20">
            <span className="material-symbols-outlined text-[16px] text-tertiary">memory</span>
            <span className="font-label-md text-label-md">
              RAM: <strong className="text-on-surface font-semibold">1.4 GB / 16 GB</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter-desktop items-start">
        {/* Sol Kolon: İşlem Sırası (Pipeline) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-space-md">
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[18px]">
                  account_tree
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  İşlem Sırası (Pipeline)
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">
                {isRendering ? renderProgress?.stage || "İşleniyor" : isDone ? "Tamamlandı" : "Hazır"}
              </span>
            </div>

            <ol className="relative flex flex-col gap-3.5 pl-1 pt-2">
              {stages.map((st, idx) => {
                const isStepActive = renderProgress?.stage === st.id;
                const isStepPast = isDone || (renderProgress && percent > (idx + 1) * 16);

                return (
                  <li key={st.id} className="relative flex items-start gap-space-md">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-label-sm ${
                          isStepPast
                            ? "bg-secondary-container text-on-secondary-container"
                            : isStepActive
                            ? "bg-primary-container text-on-primary-container animate-pulse"
                            : "bg-surface-container-highest text-outline"
                        }`}
                      >
                        {isStepPast ? (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        ) : isStepActive ? (
                          <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                        ) : (
                          idx + 1
                        )}
                      </span>
                      {idx < stages.length - 1 && (
                        <span
                          className={`w-0.5 h-9 mt-1 ${
                            isStepPast ? "bg-secondary-container/60" : "bg-surface-variant"
                          }`}
                        ></span>
                      )}
                    </div>
                    <div
                      className={`flex-1 px-space-md py-2.5 rounded-lg border border-outline-variant/10 ${
                        isStepActive ? "bg-surface-container-high shadow" : "bg-surface-container"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-headline-sm text-headline-sm ${
                            isStepActive ? "text-primary-container" : "text-on-surface"
                          }`}
                        >
                          {st.label}
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                          {isStepPast && (
                            <>
                              <span className="material-symbols-outlined text-[12px]">done_all</span>{" "}
                              Tamamlandı
                            </>
                          )}
                          {isStepActive && (
                            <span className="text-primary-fixed bg-on-primary-container px-2 py-0.5 rounded font-mono">
                              %{percent}
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Telif & Gizlilik Koruması Kartı */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between border border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[20px]">shield</span>
              </div>
              <div>
                <div className="font-headline-sm text-headline-sm text-on-surface">
                  Telif &amp; Gizlilik Koruması
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Gerçek yayın görüntüsü diske yazılmaz, sadece 2D vektörel simülasyon kaydedilir.
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary text-[20px]">verified</span>
          </div>
        </div>

        {/* Sağ Kolon: Dışa Aktarma Durumu & Butonlar */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-space-md">
          {/* İlerleme ve Durum Kartı */}
          <div className="bg-surface-container-low rounded-xl p-space-lg shadow-sm border border-outline-variant/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-4">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                  Dışa Aktarma Durumu
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-display-lg text-display-lg text-on-surface tabular-nums leading-none">
                    %{percent}
                  </span>
                  <span className="font-headline-md text-headline-md text-primary-container">
                    {isRendering
                      ? "Oluşturuluyor..."
                      : isDone
                      ? "Tamamlandı!"
                      : "İşleme Hazır"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-space-lg bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/20">
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">Aralık</span>
                  <span className="font-label-lg text-label-lg text-on-surface tabular-nums">
                    {(outSec - inSec).toFixed(2)}s
                  </span>
                </div>
                <div className="w-px h-6 bg-surface-variant"></div>
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">Toplam Kare</span>
                  <span className="font-label-lg text-label-lg text-secondary tabular-nums">
                    {totalFrames}
                  </span>
                </div>
              </div>
            </div>

            {/* İlerleme Çubuğu */}
            <div className="w-full bg-surface-container-lowest rounded-full h-3.5 p-0.5 shadow-inner overflow-hidden relative border border-outline-variant/20">
              <div
                className="bg-gradient-to-r from-secondary via-primary-container to-primary h-full rounded-full transition-all duration-300 relative flex items-center justify-end"
                style={{ width: `${percent}%` }}
              >
                {percent > 0 && (
                  <span className="w-2 h-2 rounded-full bg-surface-container-lowest mr-0.5"></span>
                )}
              </div>
            </div>

            {/* Hata Mesajı Varsa */}
            {renderError && (
              <div className="mt-4 p-3 rounded-lg bg-error-container/40 border border-error text-error text-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">error</span>
                <span>{renderError}</span>
              </div>
            )}

            {/* Format Özellikleri Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
              <div className="bg-surface-container p-2.5 rounded-lg">
                <span className="font-label-sm text-label-sm text-outline block">Format &amp; En-Boy</span>
                <span className="font-headline-sm text-headline-sm text-on-surface block mt-0.5">
                  1080×1920
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim block">
                  9:16 Shorts / Reels
                </span>
              </div>

              <div className="bg-surface-container p-2.5 rounded-lg">
                <span className="font-label-sm text-label-sm text-outline block">Kare Hızı</span>
                <span className="font-headline-sm text-headline-sm text-on-surface block mt-0.5">
                  30 FPS
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant block">
                  Akıcı 2D Animasyon
                </span>
              </div>

              <div className="bg-surface-container p-2.5 rounded-lg">
                <span className="font-label-sm text-label-sm text-outline block">Video Kodeki</span>
                <span className="font-headline-sm text-headline-sm text-on-surface block mt-0.5">
                  H.264 MP4
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim block">
                  Hardware Enc (libx264)
                </span>
              </div>

              <div className="bg-surface-container p-2.5 rounded-lg">
                <span className="font-label-sm text-label-sm text-outline block">Ses Kanalı</span>
                <span className="font-headline-sm text-headline-sm text-on-surface block mt-0.5">
                  Sessiz Video
                </span>
                <span className="font-label-sm text-label-sm text-outline-variant block">
                  Orijinal ses dışarı aktarılmaz
                </span>
              </div>

              <div className="bg-surface-container p-2.5 rounded-lg col-span-2">
                <span className="font-label-sm text-label-sm text-outline block">Hedef Dosya Yolu</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[15px] text-primary-container shrink-0">
                    movie
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface truncate font-semibold font-mono">
                    {outputPath || "~/Videolar/SahaQuiz/sahaquiz_output.mp4"}
                  </span>
                </div>
              </div>
            </div>

            {/* Render Tamamlandı - Canlı 9:16 Dikey Önizleme Oynatıcısı */}
            {isDone && (
              <div className="mt-5 bg-surface-container rounded-xl p-space-md border border-secondary/40 shadow-xl flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">check_circle</span>
                    <div>
                      <span className="font-headline-sm text-headline-sm text-on-surface block">
                        Üretilen Sessiz 2D Video (1080×1920)
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                        {outputPath}
                      </span>
                    </div>
                  </div>
                  <span className="text-secondary font-label-sm text-label-sm font-mono bg-secondary-container/40 px-2.5 py-1 rounded-full border border-secondary/30">
                    H.264 • 30 FPS • Sessiz MP4
                  </span>
                </div>

                <div className="relative aspect-[9/16] h-[400px] rounded-xl overflow-hidden bg-black shadow-2xl border border-outline-variant/30 flex items-center justify-center">
                  {outputVideoUrl ? (
                    <video
                      src={outputVideoUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-[28px] animate-spin">progress_activity</span>
                      <span className="font-label-sm text-label-sm">Video yükleniyor...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Akıllı İyileştirme ve Kurtarma Kartı */}
          <div className="bg-surface-container-high rounded-xl p-space-md shadow-sm border border-outline-variant/20">
            <div className="flex items-start justify-between gap-space-md">
              <div className="flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">auto_fix_high</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      Akıllı İyileştirme ve Kurtarma
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary-fixed-dim font-label-sm text-label-sm font-semibold">
                      Otomatik Algoritma
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    <strong className="text-on-surface font-semibold">Top kaybı heuristiği</strong> — Çarpışma
                    anında top silueti kaybolursa, son koordinatlar 4 kare boyunca doğrusal enterpolasyonla
                    otomatik sürüklenir ve hareket sürekliliği korunur.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-wrap items-center justify-between gap-space-md shadow-md border border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <button
                type="button"
                onClick={onPrevStep}
                className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface font-headline-sm text-headline-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">content_cut</span>
                <span>Bir Kez Daha Kes</span>
              </button>
            </div>

            <div className="flex items-center gap-space-sm">
              <button
                type="button"
                disabled={isRendering}
                onClick={onStartRender}
                className={`px-6 py-2.5 rounded-xl font-headline-md text-headline-md font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  isRendering
                    ? "bg-surface-container-highest text-outline cursor-not-allowed"
                    : "bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container active:scale-95"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] material-symbols-fill">
                  {isRendering ? "progress_activity" : "play_circle"}
                </span>
                <span>
                  {isRendering
                    ? "Render Ediliyor..."
                    : isDone
                    ? "Yeniden Render Et"
                    : "Render ve Dışa Aktar"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
