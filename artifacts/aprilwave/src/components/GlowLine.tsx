import { useEffect, useRef } from "react";

const VW = 1440;
const VH = 600;

const RANDOM_PHASE_OFFSET = Math.random() * 10000;

// Baseline Y positions for control points (% of VH)
// Line sits around 58% down — mostly horizontal, gently wandering
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
  // Add very subtle time-driven Y drift to each anchor independently
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

export function GlowLine() {
  const ambientRef = useRef<SVGPathElement>(null);
  const midRef = useRef<SVGPathElement>(null);
  const coreRef = useRef<SVGPathElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const blurMidRef = useRef<SVGFEGaussianBlurElement>(null);
  const gradRef = useRef<SVGLinearGradientElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;

    function frame(ts: number) {
      if (start === null) start = ts;
      const t = ts - start + RANDOM_PHASE_OFFSET;

      const d = buildPath(BASE_ANCHORS, t);

      // Ambient glow blur pulses: 32 ± 10
      const blurAmb = 32 + 10 * Math.sin(t * 0.00035);
      // Mid glow blur pulses: 8 ± 3
      const blurMid = 8 + 3 * Math.sin(t * 0.00048 + 1.2);

      if (ambientRef.current) ambientRef.current.setAttribute("d", d);
      if (midRef.current) midRef.current.setAttribute("d", d);
      if (coreRef.current) coreRef.current.setAttribute("d", d);
      if (blurRef.current)
        blurRef.current.setAttribute("stdDeviation", String(blurAmb));
      if (blurMidRef.current)
        blurMidRef.current.setAttribute("stdDeviation", String(blurMid));

      // Pulse gradient stop opacity: 0.18 ± 0.08
      const gradStrength = 0.3 + 0.1 * Math.sin(t * 0.00042 + 0.6);
      if (gradRef.current) {
        const stops = gradRef.current.querySelectorAll("stop");
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

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-10">
      <svg
        width="100vw"
        height="100vh"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Horizontal color gradient for the stroke */}
          <linearGradient
            id="lineColorGrad"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="hsl(221 83% 82%)" />
            <stop offset="25%" stopColor="hsl(25 85% 78%)" />
            <stop offset="50%" stopColor="hsl(35 85% 85%)" />
            <stop offset="75%" stopColor="hsl(25 85% 78%)" />
            <stop offset="100%" stopColor="hsl(221 83% 82%)" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="6s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Vertical gradient for the ambient glow rect — fills up/down from the line */}
          <linearGradient
            id="glowAreaGrad"
            x1="0"
            y1="0"
            x2="0"
            y2={VH}
            gradientUnits="userSpaceOnUse"
            ref={gradRef}
          >
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop
              offset="20%"
              stopColor="hsl(221 83% 82%)"
              stopOpacity="0.22"
            />
            <stop offset="35%" stopColor="hsl(25 85% 78%)" stopOpacity="0.32" />
            <stop offset="65%" stopColor="hsl(25 85% 78%)" stopOpacity="0.32" />
            <stop offset="80%" stopColor="hsl(35 85% 85%)" stopOpacity="0.22" />
            <stop offset="92%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
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

        {/* Background gradient slab — vertical color emanating from line area */}
        <rect x="0" y="0" width={VW} height={VH} fill="url(#glowAreaGrad)" />

        {/* Layer 1: wide ambient haze */}
        <path
          ref={ambientRef}
          fill="none"
          stroke="url(#lineColorGrad)"
          strokeWidth="100"
          opacity="0.28"
          filter="url(#glowAmbient)"
        />

        {/* Layer 2: mid glow */}
        <path
          ref={midRef}
          fill="none"
          stroke="url(#lineColorGrad)"
          strokeWidth="22"
          opacity="0.55"
          filter="url(#glowMid)"
        />

        {/* Layer 3: core line — sharp and bright */}
        <path
          ref={coreRef}
          fill="none"
          stroke="url(#lineColorGrad)"
          strokeWidth="3.5"
          opacity="0.90"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
