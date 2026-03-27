import { useEffect, useRef } from "react";

export function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      glowRef.current.style.left = `${e.clientX}px`;
      glowRef.current.style.top = `${e.clientY}px`;
      glowRef.current.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-0 opacity-0"
      style={{
        width: "700px",
        height: "700px",
        transform: "translate(-50%, -50%)",
        background:
          "radial-gradient(circle, hsl(var(--primary) / 0.10) 0%, hsl(var(--secondary) / 0.07) 35%, transparent 70%)",
        borderRadius: "50%",
        transition: "opacity 0.4s ease",
        willChange: "left, top",
      }}
    />
  );
}
