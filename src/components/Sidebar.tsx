import React from "react";
import { Step } from "../types";

interface SidebarProps {
  currentStep: Step;
  onSelectStep: (step: Step) => void;
  canNavigateTo: (step: Step) => boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  onSelectStep,
  canNavigateTo,
}) => {
  const navItems: { step: Step; label: string; icon: string }[] = [
    { step: 1, label: "1. Klip", icon: "movie" },
    { step: 2, label: "2. Kes", icon: "content_cut" },
    { step: 3, label: "3. Takımlar", icon: "shield" },
    { step: 4, label: "4. Stil", icon: "palette" },
    { step: 5, label: "5. Dışa Aktar", icon: "ios_share" },
  ];

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-20 bg-surface-container-low border-r border-outline-variant/30 z-40 flex flex-col justify-between py-space-md select-none">
      <nav className="flex flex-col items-center gap-space-sm w-full px-space-xs">
        {navItems.map((item) => {
          const isActive = currentStep === item.step;
          const isAllowed = canNavigateTo(item.step);

          return (
            <button
              key={item.step}
              type="button"
              onClick={() => isAllowed && onSelectStep(item.step)}
              disabled={!isAllowed}
              className={`w-full flex flex-col items-center justify-center py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? "bg-primary-container text-on-primary-container shadow-md"
                  : isAllowed
                  ? "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  : "text-outline-variant/40 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] mb-0.5">
                {item.icon}
              </span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Alt Bilgi */}
      <div className="flex flex-col items-center px-space-xs text-center border-t border-outline-variant/20 pt-space-md">
        <span className="font-label-sm text-label-sm text-outline tracking-tighter leading-tight">
          Tauri v2.1
        </span>
        <span className="font-label-sm text-label-sm text-outline-variant text-[9px] mt-0.5">
          Yerel Çevrimdışı
        </span>
      </div>
    </aside>
  );
};
