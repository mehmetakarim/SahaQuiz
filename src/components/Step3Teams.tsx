import React from "react";
import { TeamKit } from "../types";

interface Step3TeamsProps {
  videoName: string;
  homeKit: TeamKit;
  awayKit: TeamKit;
  isHomeGkCustom: boolean;
  isAwayGkCustom: boolean;
  onChangeHomeKit: (kit: TeamKit) => void;
  onChangeAwayKit: (kit: TeamKit) => void;
  onToggleHomeGk: () => void;
  onToggleAwayGk: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const Step3Teams: React.FC<Step3TeamsProps> = ({
  videoName,
  homeKit,
  awayKit,
  isHomeGkCustom,
  isAwayGkCustom,
  onChangeHomeKit,
  onChangeAwayKit,
  onToggleHomeGk,
  onToggleAwayGk,
  onNextStep,
  onPrevStep,
}) => {
  const homePresets = [
    { name: "Sarı-Kırmızı", shirt: "#DE0B1E", shorts: "#FDB913", socks: "#FFFFFF", c1: "#DE0B1E", c2: "#FDB913" },
    { name: "Lacivert-Sarı", shirt: "#002D62", shorts: "#FFE000", socks: "#002D62", c1: "#002D62", c2: "#FFE000" },
    { name: "Siyah-Beyaz", shirt: "#111111", shorts: "#FFFFFF", socks: "#111111", c1: "#111111", c2: "#FFFFFF" },
    { name: "Bordo-Mavi", shirt: "#800020", shorts: "#6BA4B8", socks: "#800020", c1: "#800020", c2: "#6BA4B8" },
    { name: "Kırmızı-Beyaz", shirt: "#E30613", shorts: "#FFFFFF", socks: "#E30613", c1: "#E30613", c2: "#FFFFFF" },
  ];

  const awayPresets = [
    { name: "Lacivert-Beyaz", shirt: "#00205B", shorts: "#FFFFFF", socks: "#00205B", c1: "#00205B", c2: "#FFFFFF" },
    { name: "Beyaz-Siyah", shirt: "#FFFFFF", shorts: "#111111", socks: "#FFFFFF", c1: "#FFFFFF", c2: "#111111" },
    { name: "Tam Kırmızı", shirt: "#E30613", shorts: "#E30613", socks: "#FFFFFF", c1: "#E30613", c2: "#E30613" },
    { name: "Yeşil-Beyaz", shirt: "#00682B", shorts: "#FFFFFF", socks: "#00682B", c1: "#00682B", c2: "#FFFFFF" },
    { name: "Turuncu-Siyah", shirt: "#FF7900", shorts: "#000000", socks: "#FF7900", c1: "#FF7900", c2: "#000000" },
  ];

  return (
    <div className="flex flex-col w-full pb-12 select-none">
      {/* Üst Bilgi Barı */}
      <div className="flex items-center justify-between py-space-md mb-space-md bg-surface-container-low px-space-lg rounded-xl shadow-md border border-outline-variant/20">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md font-bold shadow-sm">
            3
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">
                Aşama 3 / 5
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                2D Vektör Motoru v2.4
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              Takım Kitleri &amp; Karikatür Önizleme
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-1.5 rounded-lg shadow-inner">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-md text-label-md text-on-surface">Canlı Render: 60 FPS</span>
          </div>
          <div className="bg-surface-variant text-on-surface-variant px-space-md py-1.5 rounded-lg font-label-md text-label-md">
            Klip: {videoName}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-space-lg">
        {/* Sol Kolon: Renk Ayarları */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-space-lg">
          {/* Ev Sahibi Takım */}
          <div className="bg-surface-container rounded-xl p-space-lg shadow-lg relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm mb-space-md bg-surface-container-high px-space-md py-space-xs rounded-lg">
              <div className="flex items-center gap-space-sm">
                <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: homeKit.shirt }}></span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Ev Sahibi Takım</span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant uppercase tracking-wider">
                  Hücum
                </span>
              </div>
              <span className="font-label-md text-label-md text-primary font-mono">{homeKit.name}</span>
            </div>

            {/* Presets */}
            <div className="mb-space-md">
              <div className="font-label-sm text-label-sm text-on-surface-variant mb-space-xs uppercase tracking-wider">
                Hızlı Kulüp Paletleri
              </div>
              <div className="flex flex-wrap gap-space-xs">
                {homePresets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() =>
                      onChangeHomeKit({ shirt: p.shirt, shorts: p.shorts, socks: p.socks, name: p.name })
                    }
                    className="px-2.5 py-1 rounded bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span className="flex -space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.c1 }}></span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.c2 }}></span>
                    </span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Renk Seçiciler */}
            <div className="grid grid-cols-3 gap-space-md bg-surface-container-low p-space-md rounded-lg mb-space-md">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>Forma</span>
                  <span className="font-mono text-[10px]">{homeKit.shirt}</span>
                </span>
                <div className="flex items-center gap-space-xs">
                  <input
                    type="color"
                    value={homeKit.shirt}
                    onChange={(e) => onChangeHomeKit({ ...homeKit, shirt: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Ana Renk</span>
                    <span className="font-label-sm text-label-sm text-outline">Gövde &amp; Kol</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>Şort</span>
                  <span className="font-mono text-[10px]">{homeKit.shorts}</span>
                </span>
                <div className="flex items-center gap-space-xs">
                  <input
                    type="color"
                    value={homeKit.shorts}
                    onChange={(e) => onChangeHomeKit({ ...homeKit, shorts: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Alt Renk</span>
                    <span className="font-label-sm text-label-sm text-outline">Klasik Şort</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>Çorap</span>
                  <span className="font-mono text-[10px]">{homeKit.socks}</span>
                </span>
                <div className="flex items-center gap-space-xs">
                  <input
                    type="color"
                    value={homeKit.socks}
                    onChange={(e) => onChangeHomeKit({ ...homeKit, socks: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Tozluk</span>
                    <span className="font-label-sm text-label-sm text-outline">Diz Çorabı</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kaleci Forması */}
            <div className="flex items-center justify-between pt-space-xs bg-surface-container-high px-space-md py-space-sm rounded-lg">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">sports_soccer</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface text-sm">
                    Kaleci Özel Forması
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Fosforlu Yeşil / Neon Sarı sprite gövdesi
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleHomeGk}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  isHomeGkCustom ? "bg-secondary" : "bg-surface-variant"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isHomeGkCustom ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Deplasman Takımı */}
          <div className="bg-surface-container rounded-xl p-space-lg shadow-lg relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm mb-space-md bg-surface-container-high px-space-md py-space-xs rounded-lg">
              <div className="flex items-center gap-space-sm">
                <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: awayKit.shirt }}></span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Deplasman Takımı</span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant uppercase tracking-wider">
                  Savunma
                </span>
              </div>
              <span className="font-label-md text-label-md text-secondary font-mono">{awayKit.name}</span>
            </div>

            {/* Presets */}
            <div className="mb-space-md">
              <div className="font-label-sm text-label-sm text-on-surface-variant mb-space-xs uppercase tracking-wider">
                Hızlı Kulüp Paletleri
              </div>
              <div className="flex flex-wrap gap-space-xs">
                {awayPresets.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() =>
                      onChangeAwayKit({ shirt: p.shirt, shorts: p.shorts, socks: p.socks, name: p.name })
                    }
                    className="px-2.5 py-1 rounded bg-surface-container-highest hover:bg-surface-bright text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span className="flex -space-x-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.c1 }}></span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.c2 }}></span>
                    </span>
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Renk Seçiciler */}
            <div className="grid grid-cols-3 gap-space-md bg-surface-container-low p-space-md rounded-lg mb-space-md">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>Forma</span>
                  <span className="font-mono text-[10px]">{awayKit.shirt}</span>
                </span>
                <div className="flex items-center gap-space-xs">
                  <input
                    type="color"
                    value={awayKit.shirt}
                    onChange={(e) => onChangeAwayKit({ ...awayKit, shirt: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Ana Renk</span>
                    <span className="font-label-sm text-label-sm text-outline">Gövde &amp; Kol</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>Şort</span>
                  <span className="font-mono text-[10px]">{awayKit.shorts}</span>
                </span>
                <div className="flex items-center gap-space-xs">
                  <input
                    type="color"
                    value={awayKit.shorts}
                    onChange={(e) => onChangeAwayKit({ ...awayKit, shorts: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Alt Renk</span>
                    <span className="font-label-sm text-label-sm text-outline">Klasik Şort</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>Çorap</span>
                  <span className="font-mono text-[10px]">{awayKit.socks}</span>
                </span>
                <div className="flex items-center gap-space-xs">
                  <input
                    type="color"
                    value={awayKit.socks}
                    onChange={(e) => onChangeAwayKit({ ...awayKit, socks: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0 shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">Tozluk</span>
                    <span className="font-label-sm text-label-sm text-outline">Diz Çorabı</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Kaleci Forması */}
            <div className="flex items-center justify-between pt-space-xs bg-surface-container-high px-space-md py-space-sm rounded-lg">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[20px]">sports_soccer</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface text-sm">
                    Kaleci Özel Forması
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">
                    Neon Sarı / Parlak Turuncu bekçi forması
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onToggleAwayGk}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  isAwayGkCustom ? "bg-secondary" : "bg-surface-variant"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isAwayGkCustom ? "translate-x-5" : "translate-x-0"
                  }`}
                ></div>
              </button>
            </div>
          </div>

          {/* Numara Çizme / Anonimleştirme Kilitli Rozeti (Zorunlu Kural) */}
          <div className="bg-surface-container-low p-space-md rounded-xl flex items-start gap-space-md shadow-md border border-outline-variant/30">
            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-outline-variant shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[22px] text-primary">verified_user</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-1.5">
                  <span>Numara Çizme / Anonimleştirme</span>
                  <span className="material-symbols-outlined text-[16px] text-outline">lock</span>
                </span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-bold">
                  KİLİTLİ &amp; AÇIK
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                Telif &amp; Quiz Kuralı: Format kuralları gereği forma sırt ve göğüs numaraları otomatik
                olarak gizlenir. İzleyicinin futbolcuyu sadece hareket ve pozisyondan tahmin etmesi sağlanır.
              </p>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: Canlı Mini Saha & 2D Karikatür Sprite */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-space-md">
          <div className="bg-surface-container rounded-xl p-space-lg shadow-xl flex flex-col h-full border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-sm mb-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary-container text-[20px]">stadium</span>
                <span className="font-headline-md text-headline-md text-on-surface">
                  Canlı Mini Saha &amp; 2D Karikatür Sprite
                </span>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-highest px-space-sm py-1 rounded font-label-sm text-label-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-primary-container">animation</span>
                <span>Mikro Zıplama Aktif</span>
              </div>
            </div>

            {/* Saha SVG Canvas */}
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center select-none bg-[#1F7A3A] border-2 border-white/20">
              {/* Çim Şeritleri */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full"
                    style={{ backgroundColor: i % 2 === 0 ? "#1F7A3A" : "#2E8B4A" }}
                  ></div>
                ))}
              </div>

              {/* Taktik Çizgiler */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                fill="none"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="4"
                viewBox="0 0 800 600"
              >
                <rect x="30" y="30" width="740" height="540" rx="4" />
                <line x1="400" y1="30" x2="400" y2="570" strokeWidth="3" />
                <circle cx="400" cy="300" r="70" strokeWidth="3" />
                <circle cx="400" cy="300" r="4" fill="rgba(255,255,255,0.8)" stroke="none" />
                {/* Sol Ceza Sahası */}
                <rect x="30" y="160" width="130" height="280" strokeWidth="3" />
                <rect x="30" y="220" width="50" height="160" strokeWidth="3" />
                {/* Sağ Ceza Sahası */}
                <rect x="640" y="160" width="130" height="280" strokeWidth="3" />
                <rect x="720" y="220" width="50" height="160" strokeWidth="3" />
              </svg>

              {/* 2D Karikatür Oyuncular */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 800 600"
              >
                {/* Ev Sahibi - Kaleci */}
                <g transform="translate(65, 270)">
                  <ellipse cx="20" cy="56" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
                  <rect x="12" y="40" width="6" height="14" rx="2" fill={homeKit.socks} stroke="#000" strokeWidth="2.5" />
                  <rect x="22" y="40" width="6" height="14" rx="2" fill={homeKit.socks} stroke="#000" strokeWidth="2.5" />
                  <rect x="10" y="28" width="20" height="14" rx="3" fill="#111" stroke="#000" strokeWidth="3" />
                  <path d="M 7 13 L 33 13 L 31 30 L 9 30 Z" fill="#2BF853" stroke="#000" strokeWidth="3.2" />
                  <circle cx="20" cy="7" r="9" fill="#F2B889" stroke="#000" strokeWidth="3" />
                </g>

                {/* Ev Sahibi - Forvet (Oyuncu) */}
                <g transform="translate(480, 240)">
                  <ellipse cx="20" cy="56" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
                  <rect x="12" y="40" width="6" height="14" rx="2" fill={homeKit.socks} stroke="#000" strokeWidth="2.5" />
                  <rect x="22" y="40" width="6" height="14" rx="2" fill={homeKit.socks} stroke="#000" strokeWidth="2.5" />
                  <rect x="10" y="28" width="20" height="14" rx="3" fill={homeKit.shorts} stroke="#000" strokeWidth="3" />
                  <path d="M 7 13 L 33 13 L 31 30 L 9 30 Z" fill={homeKit.shirt} stroke="#000" strokeWidth="3.2" />
                  <circle cx="20" cy="7" r="9" fill="#F2B889" stroke="#000" strokeWidth="3" />
                </g>

                {/* Deplasman - Savunma Oyuncusu */}
                <g transform="translate(560, 270)">
                  <ellipse cx="20" cy="56" rx="15" ry="4" fill="rgba(0,0,0,0.4)" />
                  <rect x="12" y="40" width="6" height="14" rx="2" fill={awayKit.socks} stroke="#000" strokeWidth="2.5" />
                  <rect x="22" y="40" width="6" height="14" rx="2" fill={awayKit.socks} stroke="#000" strokeWidth="2.5" />
                  <rect x="10" y="28" width="20" height="14" rx="3" fill={awayKit.shorts} stroke="#000" strokeWidth="3" />
                  <path d="M 7 13 L 33 13 L 31 30 L 9 30 Z" fill={awayKit.shirt} stroke="#000" strokeWidth="3.2" />
                  <circle cx="20" cy="7" r="9" fill="#FCD5B5" stroke="#000" strokeWidth="3" />
                </g>

                {/* Futbol Topu */}
                <g transform="translate(450, 290)">
                  <ellipse cx="10" cy="18" rx="8" ry="3" fill="rgba(0,0,0,0.3)" />
                  <circle cx="10" cy="10" r="9" fill="#FFF" stroke="#000" strokeWidth="2.5" />
                  <polygon points="10,6 13,8 12,12 8,12 7,8" fill="#111" />
                </g>
              </svg>
            </div>
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
          <span>2. Adıma Dön</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="px-space-xl py-2.5 rounded-xl bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-headline-sm text-headline-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 group cursor-pointer"
        >
          <span>4. Adıma Geç: Stil &amp; 9:16</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};
