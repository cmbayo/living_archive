import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Log for now — wire up email service or database storage as needed
  console.log("[contact]", { name, email, message, at: new Date().toISOString() });

  return NextResponse.json({ ok: true });
}
