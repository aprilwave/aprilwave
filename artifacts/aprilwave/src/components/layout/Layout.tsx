import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlowLine } from "@/components/GlowLine";
import { MouseGlow } from "@/components/MouseGlow";
import { MusicOrb } from "@/components/MusicOrb";
import { AudioProvider } from "@/context/AudioContext";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "instant" }),
    );
    return () => cancelAnimationFrame(id);
  }, [location]);

  return (
    <AudioProvider>
      <div className="min-h-screen flex flex-col relative selection-bg-primary selection:text-primary-foreground">
        <GlowLine />
        <MouseGlow />
        <Navbar />
        <MusicOrb />
        <main className="flex-1 w-full relative z-10">{children}</main>
        <Footer />
      </div>
    </AudioProvider>
  );
}
