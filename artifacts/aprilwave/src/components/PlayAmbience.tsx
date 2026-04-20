import { useAudio } from "@/context/AudioContext";
import { motion, AnimatePresence } from "framer-motion";

export function PlayAmbience() {
  const { play, isPlaying, playSource } = useAudio();
  const isOrbPlaying = playSource === "orb" && isPlaying;

  return (
    <div className="mb-4 h-9 flex items-center justify-center">
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
              onClick={() => play("/audio/v2_awve_website_home_atmos.mp3", "orb", "Atomic")}
              whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs font-medium text-muted-foreground overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary/60" />
              </span>

              <span className="relative">Play Ambience</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
