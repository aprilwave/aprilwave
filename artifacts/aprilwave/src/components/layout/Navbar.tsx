import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
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

  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    radius: number;
    opacity: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 2,
    radius: 9999,
    opacity: 0,
  });

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

  // Precise measurement for all navigation positions
  useLayoutEffect(() => {
    if (!navRef.current) return;

    // Use a slight timeout to ensure DOM has settled, but since we're in useLayoutEffect,
    // we mostly rely on the direct DOM measurement.
    const updateIndicator = () => {
      if (!navRef.current) return;

      let targetEl: HTMLElement | null = null;
      if (isContact) {
        targetEl =
          navRef.current.querySelector<HTMLElement>('a[href="/contact"]');
      } else {
        targetEl = navRef.current.querySelector<HTMLElement>(
          `a[data-navhref="${location}"]`,
        );
      }

      if (targetEl) {
        const navRect = navRef.current.getBoundingClientRect();
        const elRect = targetEl.getBoundingClientRect();

        const left = elRect.left - navRect.left;
        const width = elRect.width;
        const top = elRect.top - navRect.top;

        if (isContact) {
          // Pill shape: fills the button perfectly
          setIndicator({
            left,
            top,
            width,
            height: elRect.height,
            radius: 9999,
            opacity: 1,
          });
        } else {
          // Underline shape: 2px bar, 4px below the text
          setIndicator({
            left,
            top: top + elRect.height + 4,
            width,
            height: 2,
            radius: 9999,
            opacity: 1,
          });
        }
      } else {
        // Only hide if we really can't find the target
        setIndicator((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();

    // Also re-measure on window resize to keep it pinned
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [location, isContact]);

  const logoVisible = location !== "/" || heroPast;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled ? "py-3 glass-panel !fixed" : "py-5 bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-brand font-bold text-lg tracking-wider group"
          aria-label="Aprilwave home"
        >
          <motion.span
            animate={{ opacity: logoVisible ? 1 : 0, y: logoVisible ? 0 : -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ display: "inline-block" }}
          >
            <span className="text-primary">Aprilwave</span>
          </motion.span>
        </Link>

        {/* Desktop Nav */}
        <div
          ref={navRef}
          className="hidden md:flex items-center gap-8 relative py-2"
        >
          {/* Shared Moving Indicator Component */}
          <motion.div
            className="absolute bg-gradient-to-r from-primary via-accent to-secondary pointer-events-none z-0"
            animate={{
              left: indicator.left,
              top: indicator.top,
              width: indicator.width,
              height: indicator.height,
              borderRadius: indicator.radius,
              opacity: indicator.opacity,
            }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.5,
            }}
          />

          {links.map((link) => {
            const isActive = location === link.href && !isContact;
            return (
              <Link
                key={link.href}
                href={link.href}
                data-navhref={link.href}
                className={cn(
                  "relative z-10 py-1 font-medium text-sm transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Let's Talk Button */}
          <Link
            href="/contact"
            className={cn(
              "relative z-10 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
              isContact
                ? "text-white shadow-primary/30"
                : "bg-foreground text-background hover:bg-primary/10 hover:text-primary",
            )}
          >
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
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-display text-2xl font-medium",
                    location === link.href ? "text-primary" : "text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="font-display text-2xl font-medium text-foreground"
            >
              Let's Talk
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
