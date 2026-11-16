import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getDayStatus } from "@/lib/utils";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "crabmas-secret-change-me"
);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("crabmas_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await jwtVerify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const previewMode = process.env.PREVIEW_MODE === "true";
  const days = Array.from({ length: 24 }, (_, i) => {
    const day = i + 1;
    const status = getDayStatus(day);
    if (previewMode) return { day, ...status, isUnlocked: true, isPast: true, isFuture: false };
    return { day, ...status };
  });

  // Get opened records from Firebase
  let openedDays: number[] = [];
  if (process.env.FIREBASE_PROJECT_ID) {
    try {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const db = getAdminDb();
      const snapshot = await db.collection("opens").get();
      openedDays = snapshot.docs.map((d) => parseInt(d.id, 10));
    } catch {
      // Non-critical
    }
  }

  const result = days.map((d) => ({
    ...d,
    isOpened: openedDays.includes(d.day),
  }));

  return NextResponse.json({ days: result });
}
