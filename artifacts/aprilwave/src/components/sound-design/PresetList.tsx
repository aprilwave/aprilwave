import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";
import { SynthFilter } from "./SynthFilter";
import { PresetRow } from "./PresetRow";
import { PresetDetail } from "./PresetDetail";

interface Preset {
  id: string;
  name: string;
  synth: "vital" | "serum2" | "pigments" | "arturia";
  tags: string[];
  type: "one-shot" | "phrase";
  duration: number;
  audioFile: string;
}

const PRESETS: Preset[] = [
  {
    id: "vital-cyber-growl",
    name: "Cyber Growl",
    synth: "vital",
    tags: ["Bass", "Growl", "Analog"],
    type: "phrase",
    duration: 6.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-neon-pluck",
    name: "Neon Pluck",
    synth: "vital",
    tags: ["Pluck", "Digital", "Short"],
    type: "one-shot",
    duration: 2.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-wobble-bass",
    name: "Wobble Bass",
    synth: "vital",
    tags: ["Bass", "Wobble", "Dubstep"],
    type: "phrase",
    duration: 5.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-crystal-lead",
    name: "Crystal Lead",
    synth: "vital",
    tags: ["Lead", "Bright", "Digital"],
    type: "phrase",
    duration: 4.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-dark-pad",
    name: "Dark Pad",
    synth: "vital",
    tags: ["Pad", "Dark", "Cinematic"],
    type: "phrase",
    duration: 7.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-fm-bell",
    name: "FM Bell",
    synth: "vital",
    tags: ["Bell", "FM", "Clean"],
    type: "one-shot",
    duration: 3.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-supersaw",
    name: "Supersaw",
    synth: "vital",
    tags: ["Lead", "Supersaw", "Trance"],
    type: "phrase",
    duration: 5.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-sub-drop",
    name: "Sub Drop",
    synth: "vital",
    tags: ["Bass", "Sub", "Impact"],
    type: "one-shot",
    duration: 2.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-grain-texture",
    name: "Grain Texture",
    synth: "vital",
    tags: ["Texture", "Granular", "Ambient"],
    type: "phrase",
    duration: 6.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "vital-arpeggio",
    name: "Arpeggio",
    synth: "vital",
    tags: ["Arp", "Digital", "Rhythmic"],
    type: "phrase",
    duration: 4.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-bass-reese",
    name: "Bass Reese",
    synth: "serum2",
    tags: ["Bass", "Sub", "Analog"],
    type: "phrase",
    duration: 5.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-hyper-saw",
    name: "Hyper Saw",
    synth: "serum2",
    tags: ["Lead", "Saw", "EDM"],
    type: "phrase",
    duration: 4.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-vocal-chop",
    name: "Vocal Chop",
    synth: "serum2",
    tags: ["Vocal", "Chop", "Future"],
    type: "phrase",
    duration: 3.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-dirty-brass",
    name: "Dirty Brass",
    synth: "serum2",
    tags: ["Brass", "Dirty", "Hip-Hop"],
    type: "one-shot",
    duration: 2.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-pluck-stab",
    name: "Pluck Stab",
    synth: "serum2",
    tags: ["Pluck", "Stab", "House"],
    type: "one-shot",
    duration: 1.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-atmosphere",
    name: "Atmosphere",
    synth: "serum2",
    tags: ["Pad", "Ambient", "Wide"],
    type: "phrase",
    duration: 8.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-fx-sweep",
    name: "FX Sweep",
    synth: "serum2",
    tags: ["FX", "Sweep", "Transition"],
    type: "phrase",
    duration: 4.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-square-lead",
    name: "Square Lead",
    synth: "serum2",
    tags: ["Lead", "Square", "Retro"],
    type: "phrase",
    duration: 5.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-deep-sub",
    name: "Deep Sub",
    synth: "serum2",
    tags: ["Bass", "Sub", "Deep"],
    type: "one-shot",
    duration: 3.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "serum2-glass-hit",
    name: "Glass Hit",
    synth: "serum2",
    tags: ["Percussion", "Glass", "Impact"],
    type: "one-shot",
    duration: 1.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-ethereal-pad",
    name: "Ethereal Pad",
    synth: "pigments",
    tags: ["Pad", "Ambient", "Long"],
    type: "phrase",
    duration: 7.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-grain-cloud",
    name: "Grain Cloud",
    synth: "pigments",
    tags: ["Texture", "Granular", "Ethereal"],
    type: "phrase",
    duration: 6.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-analog-brass",
    name: "Analog Brass",
    synth: "pigments",
    tags: ["Brass", "Analog", "Warm"],
    type: "phrase",
    duration: 5.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-harmonic-bell",
    name: "Harmonic Bell",
    synth: "pigments",
    tags: ["Bell", "Harmonic", "Mallet"],
    type: "one-shot",
    duration: 3.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-string-ensemble",
    name: "String Ensemble",
    synth: "pigments",
    tags: ["Strings", "Ensemble", "Cinematic"],
    type: "phrase",
    duration: 6.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-karplus-pluck",
    name: "Karplus Pluck",
    synth: "pigments",
    tags: ["Pluck", "Karplus", "Acoustic"],
    type: "one-shot",
    duration: 2.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-noise-scape",
    name: "Noise Scape",
    synth: "pigments",
    tags: ["Noise", "Texture", "Dark"],
    type: "phrase",
    duration: 7.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-wavetable-lead",
    name: "Wavetable Lead",
    synth: "pigments",
    tags: ["Lead", "Wavetable", "Modern"],
    type: "phrase",
    duration: 4.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-choir-ahh",
    name: "Choir Ahh",
    synth: "pigments",
    tags: ["Choir", "Vocal", "Pad"],
    type: "phrase",
    duration: 6.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "pigments-resonator",
    name: "Resonator",
    synth: "pigments",
    tags: ["FX", "Resonator", "Metallic"],
    type: "phrase",
    duration: 5.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-jupiter-lead",
    name: "Jupiter Lead",
    synth: "arturia",
    tags: ["Lead", "Vintage", "Bright"],
    type: "phrase",
    duration: 4.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-mini-bass",
    name: "Mini Bass",
    synth: "arturia",
    tags: ["Bass", "Moog", "Fat"],
    type: "phrase",
    duration: 3.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-cs-strings",
    name: "CS Strings",
    synth: "arturia",
    tags: ["Strings", "CS-80", "Lush"],
    type: "phrase",
    duration: 6.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-dx-piano",
    name: "DX Piano",
    synth: "arturia",
    tags: ["Piano", "FM", "Electric"],
    type: "one-shot",
    duration: 2.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-prophet-pad",
    name: "Prophet Pad",
    synth: "arturia",
    tags: ["Pad", "Prophet", "Warm"],
    type: "phrase",
    duration: 7.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-juno-arp",
    name: "Juno Arp",
    synth: "arturia",
    tags: ["Arp", "Juno", "Retro"],
    type: "phrase",
    duration: 4.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-modular-fx",
    name: "Modular FX",
    synth: "arturia",
    tags: ["FX", "Modular", "Experimental"],
    type: "phrase",
    duration: 5.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-sqx-sequence",
    name: "SQX Sequence",
    synth: "arturia",
    tags: ["Sequence", "SQ-80", "Digital"],
    type: "phrase",
    duration: 4.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-vox-organ",
    name: "Vox Organ",
    synth: "arturia",
    tags: ["Organ", "Vox", "Classic"],
    type: "phrase",
    duration: 5.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  {
    id: "arturia-clavinet",
    name: "Clavinet",
    synth: "arturia",
    tags: ["Clavinet", "Funk", "Percussive"],
    type: "one-shot",
    duration: 2.0,
    audioFile: "audio/synth/placeholder.mp3",
  },
];

export function PresetList() {
  const [activeSynth, setActiveSynth] = useState<"all" | "vital" | "serum2" | "pigments" | "arturia">("all");
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [playingPresetId, setPlayingPresetId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const { play, pause, isPlaying, playSource, currentTime, duration, seek } = useAudio();

  const filteredPresets = useMemo(
    () => (activeSynth === "all" ? PRESETS : PRESETS.filter((p) => p.synth === activeSynth)),
    [activeSynth]
  );

  const selectedPreset = useMemo(
    () => PRESETS.find((p) => p.id === selectedPresetId) || null,
    [selectedPresetId]
  );

  const handleSelectPreset = useCallback(
    async (preset: Preset) => {
      setSelectedPresetId(preset.id);
      const isSamePreset = playingPresetId === preset.id;

      if (isSamePreset && isPlaying && playSource === "preset") {
        pause(true);
        setPlayingPresetId(null);
        setProgress(0);
      } else {
        setPlayingPresetId(preset.id);
        await play(
          `${import.meta.env.BASE_URL}${preset.audioFile}`,
          "preset",
          preset.name,
          () => {
            setPlayingPresetId(null);
            setProgress(0);
          },
          true
        );
      }
    },
    [playingPresetId, isPlaying, playSource, pause, play]
  );

  const handlePlayPause = useCallback(async () => {
    if (!selectedPreset) return;

    if (isPlaying && playSource === "preset" && playingPresetId === selectedPreset.id) {
      pause(true);
      setPlayingPresetId(null);
      setProgress(0);
    } else {
      setPlayingPresetId(selectedPreset.id);
      await play(
        `${import.meta.env.BASE_URL}${selectedPreset.audioFile}`,
        "preset",
        selectedPreset.name,
        () => {
          setPlayingPresetId(null);
          setProgress(0);
        },
        true
      );
    }
  }, [selectedPreset, isPlaying, playSource, playingPresetId, pause, play]);

  const handlePrev = useCallback(() => {
    if (!selectedPresetId) return;
    const currentIndex = filteredPresets.findIndex((p) => p.id === selectedPresetId);
    if (currentIndex <= 0) return;
    const prevPreset = filteredPresets[currentIndex - 1];
    handleSelectPreset(prevPreset);
  }, [selectedPresetId, filteredPresets, handleSelectPreset]);

  const handleNext = useCallback(() => {
    if (!selectedPresetId) return;
    const currentIndex = filteredPresets.findIndex((p) => p.id === selectedPresetId);
    if (currentIndex >= filteredPresets.length - 1) return;
    const nextPreset = filteredPresets[currentIndex + 1];
    handleSelectPreset(nextPreset);
  }, [selectedPresetId, filteredPresets, handleSelectPreset]);

  const handleSeek = useCallback(
    (time: number) => {
      seek(time);
    },
    [seek]
  );

  useEffect(() => {
    if (playSource === "preset" && isPlaying && duration > 0) {
      setProgress(currentTime / duration);
    } else {
      setProgress(0);
    }
  }, [currentTime, duration, isPlaying, playSource]);

  useEffect(() => {
    if (selectedPresetId && !filteredPresets.find((p) => p.id === selectedPresetId)) {
      setSelectedPresetId(null);
      setPlayingPresetId(null);
      setProgress(0);
    }
  }, [filteredPresets, selectedPresetId]);

  const getPresetIndex = (id: string) => filteredPresets.findIndex((p) => p.id === id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto items-start">
      <div className="flex-1 min-w-0">
        <SynthFilter
          activeSynth={activeSynth}
          onChange={(synth) => {
            setActiveSynth(synth);
            setSelectedPresetId(null);
            setPlayingPresetId(null);
            setProgress(0);
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          <div className="max-h-[600px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {filteredPresets.map((preset, index) => (
                <motion.div
                  key={preset.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <PresetRow
                    preset={preset}
                    isSelected={selectedPresetId === preset.id}
                    isPlaying={playingPresetId === preset.id && isPlaying && playSource === "preset"}
                    progress={playingPresetId === preset.id ? progress : 0}
                    onSelect={() => handleSelectPreset(preset)}
                    onPlay={() => handleSelectPreset(preset)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      <div className="lg:w-96 lg:flex-shrink-0 lg:mt-16">
        <PresetDetail
          preset={selectedPreset}
          isPlaying={playingPresetId === selectedPreset?.id && isPlaying && playSource === "preset"}
          progress={selectedPresetId && playingPresetId === selectedPresetId ? progress : 0}
          currentTime={selectedPresetId && playingPresetId === selectedPresetId ? currentTime : 0}
          onPlay={handlePlayPause}
          onPrev={handlePrev}
          onNext={handleNext}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
}
