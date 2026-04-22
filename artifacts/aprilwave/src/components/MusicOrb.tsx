import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play } from "lucide-react";
import { useAudio } from "@/context/AudioContext";

export function MusicOrb() {
  const { isPlaying, playSource, volume, currentTrack, togglePlay, setVolume } = useAudio();
  const isOrbPlaying = playSource === "orb" && isPlaying;
  const isPortfolioPlaying = playSource === "portfolio" && isPlaying;
  const isAnyPlaying = isOrbPlaying || isPortfolioPlaying;
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const dragStartY = useRef(0);
  const dragHasMoved = useRef(false);
  const dragTargetIsOrb = useRef(false);

  const volumeFromPointer = useCallback(
    (clientY: number, clientX?: number) => {
      if (!sliderTrackRef.current) return;
      const rect = sliderTrackRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 1024;
      let fraction: number;
      if (isMobile && clientX !== undefined) {
        fraction = (clientX - rect.left) / rect.width;
      } else {
        fraction = 1 - (clientY - rect.top) / rect.height;
      }
      setVolume(Math.max(0, Math.min(1, fraction)));
    },
    [setVolume],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragHasMoved.current = false;
    const isOrb = !!(e.target as Element).closest("#music-orb-btn");
    dragTargetIsOrb.current = isOrb;
    if (!isOrb) {
      volumeFromPointer(e.clientY, e.clientX);
      dragHasMoved.current = true;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      if (Math.abs(e.clientX - dragStartY.current) > 3) {
        dragHasMoved.current = true;
      }
    } else {
      if (Math.abs(e.clientY - dragStartY.current) > 3) {
        dragHasMoved.current = true;
      }
    }
    volumeFromPointer(e.clientY, e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    if (!dragHasMoved.current && dragTargetIsOrb.current) {
      togglePlay("orb");
    }
  };

  const volumePct = Math.round(volume * 100);
  const orbSize = 52;
  const isMobileCurrent = isMobile;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
      case "ArrowRight":
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.05));
        break;
      case "ArrowDown":
      case "ArrowLeft":
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.05));
        break;
      case " ":
      case "Enter":
        e.preventDefault();
        togglePlay("orb");
        break;
    }
  };

  return (
    <div
      className="fixed z-[60] select-none group"
      style={
        isMobileCurrent
          ? {
              bottom: "2rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80vw",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }
          : {
              left: "2rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "48px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }
      }
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="group"
      aria-label={`Music orb. Current track: ${currentTrack}. Press Space to play or pause. Use arrow keys to adjust volume.`}
      onKeyDown={handleKeyDown}
    >
      <div
        className="lg:hidden mb-2 text-[11px] font-bold tracking-wider tabular-nums transition-all duration-300"
        style={{
          opacity: isHovered || isDragging ? 1 : 0,
          color: "var(--primary)",
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {volumePct}%
      </div>

      <div
        className="hidden lg:block absolute text-[11px] font-bold tracking-wider tabular-nums transition-all duration-300"
        style={{
          bottom: "100%",
          marginBottom: "3rem",
          opacity: isHovered || isDragging ? 1 : 0,
          transform:
            isHovered || isDragging ? "translateY(0)" : "translateY(8px)",
          color: "var(--primary)",
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {volumePct}%
      </div>

      <div
        ref={sliderTrackRef}
        className="relative touch-none cursor-pointer"
        style={
          isMobileCurrent
            ? {
                width: "100%",
                height: "48px",
              }
            : {
                width: "48px",
                height: "200px",
                display: "flex",
                justifyContent: "center",
              }
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
            className="hidden lg:absolute lg:block pointer-events-none"
            style={{
              width: "48px",
              height: "200px",
              clipPath: "polygon(10% 0, 90% 0, 65% 100%, 35% 100%)",
              background:
                "linear-gradient(to bottom, color-mix(in oklch, var(--primary) 15%, transparent), color-mix(in oklch, var(--accent) 5%, transparent))",
              opacity: isHovered || isDragging ? 1 : 0.3,
              transition: "opacity 0.3s",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
          <div
            className="absolute bottom-0 left-0 w-full origin-bottom"
            style={{
              height: "200px",
              transform: `scaleY(${volume})`,
              background:
                "linear-gradient(to top, color-mix(in oklch, var(--primary) 40%, transparent), color-mix(in oklch, var(--accent) 20%, transparent))",
              clipPath: "polygon(0 0, 100% 0, 65% 100%, 35% 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          />
        </div>

        <div
          className="lg:hidden absolute inset-0 pointer-events-none rounded-full"
          style={{
            background:
              "linear-gradient(to right, color-mix(in oklch, var(--primary) 15%, transparent), color-mix(in oklch, var(--accent) 5%, transparent))",
            opacity: isHovered || isDragging ? 1 : 0.3,
            transition: "opacity 0.3s",
            maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <div
            className="absolute left-0 top-0 h-full origin-left rounded-full"
            style={{
              width: `${volume * 100}%`,
              background:
                "linear-gradient(to right, color-mix(in oklch, var(--primary) 40%, transparent), color-mix(in oklch, var(--accent) 20%, transparent))",
              maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          />
        </div>

        <motion.div
          id="music-orb-btn"
          className="absolute z-10 rounded-full flex items-center justify-center border border-white/10 shadow-xl backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none"
          style={{
            width: `${orbSize}px`,
            height: `${orbSize}px`,
            ...(isMobileCurrent
              ? {
                  left: `calc(${volume * 100}% - ${orbSize / 2}px)`,
                  top: `calc(50% - ${orbSize / 2}px)`,
                }
              : {
                  left: `calc(50% - ${orbSize / 2}px)`,
                  top: `calc(${(1 - volume) * (200 - orbSize)}px)`,
                }),
            background: "color-mix(in oklch, var(--background) 45%, transparent)",
            pointerEvents: "auto",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: isAnyPlaying
              ? "0 0 20px color-mix(in oklch, var(--primary) 40%, transparent)"
              : "none",
          }}
        >
          <div
            className="hidden lg:block absolute pointer-events-none transition-opacity duration-500 whitespace-nowrap"
            style={{
              left: "100%",
              marginLeft: "14px",
              opacity: isAnyPlaying || isHovered || isDragging ? 1 : 0,
            }}
          >
            <span
              className="font-sans font-light italic text-[13px] tracking-wide"
              style={{ color: "color-mix(in oklch, var(--foreground) 80%, transparent)" }}
            >
              {`'${currentTrack}'`}
            </span>
          </div>

          {!isAnyPlaying && (
            <>
              <motion.span
                className="absolute inset-0 rounded-full border border-primary/40 pointer-events-none"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  repeat: 2,
                  delay: 0.5,
                }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-primary/40 pointer-events-none"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  repeat: 2,
                  delay: 1.5,
                }}
              />
            </>
          )}

          <AnimatePresence mode="wait">
            {isHovered || isDragging || !isAnyPlaying ? (
              <motion.span
                key={isAnyPlaying ? "pause" : "play"}
                initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 30 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 pointer-events-none"
                style={{ color: "color-mix(in oklch, var(--foreground) 80%, transparent)" }}
              >
                {isAnyPlaying ? (
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
                className="relative z-10 pointer-events-none"
                style={{ color: "color-mix(in oklch, var(--foreground) 80%, transparent)" }}
              >
                <Music className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}