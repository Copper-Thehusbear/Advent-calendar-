export type CardType = "message" | "memory" | "coupon" | "love-note" | "poem";

export interface DayCard {
  id: number;
  title: string;
  message: string;
  type: CardType;
  emoji?: string;
  imageUrl?: string;
  audioUrl?: string;
  giftHint?: string;
  couponTitle?: string;
  couponDescription?: string;
  backgroundColor?: string;
  accentColor?: string;
  isSpecial?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnlockRecord {
  dayId: number;
  openedAt: string;
  sessionId: string;
}

export interface CalendarStatus {
  dayId: number;
  isUnlocked: boolean;
  isOpened: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

export interface AdminStats {
  totalOpened: number;
  lastOpened: number | null;
  lastOpenedAt: string | null;
}
