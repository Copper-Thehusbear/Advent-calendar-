import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CARDS } from "@/lib/constants";
import type { DayCard } from "@/types";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin-change-me";

function checkAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-key");
  return auth === ADMIN_PASSWORD;
}

// GET — list all cards with open stats
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let cards = [...DEFAULT_CARDS];
  let opens: Record<string, { openedAt: string; count: number }> = {};

  if (process.env.FIREBASE_PROJECT_ID) {
    try {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const db = getAdminDb();

      const [daysSnap, opensSnap] = await Promise.all([
        db.collection("days").get(),
        db.collection("opens").get(),
      ]);

      // Merge Firebase cards with defaults
      const firebaseCards: Record<string, Partial<DayCard>> = {};
      daysSnap.forEach((doc) => {
        firebaseCards[doc.id] = doc.data() as Partial<DayCard>;
      });

      cards = DEFAULT_CARDS.map((c) => ({
        ...c,
        ...(firebaseCards[String(c.id)] || {}),
        id: c.id,
      }));

      opensSnap.forEach((doc) => {
        opens[doc.id] = doc.data() as { openedAt: string; count: number };
      });
    } catch {
      // Fall back to defaults
    }
  }

  return NextResponse.json({ cards, opens });
}

// PUT — update a card
export async function PUT(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id || id < 1 || id > 24) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  if (!process.env.FIREBASE_PROJECT_ID) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    await db.collection("days").doc(String(id)).set(
      { ...updates, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
