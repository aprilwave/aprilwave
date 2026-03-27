import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Play, Pause, ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock data
const categories = ["All", "Game Audio", "Film Score", "Sound Design", "Composition"];

const portfolioItems = [
  {
    id: 1,
    title: "Neon Horizon",
    category: "Game Audio",
    description: "Cyberpunk-inspired dynamic combat soundtrack.",
    image: "audio-1.png",
    color: "from-blue-400 to-purple-400"
  },
  {
    id: 2,
    title: "Whispers of the Forest",
    category: "Film Score",
    description: "Orchestral piece for an indie animated short.",
    image: "audio-2.png",
    color: "from-emerald-400 to-teal-500"
  },
  {
    id: 3,
    title: "UI Click Interface pack",
    category: "Sound Design",
    description: "Modern, snappy interface sounds for mobile apps.",
    image: "audio-3.png",
    color: "from-rose-400 to-orange-400"
  },
  {
    id: 4,
    title: "Stardust Lullaby",
    category: "Composition",
    description: "Ambient electronic track featuring analog synths.",
    image: "audio-4.png",
    color: "from-indigo-400 to-cyan-400"
  },
  {
    id: 5,
    title: "Abyssal Descent",
    category: "Game Audio",
    description: "Eerie atmospheric soundscapes for a horror title.",
    image: "audio-1.png",
    color: "from-slate-600 to-slate-800"
  },
  {
    id: 6,
    title: "The Final Stand",
    category: "Film Score",
    description: "Epic brass and percussion heavy trailer music.",
    image: "audio-2.png",
    color: "from-red-500 to-rose-700"
  }
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [playingId, setPlayingId] = useState<number | null>(null);

  const filteredItems = activeCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <Layout>
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-5xl font-bold mb-4"
          >
            Selected <span className="text-gradient">Works</span>
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

        {/* Filters */}
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
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === cat 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "glass-panel hover:bg-white/80 text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              {/* Image Header */}
              <div className="relative h-56 w-full overflow-hidden bg-muted">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={`${import.meta.env.BASE_URL}images/${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => setPlayingId(playingId === item.id ? null : item.id)}
                    className="w-16 h-16 rounded-full bg-white/90 backdrop-blur text-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    {playingId === item.id ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                  </button>
                </div>

                {/* Category Tag */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-md text-foreground shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm flex-1">
                  {item.description}
                </p>
                
                {/* Simulated Audio Waveform visualization */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex gap-1 items-end h-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={playingId === item.id ? {
                          height: ["20%", "100%", "40%", "80%", "20%"]
                        } : {
                          height: "20%"
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                        className={cn("w-1.5 rounded-full", `bg-gradient-to-t ${item.color}`)}
                        style={{ height: "20%" }}
                      />
                    ))}
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </section>
    </Layout>
  );
}
