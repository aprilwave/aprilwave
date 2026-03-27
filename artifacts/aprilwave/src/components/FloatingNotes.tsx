import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NOTES = ["♪", "♫", "♩", "♬", "♭", "♮"];
const NOTE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
];
const NOTE_SIZES = ["1.6rem", "2.2rem", "2.8rem", "3.6rem"];

interface FloatingNote {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
  size: string;
  lifetime: number;
}

let noteId = 0;

function makeNote(): FloatingNote {
  return {
    id: noteId++,
    x: 3 + Math.random() * 90,
    y: 5 + Math.random() * 82,
    symbol: NOTES[Math.floor(Math.random() * NOTES.length)],
    color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    size: NOTE_SIZES[Math.floor(Math.random() * NOTE_SIZES.length)],
    lifetime: 2800 + Math.random() * 2400,
  };
}

export function FloatingNotes() {
  const [notes, setNotes] = useState<FloatingNote[]>(() =>
    Array.from({ length: 3 }, makeNote)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const note = makeNote();
      setNotes(prev => {
        const trimmed = prev.length >= 5 ? prev.slice(1) : prev;
        return [...trimmed, note];
      });
      setTimeout(() => {
        setNotes(prev => prev.filter(n => n.id !== note.id));
      }, note.lifetime + 1400);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <AnimatePresence>
        {notes.map(note => (
          <motion.span
            key={note.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.38, scale: 1, y: -6 }}
            exit={{ opacity: 0, scale: 0.5, y: -22 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            style={{
              position: "absolute",
              left: `${note.x}%`,
              top: `${note.y}%`,
              color: note.color,
              fontSize: note.size,
              lineHeight: 1,
            }}
          >
            {note.symbol}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
