import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MouseGlow } from "@/components/MouseGlow";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { MusicOrb } from "@/components/MusicOrb";
import { AudioProvider } from "@/context/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  // Scroll to top on every page change — delayed by one frame so
  // framer-motion can snapshot element positions before the page moves
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "instant" })
    );
    return () => cancelAnimationFrame(id);
  }, [location]);

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col relative selection:bg-primary selection:text-primary-foreground">
        <BackgroundMusic />
        <MouseGlow />
        <Navbar />
        <MusicOrb />
        <main className="flex-1 w-full relative z-10">
          {children}
        </main>
        <Footer />
      </div>
    </AudioProvider>
  );
}
