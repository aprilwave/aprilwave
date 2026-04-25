import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlowLine } from "@/components/GlowLine";
import { MusicOrb } from "@/components/MusicOrb";
import { AmbientBlobs } from "@/components/AmbientBlobs";
import { AudioProvider } from "@/context/AudioContext";
import { GlobalShortcuts } from "./GlobalShortcuts";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <AudioProvider>
      <GlobalShortcuts />
      <div className="min-h-screen flex flex-col relative selection:bg-primary selection:text-primary-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <GlowLine />
        <AmbientBlobs />

        <Navbar />
        <MusicOrb />
        <main id="main-content" className="flex-1 w-full relative z-10">
          {children}
        </main>
        <Footer />
      </div>
    </AudioProvider>
  );
}
