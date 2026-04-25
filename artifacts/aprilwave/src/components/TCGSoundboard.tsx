import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Volume2 } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

const CARD_ACTIONS: { label: string; files: string[] }[] = [
  { label: "Draw", files: ["card_draw1.wav", "card_draw2.wav", "card_draw3.wav", "card_draw4.wav"] },
  { label: "Play", files: ["card_play1.wav", "card_play2.wav"] },
  { label: "Discard", files: ["card_discard1.wav"] },
  { label: "Exhaust", files: ["card_exhaust1.wav", "card_exhaust2.wav"] },
  { label: "Recycle", files: ["card_recycle1.wav", "card_recycle2.wav", "card_recycle3.wav", "card_recycle4.wav"] },
  { label: "Hover", files: ["card_hover1.wav", "card_hover2.wav", "card_hover3.wav"] },
  { label: "Auto-pay", files: ["card_autopay1.wav", "card_autopay2.wav", "card_autopay3.wav"] },
];

const OTHER_SOUNDS: { label: string; files: string[] }[] = [
  { label: "Rewind", files: ["game_rewind1.wav", "game_rewind2.wav"] },
  { label: "Score", files: ["score_conquer1.wav", "score_conquer2.wav", "score_end.wav", "score_generic.wav", "score_hold.wav"] },
  { label: "UI", files: ["ui_click1.wav", "ui_click2.wav", "ui_confirm.wav"] },
];

const BASE_URL = `${import.meta.env.BASE_URL}audio/game-audio/tcg-sim/`;

function getRandomFile(files: string[]): string {
  return files[Math.floor(Math.random() * files.length)];
}

export default function TCGSoundboard({ onClose }: { onClose: () => void }) {
  const { volume } = useAudio();
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const playSound = useCallback((label: string, files: string[]) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(`${BASE_URL}${getRandomFile(files)}`);
    audio.volume = Math.pow(volume, 2);
    audioRef.current = audio;

    setActiveSound(label);
    audio.onended = () => setActiveSound(null);
    audio.play().catch(() => setActiveSound(null));
  }, [volume]);

  return (
    <motion.div
      ref={overlayRef}
      onClick={handleOverlayClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-panel rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">TCG Simulator Project</h2>
            <p className="text-xs text-muted-foreground mt-1">Interactive sound design demo</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Close demo"
            className="p-2 rounded-full glass-panel transition-colors hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Card Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CARD_ACTIONS.map((sound) => {
                const isActive = activeSound === sound.label;
                return (
                  <motion.button
                    key={sound.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playSound(sound.label, sound.files)}
                    className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/20 text-foreground ring-1 ring-primary/40"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                    {sound.label}
                    {isActive && (
                      <motion.span
                        layoutId="playing-indicator"
                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 px-1">Other</h3>
            <div className="grid grid-cols-3 gap-3">
              {OTHER_SOUNDS.map((sound) => {
                const isActive = activeSound === sound.label;
                return (
                  <motion.button
                    key={sound.label}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playSound(sound.label, sound.files)}
                    className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/20 text-foreground ring-1 ring-primary/40"
                        : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                    {sound.label}
                    {isActive && (
                      <motion.span
                        layoutId="playing-indicator"
                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground mt-6 text-center italic">
          Click any button to hear a random variant. Each click plays a different version.
        </p>
      </motion.div>
    </motion.div>
  );
}
