const SYNTHS = [
  { value: "all" as const, label: "All", count: 40 },
  { value: "vital" as const, label: "Vital", count: 10 },
  { value: "serum2" as const, label: "Serum 2", count: 10 },
  { value: "pigments" as const, label: "Pigments", count: 10 },
  { value: "arturia" as const, label: "Arturia", count: 10 },
];

type SynthValue = (typeof SYNTHS)[number]["value"];

interface SynthFilterProps {
  activeSynth: SynthValue;
  onChange: (synth: SynthValue) => void;
}

export function SynthFilter({ activeSynth, onChange }: SynthFilterProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
      {SYNTHS.map((synth) => (
        <button
          key={synth.value}
          onClick={() => onChange(synth.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            activeSynth === synth.value
              ? "text-foreground bg-white/10"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          {synth.label} <span className="text-muted-foreground/50 text-[10px]">({synth.count})</span>
        </button>
      ))}
    </div>
  );
}
