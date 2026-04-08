import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface AudioContextValue {
  isPlaying: boolean;
  volume: number;
  togglePlay: () => Promise<boolean>;
  setVolume: (v: number) => void;
  registerAudio: (el: HTMLAudioElement) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within <AudioProvider>");
  return ctx;
}

const FADE_DURATION = 700;
const FADE_STEP_MS = 20;

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, _setVolume] = useState(0.75);

  /* ── helpers ─────────────────────────────────────── */

  const fadeTo = useCallback((target: number) => {
    const el = audioRef.current;
    if (!el) return;

    if (fadeRef.current) clearInterval(fadeRef.current);

    const start = el.volume;
    const t0 = Date.now();

    fadeRef.current = setInterval(() => {
      const p = Math.min((Date.now() - t0) / FADE_DURATION, 1);
      el.volume = start + (target - start) * p;
      if (p >= 1 && fadeRef.current) clearInterval(fadeRef.current);
    }, FADE_STEP_MS);
  }, []);

  /* ── public API ──────────────────────────────────── */

  const registerAudio = useCallback((el: HTMLAudioElement) => {
    audioRef.current = el;
  }, []);

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v));
      _setVolume(clamped);
      if (audioRef.current) {
        audioRef.current.volume = clamped;
      }
    },
    []
  );

  const togglePlay = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return false;

    if (el.paused) {
      try {
        el.volume = 0;
        await el.play();
        setIsPlaying(true);
        fadeTo(volume);
        return true;
      } catch {
        /* autoplay blocked — ignore */
        return false;
      }
    } else {
      // Fade out then pause
      fadeTo(0);
      setTimeout(() => {
        el.pause();
        setIsPlaying(false);
      }, FADE_DURATION);
      return true;
    }
  }, [fadeTo, volume]);

  /* keep audio element volume in sync when volume state changes while playing */
  useEffect(() => {
    const el = audioRef.current;
    if (el && !el.paused) {
      el.volume = volume;
    }
  }, [volume]);

  /* cleanup */
  useEffect(() => {
    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, []);

  return (
    <AudioCtx.Provider
      value={{ isPlaying, volume, togglePlay, setVolume, registerAudio }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
