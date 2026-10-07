export type Step = 1 | 2 | 3 | 4 | 5;

export interface VideoMetadata {
  duration: number; // saniye
  width: number;
  height: number;
  fps: number;
  frame_count: number;
  size_bytes: number;
  codec?: string;
}

export interface PreviewFrame {
  time_sec: number;
  frame_index: number;
  data_uri: string;
}

export interface TeamKit {
  shirt: string;
  shorts: string;
  socks: string;
  name: string;
}

export type StylePreset = "quiz" | "line" | "broadcast";
export type Difficulty = "Kolay" | "Orta" | "Zor";

export interface ProjectState {
  currentStep: Step;
  videoPath: string | null;
  videoName: string;
  metadata: VideoMetadata | null;
  inSec: number;
  outSec: number;
  currentPreviewSec: number;
  homeKit: TeamKit;
  awayKit: TeamKit;
  isHomeGkCustom: boolean;
  isAwayGkCustom: boolean;
  style: StylePreset;
  badgeText: string;
  questionText: string;
  difficulty: Difficulty;
  timerSec: number;
  showSafeZone: boolean;
  renderProgress: {
    stage: string;
    percent: number;
    frame?: number;
    total?: number;
    message?: string;
  } | null;
  outputPath: string | null;
  isRendering: boolean;
  renderError: string | null;
}
