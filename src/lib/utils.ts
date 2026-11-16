import { CALENDAR_YEAR, TIMEZONE } from "./constants";

export function getThaiNow(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
}

export function getCalendarDate(day: number): Date {
  return new Date(CALENDAR_YEAR, 11, day); // Month is 0-indexed
}

export function getDayStatus(day: number) {
  const now = getThaiNow();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(CALENDAR_YEAR, 11, day); // December day

  if (today < target) {
    return { isUnlocked: false, isToday: false, isPast: false, isFuture: true };
  }
  if (today.getTime() === target.getTime()) {
    return { isUnlocked: true, isToday: true, isPast: false, isFuture: false };
  }
  return { isUnlocked: true, isToday: false, isPast: true, isFuture: false };
}

export function getCountdownToNextDay(): { hours: number; minutes: number; seconds: number } {
  const now = getThaiNow();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function formatOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function getDayEmoji(day: number): string {
  const emojis = [
    "🎄", "⭐", "🦌", "🔔", "🕯️",
    "🎁", "⛄", "🧦", "🌟", "🎶",
    "🍪", "🦀", "🐸", "🌙", "❄️",
    "🎅", "🍊", "🌿", "🎿", "🧤",
    "🕊️", "🍷", "✨", "❤️",
  ];
  return emojis[(day - 1) % emojis.length];
}
