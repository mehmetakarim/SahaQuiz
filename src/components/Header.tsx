import React from "react";

interface HeaderProps {
  projectName: string;
}

export const Header: React.FC<HeaderProps> = ({ projectName }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant/30 z-50 select-none">
      <div className="h-14 w-full px-margin-desktop flex items-center justify-between gap-space-lg">
        {/* Sol Alan: Window Controls & Logo */}
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-1.5 pr-space-md border-r border-outline-variant/30">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-90 hover:opacity-100 transition-opacity cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-90 hover:opacity-100 transition-opacity cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] opacity-90 hover:opacity-100 transition-opacity cursor-pointer"></div>
          </div>
          <div className="flex items-center gap-space-sm pl-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shadow-sm">
              ⚽
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">SahaQuiz</span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-md text-label-md text-on-surface-variant truncate max-w-xs">
              Proje: {projectName || "Henüz klip seçilmedi"}
            </span>
          </div>
        </div>

        {/* Sağ Alan: Hardware Status & Output Directory */}
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container border border-outline-variant/20 font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px] text-primary-container">memory</span>
            <span className="tracking-wide">Yerel Donanım: CPU / Yerel Motor Aktif (GPU Yok)</span>
          </div>
          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container border border-outline-variant/20 font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px] text-secondary">folder</span>
            <span className="tracking-wide font-label-sm truncate max-w-[200px]">Çıktı: ~/Videolar/SahaQuiz/</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
