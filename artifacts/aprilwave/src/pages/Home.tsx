import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { ArrowRight, Play, AudioWaveform, Star } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Mesh */}
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Abstract pastel background" 
            className="w-full h-full object-cover opacity-20 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium mb-8 text-foreground/80"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Available for exciting new projects
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 text-foreground/90"
          >
            Aprilwave
          </motion.h2>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 text-foreground"
          >
            I shape <span className="text-gradient">silence</span> <br/>
            into sound.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Music Producer | Composer | Game Audio | Sound Design
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              href="/portfolio" 
              className="px-8 py-4 rounded-full bg-foreground text-background font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-xl hover:shadow-primary/30 hover:-translate-y-1 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Explore My Work
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 rounded-full glass-panel font-medium hover:bg-white/60 transition-all duration-300 flex items-center gap-2 group text-foreground"
            >
              Contact Me
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 relative bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Image Column */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] blur-xl z-0" />
              <div className="relative z-10 rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-white aspect-square max-w-md mx-auto">
                <img 
                  src={`${import.meta.env.BASE_URL}images/profile.png`} 
                  alt="Aprilwave in the studio" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-10 -right-4 glass-panel p-4 rounded-2xl z-20 flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center text-secondary-foreground">
                  <AudioWaveform className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">10+ Years</p>
                  <p className="text-xs text-muted-foreground">Sonic Experience</p>
                </div>
              </div>
            </motion.div>

            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Hi, I'm <span className="text-primary">Aprilwave</span>.
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  I'm a versatile music producer, composer, and sound designer based in the ether. I specialize in crafting immersive soundscapes, dynamic game audio, and emotive original compositions that elevate the medium they accompany.
                </p>
                <p>
                  With a deep love for both analog synthesizers and modern digital manipulation, my work bridges the gap between organic textures and futuristic tones. Whether it's an indie game needing a unique sonic identity or a short film requiring a delicate orchestral score, I approach every project with meticulous attention to detail.
                </p>
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Star className="w-6 h-6 text-secondary mb-3" />
                  <h4 className="font-bold text-foreground">Original Score</h4>
                  <p className="text-sm text-muted-foreground">Tailor-made musical compositions for visual media.</p>
                </div>
                <div className="space-y-2">
                  <AudioWaveform className="w-6 h-6 text-primary mb-3" />
                  <h4 className="font-bold text-foreground">Sound Design</h4>
                  <p className="text-sm text-muted-foreground">Foley, UI sounds, and atmospheric environments.</p>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>
    </Layout>
  );
}
