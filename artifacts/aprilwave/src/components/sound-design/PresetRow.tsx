import { memo } from "react";
import { Play, Pause } from "lucide-react";

interface Preset {
  id: string;
  name: string;
  synth: "vital" | "serum2" | "pigments" | "arturia";
  tags: string[];
  type: "one-shot" | "phrase";
  duration: number;
  audioFile: string;
}

interface PresetRowProps {
  preset: Preset;
  isSelected: boolean;
  isPlaying: boolean;
  progress: number;
  onSelect: () => void;
  onPlay: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const synthLabels: Record<string, string> = {
  vital: "VITAL",
  serum2: "SERUM 2",
  pigments: "PIGMENTS",
  arturia: "ARTURIA",
};

export const PresetRow = memo(function PresetRow({
  preset,
  isSelected,
  isPlaying,
  onSelect,
}: PresetRowProps) {
  const handleClick = () => {
    onSelect();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      aria-label={`Preset: ${preset.name}, ${synthLabels[preset.synth]}, ${formatDuration(preset.duration)}`}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-white/5 last:border-b-0 ${
        isSelected || isPlaying
          ? "bg-white/8 border-l-2 border-l-primary pl-[14px]"
          : "hover:bg-white/5"
      }`}
    >
      <div className={`w-4 h-4 text-muted-foreground flex-shrink-0 ${isPlaying ? "animate-pulse text-primary" : ""}`}>
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </div>

      <span className="font-display text-sm font-semibold text-foreground truncate flex-1">
        {preset.name}
      </span>

      <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 flex-shrink-0">
        {synthLabels[preset.synth]}
      </span>

      <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-muted-foreground/60 flex-shrink-0">
        {preset.tags[0]}
      </span>

      <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0 w-10 text-right">
        {formatDuration(preset.duration)}
      </span>
    </div>
  );
});
