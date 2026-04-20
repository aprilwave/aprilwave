// import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Play, Pause, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useAudio } from "@/context/AudioContext";

const categories = [
  "All",
  "Game/Film Compositions",
  "Music",
  "Game Audio/Sound Design",
  "Synth Sound Design",
];

const portfolioItems = [
  {
    id: 1,
    title: "Neon Horizons",
    description: "Cyberpunk-inspired dynamic combat soundtrack.",
    tags: ["Game/Film Compositions", "Synth Sound Design"],
    image: "audio-1.png",
    color: "from-primary/80 to-primary",
    waveform: [
      35, 55, 40, 70, 50, 85, 45, 60, 75, 40, 55, 65, 50, 80, 45, 60, 70, 55,
      40, 65,
    ],
  },
  {
    id: 2,
    title: "Whispers of the Forest",
    description: "Orchestral piece for an indie animated short.",
    tags: ["Game/Film Compositions", "Music"],
    image: "audio-2.png",
    color: "from-secondary/80 to-secondary",
    waveform: [
      45, 60, 35, 50, 70, 55, 40, 65, 75, 50, 45, 60, 55, 70, 40, 55, 65, 50,
      35, 60,
    ],
  },
  {
    id: 3,
    title: "UI Click Interface Pack",
    description: "Modern, snappy interface sounds for mobile apps.",
    tags: ["Game Audio/Sound Design"],
    image: "audio-3.png",
    color: "from-accent/80 to-accent",
    waveform: [
      30, 45, 60, 40, 55, 70, 50, 40, 55, 65, 45, 35, 50, 60, 40, 55, 70, 50,
      45, 60,
    ],
  },
  {
    id: 4,
    title: "Stardust Lullaby",
    description: "Ambient electronic track featuring analog synths.",
    tags: ["Music", "Synth Sound Design"],
    image: "audio-4.png",
    color: "from-secondary/60 to-secondary/90",
    waveform: [
      50, 65, 40, 55, 75, 60, 45, 70, 55, 40, 60, 50, 45, 65, 55, 40, 70, 60,
      50, 55,
    ],
  },
  {
    id: 5,
    title: "Abyssal Descent",
    description: "Eerie atmospheric soundscapes for a horror title.",
    tags: ["Game Audio/Sound Design", "Synth Sound Design"],
    image: "audio-1.png",
    color: "from-slate-500/60 to-slate-700/80",
    waveform: [
      60, 45, 35, 55, 70, 50, 40, 65, 55, 45, 60, 50, 40, 55, 70, 45, 35, 60,
      55, 50,
    ],
  },
  {
    id: 6,
    title: "The Final Stand",
    description: "Epic brass and percussion heavy trailer music.",
    tags: ["Game/Film Compositions", "Music"],
    image: "audio-2.png",
    color: "from-primary to-primary/70",
    waveform: [
      40, 55, 70, 60, 45, 75, 55, 50, 65, 45, 60, 70, 50, 40, 65, 55, 45, 60,
      70, 55,
    ],
  },
  {
    id: 7,
    title: "Crystal Caves",
    description: "Ethereal ambient textures for exploration games.",
    tags: ["Synth Sound Design", "Game Audio/Sound Design"],
    image: "audio-4.png",
    color: "from-secondary/70 to-secondary/40",
    waveform: [
      45, 50, 35, 45, 60, 55, 40, 50, 65, 50, 40, 55, 45, 60, 50, 35, 55, 45,
      40, 50,
    ],
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playingId, setPlayingId] = useState<number | null>(null);
  const { setCurrentTrack } = useAudio();

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.tags.includes(activeCategory));

  const handlePlay = (id: number, title: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setCurrentTrack(title);
    }
  };

  return (
    <>
        {/* Soft dark blur overlay ON TOP of GlowLine - more visible */}
      <div className="fixed inset-0 pointer-events-none -z-5 bg-background/40 blur-lg" />

      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold mb-4 view-transition-portfolio-header"
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

        {/* Glassmorphic Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 glass-panel active:scale-95 active:duration-150 ${
                activeCategory === cat
                  ? "bg-white/10 text-foreground shadow-lg"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Vertical SoundCloud-style List */}
        <div className="max-w-2xl mx-auto space-y-4">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="group glass-panel rounded-2xl p-4 hover:bg-white/[0.08] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={`${import.meta.env.BASE_URL}images/${item.image}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handlePlay(item.id, item.title)}
                    className="absolute inset-0 flex items-center justify-center bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
                  >
                    {playingId === item.id ? (
                      <Pause className="w-6 h-6 text-white fill-current" />
                    ) : (
                      <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Waveform + Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {/* Row 1: Title */}
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {item.title}
                  </h3>

                  {/* Row 2: Waveform + Play */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-end gap-0.5 h-5 flex-1 min-w-0">
                      {item.waveform.map((height, i) => (
                        <motion.div
                          key={i}
                          animate={
                            playingId === item.id
                              ? {
                                  height: [
                                    "20%",
                                    `${height}%`,
                                    "30%",
                                    `${height - 10}%`,
                                    "20%",
                                  ],
                                }
                              : { height: "20%" }
                          }
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            delay: i * 0.08,
                            ease: "easeInOut",
                          }}
                          className={`flex-1 rounded-sm bg-gradient-to-t ${item.color}`}
                          style={{ minWidth: 2 }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => handlePlay(item.id, item.title)}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all duration-200"
                    >
                      {playingId === item.id ? (
                        <Pause className="w-4 h-4 text-foreground fill-current" />
                      ) : (
                        <Play className="w-4 h-4 text-foreground fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Row 3: Description */}
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
