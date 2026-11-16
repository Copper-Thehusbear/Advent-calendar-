"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Snow from "@/components/Snow";
import FrogCursor from "@/components/FrogCursor";

const HINTS = [
  "Psst… it's something you say to me.",
  "Three words. Starts with 'I'…",
  "Think about copper. And love. 🐸",
];

export default function EntrancePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if already authenticated
    fetch("/api/days").then((r) => {
      if (r.ok) router.replace("/calendar");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      if (res.ok) {
        router.push("/calendar");
      } else {
        setShaking(true);
        setError("Those aren't quite the right words… try again? 🐸");
        setTimeout(() => setShaking(false), 600);
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setHintIndex((i) => (i + 1) % HINTS.length);
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-forest-radial">
      <Snow count={45} />
      <FrogCursor />

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-8 left-8 text-4xl animate-twinkle opacity-30">❄️</div>
        <div className="absolute top-16 right-12 text-3xl animate-twinkle opacity-20" style={{ animationDelay: "1s" }}>⭐</div>
        <div className="absolute bottom-20 left-16 text-3xl animate-float opacity-20" style={{ animationDelay: "0.5s" }}>🕯️</div>
        <div className="absolute bottom-12 right-10 text-4xl animate-twinkle opacity-25" style={{ animationDelay: "2s" }}>✨</div>
        <div className="absolute top-1/3 left-6 text-2xl animate-float opacity-15" style={{ animationDelay: "1.5s" }}>🌿</div>
        <div className="absolute top-1/4 right-8 text-2xl animate-float opacity-15" style={{ animationDelay: "0.8s" }}>🌿</div>
      </div>

      {/* Main card */}
      <div
        className={`relative z-10 w-full max-w-sm mx-4 animate-fade-in`}
        style={{ animationDelay: "0.2s" }}
      >
        {/* House illustration */}
        <div className="text-center mb-6 animate-float">
          <div className="inline-block relative">
            <span className="text-6xl">🏠</span>
            <span className="absolute -top-2 -right-2 text-2xl animate-twinkle">⭐</span>
          </div>
        </div>

        <div className="card-parchment rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-xs font-sans tracking-[0.3em] uppercase text-forest-700/60 mb-2">
              Private
            </div>
            <h1 className="font-display text-3xl text-forest-900 leading-tight">
              CRABMAS
            </h1>
            <p className="font-display text-sm text-forest-700/70 italic mt-1">
              24 Days With My Little Frog
            </p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-px bg-forest-700/20 flex-1" />
              <span className="text-lg">🐸🦀</span>
              <div className="h-px bg-forest-700/20 flex-1" />
            </div>
          </div>

          {/* Password prompt */}
          <div className="mb-6">
            <p className="text-center text-forest-800/80 font-body text-sm leading-relaxed mb-5">
              Only my Mini Crab Stick knows<br />the magic words.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className={`relative transition-transform duration-100 ${shaking ? "animate-shake" : ""}`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Type the magic words…"
                  className="w-full px-4 py-3 rounded-xl border-2 border-forest-700/20 bg-cream/80 text-forest-900 font-body placeholder:text-forest-700/40 focus:border-gold focus:outline-none focus:bg-cream transition-all text-center"
                  autoComplete="off"
                  autoFocus
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-center text-burgundy text-sm font-body animate-fade-in">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !password.trim()}
                className="w-full py-3 rounded-xl bg-forest-800 text-cream font-display text-sm tracking-wider hover:bg-forest-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">❄</span>
                    Opening…
                  </span>
                ) : (
                  "Enter ✦"
                )}
              </button>
            </form>
          </div>

          {/* Hint */}
          <div className="text-center">
            {showHint ? (
              <p className="text-forest-700/60 text-xs font-body italic animate-fade-in">
                {HINTS[hintIndex]}
              </p>
            ) : (
              <button
                onClick={handleHint}
                className="text-forest-700/40 text-xs font-sans hover:text-forest-700/70 transition-colors"
              >
                Need a hint?
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-cream/20 text-xs mt-4 font-sans">
          Made with ❤️ for James
        </p>
      </div>
    </main>
  );
}
