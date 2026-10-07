import React from "react";
import { StylePreset, Difficulty, TeamKit } from "../types";

interface Step4StyleProps {
  style: StylePreset;
  badgeText: string;
  questionText: string;
  difficulty: Difficulty;
  timerSec: number;
  showSafeZone: boolean;
  homeKit: TeamKit;
  awayKit: TeamKit;
  onChangeStyle: (s: StylePreset) => void;
  onChangeBadgeText: (t: string) => void;
  onChangeQuestionText: (t: string) => void;
  onChangeDifficulty: (d: Difficulty) => void;
  onChangeTimerSec: (sec: number) => void;
  onToggleSafeZone: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const Step4Style: React.FC<Step4StyleProps> = ({
  style,
  badgeText,
  questionText,
  difficulty,
  timerSec,
  showSafeZone,
  homeKit,
  awayKit,
  onChangeStyle,
  onChangeBadgeText,
  onChangeQuestionText,
  onChangeDifficulty,
  onChangeTimerSec,
  onToggleSafeZone,
  onNextStep,
  onPrevStep,
}) => {
  return (
    <div className="flex flex-col w-full pb-8 text-on-surface select-none">
      {/* Üst Bilgi Barı */}
      <div className="flex items-center justify-between py-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container font-headline-sm">
            4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md tracking-tight">
                Görsel Stil ve Soru Formatı
              </span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                ADIM 4 / 5
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Viral 9:16 Shorts &amp; Reels şablonu, 2D animasyon kontur yapısı ve dinamik soru bantları
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant/20">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <span className="font-label-sm text-label-sm text-on-surface">Motor: Yerel Vektör Render (60 FPS)</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Sol Kolon: Yapılandırma */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-5">
          {/* Çizim Ön Ayarı Kartları */}
          <div className="bg-surface-container-low rounded-xl p-4 shadow-md flex flex-col gap-3 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[18px]">brush</span>
                <span className="font-headline-sm text-headline-sm">Karakter ve Çizim Ön Ayarı</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Seçilen modele göre çizgi kalınlığı uyarlanır
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {/* Quiz (Varsayılan) */}
              <button
                type="button"
                onClick={() => onChangeStyle("quiz")}
                className={`group relative text-left p-3 rounded-lg transition-all shadow-sm ${
                  style === "quiz"
                    ? "bg-surface-container-high border-2 border-primary-container"
                    : "bg-surface-container opacity-80 hover:opacity-100"
                }`}
              >
                <div className="absolute -top-1.5 right-2 px-1.5 py-0.2 rounded bg-primary-container text-on-primary-container font-label-sm text-[9px] font-bold">
                  ÖNERİLEN
                </div>
                <div className="w-full h-16 rounded bg-surface-container-lowest mb-2 flex items-center justify-center overflow-hidden relative">
                  <div className="w-7 h-7 rounded-full bg-primary-fixed relative shadow-md">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/20"></div>
                  </div>
                  <div
                    className="w-10 h-7 rounded-t-md absolute -bottom-1 shadow-md"
                    style={{ backgroundColor: homeKit.shirt }}
                  ></div>
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface">Quiz (Varsayılan)</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  Kel kafa, dolgun forma, kalın siyah kontur ve alt gölge.
                </div>
                <div className="mt-2 flex items-center gap-1 font-label-sm text-label-sm text-primary-container">
                  <span className="material-symbols-outlined text-[14px]">
                    {style === "quiz" ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span>{style === "quiz" ? "Aktif Şablon" : "Seç"}</span>
                </div>
              </button>

              {/* Çizgi (Vektör) */}
              <button
                type="button"
                onClick={() => onChangeStyle("line")}
                className={`group relative text-left p-3 rounded-lg transition-all shadow-sm ${
                  style === "line"
                    ? "bg-surface-container-high border-2 border-primary-container"
                    : "bg-surface-container opacity-80 hover:opacity-100"
                }`}
              >
                <div className="w-full h-16 rounded bg-surface-container-lowest mb-2 flex items-center justify-center overflow-hidden relative">
                  <div className="w-7 h-7 rounded-full bg-primary-fixed"></div>
                  <div
                    className="w-10 h-7 rounded-t-md absolute -bottom-1"
                    style={{ backgroundColor: awayKit.shirt }}
                  ></div>
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface">Çizgi (Vektör)</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  İnce kontur, saf vektör dolgusu, gölgesiz minimal animasyon.
                </div>
                <div className="mt-2 flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">
                    {style === "line" ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span>{style === "line" ? "Aktif Şablon" : "Seç"}</span>
                </div>
              </button>

              {/* Yayın Bandı */}
              <button
                type="button"
                onClick={() => onChangeStyle("broadcast")}
                className={`group relative text-left p-3 rounded-lg transition-all shadow-sm ${
                  style === "broadcast"
                    ? "bg-surface-container-high border-2 border-primary-container"
                    : "bg-surface-container opacity-80 hover:opacity-100"
                }`}
              >
                <div className="w-full h-16 rounded bg-surface-container-lowest mb-2 flex flex-col items-center justify-between p-1.5 relative overflow-hidden">
                  <div className="w-full h-3 rounded bg-surface-container-highest flex items-center justify-between px-1">
                    <span className="w-2 h-1 bg-primary-container rounded-xs"></span>
                    <span className="w-6 h-1 bg-on-surface/40 rounded-xs"></span>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-primary-fixed"></div>
                  <div className="w-full h-3 rounded bg-primary-container"></div>
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface">Yayın Bandı</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                  Canlı maç TV skorbordu, şık alt soru kartı ve logo rozeti.
                </div>
                <div className="mt-2 flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">
                    {style === "broadcast" ? "check_circle" : "radio_button_unchecked"}
                  </span>
                  <span>{style === "broadcast" ? "Aktif Şablon" : "Seç"}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Başlık, Soru ve Zorluk Formu */}
          <div className="bg-surface-container-low rounded-xl p-4 shadow-md flex flex-col gap-4 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[18px]">subtitles</span>
                <span className="font-headline-sm text-headline-sm">Başlık, Soru ve Zorluk Derecesi</span>
              </div>
              <span className="font-label-sm text-label-sm text-secondary">Canlı Dinamik Önizleme</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Rozet Metni */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>ÜST BANT ROZET METNİ</span>
                  <span className="font-label-sm text-label-sm text-outline">
                    {badgeText.length}/16
                  </span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    maxLength={16}
                    value={badgeText}
                    onChange={(e) => onChangeBadgeText(e.target.value)}
                    className="w-full bg-surface-container rounded-lg px-3 py-2 font-label-md text-label-md text-on-surface focus:outline-none focus:bg-surface-container-high transition-colors"
                  />
                  <span className="material-symbols-outlined text-outline text-[16px] absolute right-2.5 pointer-events-none">
                    flag
                  </span>
                </div>
              </div>

              {/* Geri Sayım Süresi */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                  <span>GERİ SAYIM SÜRESİ</span>
                  <span className="font-label-sm text-label-sm text-primary-container">Klip donma anı</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[3, 5, 8].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => onChangeTimerSec(sec)}
                      className={`py-2 rounded-lg font-label-md text-label-md transition-colors ${
                        timerSec === sec
                          ? "bg-primary-container text-on-primary-container font-bold"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {sec} sn
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Soru Metni */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
                <span>VİRAL ALT SORU METNİ</span>
                <span className="font-label-sm text-label-sm text-outline">Shorts ortasında belirecek soru</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={64}
                  value={questionText}
                  onChange={(e) => onChangeQuestionText(e.target.value)}
                  className="w-full bg-surface-container rounded-lg pl-3 pr-9 py-2.5 font-headline-sm text-headline-sm text-on-surface focus:outline-none focus:bg-surface-container-high transition-colors"
                />
                <span className="material-symbols-outlined text-primary-container text-[18px] absolute right-3 top-3 pointer-events-none">
                  help
                </span>
              </div>
            </div>

            {/* Zorluk & Safe Zone */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-on-surface-variant">ZORLUK ETİKETİ</span>
                <div className="flex items-center gap-1.5">
                  {(["Kolay", "Orta", "Zor"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => onChangeDifficulty(d)}
                      className={`px-3 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                        difficulty === d
                          ? "bg-primary-container text-on-primary-container font-bold"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safe Zone Toggle */}
              <div className="flex items-center justify-between sm:justify-end gap-3 bg-surface-container px-3 py-2 rounded-lg">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">Güvenli Alan (Safe Zone)</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    TikTok/Reels UI kılavuz çizgileri
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onToggleSafeZone}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    showSafeZone ? "bg-primary-container" : "bg-surface-variant"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-surface-container-lowest shadow transition-transform ${
                      showSafeZone ? "translate-x-5" : "translate-x-0"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* Düdük & Ses Efekti Kutusu */}
          <div className="bg-surface-container-low rounded-xl p-4 shadow-md flex items-center justify-between border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">audiotrack</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm">Geri Sayım Düdük &amp; Nabız Sesi</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Soru anında dramatik kalp atışı ve son düdük efekti (Yerel kütüphane)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">volume_up</span>
                <span>Ön Dinle</span>
              </button>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
          </div>
        </div>

        {/* Sağ Kolon: 9:16 Dikey Mobil Önizleme */}
        <div className="col-span-12 lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] flex flex-col items-center">
            <div className="w-full flex items-center justify-between px-2 mb-2 font-label-sm text-label-sm text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary-container">
                  stay_primary_portrait
                </span>
                <span>9:16 Dikey Shorts Önizlemesi</span>
              </div>
              <span className="text-secondary font-label-md">1080x1920 (Canlı)</span>
            </div>

            {/* Telefon Çerçevesi */}
            <div className="relative w-full aspect-[9/16] rounded-3xl bg-surface-container-lowest overflow-hidden shadow-2xl p-2.5 flex flex-col justify-between border-4 border-surface-container-high">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-surface-container-lowest rounded-full z-30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-surface-container-high mr-2"></div>
                <div className="w-2 h-2 rounded-full bg-surface-container"></div>
              </div>

              {/* Ekran İçeriği */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#1F7A3A] flex flex-col justify-between p-3 select-none">
                {/* Taktik Çizgiler */}
                <div className="absolute inset-0 pointer-events-none opacity-25">
                  <div className="absolute inset-x-8 top-12 bottom-12 rounded-3xl border-2 border-white/40"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-2 border-white/40"></div>
                  <div className="absolute top-1/2 inset-x-0 h-0.5 bg-white/40"></div>
                </div>

                {/* Safe Zone Kılavuz Katmanı */}
                {showSafeZone && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-2">
                    <div className="w-full h-12 flex items-center justify-between px-2 text-white/50 font-label-sm text-[9px] pt-1">
                      <span>Profil / Üst UI</span>
                      <span>Shorts Keşfet</span>
                    </div>
                    <div className="absolute right-1 bottom-24 flex flex-col gap-3 items-center text-white/70">
                      <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[12px]">
                        ❤️
                      </div>
                      <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[12px]">
                        💬
                      </div>
                      <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[12px]">
                        ↪️
                      </div>
                      <div className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-[10px]">
                        9:16
                      </div>
                    </div>
                    <div className="w-3/4 h-16 bg-black/20 rounded p-1 text-white/40 font-label-sm text-[9px] flex flex-col justify-end">
                      <span>@sahaquiz • Orijinal ses yok • Sessiz MP4</span>
                    </div>
                  </div>
                )}

                {/* Üst Rozet & Sayaç */}
                <div className="relative z-10 w-full flex items-center justify-between pt-4">
                  <div className="flex items-center gap-1.5 bg-surface-container-lowest/90 px-2.5 py-1 rounded-full shadow-lg border border-primary-container/40">
                    <span className="font-headline-sm text-headline-sm tracking-widest text-primary-container font-black">
                      {badgeText.toUpperCase() || "SAHAQUIZ"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/60"></span>
                    <span className="font-label-sm text-label-sm text-on-surface font-bold tracking-wider">
                      {difficulty.toUpperCase()} SEVİYE
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-lowest/90 px-2 py-1 rounded-full shadow-lg border border-primary-container/40">
                    <span className="material-symbols-outlined text-primary-container text-[14px]">timer</span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">{timerSec}s</span>
                  </div>
                </div>

                {/* Orta Sahne: Karikatür Oyuncular */}
                <div className="relative z-10 w-full flex-1 flex items-center justify-center py-4">
                  <div className="relative w-full h-44 flex items-center justify-center">
                    {/* Oyuncu 1 */}
                    <div className="absolute left-8 bottom-6 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#fcd34d] shadow-md border-2 border-black"></div>
                      <div
                        className="w-9 h-11 rounded-t-md relative flex items-center justify-center border-2 border-black -mt-0.5"
                        style={{ backgroundColor: homeKit.shirt }}
                      ></div>
                      <div className="flex gap-1 -mt-0.5">
                        <div
                          className="w-2.5 h-4 rounded-b-xs border border-black"
                          style={{ backgroundColor: homeKit.socks }}
                        ></div>
                        <div
                          className="w-2.5 h-4 rounded-b-xs border border-black"
                          style={{ backgroundColor: homeKit.socks }}
                        ></div>
                      </div>
                      <div className="w-8 h-2 bg-black/30 rounded-full blur-[1px] mt-0.5"></div>
                    </div>

                    {/* Top */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-12 flex flex-col items-center animate-bounce">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 bg-black rotate-45"></div>
                      </div>
                      <div className="w-6 h-1.5 bg-black/30 rounded-full blur-[1px]"></div>
                    </div>

                    {/* Oyuncu 2 */}
                    <div className="absolute right-10 bottom-10 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#fed7aa] shadow-md border-2 border-black"></div>
                      <div
                        className="w-9 h-11 rounded-t-md relative flex items-center justify-center border-2 border-black -mt-0.5"
                        style={{ backgroundColor: awayKit.shirt }}
                      ></div>
                      <div className="flex gap-1 -mt-0.5">
                        <div
                          className="w-2.5 h-4 rounded-b-xs border border-black"
                          style={{ backgroundColor: awayKit.socks }}
                        ></div>
                        <div
                          className="w-2.5 h-4 rounded-b-xs border border-black"
                          style={{ backgroundColor: awayKit.socks }}
                        ></div>
                      </div>
                      <div className="w-8 h-2 bg-black/30 rounded-full blur-[1px] mt-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* Alt Viral Soru Kartı */}
                <div className="relative z-10 w-full pb-3 flex flex-col gap-2">
                  <div className="bg-primary-container text-on-primary-container p-3 rounded-xl shadow-xl flex flex-col gap-1 border-2 border-black">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-[10px] tracking-wider uppercase font-bold text-black">
                        GOLÜ TAHMİN ET
                      </span>
                      <span className="font-label-sm text-[10px] font-black px-1.5 py-0.2 rounded bg-black text-primary-container">
                        {timerSec} SANİYE
                      </span>
                    </div>
                    <div className="font-headline-sm text-[14px] leading-tight font-black text-black">
                      {questionText || "Bu golü hangi efsane 9 numara attı?"}
                    </div>
                  </div>
                  <div className="w-full bg-black/50 backdrop-blur-sm rounded-lg py-1 px-2 flex items-center justify-between text-white/80 font-label-sm text-[10px]">
                    <span>Cevap Süre Sonu Gösterilecek</span>
                    <span className="text-primary-container font-bold font-label-md">Tıkla &amp; Kilitle</span>
                  </div>
                </div>
              </div>
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
          <span>3. Adıma Dön</span>
        </button>

        <button
          type="button"
          onClick={onNextStep}
          className="px-space-xl py-2.5 rounded-xl bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container font-headline-sm text-headline-sm flex items-center gap-2 transition-all shadow-lg active:scale-95 group cursor-pointer"
        >
          <span>5. Adıma Geç: Dışa Aktar</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
};
