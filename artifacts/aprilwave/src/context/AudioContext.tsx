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
  currentTrack: string;
  hasPlayedAtLeastOnce: boolean;
  togglePlay: () => Promise<boolean>;
  setVolume: (v: number) => void;
  setCurrentTrack: (track: string) => void;
  registerAudio: (el: HTMLAudioElement) => void;
  getFrequencyData: () => Uint8Array;
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array>(new Uint8Array(64));
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedAtLeastOnce, setHasPlayedAtLeastOnce] = useState(false);
  const [volume, _setVolume] = useState(0.75);
  const [currentTrack, setCurrentTrack] = useState("Atomic");

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

  const getFrequencyData = useCallback(() => {
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(frequencyDataRef.current);
    }
    return frequencyDataRef.current;
  }, []);

  /* ── public API ──────────────────────────────────── */

  const registerAudio = useCallback((el: HTMLAudioElement) => {
    audioRef.current = el;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
      analyserRef.current.smoothingTimeConstant = 0.8;
      frequencyDataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }

    if (audioContextRef.current && !sourceRef.current) {
      sourceRef.current = audioContextRef.current.createMediaElementSource(el);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    _setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const setCurrentTrackFn = useCallback((track: string) => {
    setCurrentTrack(track);
  }, []);

  const togglePlay = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return false;

    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume();
    }

    if (el.paused) {
      try {
        el.volume = 0;
        await el.play();
        setIsPlaying(true);
        setHasPlayedAtLeastOnce(true);
        fadeTo(volume);
        return true;
      } catch {
        /* autoplay blocked — ignore */
        return false;
      }
    } else {
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
      value={{
        isPlaying,
        volume,
        currentTrack,
        hasPlayedAtLeastOnce,
        togglePlay,
        setVolume,
        setCurrentTrack: setCurrentTrackFn,
        registerAudio,
        getFrequencyData,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
