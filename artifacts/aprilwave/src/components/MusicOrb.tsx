import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

export function MusicOrb() {
  const { isPlaying, volume, togglePlay, setVolume } = useAudio();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  // We track drag movement to differentiate between tap (play/pause) and drag (volume)
  const dragStartY = useRef(0);
  const dragHasMoved = useRef(false);
  const dragTargetIsOrb = useRef(false);

  const volumeFromPointer = useCallback(
    (clientY: number) => {
      if (!sliderTrackRef.current) return;
      const rect = sliderTrackRef.current.getBoundingClientRect();
      const fraction = 1 - (clientY - rect.top) / rect.height;
      setVolume(Math.max(0, Math.min(1, fraction)));
    },
    [setVolume]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    e.preventDefault();
    (e.currentTarget).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragHasMoved.current = false;

    // Direct clicks on track vs orb
    const isOrb = !!(e.target as Element).closest('#music-orb-btn');
    dragTargetIsOrb.current = isOrb;

    if (!isOrb) {
      // Clean snap to clicked position on the track
      volumeFromPointer(e.clientY);
      dragHasMoved.current = true; // prevent firing togglePlay on a track click
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    if (Math.abs(e.clientY - dragStartY.current) > 3) {
      dragHasMoved.current = true;
    }
    
    volumeFromPointer(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.currentTarget).releasePointerCapture(e.pointerId);

    // If it's a tap on the orb vs the track
    if (!dragHasMoved.current && dragTargetIsOrb.current) {
      togglePlay();
    }
  };

  const volumePct = Math.round(volume * 100);
  
  // Track geometry values
  const trackHeight = 200;
  const orbSize = 52;
  
  // Hardcoded track name for now based on user instruction
  const trackName = "'Atomic'";

  return (
    <div
      className="fixed left-5 top-1/2 -translate-y-1/2 z-[60] select-none flex flex-col items-center group w-[60px]"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* ── Percentage Label ── */}
      {/* Absolute positioning upwards to avoid orb collision at 100% volume */}
      <div 
        className={`absolute bottom-[100%] mb-12 text-[11px] font-bold tracking-wider tabular-nums transition-all duration-300 ${
          isHovered || isDragging ? "opacity-100 translate-y-0 text-primary" : "opacity-0 translate-y-2 text-primary/50"
        }`}
      >
        {volumePct}%
      </div>

      {/* ── Slider Track Container ── */}
      <div
        ref={sliderTrackRef}
        className="relative w-[48px] touch-none cursor-pointer flex justify-center"
        style={{ height: `${trackHeight}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Track shape using clipPath to create wide-top slim-bottom shape */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isHovered || isDragging ? "opacity-100" : "opacity-30"
          }`}
          style={{
            clipPath: "polygon(10% 0, 90% 0, 65% 100%, 35% 100%)", 
            background: "linear-gradient(to bottom, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.05))",
          }}
        >
          {/* Track Fill */}
          <div 
            className="absolute bottom-0 left-0 w-full h-full origin-bottom"
            style={{
              transform: `scaleY(${volume})`,
              background: "linear-gradient(to top, hsl(var(--primary) / 0.4), hsl(var(--accent) / 0.2))",
            }}
          />
        </div>

        {/* ── The Orb (Thumb) ── */}
        <motion.div
           id="music-orb-btn"
           className="absolute z-10 rounded-full flex items-center justify-center outline-none border border-white/10 shadow-xl backdrop-blur-xl"
           style={{
             width: `${orbSize}px`,
             height: `${orbSize}px`,
             top: `calc(${100 - volumePct}% - ${orbSize/2}px)`,
             background: "hsl(var(--background) / 0.45)",
             pointerEvents: "auto",
           }}
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           animate={{
            boxShadow: isPlaying ? "0 0 20px hsl(var(--primary) / 0.4)" : "0 0 0px hsl(var(--primary) / 0)"
           }}
        >
          {/* Track Name Wrapper */}
          <div 
            className={`absolute left-[calc(100%+14px)] whitespace-nowrap pointer-events-none transition-opacity duration-500 ${
              isPlaying || isHovered || isDragging ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="font-sans font-light italic text-[13px] tracking-wide text-foreground/80 drop-shadow-md">
              {trackName}
            </span>
          </div>

          {/* Initial precise entrance ripples - runs exactly 3 times on mount, completely eliminating infinite loop bugs */}
          {!isPlaying && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full border border-primary/40 pointer-events-none"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut", repeat: 2, delay: 0.5 }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-primary/40 pointer-events-none"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut", repeat: 2, delay: 1.5 }}
              />
            </>
          )}


          <AnimatePresence mode="wait">
            {isHovered || isDragging || !isPlaying ? (
              <motion.span
                key={isPlaying ? "pause" : "play"}
                initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 text-foreground/80 pointer-events-none"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </motion.span>
            ) : (
              <motion.span
                key="note"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                }}
                className="relative z-10 text-foreground/80 pointer-events-none"
              >
                <Music className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Entrance Play Hint ── */}
      <AnimatePresence>
        {!isPlaying && !isHovered && !isDragging && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute top-[calc(100%+16px)] px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md whitespace-nowrap pointer-events-none"
          >
            <span className="text-[11px] font-medium tracking-wide text-primary/90 flex items-center gap-1.5">
              <Play className="w-3 h-3 fill-primary/80" /> Welcome
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
