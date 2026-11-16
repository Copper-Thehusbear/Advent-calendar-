"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Snow from "@/components/Snow";
import FrogCursor from "@/components/FrogCursor";
import type { DayCard } from "@/types";

interface DayData {
  card: DayCard;
  status: { isUnlocked: boolean; isToday: boolean; isPast: boolean; isFuture: boolean };
}

type Phase = "loading" | "locked" | "opening" | "open" | "error";
type RevealPhase = "card" | "photo";

const CONFETTI = ["❄️", "⭐", "✨", "🌟", "💛", "🐸", "🦀", "🎄"];
const POLAROID_TILTS = [-2, 1.5, -1, 2.5, -2.5, 1, -1.5, 2, -1, 1.5, -2, 1, -1.5, 2.5, -2, 1, -1, 2, -2.5, 1.5, -1, 2, -1.5, 1];

export default function DayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dayId = parseInt(id, 10);
  const [phase, setPhase] = useState<Phase>("loading");
  const [revealPhase, setRevealPhase] = useState<RevealPhase>("card");
  const [data, setData] = useState<DayData | null>(null);
  const [confetti, setConfetti] = useState<Array<{ id: number; emoji: string; x: number; delay: number }>>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isNaN(dayId) || dayId < 1 || dayId > 24) {
      router.replace("/calendar");
      return;
    }

    fetch(`/api/days/${dayId}`)
      .then((r) => {
        if (r.status === 401) { router.replace("/"); return null; }
        if (r.status === 403) { setPhase("locked"); return null; }
        if (!r.ok) { setPhase("error"); return null; }
        return r.json();
      })
      .then((d: DayData | null) => {
        if (!d) return;
        setData(d);
        setPhase("opening");
        setTimeout(() => {
          setPhase("open");
          setConfetti(
            Array.from({ length: 12 }, (_, i) => ({
              id: i,
              emoji: CONFETTI[i % CONFETTI.length],
              x: 10 + Math.random() * 80,
              delay: i * 0.1,
            }))
          );
          playBell();
          setTimeout(() => setConfetti([]), 2500);
        }, 600);
      })
      .catch(() => setPhase("error"));
  }, [dayId, router]);

  function handleFindGift() {
    setIsFlipping(true);
    setTimeout(() => {
      setRevealPhase("photo");
      setIsFlipping(false);
    }, 350);
  }

  function handleBackToCard() {
    setIsFlipping(true);
    setTimeout(() => {
      setRevealPhase("card");
      setIsFlipping(false);
    }, 350);
  }

  if (phase === "loading" || phase === "opening") {
    return (
      <div className="min-h-dvh bg-forest-radial flex items-center justify-center">
        <div className="text-center space-y-6">
          <div
            className="text-8xl transition-all duration-500"
            style={{
              transform: phase === "opening" ? "scale(1.2) rotate(5deg)" : "scale(1)",
              filter: phase === "opening" ? "drop-shadow(0 0 20px rgba(201,168,76,0.8))" : "none",
            }}
          >
            🎁
          </div>
          <p className="text-cream/40 font-body text-sm animate-pulse">
            {phase === "loading" ? "Finding your gift…" : "Opening…"}
          </p>
        </div>
      </div>
    );
  }

  if (phase === "locked") return <LockedView dayId={dayId} />;

  if (phase === "error" || !data) {
    return (
      <div className="min-h-dvh bg-forest-radial flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="text-5xl">🐸</span>
          <p className="text-cream/60 font-body">Something went wrong…</p>
          <Link href="/calendar" className="text-gold/70 text-sm hover:text-gold">← Back to calendar</Link>
        </div>
      </div>
    );
  }

  const { card } = data;
  const tilt = POLAROID_TILTS[(dayId - 1) % POLAROID_TILTS.length];

  return (
    <main className="relative min-h-dvh bg-forest-radial overflow-hidden">
      <Snow count={20} />
      <FrogCursor />

      {/* Confetti burst */}
      {confetti.map((c) => (
        <span
          key={c.id}
          className="fixed top-1/3 pointer-events-none z-50 text-2xl"
          style={{
            left: `${c.x}%`,
            animationName: "confettiFall",
            animationDuration: "1.8s",
            animationDelay: `${c.delay}s`,
            animationFillMode: "both",
            animationTimingFunction: "ease-out",
          }}
          aria-hidden
        >
          {c.emoji}
        </span>
      ))}

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* Nav */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Link href="/calendar" className="text-cream/40 hover:text-cream/80 text-sm font-sans transition-colors">
            ← Calendar
          </Link>
          <div className="text-xs font-sans text-gold/50 tracking-widest uppercase">
            December {dayId}
          </div>
          <div className="w-16" />
        </div>

        {/* Emoji + title header */}
        <div className="text-center mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <span
            className="text-6xl block mb-2"
            style={{
              filter: "drop-shadow(0 0 15px rgba(201,168,76,0.6))",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            {card.emoji || "🎁"}
          </span>
          {card.isSpecial && (
            <span className="inline-block bg-ribbon/20 border border-ribbon/30 text-ribbon text-xs px-3 py-1 rounded-full font-sans tracking-wider uppercase mb-2">
              ✦ Special Day ✦
            </span>
          )}
          <h2 className="font-display text-2xl text-gold leading-tight">{card.title}</h2>
        </div>

        {/* Phase indicator pills */}
        {card.giftHint && (
          <div className="flex justify-center gap-2 mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <button
              onClick={revealPhase === "photo" ? handleBackToCard : undefined}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${revealPhase === "card" ? "bg-gold scale-125" : "bg-gold/30"}`}
              aria-label="Card view"
            />
            <button
              onClick={revealPhase === "card" && card.giftHint ? handleFindGift : undefined}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${revealPhase === "photo" ? "bg-gold scale-125" : "bg-gold/30"}`}
              aria-label="Gift view"
            />
          </div>
        )}

        {/* Content area — transitions between card and polaroid */}
        <div
          className="transition-all duration-350"
          style={{
            opacity: isFlipping ? 0 : 1,
            transform: isFlipping ? "scale(0.95) translateY(8px)" : "scale(1) translateY(0)",
          }}
        >
          {revealPhase === "card" ? (
            /* ── PHASE 1: Sweet Card ──────────────────── */
            <div>
              <div
                className="card-parchment rounded-2xl p-7 mb-5 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                {/* Coupon header */}
                {card.type === "coupon" && card.couponTitle && (
                  <div className="mb-4 pb-4 border-b border-forest-700/15">
                    <span className="text-xs font-sans tracking-widest uppercase text-forest-700/40">Gift Coupon</span>
                    <h3 className="font-display text-xl text-forest-900 mt-1">{card.couponTitle}</h3>
                    {card.couponDescription && (
                      <p className="text-forest-700/70 text-sm font-body mt-1">{card.couponDescription}</p>
                    )}
                  </div>
                )}

                {/* Message */}
                <div className="text-forest-800 font-body leading-relaxed whitespace-pre-line text-[15px]">
                  {card.message}
                </div>

                <div className="mt-4 flex justify-end">
                  <span className="text-xs text-forest-700/30 font-sans italic">
                    {card.type === "love-note" ? "💌 A note" :
                     card.type === "memory" ? "📷 A memory" :
                     card.type === "coupon" ? "🎫 A gift" :
                     card.type === "poem" ? "📜 A poem" : "✉️ A message"}
                  </span>
                </div>
              </div>

              {/* Find your gift button */}
              {card.giftHint && (
                <button
                  onClick={handleFindGift}
                  className="w-full py-4 rounded-2xl border border-gold/30 bg-forest-800/50 text-gold font-display text-lg tracking-wide hover:bg-forest-700/60 hover:border-gold/60 transition-all duration-200 animate-fade-in group"
                  style={{ animationDelay: "0.5s", animation: "glowPulse 3s ease-in-out infinite, fadeIn 0.6s ease both 0.5s" }}
                >
                  <span style={{ display: "inline-block", animation: "float 2s ease-in-out infinite" }}>🎁</span>
                  {" "}Find your gift →
                </button>
              )}
            </div>
          ) : (
            /* ── PHASE 2: Polaroid + Gift Hint ──────── */
            <div className="animate-fade-in">
              {/* Back link */}
              <button
                onClick={handleBackToCard}
                className="text-cream/40 hover:text-cream/70 text-sm font-sans mb-6 flex items-center gap-1 transition-colors"
              >
                ← Back to card
              </button>

              {/* Polaroid frame */}
              {card.imageUrl && (
                <div
                  className="mx-auto mb-6"
                  style={{
                    maxWidth: "320px",
                    transform: `rotate(${tilt}deg)`,
                    filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.6))",
                  }}
                >
                  <div
                    style={{
                      background: "#fdfaf4",
                      padding: "12px 12px 52px",
                      borderRadius: "2px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.imageUrl}
                      alt=""
                      className="w-full object-cover"
                      style={{ display: "block", aspectRatio: "4/5", objectPosition: "center top" }}
                    />
                    {/* Polaroid caption area */}
                    <div className="text-center pt-3 pb-1">
                      <span
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "13px",
                          fontStyle: "italic",
                          color: "rgba(42,31,16,0.5)",
                          letterSpacing: "0.03em",
                        }}
                      >
                        December {dayId} · CRABMAS {new Date().getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Gift hint card */}
              <div
                className="rounded-2xl p-6 text-center border animate-fade-in"
                style={{
                  background: "linear-gradient(145deg, rgba(26,61,43,0.7), rgba(15,35,24,0.8))",
                  borderColor: "rgba(201,168,76,0.25)",
                  animationDelay: "0.15s",
                }}
              >
                <div className="text-3xl mb-3" style={{ animation: "float 2.5s ease-in-out infinite" }}>🎁</div>
                <p
                  className="font-sans text-xs tracking-widest uppercase mb-3"
                  style={{ color: "rgba(201,168,76,0.5)" }}
                >
                  Your gift is waiting
                </p>
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "18px",
                    fontStyle: "italic",
                    color: "#fdf8ef",
                    lineHeight: "1.5",
                  }}
                >
                  {card.giftHint}
                </p>
                <p
                  className="font-sans text-xs mt-4"
                  style={{ color: "rgba(201,168,76,0.3)" }}
                >
                  Look for the box with <strong style={{ color: "rgba(201,168,76,0.6)" }}>#{dayId}</strong> on it
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-5 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          {dayId > 1 && (
            <Link
              href={`/day/${dayId - 1}`}
              className="flex-1 py-3 rounded-xl border border-gold/20 text-center text-cream/50 hover:text-cream/80 hover:border-gold/40 text-sm font-sans transition-all"
            >
              ← Day {dayId - 1}
            </Link>
          )}
          <Link
            href="/calendar"
            className="flex-1 py-3 rounded-xl bg-forest-700/40 border border-gold/20 text-center text-gold/70 hover:text-gold hover:bg-forest-700/60 text-sm font-sans transition-all"
          >
            🎄 All Days
          </Link>
          {dayId < 24 && (
            <Link
              href={`/day/${dayId + 1}`}
              className="flex-1 py-3 rounded-xl border border-gold/20 text-center text-cream/50 hover:text-cream/80 hover:border-gold/40 text-sm font-sans transition-all"
            >
              Day {dayId + 1} →
            </Link>
          )}
        </div>

        <p className="text-center text-cream/20 text-xs mt-8 font-body italic">
          With love, Mini Crab Stick 🦀
        </p>
      </div>
    </main>
  );
}

function LockedView({ dayId }: { dayId: number }) {
  return (
    <main className="relative min-h-dvh bg-forest-radial overflow-hidden flex items-center justify-center">
      <Snow count={20} />
      <FrogCursor />
      <div className="relative z-10 max-w-sm mx-4 text-center animate-fade-in">
        <span className="text-6xl block mb-4 opacity-50">🔒</span>
        <h2 className="font-display text-2xl text-gold mb-3">Not yet…</h2>
        <p className="text-cream/60 font-body text-sm leading-relaxed mb-6">
          December {dayId} hasn&apos;t arrived yet, my Little Frog.<br />
          Good things are worth waiting for.
        </p>
        <Link
          href="/calendar"
          className="inline-block px-6 py-3 rounded-xl bg-forest-700/40 border border-gold/20 text-gold/70 hover:text-gold text-sm font-sans transition-all"
        >
          ← Back to Calendar
        </Link>
      </div>
    </main>
  );
}

function playBell() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 1.2);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 1.2);
    });
  } catch {
    // Audio not supported
  }
}
