const TOTAL_W = 3200;
const H = 200;
const MID = H / 2;

function makePath(amplitude: number, wavelength: number, phase: number): string {
  let d = "";
  for (let x = 0; x <= TOTAL_W; x += 10) {
    const y = MID + amplitude * Math.sin((x / wavelength) * Math.PI * 2 + phase);
    d += x === 0 ? `M${x},${y.toFixed(1)}` : `L${x},${y.toFixed(1)}`;
  }
  return d;
}

const w1 = makePath(55, 400, 0);
const w2 = makePath(32, 320, 1.8);
const w3 = makePath(70, 800, 0.9);

export function WaveformBG() {
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
          animation: "wave-scroll 16s linear infinite",
        }}
        viewBox={`0 0 ${TOTAL_W} ${H}`}
      >
        <path d={w1} fill="none" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.10" strokeLinecap="round" strokeLinejoin="round" />
        <path d={w2} fill="none" stroke="hsl(var(--secondary))" strokeWidth="2.5" opacity="0.08" strokeLinecap="round" strokeLinejoin="round" />
        <path d={w3} fill="none" stroke="hsl(var(--accent))" strokeWidth="2" opacity="0.07" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
