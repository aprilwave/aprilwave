import { Link } from "wouter";
import { Waves, Disc3, Headphones, Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 pt-16 pb-8 px-6 overflow-hidden relative">
      {/* Decorative blurred blobs */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20">
          <Waves className="w-6 h-6" />
        </div>
        
        <h3 className="font-display text-2xl font-bold mb-2">Aprilwave</h3>
        <p className="text-muted-foreground max-w-sm mb-8">
          Crafting sonic landscapes, game audio, and original compositions that evoke emotion and tell stories.
        </p>
        
        <div className="flex items-center gap-6 mb-12">
          <a href="#" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:shadow-md transition-all">
            <Disc3 className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-secondary hover:border-secondary hover:shadow-md transition-all">
            <Headphones className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent hover:shadow-md transition-all">
            <Music className="w-5 h-5" />
          </a>
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-muted-foreground mb-12">
          <Link href="/" className="hover:text-foreground transition-colors">About</Link>
          <Link href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
        
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
        
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Aprilwave. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
