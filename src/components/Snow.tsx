"use client";

import { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  char: string;
}

const SNOW_CHARS = ["❄", "❅", "❆", "·", "*"];

export default function Snow({ count = 40 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const newFlakes: Snowflake[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      size: 10 + Math.random() * 14,
      opacity: 0.3 + Math.random() * 0.5,
      char: SNOW_CHARS[Math.floor(Math.random() * SNOW_CHARS.length)],
    }));
    setFlakes(newFlakes);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {flakes.map((f) => (
        <span
          key={f.id}
          className="absolute top-0 select-none"
          style={{
            left: `${f.x}%`,
            fontSize: `${f.size}px`,
            opacity: f.opacity,
            color: "#f9f5ee",
            animationName: "snowFall",
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          }}
        >
          {f.char}
        </span>
      ))}
    </div>
  );
}
