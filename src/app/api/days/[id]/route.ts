import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getDayStatus } from "@/lib/utils";
import { DEFAULT_CARDS } from "@/lib/constants";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "crabmas-secret-change-me"
);

async function verifySession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("crabmas_session")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dayId = parseInt(id, 10);

  if (isNaN(dayId) || dayId < 1 || dayId > 24) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  const isAuthenticated = await verifySession(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Server-side date check — cannot be bypassed by client
  // PREVIEW_MODE=true in env skips the lock (for testing only)
  const previewMode = process.env.PREVIEW_MODE === "true";
  const status = getDayStatus(dayId);
  if (!status.isUnlocked && !previewMode) {
    return NextResponse.json({ error: "Not yet", locked: true }, { status: 403 });
  }

  // Try Firebase first, fall back to defaults
  let card = DEFAULT_CARDS.find((c) => c.id === dayId);

  if (process.env.FIREBASE_PROJECT_ID) {
    try {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const db = getAdminDb();
      const doc = await db.collection("days").doc(String(dayId)).get();
      if (doc.exists) {
        card = { id: dayId, ...doc.data() } as typeof card;
      }
    } catch {
      // Fall back to defaults
    }
  }

  // Record open in Firebase
  if (card && process.env.FIREBASE_PROJECT_ID) {
    try {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const db = getAdminDb();
      await db.collection("opens").doc(String(dayId)).set(
        { dayId, openedAt: new Date().toISOString(), count: 1 },
        { merge: true }
      );
    } catch {
      // Non-critical
    }
  }

  return NextResponse.json({ card, status });
}
