import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Info, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/context/AudioContext";

interface Track {
  id: string;
  title: string;
  file: string;
  isPersonalWork?: boolean;
}

const categories = [
  {
    name: "Music",
    folder: "music",
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
      { id: "14", title: "Covex Younger (Remix)", file: "covex-younger-remix.mp3", isPersonalWork: true },
      { id: "15", title: "KUCKA No Good (Remix)", file: "kucka-no-good-remix.mp3", isPersonalWork: true },
      { id: "16", title: "NIKI Plot Twist (Remix)", file: "niki-plot-twist-remix.mp3", isPersonalWork: true },
    ],
  },
  {
    name: "Game/Film Compositions",
    folder: "game-film",
    tracks: [],
  },
  {
    name: "Game Audio/Sound Design",
    folder: "game-audio",
    tracks: [],
  },
  {
    name: "Synth Sound Design",
    folder: "synth",
    tracks: [],
  },
];

const BAR_COUNT = 20;
const MIN_BIN = 2;
const MAX_BIN = 80;

function getLogarithmicBins(freqData: Uint8Array, barCount: number): number[] {
  const logMin = Math.log(MIN_BIN);
  const logMax = Math.log(MAX_BIN);
  const logRange = logMax - logMin;
  const bars: number[] = [];
  for (let i = 0; i < barCount; i++) {
    const t = i / barCount;
    const logIdx = logMin + t * logRange;
    const binIdx = Math.round(Math.exp(logIdx));
    const safeIdx = Math.min(binIdx, freqData.length - 1);
    bars.push(freqData[safeIdx] / 255);
  }
  return bars;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Music");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState<Track[]>([]);
  const [spectrumData, setSpectrumData] = useState<number[]>([]);
  const infoRef = useRef<HTMLDivElement>(null);
  const infoButtonRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);

  const {
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    getFrequencyData,
    isPlaying: ctxIsPlaying,
    playSource,
    volume,
    currentTime,
    duration,
    currentTrack: ctxTrackName,
  } = useAudio();

  const activeCatData = categories.find((c) => c.name === activeCategory) || categories[0];
  const hasTracks = activeCatData.tracks.length > 0;
  const isPortfolioPlaying = playSource === "portfolio" && ctxIsPlaying;
  const currentTrack = shuffledTracks[currentTrackIndex];
  const activeTrackName = isPortfolioPlaying ? ctxTrackName : currentTrack?.title;

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

  useEffect(() => {
    if (hasTracks) {
      setShuffledTracks(shuffleArray(activeCatData.tracks));
      setCurrentTrackIndex(0);
      currentIndexRef.current = 0;
    }
  }, [activeCategory, hasTracks]);

  useEffect(() => {
    if (!isPortfolioPlaying) {
      setSpectrumData([]);
      return;
    }
    let raf = 0;
    const loop = () => {
      const freqData = getFrequencyData();
      const bars = getLogarithmicBins(freqData, BAR_COUNT);
      setSpectrumData(bars);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isPortfolioPlaying, getFrequencyData]);

  const handleTogglePlay = async () => {
    if (!currentTrack) return;
    if (isPortfolioPlaying) {
      pause();
    } else {
      const src = `${import.meta.env.BASE_URL}audio/${activeCatData.folder}/${currentTrack.file}`;
      await play(src, "portfolio", currentTrack.title, () => handleTrackEnded());
    }
  };

  const handleTrackEnded = () => {
    const next = (currentIndexRef.current + 1) % shuffledTracks.length;
    playTrack(next);
  };

  const playTrack = async (index: number) => {
    currentIndexRef.current = index;
    setCurrentTrackIndex(index);
    const track = shuffledTracks[index];
    if (!track) return;
    const src = `${import.meta.env.BASE_URL}audio/${activeCatData.folder}/${track.file}`;
    await play(src, "portfolio", track.title, () => handleTrackEnded());
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
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
      setVolume(0);
    } else {
      setVolume(volume > 0 ? volume : 0.75);
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

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full relative z-10">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 glass-panel active:scale-95 active:duration-150 ${
                activeCategory === cat.name
                  ? "bg-white/10 text-foreground shadow-lg"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div ref={infoRef} className="relative flex items-center">
            <button
              ref={infoButtonRef}
              onClick={() => setShowInfo(!showInfo)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 glass-panel active:scale-95 active:duration-150 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              <Info className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-full ml-3 top-0 z-50 p-4 rounded-2xl glass-panel w-[500px]"
                >
                  <p className="text-sm text-muted-foreground italic">
                    The following audio samples are snippets from previously done works. Due to NDAs and similar agreements, the length is purposely kept short. If you are one of my previous clients finding this content and would like any of your samples removed, please feel free to reach out.
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
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">No audio files in this category yet.</p>
            <p className="text-muted-foreground/60 text-sm mt-2">Check back soon for updates.</p>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
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
              </div>

              <div className="flex items-end justify-center gap-1 h-16 mb-6">
                {spectrumData.length > 0
                  ? spectrumData.map((height, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: `${Math.max(5, height * 100)}%` }}
                        transition={{ duration: 0.08, ease: "easeOut" }}
                        className="flex-1 rounded-sm bg-gradient-to-t from-primary to-primary"
                        style={{ minWidth: 3 }}
                      />
                    ))
                  : Array.from({ length: BAR_COUNT }, (_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: "15%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.04,
                          ease: "easeInOut",
                        }}
                        className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-primary/20"
                        style={{ minWidth: 3 }}
                      />
                    ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 accent-primary cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground w-10">
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      if (currentTrackIndex > 0) {
                        playTrack(currentTrackIndex - 1);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleTogglePlay}
                    className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {isPortfolioPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (currentTrackIndex < shuffledTracks.length - 1) {
                        playTrack(currentTrackIndex + 1);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button onClick={toggleMute} className="p-1">
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel rounded-2xl p-4"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-2">
                Playlist
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {shuffledTracks.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => playTrack(index)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      ctxTrackName === track.title
                        ? "bg-white/10 text-foreground"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <span className="text-sm">{track.title}</span>
                    {track.isPersonalWork && (
                      <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary/80">
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
    </>
  );
}