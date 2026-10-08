import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Step1Clip } from "./components/Step1Clip";
import { Step2Cut } from "./components/Step2Cut";
import { Step3Teams } from "./components/Step3Teams";
import { Step4Style } from "./components/Step4Style";
import { Step5Export } from "./components/Step5Export";
import { ProjectState, Step, VideoMetadata, TeamKit, StylePreset, Difficulty } from "./types";

export const App: React.FC = () => {
  const [state, setState] = useState<ProjectState>({
    currentStep: 1,
    videoPath: null,
    videoName: "",
    videoUrl: null,
    metadata: null,
    inSec: 0,
    outSec: 8.0,
    currentPreviewSec: 0,
    previewFrames: [],
    hasCloseUpDetected: false,
    isLoadingFrames: false,
    homeKit: {
      shirt: "#DE0B1E",
      shorts: "#FDB913",
      socks: "#FFFFFF",
      name: "Sarı-Kırmızı",
    },
    awayKit: {
      shirt: "#00205B",
      shorts: "#FFFFFF",
      socks: "#00205B",
      name: "Lacivert-Beyaz",
    },
    isHomeGkCustom: true,
    isAwayGkCustom: true,
    style: "quiz",
    badgeText: "SAHAQUIZ",
    questionText: "Bu golü hangi efsane 9 numara attı?",
    difficulty: "Zor",
    timerSec: 5,
    showSafeZone: true,
    renderProgress: null,
    outputPath: null,
    isRendering: false,
    renderError: null,
  });

  // Kare çıkarma ve yakın plan analizi
  const fetchPreviewFrames = async (filePath: string, inVal: number, outVal: number) => {
    if (!filePath) return;
    setState((prev) => ({ ...prev, isLoadingFrames: true }));
    try {
      // @ts-ignore
      if (window.__TAURI_INTERNALS__) {
        const { invoke } = await import("@tauri-apps/api/core");
        const resp: any = await invoke("run_sidecar_action", {
          action: "frames",
          payload: {
            path: filePath,
            in_sec: inVal,
            out_sec: outVal,
            fps: 2,
          },
        });
        if (resp && resp.frames) {
          setState((prev) => ({
            ...prev,
            previewFrames: resp.frames,
            hasCloseUpDetected: Boolean(resp.has_close_up),
            isLoadingFrames: false,
          }));
          return;
        }
      }
    } catch (err) {
      console.warn("Sidecar kare çıkarma hatası:", err);
    }
    setState((prev) => ({ ...prev, isLoadingFrames: false }));
  };

  // Tauri event listener (sidecar-progress)
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      try {
        // @ts-ignore
        if (window.__TAURI_INTERNALS__) {
          const { listen } = await import("@tauri-apps/api/event");
          const u = await listen("sidecar-progress", (event: any) => {
            const data = event.payload;
            setState((prev) => ({
              ...prev,
              renderProgress: {
                stage: data.stage || "processing",
                percent: data.percent || 0,
                frame: data.frame,
                total: data.total,
                message: data.message,
              },
            }));
          });
          unlisten = u;
        }
      } catch {
        // Tarayıcı ortamında sessiz kal
      }
    };

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // Dosya seçildiğinde metadata probe et ve kareleri çek
  const handleSelectFile = async (filePath: string, fileName: string, fileUrl?: string) => {
    setState((prev) => ({
      ...prev,
      videoPath: filePath,
      videoName: fileName,
      videoUrl: fileUrl || null,
      previewFrames: [],
      hasCloseUpDetected: false,
    }));

    try {
      // @ts-ignore
      if (window.__TAURI_INTERNALS__) {
        const { invoke } = await import("@tauri-apps/api/core");
        const resp: any = await invoke("run_sidecar_action", {
          action: "probe",
          payload: { path: filePath },
        });

        if (resp && resp.data) {
          const meta: VideoMetadata = resp.data;
          const initialOut = Math.min(meta.duration, 8.68);
          setState((prev) => ({
            ...prev,
            metadata: meta,
            inSec: 0,
            outSec: initialOut,
            currentPreviewSec: Math.min(meta.duration / 2, 4.0),
          }));

          // Arka planda filmstrip karelerini ve yakın plan tespitini çıkar
          fetchPreviewFrames(filePath, 0, initialOut);
        }
      }
    } catch (err) {
      console.warn("Probe sidecar hatası veya web ortamı:", err);
    }
  };

  // Render işlemi başlat
  const handleStartRender = async () => {
    setState((prev) => ({
      ...prev,
      isRendering: true,
      renderError: null,
      renderProgress: { stage: "extract", percent: 5, message: "Kareler ayrıştırılıyor..." },
    }));

    try {
      // @ts-ignore
      if (window.__TAURI_INTERNALS__) {
        const { invoke } = await import("@tauri-apps/api/core");
        const resp: any = await invoke("run_sidecar_action", {
          action: "render",
          payload: {
            path: state.videoPath,
            in_sec: state.inSec,
            out_sec: state.outSec,
            home_colors: state.homeKit,
            away_colors: state.awayKit,
            style: state.style,
            badge_text: state.badgeText,
            question_text: state.questionText,
            difficulty: state.difficulty,
            timer_sec: state.timerSec,
          },
        });

        if (resp && resp.type === "done") {
          setState((prev) => ({
            ...prev,
            isRendering: false,
            outputPath: resp.output_path,
            renderProgress: { stage: "done", percent: 100, message: "Tamamlandı" },
          }));
        } else if (resp && resp.type === "error") {
          setState((prev) => ({
            ...prev,
            isRendering: false,
            renderError: resp.message || "Bilinmeyen render hatası",
          }));
        }
      } else {
        // Tauri dışı tarayıcı ortamında anlaşılır bilgi ver (sahte progress bar yok)
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isRendering: false,
            renderError:
              "Tauri masaüstü ortamı algılanmadı. Yerel video render borusu için uygulamayı 'npm run tauri dev' ile çalıştırın.",
          }));
        }, 1200);
      }
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isRendering: false,
        renderError: `Render motoru hatası: ${err?.message || err}`,
      }));
    }
  };

  const canNavigateTo = (step: Step) => {
    if (step === 1) return true;
    return !!state.videoPath;
  };

  return (
    <div className="bg-background min-h-screen text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      <Header projectName={state.videoName} />
      <Sidebar
        currentStep={state.currentStep}
        onSelectStep={(step) => setState((prev) => ({ ...prev, currentStep: step }))}
        canNavigateTo={canNavigateTo}
      />

      <div className="pl-20">
        <main className="relative pt-14 min-h-screen bg-background w-full px-margin-desktop">
          {state.currentStep === 1 && (
            <Step1Clip
              videoPath={state.videoPath}
              videoUrl={state.videoUrl}
              videoName={state.videoName}
              metadata={state.metadata}
              onSelectFile={handleSelectFile}
              onClearFile={() =>
                setState((prev) => ({
                  ...prev,
                  videoPath: null,
                  videoUrl: null,
                  videoName: "",
                  metadata: null,
                }))
              }
              onNextStep={() => setState((prev) => ({ ...prev, currentStep: 2 }))}
            />
          )}

          {state.currentStep === 2 && (
            <Step2Cut
              videoName={state.videoName}
              videoUrl={state.videoUrl}
              metadata={state.metadata}
              inSec={state.inSec}
              outSec={state.outSec}
              currentPreviewSec={state.currentPreviewSec}
              previewFrames={state.previewFrames}
              hasCloseUpDetected={state.hasCloseUpDetected}
              isLoadingFrames={state.isLoadingFrames}
              onRefreshFrames={() => {
                if (state.videoPath) {
                  fetchPreviewFrames(state.videoPath, state.inSec, state.outSec);
                }
              }}
              onChangeInSec={(val) => setState((prev) => ({ ...prev, inSec: val }))}
              onChangeOutSec={(val) => setState((prev) => ({ ...prev, outSec: val }))}
              onChangePreviewSec={(val) => setState((prev) => ({ ...prev, currentPreviewSec: val }))}
              onNextStep={() => setState((prev) => ({ ...prev, currentStep: 3 }))}
              onPrevStep={() => setState((prev) => ({ ...prev, currentStep: 1 }))}
            />
          )}

          {state.currentStep === 3 && (
            <Step3Teams
              videoName={state.videoName}
              homeKit={state.homeKit}
              awayKit={state.awayKit}
              isHomeGkCustom={state.isHomeGkCustom}
              isAwayGkCustom={state.isAwayGkCustom}
              onChangeHomeKit={(kit: TeamKit) => setState((prev) => ({ ...prev, homeKit: kit }))}
              onChangeAwayKit={(kit: TeamKit) => setState((prev) => ({ ...prev, awayKit: kit }))}
              onToggleHomeGk={() =>
                setState((prev) => ({ ...prev, isHomeGkCustom: !prev.isHomeGkCustom }))
              }
              onToggleAwayGk={() =>
                setState((prev) => ({ ...prev, isAwayGkCustom: !prev.isAwayGkCustom }))
              }
              onNextStep={() => setState((prev) => ({ ...prev, currentStep: 4 }))}
              onPrevStep={() => setState((prev) => ({ ...prev, currentStep: 2 }))}
            />
          )}

          {state.currentStep === 4 && (
            <Step4Style
              style={state.style}
              badgeText={state.badgeText}
              questionText={state.questionText}
              difficulty={state.difficulty}
              timerSec={state.timerSec}
              showSafeZone={state.showSafeZone}
              homeKit={state.homeKit}
              awayKit={state.awayKit}
              onChangeStyle={(s: StylePreset) => setState((prev) => ({ ...prev, style: s }))}
              onChangeBadgeText={(t: string) => setState((prev) => ({ ...prev, badgeText: t }))}
              onChangeQuestionText={(t: string) => setState((prev) => ({ ...prev, questionText: t }))}
              onChangeDifficulty={(d: Difficulty) => setState((prev) => ({ ...prev, difficulty: d }))}
              onChangeTimerSec={(sec: number) => setState((prev) => ({ ...prev, timerSec: sec }))}
              onToggleSafeZone={() =>
                setState((prev) => ({ ...prev, showSafeZone: !prev.showSafeZone }))
              }
              onNextStep={() => setState((prev) => ({ ...prev, currentStep: 5 }))}
              onPrevStep={() => setState((prev) => ({ ...prev, currentStep: 3 }))}
            />
          )}

          {state.currentStep === 5 && (
            <Step5Export
              state={state}
              onStartRender={handleStartRender}
              onPrevStep={() => setState((prev) => ({ ...prev, currentStep: 2 }))}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
