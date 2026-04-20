import { useEffect, useRef } from "react";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };

    function rafLoop() {
      if (glowRef.current) {
        glowRef.current.style.left = `${targetRef.current.x}px`;
        glowRef.current.style.top = `${targetRef.current.y}px`;
        glowRef.current.style.opacity = "1";
      }
      rafRef.current = requestAnimationFrame(rafLoop);
    }

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    rafRef.current = requestAnimationFrame(rafLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-[30] opacity-0"
      style={{
        width: "300px",
        height: "250px",
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle, hsl(var(--primary) / 0.35) 0%, hsl(var(--accent) / 0.25) 30%, hsl(var(--secondary) / 0.15) 50%, transparent 70%)",
        borderRadius: "50%",
        transition: "opacity 0.4s ease",
        willChange: "left, top",
        mixBlendMode: "soft-light",
      }}
    />
  );
}
