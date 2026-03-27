import { useEffect, useRef } from "react";

const TOTAL_W = 3200;
const H = 200;
const MID = H / 2;

// Wavelengths must divide evenly into TOTAL_W/2 (1600) for seamless loop.
// Valid divisors: 1600, 800, 400, 320, 200, 160...
const WL1 = 400;
const WL2 = 320;
const WL3 = 800;

function buildPath(amplitude: number, wavelength: number, phase: number): string {
  let d = "";
  for (let x = 0; x <= TOTAL_W; x += 10) {
    const y = MID + amplitude * Math.sin((x / wavelength) * Math.PI * 2 + phase);
    d += x === 0 ? `M${x},${y.toFixed(2)}` : `L${x},${y.toFixed(2)}`;
  }
  return d;
}

export function WaveformBG() {
  const path1 = useRef<SVGPathElement>(null);
  const path2 = useRef<SVGPathElement>(null);
  const path3 = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let startTime: number | null = null;

    function frame(ts: number) {
      if (startTime === null) startTime = ts;
      const t = ts - startTime;

      // Only vary amplitude — wavelengths stay fixed to keep loop seamless
      const amp1 = 55 + 13 * Math.sin(t * 0.00038);
      const amp2 = 32 + 9  * Math.sin(t * 0.00051 + 1.1);
      const amp3 = 70 + 15 * Math.sin(t * 0.00042 + 0.7);

      if (path1.current) path1.current.setAttribute("d", buildPath(amp1, WL1, 0));
      if (path2.current) path2.current.setAttribute("d", buildPath(amp2, WL2, 1.8));
      if (path3.current) path3.current.setAttribute("d", buildPath(amp3, WL3, 0.9));

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none"
      style={{ height: H }}
    >
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: TOTAL_W,
          height: H,
          animation: "wave-scroll 18s linear infinite",
        }}
        viewBox={`0 0 ${TOTAL_W} ${H}`}
      >
        <path ref={path1} fill="none" stroke="hsl(var(--primary))"   strokeWidth="3"   opacity="0.10" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={path2} fill="none" stroke="hsl(var(--secondary))" strokeWidth="2.5" opacity="0.08" strokeLinecap="round" strokeLinejoin="round" />
        <path ref={path3} fill="none" stroke="hsl(var(--accent))"    strokeWidth="2"   opacity="0.07" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
