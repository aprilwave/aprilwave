import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Info, SkipBack, SkipForward, Volume2, VolumeX, Gamepad2, Music, Headphones, Waves } from "lucide-react";
import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import { useAudio } from "@/context/AudioContext";
import { WaveformSeekBar } from "@/components/WaveformSeekBar";

const TCGSoundboard = lazy(() => import("@/components/TCGSoundboard"));

interface Track {
  id: string;
  title: string;
  file: string;
  isPersonalWork?: boolean;
  description?: string;
}

const categories: { name: string; folder: string; icon: typeof Gamepad2; tracks: Track[] }[] = [
  {
    name: "Game/Film Compositions",
    folder: "game-film",
    icon: Gamepad2,
    tracks: [
      { id: "gf-1", title: "Atomic", file: "atomic.mp3", description: "A short hybrid cinematic piece, inspired by timbres from Oppenheimer. Welcome to the site!" },
      { id: "gf-2", title: "Mad Mage", file: "mad-mage.mp3", description: "Dark orchestral fantasy, meant to serve as a Menu score - inspired by Baldur's Gate." },
    ],
  },
  {
    name: "Music",
    folder: "music",
    icon: Music,
    tracks: [
      { id: "1", title: "Alternative Dance", file: "alternative-dance.mp3" },
      { id: "2", title: "Bounce House", file: "bounce-house.mp3" },
      { id: "3", title: "Eastern Rave", file: "eastern-rave.mp3" },
      { id: "4", title: "Granular Cinematic", file: "granular-cinematic.mp3" },
      { id: "5", title: "Heavy Melodic", file: "heavy-melodic.mp3" },
      { id: "6", title: "Indie Electropop", file: "indie-electropop.mp3" },
      { id: "7", title: "Lo-Fi", file: "lo-fi.mp3" },
      { id: "8", title: "Melodic Dubstep", file: "melodic-dubstep.mp3" },
      { id: "9", title: "Old School Dub", file: "old-school-dub.mp3" },
      { id: "10", title: "Synth Era", file: "synth-era.mp3" },
      { id: "11", title: "Vaportwitch", file: "vaportwitch.mp3" },
      { id: "12", title: "Better Love", file: "aprilwave-better-love.mp3", isPersonalWork: true },
      { id: "13", title: "Saw You", file: "aprilwave-saw-you.mp3", isPersonalWork: true },
      { id: "14", title: "Covex - Younger (Remix)", file: "covex-younger-remix.mp3", isPersonalWork: true },
      { id: "15", title: "KUCKA - No Good (Remix)", file: "kucka-no-good-remix.mp3", isPersonalWork: true },
      { id: "16", title: "NIKI - Plot Twist (Remix)", file: "niki-plot-twist-remix.mp3", isPersonalWork: true },
    ],
  },
  {
    name: "Game Audio",
    folder: "game-audio",
    icon: Headphones,
    tracks: [],
  },
  {
    name: "Sound Design",
    folder: "synth",
    icon: Waves,
    tracks: [],
  },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Game/Film Compositions");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showTCG, setShowTCG] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState<Track[]>([]);
  const infoRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const currentIndexRef = useRef(0);
  const playingCategoryRef = useRef<string | null>(null);
  const categoryIndexRef = useRef<Record<string, number>>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const {
    play,
    pause,
    seek,
    setVolume,
    isPlaying: ctxIsPlaying,
    playSource,
    volume,
    currentTime,
    duration,
    currentTrack: ctxTrackName,
  } = useAudio();

  const isPlayingRef = useRef(false);
  const volumeRef = useRef(volume);
  const preMuteVolumeRef = useRef(0.75);
  const isMutedRef = useRef(false);
  const durationRef = useRef(0);
  const currentTimeRef = useRef(0);
  isPlayingRef.current = playSource === "portfolio" && ctxIsPlaying;
  volumeRef.current = volume;
  isMutedRef.current = isMuted;
  durationRef.current = duration;
  currentTimeRef.current = currentTime;

  const activeCatData = categories.find((c) => c.name === activeCategory) || categories[0];
  const hasTracks = activeCatData.tracks.length > 0;
  const isPortfolioPlaying = playSource === "portfolio" && ctxIsPlaying;
  const currentTrack = shuffledTracks[currentTrackIndex];
  const isCategoryPlaying = playingCategoryRef.current === activeCategory;
  const activeTrackName = isCategoryPlaying && ctxIsPlaying ? ctxTrackName : currentTrack?.title;
  const audioSrc = currentTrack ? `${import.meta.env.BASE_URL}audio/${activeCatData.folder}/${currentTrack.file}` : "";

  // Animated tab indicator
  const updateIndicator = useCallback(() => {
    const activeIdx = categories.findIndex((c) => c.name === activeCategory);
    const tab = tabRefs.current[activeIdx];
    if (tab && tab.parentElement) {
      const parentRect = tab.parentElement.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();
      setIndicatorStyle({
        left: tabRect.left - parentRect.left,
        width: tabRect.width,
      });
    }
  }, [activeCategory]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        infoRef.current &&
        !infoRef.current.contains(event.target as Node) &&
        infoButtonRef.current &&
        !infoButtonRef.current.contains(event.target as Node)
      ) {
        setShowInfo(false);
      }
    };
    if (showInfo) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInfo]);

  const prevCategoryRef = useRef(activeCategory);

  useEffect(() => {
    if (!hasTracks) return;

    // Save the current track index for the category we're leaving
    if (prevCategoryRef.current !== activeCategory) {
      categoryIndexRef.current[prevCategoryRef.current] = currentIndexRef.current;
    }

    const sessionKey = `portfolio-shuffled-${activeCategory}`;
    const cached = sessionStorage.getItem(sessionKey);
    if (cached) {
      setShuffledTracks(JSON.parse(cached));
    } else {
      const shuffled = shuffleArray(activeCatData.tracks);
      setShuffledTracks(shuffled);
      sessionStorage.setItem(sessionKey, JSON.stringify(shuffled));
    }

    // Restore saved index for this category, or default to 0
    const savedIndex = categoryIndexRef.current[activeCategory] || 0;
    setCurrentTrackIndex(savedIndex);
    currentIndexRef.current = savedIndex;
    prevCategoryRef.current = activeCategory;
  }, [activeCategory, hasTracks]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") return;
      if (shuffledTracks.length === 0) return;

      const orbFocused = document.activeElement?.closest?.("#music-orb-btn");

      switch (e.key) {
        case " ":
          if (orbFocused) return;
          e.preventDefault();
          if (isPlayingRef.current) {
            pause(true);
          } else {
            const track = shuffledTracks[currentIndexRef.current];
            if (track) {
              playingCategoryRef.current = activeCategory;
              const src = `${import.meta.env.BASE_URL}audio/${activeCatData.folder}/${track.file}`;
              play(src, "portfolio", track.title, undefined, true);
            }
          }
          break;
        case "ArrowLeft":
          if (orbFocused) return;
          e.preventDefault();
          if (durationRef.current > 0) {
            seek(Math.max(0, currentTimeRef.current - 5));
          }
          break;
        case "ArrowRight":
          if (orbFocused) return;
          e.preventDefault();
          if (durationRef.current > 0) {
            seek(Math.min(durationRef.current, currentTimeRef.current + 5));
          }
          break;
        case "ArrowUp":
          if (orbFocused) return;
          e.preventDefault();
          setVolume(Math.min(1, volumeRef.current + 0.05));
          break;
        case "ArrowDown":
          if (orbFocused) return;
          e.preventDefault();
          setVolume(Math.max(0, volumeRef.current - 0.05));
          break;
        case "m":
        case "M":
          e.preventDefault();
          const newMuted = !isMutedRef.current;
          setIsMuted(newMuted);
          if (newMuted) {
            preMuteVolumeRef.current = volumeRef.current || 0.75;
            setVolume(0);
          } else {
            setVolume(preMuteVolumeRef.current);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shuffledTracks, activeCatData, play, pause, seek, setVolume]);

  const handleTogglePlay = async () => {
    if (!currentTrack) return;
    if (isPortfolioPlaying) {
      pause(true);
    } else {
      playingCategoryRef.current = activeCategory;
      const src = `${import.meta.env.BASE_URL}audio/${activeCatData.folder}/${currentTrack.file}`;
      await play(src, "portfolio", currentTrack.title, () => handleTrackEnded(), true);
    }
  };

  const handleTrackEnded = () => {
    const next = (currentIndexRef.current + 1) % shuffledTracks.length;
    playTrack(next);
  };

  const playTrack = async (index: number) => {
    currentIndexRef.current = index;
    setCurrentTrackIndex(index);
    categoryIndexRef.current[activeCategory] = index;
    const track = shuffledTracks[index];
    if (!track) return;
    playingCategoryRef.current = activeCategory;
    const src = `${import.meta.env.BASE_URL}audio/${activeCatData.folder}/${track.file}`;
    await play(src, "portfolio", track.title, () => handleTrackEnded(), true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      preMuteVolumeRef.current = volume || 0.75;
      setVolume(0);
    } else {
      setVolume(preMuteVolumeRef.current);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="fixed inset-0 pointer-events-none -z-5 bg-background/40 blur-lg" />

      <section className={`pt-32 pb-20 px-6 max-w-7xl mx-auto w-full relative z-10 min-h-screen transition-all duration-300 ${showTCG ? "blur-[4px] pointer-events-none select-none" : ""}`}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold mb-4"
          >
            Selected <span className="text-primary">Works</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            A curated collection of my sounds, scores, and audio experiences.
          </motion.p>
        </div>

        {/* Horizontal filter bar with animated selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-12"
        >
          <div className="relative flex items-center glass-panel rounded-full p-1 gap-1">
            {/* Animated selector */}
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-white/10"
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />

            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.name}</span>
                </button>
              );
            })}
          </div>

          <div ref={infoRef} className="relative flex items-center">
            <button
              ref={infoButtonRef}
              onClick={() => setShowInfo(!showInfo)}
              aria-expanded={showInfo}
              aria-controls="portfolio-info-panel"
              className="p-2.5 rounded-full text-sm font-medium transition-all duration-300 glass-panel active:scale-95 active:duration-150 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              <Info className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showInfo && (
                <motion.div
                  id="portfolio-info-panel"
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute !absolute left-0 sm:left-full sm:ml-3 top-full mt-3 sm:top-0 sm:mt-0 z-50 p-4 rounded-2xl glass-panel w-[90vw] sm:w-[500px] max-w-[500px]"
                >
                  <p className="text-sm text-muted-foreground italic">
                    Some of the following audio samples are snippets from previously done works. Due to NDAs and similar agreements, their length is purposely kept short. If you are one of my previous clients finding this content and would like any of your samples removed, please feel free to reach out.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {!hasTracks ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {activeCategory === "Game Audio" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel rounded-2xl p-5"
                >
                  <h3 className="font-display text-base font-bold mb-1">Online TCG Simulator Project</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Interactive demo of an online TCG Simulator sound palette, including card handling, game event, and UI sounds.
                  </p>
                  <motion.button
                    onClick={() => setShowTCG(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-full glass-panel text-xs font-medium text-foreground/80 hover:bg-white/10 transition-colors"
                  >
                    Launch Soundboard
                  </motion.button>
                </motion.div>
              </div>
            ) : (
              <div className="mt-8">
                <p className="text-muted-foreground text-lg">No audio files in this category yet.</p>
                <p className="text-muted-foreground text-sm mt-2">Check back soon for updates.</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* 2-column layout: player + playlist side by side */
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            {/* Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {activeCategory}
                </span>
                <h2 className="font-display text-2xl font-bold mt-2">{activeTrackName}</h2>
                {currentTrack?.description && (
                  <p className="text-xs text-muted-foreground italic mt-1.5">{currentTrack.description}</p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                    {/* Waveform Seek Bar */}
                    <div className="mb-4">
                      {audioSrc && (() => {
                        const isCategoryPlaying = playingCategoryRef.current === activeCategory;
                        return (
                          <WaveformSeekBar
                            src={audioSrc}
                            currentTime={isCategoryPlaying ? currentTime : 0}
                            duration={isCategoryPlaying ? duration : 0}
                            onSeek={seek}
                          />
                        );
                      })()}
                    </div>

                    {/* Time + Transport */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {formatTime(playingCategoryRef.current === activeCategory ? currentTime : 0)}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {formatTime(playingCategoryRef.current === activeCategory ? duration : 0)}
                        </span>
                      </div>

                      {/* Transport Controls + Volume */}
                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => {
                            if (currentTrackIndex > 0) {
                              playTrack(currentTrackIndex - 1);
                            }
                          }}
                          aria-label="Previous track"
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <SkipBack className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={handleTogglePlay}
                          aria-label={isPortfolioPlaying ? "Pause" : "Play"}
                          className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          {isPortfolioPlaying ? (
                            <Pause className="w-6 h-6 fill-current" />
                          ) : (
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          )}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => {
                            if (currentTrackIndex < shuffledTracks.length - 1) {
                              playTrack(currentTrackIndex + 1);
                            }
                          }}
                          aria-label="Next track"
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <SkipForward className="w-5 h-5" />
                        </motion.button>

                        <div className="w-px h-5 bg-white/10 mx-1" />

                        <div className="flex items-center gap-2">
                          <motion.button whileTap={{ scale: 0.85 }} onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="p-1">
                            {isMuted ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </motion.button>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 cursor-pointer"
                            style={{ "--progress": `${(isMuted ? 0 : volume) * 100}%` } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    </div>
              </motion.div>
            </motion.div>

            {/* Playlist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel rounded-2xl p-4 lg:self-start"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                Playlist
              </h3>
              <div className="space-y-1 max-h-64 lg:max-h-[400px] overflow-y-auto">
                {shuffledTracks.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => playTrack(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      ctxTrackName === track.title && isCategoryPlaying
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <span className="text-sm">{track.title}</span>
                    {track.isPersonalWork && (
                      <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        personal work
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </section>

      <AnimatePresence>
        {showTCG && (
          <Suspense fallback={null}>
            <TCGSoundboard onClose={() => setShowTCG(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
