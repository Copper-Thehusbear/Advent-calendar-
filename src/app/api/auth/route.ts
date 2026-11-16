import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const ENTRY_PASSWORD = process.env.NEXT_PUBLIC_ENTRY_PASSWORD || "I love copper";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "crabmas-secret-change-me"
);

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password.trim().toLowerCase() !== ENTRY_PASSWORD.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Wrong magic words" }, { status: 401 });
    }

    const token = await new SignJWT({ role: "visitor" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(JWT_SECRET);

    const res = NextResponse.json({ success: true });
    res.cookies.set("crabmas_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete("crabmas_session");
  return res;
}
