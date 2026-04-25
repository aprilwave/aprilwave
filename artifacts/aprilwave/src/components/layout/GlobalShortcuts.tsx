import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAudio } from "@/context/AudioContext";

const NAV_ROUTES = ["/", "/portfolio", "/contact"] as const;
const AUDIO_SRC = `${import.meta.env.BASE_URL}audio/game-film/atomic.mp3`;

export function GlobalShortcuts() {
  const [location, navigate] = useLocation();
  const { isPlaying, playSource, play, pause, togglePlay } = useAudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;

      // Navigation: 1/2/3
      if (e.key >= "1" && e.key <= "3") {
        e.preventDefault();
        navigate(NAV_ROUTES[parseInt(e.key) - 1]);
        return;
      }

      // Space: play/pause (skip on /portfolio — Portfolio has its own handler)
      if (e.key === " " && location !== "/portfolio") {
        const orbFocused = document.activeElement?.closest?.("#music-orb-btn");
        if (orbFocused) return;

        e.preventDefault();
        const portfolioPlaying = playSource === "portfolio" && isPlaying;
        if (portfolioPlaying) {
          pause(true);
        } else if (playSource === "portfolio") {
          togglePlay("portfolio");
        } else {
          play(AUDIO_SRC, "portfolio", "Atomic", undefined, true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [location, navigate, isPlaying, playSource, play, pause, togglePlay]);

  return null;
}
