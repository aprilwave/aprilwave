import { motion } from "framer-motion";
import { ArrowRight, Play, AudioWaveform, Star } from "lucide-react";
import { Link } from "wouter";
import { PlayAmbience } from "@/components/PlayAmbience";

// Cinematic entrance variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Home() {
  return (
    <>
      {/* Combined Hero + About Section — seamless single page */}
      <section className="relative min-h-screen">
        {/* Subtle dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-transparent pointer-events-none z-10" />

        {/* Bridge fade: gradient from hero into about */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[40rem] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 50%, hsl(260 8% 16% / 0.05) 70%, hsl(260 8% 16% / 0.1) 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
          {/* Hero Content - positioned at top */}
          <div className="pt-48 pb-32 md:pt-64 md:pb-44">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-4xl">
                <motion.h1
                  variants={fadeUp}
                  className="font-brand text-primary text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem] font-extrabold tracking-tighter leading-[0.85] mb-8"
                >
                  Aprilwave
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="text-sm md:text-base text-foreground/70 mb-10 leading-relaxed tracking-wide max-w-lg"
                >
                  Music Producer · Composer · Game Audio · Sound Design
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap items-center gap-4 mb-12"
                >
                  <span className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium text-foreground/80 overflow-hidden">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/15 to-primary/0 animate-shimmer" />
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="relative">Available for new projects</span>
                  </span>
                  <PlayAmbience />
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className="flex flex-col sm:flex-row items-start gap-5"
                >
                  <motion.div variants={fadeRight}>
                    <Link
                      href="/contact"
                      className="px-8 py-4 rounded-full bg-foreground text-background font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-xl hover:shadow-primary/30 hover:-translate-y-1 flex items-center gap-2"
                    >
                      Contact Me
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                  <motion.div variants={fadeLeft}>
                    <Link
                      href="/portfolio"
                      className="px-8 py-4 rounded-full glass-panel font-medium hover:bg-white/60 transition-all duration-300 flex items-center gap-2 group text-foreground"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Explore My Work
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* About Content - flows seamlessly below hero */}
          <div id="about" className="pt-64 pb-28 md:pt-96 md:pb-36">
            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
              {/* Image Column */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="absolute -inset-8 bg-gradient-to-tr from-primary/8 to-secondary/15 blur-3xl z-0 pointer-events-none" />

                <div
                  className="relative z-10 overflow-hidden shadow-2xl max-w-md mx-auto md:mx-0 md:ml-auto"
                  style={{
                    borderRadius: "60% 40% 55% 45% / 40% 55% 45% 60%",
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/profile.png`}
                    alt="Aprilwave in the studio"
                    className="w-full h-full object-cover object-center"
                    decoding="async"
                  />
                </div>

                <div className="absolute -bottom-3 -right-3 md:right-auto md:left-8 glass-panel px-5 py-3 rounded-full z-20 flex items-center gap-3">
                  <AudioWaveform className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold tracking-wide text-foreground">
                    10+ Years of Sonic Experience
                  </span>
                </div>
              </motion.div>

              {/* Text Column */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-foreground leading-tight">
                  Hi, I'm{" "}
                  <span className="text-primary">Aprilwave</span>.
                </h2>
                <div className="space-y-6 text-lg text-foreground/70 leading-relaxed max-w-prose">
                  <p>
                    I'm a versatile music producer, composer, and sound designer
                    based in the ether. I specialize in crafting immersive
                    soundscapes, dynamic game audio, and emotive original
                    compositions that elevate the medium they accompany.
                  </p>
                  <p>
                    With a deep love for both analog synthesizers and modern
                    digital manipulation, my work bridges the gap between organic
                    textures and futuristic tones. Whether it's an indie game
                    needing a unique sonic identity or a short film requiring a
                    delicate orchestral score, I approach every project with
                    meticulous attention to detail.
                  </p>
                </div>

                <div className="mt-14 grid grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                  >
                    <Star className="w-5 h-5 text-secondary mb-1" />
                    <h4 className="font-bold text-foreground text-sm tracking-wide uppercase">
                      Original Score
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Tailor-made musical compositions for visual media.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <AudioWaveform className="w-5 h-5 text-primary mb-1" />
                    <h4 className="font-bold text-foreground text-sm tracking-wide uppercase">
                      Sound Design
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Foley, UI sounds, and atmospheric environments.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
