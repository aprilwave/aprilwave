# Sound Design Preset Browser — Implementation Plan

## Overview

Add a preset browser to the existing **Sound Design** category in the Portfolio page. Users can filter presets by synth (Vital, Serum 2, Pigments, Arturia) and preview audio samples with canvas-rendered waveforms.

**Design goals:**
- Match existing dark glass aesthetic (no new colors)
- Lightweight — no external waveform libraries
- Card-first layout (each preset is self-contained)
- One preview plays at a time
- Use placeholder audio during development (user provides real audio later)

---

## File Structure

```
artifacts/aprilwave/
├── src/
│   ├── components/
│   │   ├── sound-design/
│   │   │   ├── PresetCard.tsx       # Individual preset card
│   │   │   ├── PresetGrid.tsx       # Grid container + filter bar
│   │   │   ├── SynthFilter.tsx      # Synth filter pills
│   │   │   └── index.ts             # Barrel export
│   │   └── WaveformSeekBar.tsx      # Extend with readonly/compact modes
│   └── pages/
│       └── Portfolio.tsx            # Integrate PresetGrid into Sound Design tab
├── public/
│   └── audio/
│       └── synth/
│           ├── placeholder.mp3      # Single placeholder for development
│           ├── vital/
│           ├── serum2/
│           ├── pigments/
│           └── arturia/
└── SOUND_DESIGN_PLAN.md             # This file
```

---

## Data Structure

```typescript
interface Preset {
  id: string;
  name: string;
  synth: "vital" | "serum2" | "pigments" | "arturia";
  tags: string[];       // e.g., ["Bass", "Growl", "Analog"]
  type: "one-shot" | "phrase";
  duration: number;     // seconds (e.g., 6.2)
  audioFile: string;    // Relative path: "audio/synth/vital/cyber-growl.mp3"
}

const PRESETS: Preset[] = [
  // Vital presets (~10)
  {
    id: "vital-cyber-growl",
    name: "Cyber Growl",
    synth: "vital",
    tags: ["Bass", "Growl", "Analog"],
    type: "phrase",
    duration: 6.2,
    audioFile: "audio/synth/placeholder.mp3",  // Placeholder until real audio provided
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
  // ... more Vital presets

  // Serum 2 presets (~10)
  {
    id: "serum2-bass-reese",
    name: "Bass Reese",
    synth: "serum2",
    tags: ["Bass", "Sub", "Analog"],
    type: "phrase",
    duration: 5.8,
    audioFile: "audio/synth/placeholder.mp3",
  },
  // ... more Serum 2 presets

  // Pigments presets (~10)
  {
    id: "pigments-ethereal-pad",
    name: "Ethereal Pad",
    synth: "pigments",
    tags: ["Pad", "Ambient", "Long"],
    type: "phrase",
    duration: 7.5,
    audioFile: "audio/synth/placeholder.mp3",
  },
  // ... more Pigments presets

  // Arturia presets (~10)
  {
    id: "arturia-jupiter-lead",
    name: "Jupiter Lead",
    synth: "arturia",
    tags: ["Lead", "Vintage", "Bright"],
    type: "phrase",
    duration: 4.2,
    audioFile: "audio/synth/placeholder.mp3",
  },
  // ... more Arturia presets
];
```

**Note:** All presets point to `audio/synth/placeholder.mp3` during development. User will replace with real audio files later by:
1. Creating subdirectories: `public/audio/synth/vital/`, `serum2/`, `pigments/`, `arturia/`
2. Adding MP3 files to each directory
3. Updating the `audioFile` paths in the `PRESETS` array

---

## Component Architecture

### `PresetCard.tsx`

**Props:**
```typescript
interface PresetCardProps {
  preset: Preset;
  isPlaying: boolean;
  progress: number;     // 0–1 current playback progress
  onPlay: () => void;   // Trigger play (parent handles audio context)
}
```

**Visual Layout (landscape card, ~16:9 aspect ratio):**

```
+--------------------------------------------------+
| [VITAL]    Bass  Growl  Analog                    |  ← Top bar: synth badge + tags
|                                                    |
|              Cyber Growl                           |  ← Preset name (centered, large)
|                                                    |
|   +--------------------------------------------+   |
|   |  ▂▃▅▆▇▆▅▃▂▁▂▃▅▆▇▆▅▃▂▁▂▃▅▆▇▆▅▃▂▁▂▃▅▆▇▆▅▃▂  |   |  ← Canvas waveform (full width)
|   +--------------------------------------------+   |
|                                                    |
| [▶]                              0:06              |  ← Bottom bar: play button + duration
+--------------------------------------------------+
  ↑
  Progress bar (2px, top edge, fills during playback)
```

**Detailed Visual Specs:**

| Element | Classes / Style | Notes |
|---|---|---|
| **Card container** | `glass-panel rounded-2xl p-4 h-48 flex flex-col` | Reuse existing glass panel utility |
| **Progress bar** | `absolute top-0 left-0 h-0.5 bg-primary transition-all duration-100` | Width = `progress * 100%`, only visible when playing |
| **Top bar** | `flex items-center justify-between mb-3` | Synth badge left, tags right |
| **Synth badge** | `text-[10px] uppercase tracking-widest text-muted-foreground border border-white/10 rounded-full px-2 py-0.5` | Monochrome, subtle |
| **Tags container** | `flex items-center gap-1 flex-wrap` | Allow tags to wrap if many |
| **Tag pills** | `text-[9px] uppercase tracking-wider text-muted-foreground/70 border border-white/5 rounded-full px-1.5 py-0.5` | Smaller than synth badge |
| **Preset name** | `font-display text-lg font-bold text-foreground text-center mb-4` | Hero element, centered |
| **Waveform canvas** | `w-full h-12 mb-4` | Compact height, full width |
| **Bottom bar** | `flex items-center justify-between` | Play button left, duration right |
| **Play button** | `p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-95` | Consistent with portfolio player |
| **Play icon** | `w-4 h-4 fill-current` | Lucide `Play` or `Pause` |
| **Duration** | `text-xs text-muted-foreground tabular-nums` | Format: `M:SS` |

**States:**

| State | Visual Changes |
|---|---|
| **Idle** | Waveform dim (`rgba(255,255,255,0.15)`), play button visible, no progress bar |
| **Hover** | Card lifts `-translate-y-1` via Framer Motion, waveform opacity increases to `0.25`, subtle glow via `shadow-lg` |
| **Playing** | Progress bar visible (width animates), waveform bright (`rgba(255,255,255,0.8)` for played bars), pause icon shown |
| **Active (another card playing)** | Card dimmed slightly (`opacity-60`), play button disabled cursor |

**Behavior:**
- Click anywhere on card → trigger `onPlay()`
- Parent component manages which preset is playing via `AudioContext`
- Card receives `isPlaying` and `progress` props to render state
- Waveform is read-only (no seeking)

---

### `PresetGrid.tsx`

**State:**
```typescript
const [activeSynth, setActiveSynth] = useState<"all" | "vital" | "serum2" | "pigments" | "arturia">("all");
const [playingPresetId, setPlayingPresetId] = useState<string | null>(null);
const [progress, setProgress] = useState(0);
```

**Layout:**
```
+--------------------------------------------------+
|  [All] [Vital] [Serum 2] [Pigments] [Arturia]    |  ← SynthFilter (sticky or static)
+--------------------------------------------------+
|                                                   |
|  +----------+  +----------+  +----------+         |
|  |  Card    |  |  Card    |  |  Card    |         |
|  +----------+  +----------+  +----------+         |
|  +----------+  +----------+  +----------+         |  ← Responsive grid
|  |  Card    |  |  Card    |  |  Card    |         |
|  +----------+  +----------+  +----------+         |
|  +----------+  +----------+  +----------+         |
|  |  Card    |  |  Card    |  |  Card    |         |
|  +----------+  +----------+  +----------+         |
|                                                   |
+--------------------------------------------------+
```

**Grid container classes:**
```tsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto"
```

**Responsive behavior:**
- **Mobile (< 640px):** 1 column
- **Tablet (640–1024px):** 2 columns
- **Desktop (> 1024px):** 3 columns

**Filter logic:**
```typescript
const filteredPresets = activeSynth === "all"
  ? PRESETS
  : PRESETS.filter(p => p.synth === activeSynth);
```

**Audio integration:**
```typescript
const { play, pause, isPlaying, playSource, currentTime, duration } = useAudio();

const handlePlayPreset = async (preset: Preset) => {
  const isSamePreset = playingPresetId === preset.id;
  
  if (isSamePreset && isPlaying && playSource === "preset") {
    // Toggle off
    pause(true);
    setPlayingPresetId(null);
    setProgress(0);
  } else {
    // Play new preset (or restart same one)
    setPlayingPresetId(preset.id);
    await play(
      `${import.meta.env.BASE_URL}${preset.audioFile}`,
      "preset",
      preset.name,
      () => {
        // On ended callback
        setPlayingPresetId(null);
        setProgress(0);
      },
      true  // immediate play (no fade)
    );
  }
};

// Track progress
useEffect(() => {
  if (playSource === "preset" && isPlaying && duration > 0) {
    setProgress(currentTime / duration);
  } else {
    setProgress(0);
  }
}, [currentTime, duration, isPlaying, playSource]);
```

**Framer Motion entrance animation:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
>
  {filteredPresets.map((preset, index) => (
    <motion.div
      key={preset.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <PresetCard
        preset={preset}
        isPlaying={playingPresetId === preset.id && isPlaying}
        progress={playingPresetId === preset.id ? progress : 0}
        onPlay={() => handlePlayPreset(preset)}
      />
    </motion.div>
  ))}
</motion.div>
```

---

### `SynthFilter.tsx`

**Props:**
```typescript
interface SynthFilterProps {
  activeSynth: "all" | "vital" | "serum2" | "pigments" | "arturia";
  onChange: (synth: "all" | "vital" | "serum2" | "pigments" | "arturia") => void;
}
```

**Filter options:**
```typescript
const SYNTHS = [
  { value: "all", label: "All" },
  { value: "vital", label: "Vital" },
  { value: "serum2", label: "Serum 2" },
  { value: "pigments", label: "Pigments" },
  { value: "arturia", label: "Arturia" },
] as const;
```

**Visual style:**
- Container: `flex items-center justify-center gap-2 mb-6`
- Filter pills: Same style as Portfolio category tabs
- Active state: `text-foreground bg-white/10`
- Inactive state: `text-muted-foreground hover:text-foreground hover:bg-white/5`
- Transition: `transition-colors duration-200`

**Implementation:**
```typescript
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
          {synth.label}
        </button>
      ))}
    </div>
  );
}
```

---

### Waveform Rendering (Extend `WaveformSeekBar.tsx`)

**Add new props:**
```typescript
interface WaveformSeekBarProps {
  src: string;
  currentTime: number;
  duration: number;
  onSeek?: (time: number) => void;
  readonly?: boolean;    // Disable pointer events (default: false)
  compact?: boolean;     // Smaller height (default: false)
}
```

**Changes to component:**

1. **Conditional height:**
```typescript
const heightClass = compact ? "h-12" : "h-16";
```

2. **Disable pointer events when readonly:**
```typescript
const containerClasses = cn(
  "w-full cursor-pointer touch-none select-none",
  heightClass,
  readonly && "cursor-default pointer-events-none"
);
```

3. **Remove seek handlers when readonly:**
```typescript
const handlePointerDown = (e: React.PointerEvent) => {
  if (readonly) return;
  e.currentTarget.setPointerCapture(e.pointerId);
  setIsDragging(true);
  seekFromEvent(e);
};
```

4. **Color scheme adjustment:**
   - Keep existing color logic (uses `rgba(255,255,255,*)` values)
   - This ensures consistency with existing portfolio player

**Usage in PresetCard:**
```typescript
<WaveformSeekBar
  src={`${import.meta.env.BASE_URL}${preset.audioFile}`}
  currentTime={isPlaying ? currentTime : 0}
  duration={duration}
  readonly={true}
  compact={true}
/>
```

---

## Audio Behavior

**Extend `AudioContext`:**

1. **Add `"preset"` to `playSource` type:**
```typescript
type PlaySource = "orb" | "portfolio" | "preset";
```

2. **Update context value interface:**
```typescript
interface AudioContextValue {
  // ... existing fields
  play: (
    src: string,
    source: "orb" | "portfolio" | "preset",  // Added "preset"
    title: string,
    onEnded?: () => void,
    immediate?: boolean
  ) => Promise<void>;
  // ... rest
}
```

3. **Playback behavior for presets:**
   - Click preset card → play immediately (no fade-in)
   - If another preset is playing → stop it, play new one
   - If same preset is playing → toggle pause/play
   - When preset ends → reset state, ready for next click

4. **Progress tracking:**
   - Parent component (`PresetGrid`) subscribes to `currentTime` and `duration`
   - Calculates `progress = currentTime / duration`
   - Passes `progress` to active `PresetCard`

---

## Integration into Portfolio.tsx

**Current structure:**
```typescript
const categories = [
  {
    name: "Sound Design",
    folder: "synth",
    icon: Waves,
    tracks: [],  // Currently empty
  },
];
```

**Add conditional render:**

```typescript
{activeCategory === "Sound Design" ? (
  <PresetGrid />
) : hasTracks ? (
  // Existing player + playlist layout (lines ~438-580)
  <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
    {/* Player */}
    {/* Playlist */}
  </div>
) : (
  // Empty state
  <div className="mt-8">
    <p className="text-muted-foreground text-lg">No audio files in this category yet.</p>
    <p className="text-muted-foreground text-sm mt-2">Check back soon for updates.</p>
  </div>
)}
```

**Import at top of file:**
```typescript
import { PresetGrid } from "@/components/sound-design";
```

---

## Visual Design Summary

**Color palette (existing only, no new colors):**

| Element | Color Token | Usage |
|---|---|---|
| Card background | `.glass-panel` | Existing glass utility |
| Synth badge text | `text-muted-foreground` | Subtle label |
| Synth badge border | `border-white/10` | Minimal contrast |
| Tag text | `text-muted-foreground/70` | Even more subtle |
| Tag border | `border-white/5` | Barely visible |
| Preset name | `text-foreground` | Hero element |
| Waveform (unplayed) | `rgba(255,255,255,0.15)` | Dim bars |
| Waveform (played) | `rgba(255,255,255,0.8)` | Bright bars |
| Progress bar | `bg-primary` | Existing peach accent |
| Play button bg | `bg-white/10` | Subtle button |
| Play button hover | `bg-white/20` | Lighter on hover |
| Duration text | `text-muted-foreground` | Metadata |

**Typography:**
- Synth badge: `text-[10px] uppercase tracking-widest`
- Tags: `text-[9px] uppercase tracking-wider`
- Preset name: `font-display text-lg font-bold`
- Duration: `text-xs tabular-nums`

**Spacing:**
- Card padding: `p-4` (1rem)
- Grid gap: `gap-4` (1rem)
- Top bar margin: `mb-3`
- Name margin: `mb-4`
- Waveform margin: `mb-4`

**Motion:**
- Card entrance: Staggered fade + slide up (`delay: index * 0.05`)
- Card hover: `-translate-y-1` via Framer Motion
- Progress bar: `transition-all duration-100` (snappy)
- Play button active: `active:scale-95`

---

## Implementation Steps

### Phase 1: Setup

1. **Create directory structure:**
   ```bash
   mkdir -p artifacts/aprilwave/src/components/sound-design
   mkdir -p artifacts/aprilwave/public/audio/synth
   ```

2. **Create placeholder audio file:**
   - Generate or download a 6-second silent/ambient MP3
   - Save as `public/audio/synth/placeholder.mp3`
   - This allows waveform decoding to work during development

3. **Create component files:**
   - `src/components/sound-design/PresetCard.tsx`
   - `src/components/sound-design/PresetGrid.tsx`
   - `src/components/sound-design/SynthFilter.tsx`
   - `src/components/sound-design/index.ts` (barrel export)

### Phase 2: Extend Existing Components

4. **Modify `WaveformSeekBar.tsx`:**
   - Add `readonly?: boolean` prop (default: false)
   - Add `compact?: boolean` prop (default: false)
   - Disable pointer events when `readonly={true}`
   - Apply smaller height when `compact={true}`

5. **Extend `AudioContext.tsx`:**
   - Update `playSource` type to include `"preset"`
   - No other changes needed (existing logic handles new source type)

### Phase 3: Build Components

6. **Implement `SynthFilter.tsx`:**
   - Simple pill-button filter
   - Props: `activeSynth`, `onChange`
   - 5 options: All, Vital, Serum 2, Pigments, Arturia

7. **Implement `PresetCard.tsx`:**
   - Glass panel container
   - Top bar with synth badge + tags
   - Centered preset name
   - Readonly compact waveform
   - Bottom bar with play button + duration
   - Progress bar at top edge
   - Framer Motion hover lift

8. **Implement `PresetGrid.tsx`:**
   - State: `activeSynth`, `playingPresetId`, `progress`
   - Import and use `SynthFilter`
   - Filter presets by synth
   - Map to `PresetCard` components
   - Staggered entrance animation
   - Audio context integration

### Phase 4: Integration

9. **Update `Portfolio.tsx`:**
   - Import `PresetGrid`
   - Add conditional render for Sound Design category
   - Test that other categories still work

10. **Update `src/context/AudioContext.tsx`:**
    - Add `"preset"` to type definitions
    - Verify playback works with new source

### Phase 5: Testing

11. **Test visual behavior:**
    - [ ] Filter buttons work (All → Vital → Serum 2 → etc.)
    - [ ] Grid responds to screen size (1/2/3 columns)
    - [ ] Card hover state works
    - [ ] Progress bar animates during playback
    - [ ] Waveform renders correctly

12. **Test audio behavior:**
    - [ ] Click card → audio plays
    - [ ] Click same card → pauses
    - [ ] Click different card → stops previous, plays new
    - [ ] Progress resets when audio ends
    - [ ] Only one preset plays at a time

13. **Test accessibility:**
    - [ ] Keyboard navigation (Tab through cards)
    - [ ] Enter/Space triggers play
    - [ ] Screen reader announces preset name + state

### Phase 6: Handoff

14. **Document for user:**
    - How to add real audio files
    - How to update preset data
    - Where to place MP3 files

---

## Placeholder Audio Setup

**For development, create a simple placeholder:**

Option A: Generate silent MP3 (fastest)
```bash
# Using ffmpeg (if available)
ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t 6 -q:a 0 placeholder.mp3
```

Option B: Use existing short audio from project
- Copy any existing MP3 from `public/audio/music/` or `public/audio/game-film/`
- Rename to `placeholder.mp3`
- Waveform will decode and render correctly even if audio is generic

**When user provides real audio:**

1. Create subdirectories:
   ```
   public/audio/synth/vital/
   public/audio/synth/serum2/
   public/audio/synth/pigments/
   public/audio/synth/arturia/
   ```

2. Add MP3 files (5–8 seconds each):
   ```
   cyber-growl.mp3
   neon-pluck.mp3
   bass-reese.mp3
   ...
   ```

3. Update `PRESETS` array in `PresetGrid.tsx`:
   ```typescript
   audioFile: "audio/synth/vital/cyber-growl.mp3",  // Update path
   duration: 6.2,  // Update actual duration
   ```

---

## Future Considerations

**Not in scope for initial implementation:**

| Feature | When to add |
|---|---|
| Search bar | If preset count exceeds 50 |
| Pagination / Load More | If grid becomes too long (>30 presets visible) |
| Tag filtering | If users need to filter by sound type (Bass, Lead, etc.) |
| Download buttons | If offering presets for sale/download |
| Preset details modal | If showing parameters/settings per preset |
| Dedicated `/sound-design` page | If section grows significantly |

**Easy to add later:**
- The `PresetGrid` component is self-contained
- Can be promoted to a full page by wrapping with layout and adding to router
- Filter logic can be extended to include tag filtering with minimal changes

---

## Success Criteria

**Visual:**
- [ ] Cards match existing glass panel aesthetic
- [ ] No new colors introduced (uses existing palette)
- [ ] Responsive grid works at all breakpoints
- [ ] Hover states feel polished (motion, opacity)
- [ ] Waveform renders and animates correctly

**Technical:**
- [ ] Filter switches presets instantly
- [ ] Audio plays on click
- [ ] Only one preset plays at a time
- [ ] Progress bar tracks playback accurately
- [ ] No console errors or warnings

**Performance:**
- [ ] Initial page load under 2 seconds
- [ ] Filter switching feels instant (<100ms)
- [ ] Waveform decoding doesn't block UI (cached after first load)
- [ ] No layout shift when waveforms load

**Accessibility:**
- [ ] All interactive elements keyboard-accessible
- [ ] Focus states visible
- [ ] Screen reader announces preset name + playing state
