import { useAudio } from "@/context/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

export function PlayAmbience() {
  const { play, isPlaying, playSource } = useAudio();
  const isOrbPlaying = playSource === "orb" && isPlaying;

  return (
    <AnimatePresence>
      {!isOrbPlaying && (
        <motion.div
          key="play-btn"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            onClick={() => play(`${import.meta.env.BASE_URL}audio/game-film/atomic.mp3`, "orb", "Atomic")}
            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-foreground/80 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <Play className="relative w-3.5 h-3.5 fill-current" />

            <span className="relative">Play Ambience</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
