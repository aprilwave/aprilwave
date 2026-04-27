# Synth Sound Design — DAW Split View Redesign

## Overview

Replace the current card grid with a **DAW-inspired split view**: a scrollable preset list on the left, and a fixed detail/player panel on the right. This mirrors how producers browse presets in tools like Serum, Vital, or Ableton — compact list for fast scanning, dedicated area for focused listening.

**Design goals:**
- Match existing dark glass aesthetic (no new colors)
- Fast scanning — 40 presets visible at a glance
- One preview plays at a time
- Feels like a professional tool, not a catalog
- Placeholder audio during development

---

## File Structure

```
artifacts/aprilwave/
├── src/
│   ├── components/
│   │   ├── sound-design/
│   │   │   ├── PresetList.tsx         # Scrollable list (replaces PresetGrid)
│   │   │   ├── PresetRow.tsx          # Individual list row (replaces PresetCard)
│   │   │   ├── PresetDetail.tsx       # Right panel: waveform + controls
│   │   │   ├── SynthFilter.tsx        # Filter toolbar (updated)
│   │   │   └── index.ts               # Barrel export
│   │   └── WaveformSeekBar.tsx        # Already supports readonly/compact
│   └── pages/
│       └── Portfolio.tsx              # Integration point (unchanged)
```

**Files to delete:**
- `PresetGrid.tsx` (replaced by `PresetList.tsx`)
- `PresetCard.tsx` (replaced by `PresetRow.tsx`)

**Files to keep:**
- `SynthFilter.tsx` (updated styling)
- `index.ts` (updated exports)
- `WaveformSeekBar.tsx` (no changes needed)
- `AudioContext.tsx` (no changes needed)

---

## Data Structure (unchanged)

```typescript
interface Preset {
  id: string;
  name: string;
  synth: "vital" | "serum2" | "pigments" | "arturia";
  tags: string[];
  type: "one-shot" | "phrase";
  duration: number;
  audioFile: string;
}
```

Same 40 presets. Same data. Only the layout changes.

---

## Layout

### Desktop (> 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│  [All] [Vital] [Serum 2] [Pigments] [Arturia]    ← Filter bar  │
├───────────────────────────┬─────────────────────────────────────┤
│                           │                                     │
│  PRESET LIST              │  PRESET DETAIL PANEL                │
│  (scrollable)             │  (sticky, fixed height)             │
│                           │                                     │
│  ▶ Cyber Growl   VITAL 6:02│  ┌──────────────────────────────┐  │
│  ▶ Neon Pluck    VITAL 2:05│  │  Cyber Growl                 │  │
│  ▶ Wobble Bass   VITAL 5:00│  │  [     Large Waveform       ]│  │
│  ▶ Crystal Lead  VITAL 4:08│  │                              │  │
│  ▶ Dark Pad      VITAL 7:00│  │  [◁]  [▶ / ❚❚]  [▷]         │  │
│  ▶ FM Bell       VITAL 3:02│  │                              │  │
│  ▶ Supersaw      VITAL 5:05│  │  VITAL  •  Bass  Growl  6:02 │  │
│  ▶ Sub Drop      VITAL 2:00│  └──────────────────────────────┘  │
│  ▶ Grain Texture VITAL 6:08│                                     │
│  ▶ Arpeggio      VITAL 4:05│                                     │
│  ▶ Bass Reese   SERUM2 5:08│                                     │
│  ▶ Hyper Saw    SERUM2 4:02│                                     │
│  ...                       │                                     │
│                           │                                     │
└───────────────────────────┴─────────────────────────────────────┘
```

**Proportions:**
- Left list: `flex-1` (takes remaining space)
- Right detail: `w-96` (384px fixed)
- Gap: `gap-6`

### Tablet (640px – 1024px)

```
┌─────────────────────────────────────────┐
│  [All] [Vital] [Serum 2] [Pigments]     │
├─────────────────────────────────────────┤
│                                         │
│  PRESET LIST (full width, scrollable)   │
│  ▶ Cyber Growl   VITAL  6:02            │
│  ▶ Neon Pluck    VITAL  2:05            │
│  ▶ Wobble Bass   VITAL  5:00            │
│  ...                                    │
│                                         │
├─────────────────────────────────────────┤
│  PRESET DETAIL PANEL (bottom, fixed)    │
│  [Waveform]  [Controls]  [Metadata]     │
└─────────────────────────────────────────┘
```

- List: full width, `max-h-[50vh]` scrollable
- Detail: bottom bar, full width, ~180px tall

### Mobile (< 640px)

```
┌──────────────────────┐
│  [All] [Vital] [...] │
├──────────────────────┤
│  ▶ Cyber Growl  6:02 │
│  ▶ Neon Pluck   2:05 │
│  ▶ Wobble Bass  5:00 │
│  ...                 │
├──────────────────────┤
│  [Mini player bar]   │
│  ▶ Name  [▶]  6:02   │
└──────────────────────┘
```

- List: full width, compact rows (no tags visible)
- Detail: collapses to a mini player bar at bottom (~56px)
- Tapping mini bar expands full detail panel as a slide-up sheet

---

## Components

### `PresetList.tsx` (replaces `PresetGrid.tsx`)

**State:**
```typescript
const [activeSynth, setActiveSynth] = useState<"all" | "vital" | "serum2" | "pigments" | "arturia">("all");
const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
const [playingPresetId, setPlayingPresetId] = useState<string | null>(null);
const [progress, setProgress] = useState(0);
```

**Responsibilities:**
- Render `SynthFilter` at top
- Filter presets by `activeSynth`
- Render `PresetRow` for each filtered preset
- Render `PresetDetail` panel (right side on desktop, bottom on mobile)
- Manage audio playback via `AudioContext`
- Track selected vs playing state (can select without playing)

**Layout (desktop):**
```tsx
<div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
  <div className="flex-1 min-w-0">
    <SynthFilter ... />
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="max-h-[600px] overflow-y-auto">
        {filteredPresets.map(...)}
      </div>
    </div>
  </div>
  <div className="lg:w-96 lg:flex-shrink-0">
    <PresetDetail ... />
  </div>
</div>
```

**Layout (tablet/mobile):**
```tsx
<div className="flex flex-col gap-4 max-w-6xl mx-auto">
  <SynthFilter ... />
  <div className="glass-panel rounded-2xl overflow-hidden">
    <div className="max-h-[50vh] overflow-y-auto">
      {filteredPresets.map(...)}
    </div>
  </div>
  <PresetDetail ... />
</div>
```

**Audio logic (same as current):**
```typescript
const handlePlayPreset = async (preset: Preset) => {
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
};
```

**Framer Motion:**
- List container: fade in (`opacity: 0 → 1`, 0.3s)
- Rows: staggered entrance (`delay: index * 0.03` — faster than card grid since rows are smaller)
- Filter change: `AnimatePresence` with exit animation (`opacity: 0, x: -20`)

---

### `PresetRow.tsx` (replaces `PresetCard.tsx`)

**Props:**
```typescript
interface PresetRowProps {
  preset: Preset;
  isSelected: boolean;
  isPlaying: boolean;
  progress: number;
  onSelect: () => void;
  onPlay: () => void;
}
```

**Visual Layout:**
```
┌────────────────────────────────────────────────────────────┐
│ [▶]  Cyber Growl          ─────────  [VITAL] [Bass]  6:02  │
└────────────────────────────────────────────────────────────┘
```

**Row anatomy (left to right):**
1. **Play indicator**: Small play/pause icon or pulse dot (16px)
2. **Preset name**: `font-display text-sm font-semibold`, truncated if long
3. **Spacer**: `flex-1` — pushes metadata to the right
4. **Synth badge**: Compact pill, uppercase, `text-[10px]`
5. **First tag only**: Show 1 tag on desktop, hide on mobile
6. **Duration**: `text-xs tabular-nums text-muted-foreground`

**Detailed Visual Specs:**

| Element | Classes | Notes |
|---|---|---|
| **Row container** | `flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-white/5 last:border-b-0` | Thin divider between rows |
| **Idle state** | `hover:bg-white/5` | Subtle hover highlight |
| **Selected state** | `bg-white/8 border-l-2 border-l-primary/60 pl-[14px]` | Left accent bar, compensate padding |
| **Playing state** | `bg-white/8 border-l-2 border-l-primary pl-[14px]` | Brighter accent, pulsing play icon |
| **Play icon** | `w-4 h-4 text-muted-foreground flex-shrink-0` | `Play` icon idle, `Pause` when playing |
| **Playing pulse** | Add `animate-pulse` to play icon when playing | Subtle glow effect |
| **Preset name** | `font-display text-sm font-semibold text-foreground truncate` | Truncate with ellipsis |
| **Synth badge** | `text-[10px] uppercase tracking-wider text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 flex-shrink-0` | Same style as current |
| **Tag pill** | `hidden sm:inline text-[10px] uppercase tracking-wider text-muted-foreground/60` | Hide on mobile |
| **Duration** | `text-xs text-muted-foreground tabular-nums flex-shrink-0 w-10 text-right` | Fixed width for alignment |

**Behavior:**
- Click row → `onSelect()` (selects preset, shows in detail panel)
- Double-click row → `onPlay()` (selects + plays)
- Or: single click selects, play button in detail panel triggers play
- **Decision**: Single click = select + auto-play. This is the most intuitive for a preset browser.

**Accessibility:**
- `role="button"`, `tabIndex={0}`
- `aria-selected={isSelected}`
- `aria-label={`Preset: ${preset.name}, ${synthLabels[preset.synth]}, ${formatDuration(preset.duration)}`}`
- Enter/Space triggers play

---

### `PresetDetail.tsx`

**Props:**
```typescript
interface PresetDetailProps {
  preset: Preset | null;
  isPlaying: boolean;
  progress: number;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
}
```

**Desktop layout (right panel, w-96):**
```
┌──────────────────────────────────────┐
│                                      │
│        Cyber Growl                   │  ← Name (large, centered)
│                                      │
│  ┌────────────────────────────────┐  │
│  │  ▂▃▅▆▇▆▅▃▂▁▂▃▅▆▇▆▅▃▂▁▂▃▅▆▇▆  │  │  ← Full waveform (seekable)
│  └────────────────────────────────┘  │
│                                      │
│       [◁]    [▶ / ❚❚]    [▷]        │  ← Transport controls
│                                      │
│  VITAL  •  Bass  Growl  Analog  6:02 │  ← Metadata row
│                                      │
└──────────────────────────────────────┘
```

**Detailed Visual Specs:**

| Element | Classes | Notes |
|---|---|---|
| **Panel container** | `glass-panel rounded-2xl p-6 sticky top-24` | Sticky so it stays visible while scrolling list |
| **Empty state** | Centered icon + text: "Select a preset to preview" | Shown when `preset === null` |
| **Progress bar** | `absolute top-0 left-0 h-0.5 bg-primary transition-all duration-100` | Width = `progress * 100%`, only when playing |
| **Preset name** | `font-display text-xl font-bold text-foreground text-center mb-4` | Hero text |
| **Waveform** | `w-full h-20 mb-4` | Full `WaveformSeekBar` (not compact, not readonly — seekable) |
| **Transport controls** | `flex items-center justify-center gap-4 mb-4` | Three buttons |
| **Prev/Next buttons** | `p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors` | Smaller than play |
| **Play button** | `p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors active:scale-95` | Larger, prominent |
| **Icons** | `w-4 h-4` for prev/next, `w-5 h-5` for play | Lucide: `SkipBack`, `Play`/`Pause`, `SkipForward` |
| **Metadata row** | `flex items-center justify-center gap-2 flex-wrap text-xs text-muted-foreground` | Synth badge, tags, duration |
| **Synth badge** | `text-[10px] uppercase tracking-widest border border-white/10 rounded-full px-2 py-0.5` | Same as rows |
| **Tags** | `text-[10px] uppercase tracking-wider text-muted-foreground/60` | No border, just text |
| **Duration** | `tabular-nums` | |

**Empty state:**
```tsx
<div className="glass-panel rounded-2xl p-6 sticky top-24 flex flex-col items-center justify-center min-h-[280px] text-center">
  <Waves className="w-8 h-8 text-muted-foreground/40 mb-3" />
  <p className="text-sm text-muted-foreground">Select a preset to preview</p>
</div>
```

**Mobile layout (slide-up sheet):**
- Default: mini bar at bottom (`h-14`) showing name + play button
- Tap mini bar → sheet expands to full detail view
- Use Framer Motion `AnimatePresence` + `motion.div` with drag-to-dismiss

**Mini bar (mobile default):**
```
┌──────────────────────────────────────┐
│  ▶ Cyber Growl              [▶] 6:02 │
└──────────────────────────────────────┘
```

---

### `SynthFilter.tsx` (updated)

**Changes from current:**
- Add preset count badge next to each filter
- Keep same pill style, just add counts

```tsx
const SYNTHS = [
  { value: "all" as const, label: "All", count: 40 },
  { value: "vital" as const, label: "Vital", count: 10 },
  { value: "serum2" as const, label: "Serum 2", count: 10 },
  { value: "pigments" as const, label: "Pigments", count: 10 },
  { value: "arturia" as const, label: "Arturia", count: 10 },
];
```

**Visual:**
```
[All (40)]  [Vital (10)]  [Serum 2 (10)]  [Pigments (10)]  [Arturia (10)]
```

Count in `text-muted-foreground/50 text-[10px]`:
```tsx
<span>{synth.label} <span className="text-muted-foreground/50 text-[10px]">({synth.count})</span></span>
```

---

## Visual Design Summary

**Color palette (existing only):**

| Element | Color |
|---|---|
| Row idle | `hover:bg-white/5` |
| Row selected | `bg-white/8 border-l-primary/60` |
| Row playing | `bg-white/8 border-l-primary` |
| Synth badge | `text-muted-foreground border border-white/10` |
| Tags | `text-muted-foreground/60` |
| Preset name (list) | `text-foreground` |
| Preset name (detail) | `text-foreground` |
| Waveform (unplayed) | `rgba(255,255,255,0.2)` |
| Waveform (played) | `rgba(255,255,255,0.8)` |
| Progress bar | `bg-primary` |
| Play button | `bg-white/10 hover:bg-white/20` |
| Transport buttons | `bg-white/5 hover:bg-white/10` |
| Duration | `text-muted-foreground` |
| Empty state icon | `text-muted-foreground/40` |

**Typography:**

| Element | Style |
|---|---|
| Row preset name | `font-display text-sm font-semibold` |
| Detail preset name | `font-display text-xl font-bold` |
| Synth badge | `text-[10px] uppercase tracking-widest` |
| Tags | `text-[10px] uppercase tracking-wider` |
| Duration | `text-xs tabular-nums` |
| Filter pills | `text-sm font-medium` |
| Empty state text | `text-sm text-muted-foreground` |

**Spacing:**

| Element | Value |
|---|---|
| Row padding | `px-4 py-3` |
| Row gap | `gap-3` |
| List container padding | `p-2` (inner) |
| Detail panel padding | `p-6` |
| Desktop gap (list ↔ detail) | `gap-6` |
| Transport button gap | `gap-4` |
| Waveform height (detail) | `h-20` |
| Waveform height (mobile mini) | `h-12` |

**Motion:**

| Element | Animation |
|---|---|
| List entrance | Fade in, 0.3s |
| Row entrance | Staggered, `delay: index * 0.03` |
| Row hover | `bg-white/5` transition, 150ms |
| Row select | Border-l color transition, 150ms |
| Playing pulse | `animate-pulse` on play icon |
| Filter change | Rows exit left, enter right (AnimatePresence) |
| Detail panel (mobile) | Slide up from bottom, spring-based |
| Progress bar | `transition-all duration-100` |
| Play button tap | `active:scale-95` |

---

## Interaction Flow

1. **Page load**: Filter bar + empty preset list + empty detail panel ("Select a preset")
2. **Click filter**: List updates with staggered animation, count reflects filtered total
3. **Click preset row**:
   - Row becomes selected (left accent bar)
   - Detail panel populates with preset info
   - Audio starts playing automatically
   - Waveform shows playback progress
4. **Click different row while playing**:
   - Previous row deselects
   - New row selected + starts playing
   - Detail panel updates smoothly
5. **Click play/pause in detail panel**: Toggles playback
6. **Click prev/next**: Moves to previous/next preset in filtered list, auto-plays
7. **Scroll list**: Detail panel stays sticky (desktop)
8. **Mobile**: Mini player bar at bottom, tap to expand full detail sheet

---

## States

| State | List | Detail Panel |
|---|---|---|
| **Default (no selection)** | All rows idle | "Select a preset to preview" |
| **Preset selected** | One row highlighted | Shows preset name, waveform, controls |
| **Playing** | Playing row pulses | Waveform animates, play → pause icon |
| **Filter active** | Only matching rows shown | Keeps current selection if still visible, resets if not |
| **Filter removes selection** | Selection cleared | Returns to empty state |
| **Audio ends** | Row stops pulsing | Play icon returns, progress resets |
| **Mobile (collapsed)** | Full list | Mini bar: name + play button |
| **Mobile (expanded)** | Full list (pushed up) | Full detail sheet, drag to dismiss |

---

## Implementation Steps

### Phase 1: Create new components

1. **Create `PresetRow.tsx`**
   - Compact row component with play icon, name, synth badge, tag, duration
   - Hover, selected, and playing states
   - Click handler triggers play

2. **Create `PresetDetail.tsx`**
   - Right panel (desktop) / bottom panel (mobile)
   - Large seekable waveform
   - Transport controls (prev, play/pause, next)
   - Metadata row
   - Empty state
   - Mobile mini bar + slide-up sheet

3. **Update `SynthFilter.tsx`**
   - Add count badges to each filter pill

4. **Create `PresetList.tsx`**
   - Replaces `PresetGrid.tsx`
   - Two-column layout on desktop (list + detail)
   - Single column on mobile (list + bottom player)
   - Filter + audio logic (moved from PresetGrid)

### Phase 2: Update exports

5. **Update `index.ts`**
   - Export `PresetList`, `PresetRow`, `PresetDetail`, `SynthFilter`
   - Remove old `PresetGrid`, `PresetCard` exports

### Phase 3: Update Portfolio.tsx

6. **Change import**: `PresetGrid` → `PresetList`
7. **Change render**: `<PresetGrid />` → `<PresetList />`

### Phase 4: Delete old files

8. **Delete `PresetGrid.tsx`**
9. **Delete `PresetCard.tsx`**

### Phase 5: Test

10. **Visual:**
    - [ ] Desktop: two-column layout with sticky detail panel
    - [ ] Tablet: stacked layout, detail below list
    - [ ] Mobile: compact rows, mini player bar
    - [ ] Row hover/selected/playing states
    - [ ] Filter with counts works
    - [ ] Empty state shows correctly

11. **Audio:**
    - [ ] Click row → plays, detail panel updates
    - [ ] Click different row → transitions smoothly
    - [ ] Play/pause in detail panel works
    - [ ] Prev/next navigates filtered list
    - [ ] Waveform is seekable in detail panel
    - [ ] Progress tracks accurately

12. **Interaction:**
    - [ ] Detail panel stays sticky while scrolling (desktop)
    - [ ] Filter change resets selection if filtered out
    - [ ] Mobile mini bar expands to full detail
    - [ ] Staggered row animations on filter change

---

## Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `lg:` (1024px+) | Two-column: list (flex-1) + detail (w-96) |
| `sm:` – `lg:` (640–1024px) | Stacked: list (max-h-50vh) + detail (full width, ~180px) |
| `< sm:` (< 640px) | Stacked: list (full) + mini player bar (h-14), expandable |

---

## Accessibility

- All rows: `role="button"`, `tabIndex={0}`, keyboard Enter/Space support
- Selected row: `aria-selected="true"`
- Playing row: `aria-label` includes "currently playing"
- Detail panel: `aria-live="polite"` for preset name changes
- Transport controls: `aria-label` on each button ("Previous preset", "Play", "Next preset")
- Waveform: `role="slider"`, `aria-valuenow` for current time
- Focus visible states on all interactive elements
- Reduced motion: respect `prefers-reduced-motion`, disable stagger animations

---

## Performance Considerations

- **Waveform decoding**: Each preset's waveform decodes on first render. With 40 presets in a list, only the detail panel's waveform needs full decoding. List rows don't show waveforms.
- **Virtualization**: Not needed for 40 rows. If count exceeds ~100, consider `react-window`.
- **Audio preloading**: Only preload the currently selected preset's audio. Others load on demand.
- **Filter animation**: Use `AnimatePresence` with `exitBeforeEnter` to avoid rendering both states simultaneously.

---

## What Changes from Current

| Aspect | Current (Card Grid) | New (DAW Split View) |
|---|---|---|
| Layout | 3-column card grid | 2-column: list + detail panel |
| Preset display | Large cards with embedded waveform | Compact rows, waveform only in detail |
| Waveform | Mini readonly waveform on every card | Full seekable waveform in detail panel |
| Scanning | 9-12 presets visible at once | 15-20 presets visible at once |
| Interaction | Click card to play | Click row to select + play, detail panel for controls |
| Navigation | No prev/next | Prev/next buttons in detail panel |
| Filter | Pills without counts | Pills with preset counts |
| Mobile | 1-column card grid | Compact list + mini player bar |
| Feel | Catalog/browser | Professional tool/DAW |
