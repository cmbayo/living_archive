import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const expected = process.env.CURRICULUM_PASSWORD;

  if (!expected) {
    return NextResponse.json({ error: "Curriculum access is not configured" }, { status: 503 });
  }

  if (!password || password !== expected) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
