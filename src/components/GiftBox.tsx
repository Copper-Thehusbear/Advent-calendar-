"use client";

import { useState } from "react";
import Link from "next/link";

interface GiftBoxProps {
  day: number;
  isUnlocked: boolean;
  isToday: boolean;
  isPast: boolean;
  isOpened: boolean;
  emoji?: string;
}

export default function GiftBox({ day, isUnlocked, isToday, isPast, isOpened, emoji = "🎁" }: GiftBoxProps) {
  const [hovering, setHovering] = useState(false);

  const baseClasses = "relative rounded-xl border transition-all duration-300 overflow-hidden aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer select-none";

  if (!isUnlocked) {
    return (
      <div
        className={`${baseClasses} bg-forest-900/40 border-forest-700/30 opacity-50`}
        title={`December ${day} — not yet`}
      >
        <LidDecoration muted />
        <span className="text-2xl grayscale opacity-40">🔒</span>
        <span className="text-cream/30 text-xs font-sans">{day}</span>
      </div>
    );
  }

  if (isOpened && !isToday) {
    return (
      <Link href={`/day/${day}`}>
        <div
          className={`${baseClasses} bg-forest-800/50 border-gold/20 opacity-70 hover:opacity-90 hover:border-gold/40 group`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <LidDecoration opened />
          <span className="text-2xl">{emoji}</span>
          <span className="text-cream/50 text-xs font-sans group-hover:text-cream/80">{day}</span>
          <span className="absolute bottom-1.5 right-1.5 text-xs opacity-40">✓</span>
        </div>
      </Link>
    );
  }

  if (isToday) {
    return (
      <Link href={`/day/${day}`}>
        <div
          className={`${baseClasses} bg-gradient-to-br from-forest-700 to-forest-900 border-gold animate-glow-pulse hover:scale-105 shadow-lg shadow-gold/20 z-10`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          title={`Today! Open Day ${day}`}
        >
          <LidDecoration today={hovering} />
          <span className="text-3xl animate-bounce-gentle">{emoji}</span>
          <span className="text-gold font-display text-sm font-semibold">{day}</span>
          <span className="absolute -top-1 -right-1 text-xs bg-ribbon text-cream rounded-full w-5 h-5 flex items-center justify-center font-sans font-bold shadow">
            ✦
          </span>
        </div>
      </Link>
    );
  }

  // Past but not opened — available
  return (
    <Link href={`/day/${day}`}>
      <div
        className={`${baseClasses} bg-forest-800/60 border-gold/30 hover:border-gold/60 hover:scale-102 hover:bg-forest-700/60 group`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <LidDecoration opening={hovering} />
        <span className="text-2xl transition-transform group-hover:scale-110">{emoji}</span>
        <span className="text-cream/60 text-xs font-sans group-hover:text-gold">{day}</span>
      </div>
    </Link>
  );
}

function LidDecoration({ muted, opened, today, opening }: {
  muted?: boolean;
  opened?: boolean;
  today?: boolean;
  opening?: boolean;
}) {
  const color = muted ? "bg-forest-700/30" : today ? "bg-gold" : opened ? "bg-gold/30" : "bg-gold/50";

  return (
    <div className="absolute top-0 left-0 right-0 h-2 flex items-center justify-center overflow-hidden">
      <div className={`${color} h-full w-full transition-transform duration-300 ${opening || opened ? "scale-y-0" : "scale-y-100"}`} />
      {!muted && (
        <div className={`absolute w-3 h-3 rounded-full ${today ? "bg-ribbon shadow-sm shadow-ribbon/50" : "bg-gold/40"} transition-transform duration-300 ${opening ? "scale-150" : "scale-100"}`} />
      )}
    </div>
  );
}
