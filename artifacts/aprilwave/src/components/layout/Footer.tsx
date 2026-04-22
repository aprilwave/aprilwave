import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 pt-20 pb-10 px-6 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top row — asymmetric split */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-20">
          {/* Left: Large brand statement */}
          <div className="max-w-md">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
              Let's make something that{" "}
              <span className="text-primary">resonates</span>.
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Crafting sonic landscapes, game audio, and original compositions
              that evoke emotion and tell stories.
            </p>
          </div>

          {/* Right: Sparse navigation + socials as text */}
          <div className="flex flex-col items-start md:items-end gap-6">
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/portfolio"
                className="hover:text-foreground transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              Find me on{" "}
              <a
                href="https://instagram.com/aprilwave.sound"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors underline underline-offset-4"
              >
                Instagram
              </a>
              ,{" "}
              <a
                href="https://soundcloud.com/aprilwave"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-secondary transition-colors underline underline-offset-4"
              >
                SoundCloud
              </a>
              , and{" "}
              <a
                href="https://discord.gg/aprilwave"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-colors underline underline-offset-4"
              >
                Discord
              </a>
              .
            </p>
          </div>
        </div>

        {/* Bottom row — minimal copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground font-medium tracking-wide">
            © {new Date().getFullYear()} Aprilwave
          </p>
          <p className="text-xs text-muted-foreground">
            All rights reserved. Made with obsession.
          </p>
        </div>
      </div>
    </footer>
  );
}
