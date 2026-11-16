"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Snow from "@/components/Snow";
import FrogCursor from "@/components/FrogCursor";
import GiftBox from "@/components/GiftBox";
import CountdownTimer from "@/components/CountdownTimer";
import { DEFAULT_CARDS } from "@/lib/constants";

interface DayStatus {
  day: number;
  isUnlocked: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isOpened: boolean;
}

export default function CalendarPage() {
  const [days, setDays] = useState<DayStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayDay, setTodayDay] = useState<number | null>(null);
  const [nextUnlockedDay, setNextUnlockedDay] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/days")
      .then((r) => {
        if (r.status === 401) {
          router.replace("/");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setDays(data.days);
        const today = data.days.find((d: DayStatus) => d.isToday);
        setTodayDay(today?.day ?? null);
        const nextLocked = data.days.find((d: DayStatus) => d.isFuture);
        setNextUnlockedDay(nextLocked?.day ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const openedCount = days.filter((d) => d.isOpened).length;
  const unlockedCount = days.filter((d) => d.isUnlocked).length;

  if (loading) {
    return (
      <div className="min-h-dvh bg-forest-radial flex items-center justify-center">
        <div className="text-center space-y-3">
          <span className="text-4xl animate-bounce-gentle block">🐸</span>
          <p className="text-cream/40 font-body text-sm">Loading your surprises…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-dvh bg-forest-radial overflow-hidden">
      <Snow count={30} />
      <FrogCursor />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="text-xs font-sans tracking-[0.3em] uppercase text-gold/60 mb-2">
            December 2026
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-gold-shimmer leading-tight">
            CRABMAS
          </h1>
          <p className="font-display text-cream/60 italic text-lg mt-1">
            24 Days With My Little Frog
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px bg-gold/20 flex-1 max-w-20" />
            <span className="text-2xl animate-float">🐸</span>
            <span className="text-gold/40 text-sm font-sans">×</span>
            <span className="text-2xl animate-float" style={{ animationDelay: "1s" }}>🦀</span>
            <div className="h-px bg-gold/20 flex-1 max-w-20" />
          </div>
        </header>

        {/* Stats bar */}
        {openedCount > 0 && (
          <div className="text-center mb-6 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-cream/40 text-xs font-sans tracking-widest uppercase">
              {openedCount} of {unlockedCount} opened · {24 - unlockedCount} surprises still to come
            </p>
          </div>
        )}

        {/* Today's spotlight */}
        {todayDay && (
          <div
            className="mb-6 p-4 rounded-2xl border border-gold/30 bg-forest-800/40 text-center animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-gold/70 text-xs font-sans tracking-widest uppercase mb-1">
              Today ✦ December {todayDay}
            </p>
            <p className="text-cream/70 font-body text-sm">
              Your gift for today is waiting. ✨
            </p>
          </div>
        )}

        {/* Calendar grid */}
        <div
          className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 mb-8 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {days.map((d) => {
            const card = DEFAULT_CARDS.find((c) => c.id === d.day);
            return (
              <GiftBox
                key={d.day}
                day={d.day}
                isUnlocked={d.isUnlocked}
                isToday={d.isToday}
                isPast={d.isPast}
                isOpened={d.isOpened}
                emoji={card?.emoji}
              />
            );
          })}
        </div>

        {/* Countdown to next day */}
        {nextUnlockedDay && (
          <div className="animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <CountdownTimer nextDay={nextUnlockedDay} />
          </div>
        )}

        {/* Storybook footer decoration */}
        <footer className="text-center mt-10 animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <div className="flex items-center justify-center gap-2 text-cream/20 text-xs font-sans">
            <span>🌿</span>
            <span>Made with love · Mini Crab Stick</span>
            <span>🌿</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
