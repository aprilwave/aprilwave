import { useEffect, useRef, useCallback } from "react";
import { useAudio } from "@/context/AudioContext";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const { registerAudio, togglePlay, isPlaying } = useAudio();

  /* Register the <audio> element once it mounts */
  useEffect(() => {
    if (audioRef.current) {
      registerAudio(audioRef.current);
    }
  }, [registerAudio]);

  /* Attempt autoplay, falling back to first interaction */
  const startPlayback = useCallback(async () => {
    if (hasStartedRef.current || !audioRef.current) return;
    
    if (!isPlaying) {
      const success = await togglePlay();
      if (success) {
        hasStartedRef.current = true;
      }
    }
  }, [togglePlay, isPlaying]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasStartedRef.current) startPlayback();
    };

    window.addEventListener("click", handleInteraction, { capture: true });
    window.addEventListener("scroll", handleInteraction, { capture: true });
    window.addEventListener("keydown", handleInteraction, { capture: true });
    window.addEventListener("touchstart", handleInteraction, { capture: true });

    return () => {
      window.removeEventListener("click", handleInteraction, { capture: true });
      window.removeEventListener("scroll", handleInteraction, { capture: true });
      window.removeEventListener("keydown", handleInteraction, { capture: true });
      window.removeEventListener("touchstart", handleInteraction, { capture: true });
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
