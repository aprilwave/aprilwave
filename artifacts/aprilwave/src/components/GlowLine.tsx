import { useEffect, useRef } from "react";

const VW = 1440;
const VH = 600;

const RANDOM_PHASE_OFFSET = Math.random() * 10000;

const BASE_ANCHORS = [
  { x: 0, y: 0.56 },
  { x: 0.18, y: 0.52 },
  { x: 0.36, y: 0.6 },
  { x: 0.54, y: 0.55 },
  { x: 0.72, y: 0.61 },
  { x: 0.9, y: 0.54 },
  { x: 1.0, y: 0.58 },
];

function buildPath(anchors: { x: number; y: number }[], t: number): string {
  const pts = anchors.map((a, i) => ({
    x: a.x * VW,
    y:
      a.y * VH +
      Math.sin(t * 0.00028 + i * 1.1) * 18 +
      Math.sin(t * 0.00051 + i * 2.3) * 8,
  }));

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5;
    const cp1y = pts[i].y;
    const cp2x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5;
    const cp2y = pts[i + 1].y;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

// Palette: only the 3 brand hues. Bridges are lighter/darker variants of the same hue.
// Peach softened to match new primary (less saturated, slightly lighter)
const PALETTE = [
  { h: 221, s: 83, l: 82 },  // 0  blue anchor
  { h: 221, s: 83, l: 82 },  // 1  blue
  { h: 221, s: 65, l: 86 },  // 2  soft blue bridge (still hue 221)
  { h: 25,  s: 72, l: 80 },  // 3  peach — softened
  { h: 25,  s: 68, l: 84 },  // 4  light peach bridge
  { h: 35,  s: 75, l: 86 },  // 5  accent — softened
  { h: 25,  s: 68, l: 84 },  // 6  light peach bridge
  { h: 25,  s: 72, l: 80 },  // 7  peach — softened
  { h: 221, s: 65, l: 86 },  // 8  soft blue bridge
  { h: 221, s: 83, l: 82 },  // 9  blue
  { h: 221, s: 83, l: 82 },  // 10 blue anchor
];

const BASE_OFFSETS = [0, 12, 22, 32, 42, 50, 58, 68, 78, 88, 100];

export function GlowLine() {
  const ambientRef = useRef<SVGPathElement>(null);
  const midRef = useRef<SVGPathElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const blurMidRef = useRef<SVGFEGaussianBlurElement>(null);
  const glowGradRef = useRef<SVGLinearGradientElement>(null);
  const lineStopsRef = useRef<SVGStopElement[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;

    function frame(ts: number) {
      if (start === null) start = ts;
      const t = ts - start + RANDOM_PHASE_OFFSET;

      const d = buildPath(BASE_ANCHORS, t);

      const blurAmb = 32 + 10 * Math.sin(t * 0.00035);
      const blurMid = 8 + 3 * Math.sin(t * 0.00048 + 1.2);

      if (ambientRef.current) ambientRef.current.setAttribute("d", d);
      if (midRef.current) midRef.current.setAttribute("d", d);
      if (coreRef.current) coreRef.current.setAttribute("d", d);
      if (blurRef.current)
        blurRef.current.setAttribute("stdDeviation", String(blurAmb));
      if (blurMidRef.current)
        blurMidRef.current.setAttribute("stdDeviation", String(blurMid));

      // --- Aurora wave gradient animation ---
      const stops = lineStopsRef.current;
      if (stops.length === 11) {
        const auroraPhase = t * 0.00018;
        // Global slide: pushes the entire colour pattern left/right (±20%)
        const globalShift = Math.sin(auroraPhase) * 20;

        const raw = BASE_OFFSETS.map((base, i) => {
          // Ribbon lag: each stop trails the global shift by a different phase
          const waveLag = Math.sin(auroraPhase * 0.7 + i * 0.6) * 6;
          // Tiny individual breathing
          const microDrift = Math.sin(t * 0.00031 + i * 1.7) * 2;
          return base + globalShift + waveLag + microDrift;
        });

        // Enforce monotonicity with a 2.5% minimum gap so stops never cross
        const clamped: number[] = [];
        for (let i = 0; i < raw.length; i++) {
          const min = i === 0 ? 0 : clamped[i - 1] + 2.5;
          const max = i === raw.length - 1 ? 100 : raw[i + 1] - 2.5;
          clamped[i] = Math.max(min, Math.min(max, raw[i]));
        }

        for (let i = 0; i < 11; i++) {
          const base = PALETTE[i];
          const hueShift =
            i === 5
              ? Math.sin(t * 0.00052 + i) * 3
              : Math.sin(t * 0.00042 + i * 1.7) * 2;

          const h = Math.round(base.h + hueShift);
          const color = `hsl(${h} ${base.s}% ${base.l}%)`;

          stops[i].setAttribute("offset", `${clamped[i]}%`);
          stops[i].setAttribute("stop-color", color);
        }
      }

      // Pulse ambient glow gradient opacity
      const gradStrength = 0.28 + 0.08 * Math.sin(t * 0.00042 + 0.6);
      if (glowGradRef.current) {
        const stops = glowGradRef.current.querySelectorAll("stop");
        stops[1]?.setAttribute("stop-opacity", String(gradStrength * 0.7));
        stops[2]?.setAttribute("stop-opacity", String(gradStrength));
        stops[3]?.setAttribute("stop-opacity", String(gradStrength));
        stops[4]?.setAttribute("stop-opacity", String(gradStrength * 0.7));
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const setLineStopRef = (el: SVGStopElement | null, idx: number) => {
    if (el) lineStopsRef.current[idx] = el;
  };

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-10" aria-hidden="true">
      <svg
        width="100vw"
        height="100vh"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ willChange: "contents" }}
      >
        <defs>
          {/* Horizontal color gradient — JS-animated for organic chaos */}
          <linearGradient
            id="lineColorGrad"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop ref={(el) => setLineStopRef(el, 0)}  offset="0%"   stopColor="hsl(221 83% 82%)" />
            <stop ref={(el) => setLineStopRef(el, 1)}  offset="12%"  stopColor="hsl(221 83% 82%)" />
            <stop ref={(el) => setLineStopRef(el, 2)}  offset="22%"  stopColor="hsl(221 65% 86%)" />
            <stop ref={(el) => setLineStopRef(el, 3)}  offset="32%"  stopColor="hsl(25 72% 80%)" />
            <stop ref={(el) => setLineStopRef(el, 4)}  offset="42%"  stopColor="hsl(25 68% 84%)" />
            <stop ref={(el) => setLineStopRef(el, 5)}  offset="50%"  stopColor="hsl(35 75% 86%)" />
            <stop ref={(el) => setLineStopRef(el, 6)}  offset="58%"  stopColor="hsl(25 68% 84%)" />
            <stop ref={(el) => setLineStopRef(el, 7)}  offset="68%"  stopColor="hsl(25 72% 80%)" />
            <stop ref={(el) => setLineStopRef(el, 8)}  offset="78%"  stopColor="hsl(221 65% 86%)" />
            <stop ref={(el) => setLineStopRef(el, 9)}  offset="88%"  stopColor="hsl(221 83% 82%)" />
            <stop ref={(el) => setLineStopRef(el, 10)} offset="100%" stopColor="hsl(221 83% 82%)" />
          </linearGradient>

          {/* Vertical gradient for the ambient glow rect */}
          <linearGradient
            id="glowAreaGrad"
            x1="0"
            y1="0"
            x2="0"
            y2={VH}
            gradientUnits="userSpaceOnUse"
            ref={glowGradRef}
          >
            <stop offset="0%" stopColor="hsl(221 83% 82%)" stopOpacity="0" />
            <stop
              offset="20%"
              stopColor="hsl(221 83% 82%)"
              stopOpacity="0.18"
            />
            <stop offset="35%" stopColor="hsl(25 72% 80%)" stopOpacity="0.28" />
            <stop offset="65%" stopColor="hsl(25 72% 80%)" stopOpacity="0.28" />
            <stop offset="75%" stopColor="hsl(35 75% 86%)" stopOpacity="0.18" />
            <stop offset="90%" stopColor="hsl(35 75% 86%)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="hsl(35 75% 86%)" stopOpacity="0" />
          </linearGradient>

          {/* Ambient glow filter */}
          <filter
            id="glowAmbient"
            x="-20%"
            y="-200%"
            width="140%"
            height="500%"
          >
            <feGaussianBlur ref={blurRef} stdDeviation="32" result="blur" />
          </filter>

          {/* Mid glow filter */}
          <filter id="glowMid" x="-5%" y="-300%" width="110%" height="700%">
            <feGaussianBlur ref={blurMidRef} stdDeviation="8" result="blur" />
          </filter>

        </defs>

        {/* Background gradient slab */}
        <rect x="0" y="0" width={VW} height={VH} fill="url(#glowAreaGrad)" />

        {/* Layer 1: wide ambient haze */}
        <path
          ref={ambientRef}
          fill="none"
          stroke="url(#lineColorGrad)"
          strokeWidth="120"
          opacity="0.42"
          filter="url(#glowAmbient)"
        />

        {/* Layer 2: mid glow */}
        <path
          ref={midRef}
          fill="none"
          stroke="url(#lineColorGrad)"
          strokeWidth="28"
          opacity="0.72"
          filter="url(#glowMid)"
        />

        {/* Layer 3: core line — sharp and bright */}
        <path
          ref={coreRef}
          fill="none"
          stroke="url(#lineColorGrad)"
          strokeWidth="5"
          opacity="0.95"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
