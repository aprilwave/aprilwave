import { useRef, useEffect, useState, useCallback } from "react";

const BAR_COUNT = 80;
const BAR_GAP = 2;

const waveformCache = new Map<string, number[]>();

async function decodeWaveform(url: string): Promise<number[]> {
  const cached = waveformCache.get(url);
  if (cached) return cached;

  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const actx = new (window.AudioContext || (window as any).webkitAudioContext)();
  try {
    const audioBuf = await actx.decodeAudioData(buf);
    const raw = audioBuf.getChannelData(0);
    const blockSize = Math.floor(raw.length / BAR_COUNT);
    const peaks: number[] = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      let sum = 0;
      const start = i * blockSize;
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(raw[start + j]);
      }
      peaks.push(sum / blockSize);
    }
    const max = Math.max(...peaks, 0.01);
    const normalized = peaks.map((p) => p / max);
    waveformCache.set(url, normalized);
    return normalized;
  } finally {
    actx.close();
  }
}

interface WaveformSeekBarProps {
  src: string;
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  readonly?: boolean;
  compact?: boolean;
}

export function WaveformSeekBar({ src, currentTime, duration, onSeek, readonly = false, compact = false }: WaveformSeekBarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [peaks, setPeaks] = useState<number[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const widthRef = useRef(0);
  const heightRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setPeaks(null);
    decodeWaveform(src).then((p) => {
      if (!cancelled) setPeaks(p);
    });
    return () => { cancelled = true; };
  }, [src]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (w !== widthRef.current || h !== heightRef.current) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      widthRef.current = w;
      heightRef.current = h;
    }

    ctx.clearRect(0, 0, w, h);

    const barWidth = (w - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;
    const progress = duration > 0 ? currentTime / duration : 0;
    const playedBars = Math.floor(progress * BAR_COUNT);

    if (!peaks) {
      for (let i = 0; i < BAR_COUNT; i++) {
        const x = i * (barWidth + BAR_GAP);
        const barH = h * 0.15;
        const y = (h - barH) / 2;
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(x, y, barWidth, barH);
      }
      return;
    }

    for (let i = 0; i < BAR_COUNT; i++) {
      const x = i * (barWidth + BAR_GAP);
      const barH = Math.max(2, peaks[i] * h * 0.85);
      const y = (h - barH) / 2;

      ctx.fillStyle = i < playedBars
        ? "rgba(255,255,255,0.8)"
        : "rgba(255,255,255,0.2)";
      ctx.fillRect(x, y, barWidth, barH);
    }
  }, [peaks, currentTime, duration]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const observer = new ResizeObserver(() => draw());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const seekFromEvent = useCallback((e: React.PointerEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || duration <= 0 || !onSeek) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, x * duration)));
  }, [duration, onSeek]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (readonly) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    seekFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    seekFromEvent(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const heightClass = compact ? "h-12" : "h-16";

  const containerClasses = `w-full ${heightClass} ${readonly ? "cursor-default pointer-events-none" : "cursor-pointer"} touch-none select-none`;

  return (
    <div ref={containerRef} className={containerClasses}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
}
