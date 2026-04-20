import { useEffect, useRef, useCallback } from "react";
import { useAudio } from "@/context/AudioContext";

export function BackgroundMusic() {
  const hasStartedRef = useRef(false);
  const { play, isPlaying, playSource } = useAudio();
  const isOrbPlaying = playSource === "orb" && isPlaying;

  const startPlayback = useCallback(async () => {
    if (hasStartedRef.current) return;
    if (!isOrbPlaying) {
      await play("/audio/v2_awve_website_home_atmos.mp3", "orb", "Atomic");
      hasStartedRef.current = true;
    }
  }, [play, isOrbPlaying]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasStartedRef.current) startPlayback();
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("scroll", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [startPlayback]);

  return null;
}