"use client";

import { useEffect, useState } from "react";
import { getCountdownToNextDay } from "@/lib/utils";

export default function CountdownTimer({ nextDay }: { nextDay: number }) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => setTime(getCountdownToNextDay());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="text-center space-y-2">
      <p className="text-cream/60 text-sm font-body tracking-widest uppercase">
        Day {nextDay} arrives in
      </p>
      <div className="flex items-center justify-center gap-3">
        {[
          { value: time.hours, label: "hrs" },
          { value: time.minutes, label: "min" },
          { value: time.seconds, label: "sec" },
        ].map(({ value, label }, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="text-center">
              <div className="bg-forest-800/60 border border-gold/20 rounded-lg px-4 py-2 min-w-[56px]">
                <span className="text-gold font-display text-2xl tabular-nums">
                  {pad(value)}
                </span>
              </div>
              <span className="text-cream/40 text-xs mt-1 block font-sans tracking-wider uppercase">
                {label}
              </span>
            </div>
            {i < 2 && (
              <span className="text-gold/60 text-2xl font-display mb-5">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
