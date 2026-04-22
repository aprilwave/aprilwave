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
  playSource: "orb" | "portfolio" | null;
  volume: number;
  currentTrack: string;
  currentTime: number;
  duration: number;
  hasPlayedAtLeastOnce: boolean;
  play: (src: string, source: "orb" | "portfolio", title: string, onEnded?: () => void) => Promise<void>;
  pause: () => void;
  togglePlay: (source?: "orb" | "portfolio") => Promise<boolean>;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  setCurrentTrack: (track: string) => void;
  switchSource: (source: "orb" | "portfolio") => void;
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
  const sourceElementRef = useRef<HTMLAudioElement | null>(null);
  const frequencyDataRef = useRef<Uint8Array>(new Uint8Array(64));
  const timeUpdateRef = useRef<number | null>(null);
  const lastUiUpdateRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playSource, setPlaySource] = useState<"orb" | "portfolio" | null>(null);
  const [hasPlayedAtLeastOnce, setHasPlayedAtLeastOnce] = useState(false);
  const [volume, _setVolume] = useState(0.75);
  const [currentTrack, setCurrentTrack] = useState("Atomic");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      frequencyDataRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, []);

  const connectAudio = useCallback((el: HTMLAudioElement) => {
    ensureAudioContext();
    if (sourceElementRef.current === el) return;

    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }

    sourceRef.current = audioContextRef.current!.createMediaElementSource(el);
    sourceRef.current.connect(analyserRef.current!);
    analyserRef.current!.connect(audioContextRef.current!.destination);
    sourceElementRef.current = el;
  }, [ensureAudioContext]);

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

  const startTimeTracking = useCallback(() => {
    if (timeUpdateRef.current) cancelAnimationFrame(timeUpdateRef.current);
    const tick = () => {
      if (audioRef.current && !audioRef.current.paused) {
        const now = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 0;
        currentTimeRef.current = now;

        const nowMs = performance.now();
        if (nowMs - lastUiUpdateRef.current > 100) {
          lastUiUpdateRef.current = nowMs;
          setCurrentTime(now);
          setDuration(dur);
        }

        timeUpdateRef.current = requestAnimationFrame(tick);
      }
    };
    tick();
  }, []);

  const stopTimeTracking = useCallback(() => {
    if (timeUpdateRef.current) {
      cancelAnimationFrame(timeUpdateRef.current);
      timeUpdateRef.current = null;
    }
    lastUiUpdateRef.current = 0;
  }, []);

  const getFrequencyData = useCallback(() => {
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(frequencyDataRef.current as unknown as Uint8Array<ArrayBuffer>);
    }
    return frequencyDataRef.current;
  }, []);

  const stopCurrentSource = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    fadeTo(0);
    stopTimeTracking();
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setPlaySource(null);
      setCurrentTime(0);
    }, FADE_DURATION);
  }, [fadeTo, stopTimeTracking]);

  const play = useCallback(async (src: string, source: "orb" | "portfolio", title: string, onEnded?: () => void) => {
    ensureAudioContext();

    const el = audioRef.current;
    const isSameElement = el && el.src === src;

    if (playSource && playSource !== source) {
      stopCurrentSource();
      await new Promise((r) => setTimeout(r, FADE_DURATION + 50));
    }

    let audio: HTMLAudioElement;
    if (isSameElement && el) {
      audio = el;
    } else {
      audio = new Audio(src);
      audioRef.current = audio;
      connectAudio(audio);
    }

    audio.volume = Math.pow(volume, 2);
    audio.load();

    setCurrentTrack(title);

    // Remove old ended listener
    audio.onended = null;

    if (onEnded) {
      audio.onended = onEnded;
    }

    try {
      audio.volume = 0;
      await audio.play();
      setIsPlaying(true);
      setPlaySource(source);
      setHasPlayedAtLeastOnce(true);
      fadeTo(Math.pow(volume, 2));
      startTimeTracking();
    } catch {
      // autoplay blocked
    }
  }, [playSource, stopCurrentSource, ensureAudioContext, connectAudio, volume, fadeTo, startTimeTracking]);

  const pause = useCallback(() => {
    fadeTo(0);
    stopTimeTracking();
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setPlaySource(null);
    }, FADE_DURATION);
  }, [fadeTo, stopTimeTracking]);

  const togglePlay = useCallback(async (source: "orb" | "portfolio" = "orb") => {
    const el = audioRef.current;
    if (!el) return false;

    ensureAudioContext();

    if (playSource && playSource !== source) {
      stopCurrentSource();
      await new Promise((r) => setTimeout(r, FADE_DURATION + 50));
    }

    if (el.paused) {
      try {
        el.volume = 0;
        await el.play();
        setIsPlaying(true);
        setPlaySource(source);
        setHasPlayedAtLeastOnce(true);
        fadeTo(Math.pow(volume, 2));
        startTimeTracking();
        return true;
      } catch {
        return false;
      }
    } else {
      if (playSource === source) {
        fadeTo(0);
        stopTimeTracking();
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setIsPlaying(false);
          setPlaySource(null);
        }, FADE_DURATION);
        return true;
      } else {
        stopCurrentSource();
        return true;
      }
    }
  }, [playSource, stopCurrentSource, ensureAudioContext, fadeTo, volume, startTimeTracking]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      currentTimeRef.current = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    _setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = Math.pow(clamped, 2);
    }
  }, []);

  const setCurrentTrackFn = useCallback((track: string) => {
    setCurrentTrack(track);
  }, []);

  const switchSource = useCallback((source: "orb" | "portfolio") => {
    setPlaySource(source);
  }, []);

  useEffect(() => {
    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current);
      if (timeUpdateRef.current) cancelAnimationFrame(timeUpdateRef.current);
    };
  }, []);

  return (
    <AudioCtx.Provider
      value={{
        isPlaying,
        playSource,
        volume,
        currentTrack,
        currentTime,
        duration,
        hasPlayedAtLeastOnce,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        setCurrentTrack: setCurrentTrackFn,
        switchSource,
        getFrequencyData,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
