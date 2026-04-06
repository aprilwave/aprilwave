import { useEffect, useRef, useCallback } from "react";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedRef = useRef(false);

  const FADE_DURATION = 700; // 0.7s
  const FADE_STEP_MS = 20;

  const fade = useCallback((targetVolume: number) => {
    if (!audioRef.current) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const startVolume = audioRef.current.volume;
    const startTime = Date.now();

    fadeIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / FADE_DURATION, 1);

      if (audioRef.current) {
        audioRef.current.volume =
          startVolume + (targetVolume - startVolume) * progress;
      }

      if (progress >= 1) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, FADE_STEP_MS);
  }, []);

  const startPlayback = useCallback(async () => {
    if (hasStartedRef.current || !audioRef.current) return;

    try {
      audioRef.current.volume = 0;
      await audioRef.current.play();
      hasStartedRef.current = true;
      fade(1);
    } catch {
      // Autoplay blocked — will retry on user interaction
    }
  }, [fade]);

  useEffect(() => {
    // Attempt autoplay immediately
    startPlayback();

    // Fallback: start on first user interaction (click, scroll, keydown, touch)
    const handleInteraction = () => {
      if (!hasStartedRef.current) {
        startPlayback();
      }
    };

    window.addEventListener("click", handleInteraction, { once: false });
    window.addEventListener("scroll", handleInteraction, { once: false });
    window.addEventListener("keydown", handleInteraction, { once: false });
    window.addEventListener("touchstart", handleInteraction, { once: false });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [startPlayback]);

  return (
    <audio
      ref={audioRef}
      src="/audio/v2_awve_website_home_atmos.mp3"
      loop
      preload="auto"
      style={{ display: "none" }}
    />
  );
}
