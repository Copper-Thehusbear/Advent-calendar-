"use client";

import { useState, useEffect } from "react";
import type { DayCard } from "@/types";

interface AdminData {
  cards: DayCard[];
  opens: Record<string, { openedAt: string; count: number }>;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [editCard, setEditCard] = useState<Partial<DayCard>>({});
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [loginError, setLoginError] = useState("");

  const fetchData = async (key: string) => {
    const r = await fetch("/api/admin", {
      headers: { "x-admin-key": key },
    });
    if (!r.ok) return null;
    return r.json() as Promise<AdminData>;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    const d = await fetchData(adminKey);
    if (d) {
      setData(d);
      setAuthed(true);
    } else {
      setLoginError("Wrong password.");
    }
    setLoading(false);
  };

  const handleSelect = (day: number) => {
    setSelected(day);
    const card = data?.cards.find((c) => c.id === day);
    setEditCard(card ? { ...card } : { id: day });
    setSaveState("idle");
  };

  const handleSave = async () => {
    if (!editCard.id) return;
    setSaveState("saving");
    try {
      const r = await fetch("/api/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(editCard),
      });
      if (r.ok) {
        setSaveState("saved");
        // Refresh
        const fresh = await fetchData(adminKey);
        if (fresh) setData(fresh);
        setTimeout(() => setSaveState("idle"), 2000);
      } else {
        setSaveState("error");
      }
    } catch {
      setSaveState("error");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-dvh bg-forest flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-forest-800 rounded-2xl p-8 w-full max-w-xs space-y-4">
          <h1 className="font-display text-2xl text-gold text-center">Admin</h1>
          <p className="text-cream/40 text-xs text-center font-sans">CRABMAS Control Panel</p>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-xl bg-forest-700 text-cream border border-gold/20 focus:border-gold focus:outline-none"
            autoFocus
          />
          {loginError && <p className="text-ribbon text-sm text-center">{loginError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30 transition-all disabled:opacity-40"
          >
            {loading ? "…" : "Enter"}
          </button>
        </form>
      </div>
    );
  }

  const selectedCard = data?.cards.find((c) => c.id === selected);
  const openedCount = Object.keys(data?.opens || {}).length;

  return (
    <div className="min-h-dvh bg-forest text-cream font-sans">
      {/* Header */}
      <div className="bg-forest-800 border-b border-gold/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-display text-xl text-gold">🦀 CRABMAS Admin</h1>
        <div className="text-cream/40 text-xs">
          {openedCount} / 24 opened by James
        </div>
      </div>

      <div className="flex h-[calc(100dvh-57px)]">
        {/* Day list */}
        <div className="w-56 border-r border-gold/10 overflow-y-auto flex-shrink-0">
          {data?.cards.map((card) => {
            const isOpened = !!data.opens[String(card.id)];
            const isSelected = selected === card.id;
            return (
              <button
                key={card.id}
                onClick={() => handleSelect(card.id)}
                className={`w-full text-left px-4 py-3 border-b border-gold/5 hover:bg-forest-700/40 transition-colors flex items-center gap-3 ${isSelected ? "bg-forest-700/50 border-l-2 border-l-gold" : ""}`}
              >
                <span className="text-lg">{card.emoji || "🎁"}</span>
                <div>
                  <div className="text-cream/80 text-sm">Day {card.id}</div>
                  <div className="text-cream/30 text-xs truncate max-w-28">{card.title}</div>
                </div>
                {isOpened && (
                  <span className="ml-auto text-green-400 text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🎄</span>
                <p className="text-cream/30 text-sm">Select a day to edit</p>
                {openedCount > 0 && (
                  <div className="mt-6 p-4 bg-forest-800/40 rounded-xl max-w-xs">
                    <p className="text-cream/40 text-xs text-center mb-3">James has opened:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {Object.entries(data?.opens || {}).map(([dayId, record]) => (
                        <span key={dayId} className="bg-gold/10 border border-gold/20 text-gold text-xs px-2 py-1 rounded-full">
                          Day {dayId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-xl space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-gold">Day {selected}</h2>
                {data?.opens[String(selected)] && (
                  <span className="text-green-400 text-xs bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                    Opened {new Date(data.opens[String(selected)].openedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Fields */}
              {[
                { key: "title", label: "Title", multiline: false },
                { key: "emoji", label: "Emoji", multiline: false },
                { key: "message", label: "Message", multiline: true },
                { key: "couponTitle", label: "Coupon Title (optional)", multiline: false },
                { key: "couponDescription", label: "Coupon Description (optional)", multiline: false },
                { key: "imageUrl", label: "Image URL (optional)", multiline: false },
              ].map(({ key, label, multiline }) => (
                <div key={key}>
                  <label className="block text-cream/40 text-xs mb-1 tracking-wide">{label}</label>
                  {multiline ? (
                    <textarea
                      value={(editCard as Record<string, string>)[key] || ""}
                      onChange={(e) => setEditCard({ ...editCard, [key]: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 rounded-lg bg-forest-800 border border-gold/20 text-cream text-sm focus:border-gold focus:outline-none resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={(editCard as Record<string, string>)[key] || ""}
                      onChange={(e) => setEditCard({ ...editCard, [key]: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-forest-800 border border-gold/20 text-cream text-sm focus:border-gold focus:outline-none"
                    />
                  )}
                </div>
              ))}

              {/* Type */}
              <div>
                <label className="block text-cream/40 text-xs mb-1 tracking-wide">Card Type</label>
                <select
                  value={editCard.type || "love-note"}
                  onChange={(e) => setEditCard({ ...editCard, type: e.target.value as DayCard["type"] })}
                  className="w-full px-3 py-2 rounded-lg bg-forest-800 border border-gold/20 text-cream text-sm focus:border-gold focus:outline-none"
                >
                  <option value="love-note">Love Note</option>
                  <option value="memory">Memory</option>
                  <option value="coupon">Coupon</option>
                  <option value="poem">Poem</option>
                  <option value="message">Message</option>
                </select>
              </div>

              {/* Special */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isSpecial"
                  checked={!!editCard.isSpecial}
                  onChange={(e) => setEditCard({ ...editCard, isSpecial: e.target.checked })}
                  className="accent-gold"
                />
                <label htmlFor="isSpecial" className="text-cream/60 text-sm">Special day (shows ribbon badge)</label>
              </div>

              <button
                onClick={handleSave}
                disabled={saveState === "saving"}
                className={`w-full py-3 rounded-xl font-sans text-sm transition-all ${
                  saveState === "saved" ? "bg-green-600/30 border border-green-500/40 text-green-400" :
                  saveState === "error" ? "bg-ribbon/20 border border-ribbon/40 text-ribbon" :
                  "bg-gold/20 border border-gold/40 text-gold hover:bg-gold/30"
                } disabled:opacity-40`}
              >
                {saveState === "saving" ? "Saving…" :
                 saveState === "saved" ? "✓ Saved!" :
                 saveState === "error" ? "Error — try again" :
                 "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
