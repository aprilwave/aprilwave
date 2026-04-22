import { useEffect, useRef } from "react";

const BLOBS = [
  { hue: 221, s: 70, l: 70, size: 600, x: "15%", y: "30%", speed: 0.00011, phase: 0 },
  { hue: 25, s: 65, l: 72, size: 500, x: "75%", y: "60%", speed: 0.00014, phase: 2.1 },
  { hue: 35, s: 60, l: 78, size: 400, x: "50%", y: "80%", speed: 0.00009, phase: 4.3 },
];

export function AmbientBlobs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const blobs = containerRef.current?.querySelectorAll<HTMLDivElement>(".ambient-blob");
    if (!blobs) return;

    let start: number | null = null;
    function frame(ts: number) {
      if (start === null) start = ts;
      const t = ts - start;

      blobs.forEach((blob, i) => {
        const config = BLOBS[i];
        const dx = Math.sin(t * config.speed + config.phase) * 8;
        const dy = Math.cos(t * config.speed * 0.7 + config.phase) * 6;
        const scale = 1 + Math.sin(t * config.speed * 0.5 + config.phase) * 0.08;

        blob.style.transform = `translate(${dx}%, ${dy}%) scale(${scale})`;
      });

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-[5]"
      aria-hidden="true"
    >
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="ambient-blob absolute rounded-full"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            marginLeft: -blob.size / 2,
            marginTop: -blob.size / 2,
            background: `radial-gradient(circle, hsl(${blob.hue} ${blob.s}% ${blob.l}% / 0.04) 0%, transparent 70%)`,
            filter: "blur(80px)",
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
