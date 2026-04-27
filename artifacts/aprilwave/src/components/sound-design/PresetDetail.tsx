import { Waves, SkipBack, SkipForward, Play, Pause } from "lucide-react";
import { WaveformSeekBar } from "@/components/WaveformSeekBar";

interface Preset {
  id: string;
  name: string;
  synth: "vital" | "serum2" | "pigments" | "arturia";
  tags: string[];
  type: "one-shot" | "phrase";
  duration: number;
  audioFile: string;
}

interface PresetDetailProps {
  preset: Preset | null;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
}

const synthLabels: Record<string, string> = {
  vital: "VITAL",
  serum2: "SERUM 2",
  pigments: "PIGMENTS",
  arturia: "ARTURIA",
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export function PresetDetail({
  preset,
  isPlaying,
  progress,
  currentTime,
  onPlay,
  onPrev,
  onNext,
  onSeek,
}: PresetDetailProps) {
  if (!preset) {
    return (
      <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center min-h-[220px] text-center lg:w-96">
        <Waves className="w-8 h-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">Select a preset to preview</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 lg:flex-shrink-0 lg:w-96">
      {isPlaying && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 bg-primary transition-all duration-100 rounded-t-2xl"
          style={{ width: `${progress * 100}%` }}
        />
      )}

      <h2 className="font-display text-xl font-bold text-foreground text-center mb-4">
        {preset.name}
      </h2>

      <div className="w-full h-20 mb-4">
        <WaveformSeekBar
          src={`${import.meta.env.BASE_URL}${preset.audioFile}`}
          currentTime={currentTime}
          duration={preset.duration}
          onSeek={onSeek}
          readonly={false}
          compact={false}
        />
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={onPrev}
          aria-label="Previous preset"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>
        <button
          onClick={onPlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>
        <button
          onClick={onNext}
          aria-label="Next preset"
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-muted-foreground">
        <span className="text-[10px] uppercase tracking-widest border border-white/10 rounded-full px-2 py-0.5">
          {synthLabels[preset.synth]}
        </span>
        {preset.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] uppercase tracking-wider text-muted-foreground/60"
          >
            {tag}
          </span>
        ))}
        <span className="tabular-nums">{formatDuration(preset.duration)}</span>
      </div>
    </div>
  );
}
