import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
];

export function Navbar() {
  const [location, navigate] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroPast, setHeroPast] = useState(false);

  // Single indicator measured from the nav container — guarantees horizontal-only motion
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const isContact = location === "/contact";

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHeroPast(y > window.innerHeight * 0.38);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Measure the active nav link and position the indicator
  useEffect(() => {
    if (!navRef.current || isContact) {
      setIndicator(null);
      return;
    }
    const activeEl = navRef.current.querySelector<HTMLElement>(`[data-navhref="${location}"]`);
    if (activeEl) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setIndicator({ left: elRect.left - navRect.left, width: elRect.width });
    }
  }, [location, isContact]);

  const logoVisible = location !== "/" || heroPast;

  function handleAboutClick(e: React.MouseEvent) {
    if (location === "/") {
      e.preventDefault();
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    } else {
      e.preventDefault();
      navigate("/");
      setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    }
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled ? "py-3 glass-panel" : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="font-brand font-bold text-lg tracking-wider group" aria-label="Aprilwave home">
          <motion.span
            animate={{ opacity: logoVisible ? 1 : 0, y: logoVisible ? 0 : -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ display: "inline-block" }}
          >
            <span className="text-gradient">Aprilwave</span>
          </motion.span>
        </Link>

        {/* Desktop Nav */}
        <div ref={navRef} className="hidden md:flex items-center gap-8 relative">
          {links.map((link) => {
            const isActive = location === link.href && !isContact;
            const isAbout = link.label === "About";
            return (
              <Link
                key={link.href}
                href={link.href}
                data-navhref={link.href}
                onClick={isAbout ? handleAboutClick : undefined}
                className={cn(
                  "relative font-medium text-sm transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Single shared indicator — slides purely horizontally between links */}
          <AnimatePresence>
            {indicator && !isContact && (
              <motion.div
                className="absolute -bottom-1 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full pointer-events-none"
                initial={false}
                animate={{ left: indicator.left, width: indicator.width }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
          </AnimatePresence>

          {/* Let's Talk */}
          <Link
            href="/contact"
            className={cn(
              "relative px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
              isContact
                ? "text-white shadow-primary/30"
                : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <AnimatePresence>
              {isContact && (
                <motion.span
                  key="contact-fill"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-secondary"
                />
              )}
            </AnimatePresence>
            <span className="relative z-10">Let's Talk</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border p-6 shadow-xl md:hidden flex flex-col gap-6"
          >
            {links.map((link) => {
              const isAbout = link.label === "About";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={isAbout ? handleAboutClick : undefined}
                  className={cn(
                    "font-display text-2xl font-medium",
                    location === link.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link href="/contact" className="font-display text-2xl font-medium text-foreground">
              Let's Talk
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
