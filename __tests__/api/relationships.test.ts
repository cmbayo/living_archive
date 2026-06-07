import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    relationship: { create: vi.fn() },
  },
}));

import { POST } from "@/app/api/relationships/route";
import { prisma } from "@/lib/prisma";

describe("POST /api/relationships", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const request = new NextRequest("http://localhost/api/relationships", {
      method: "POST",
      body: JSON.stringify({ type: "friend" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Missing required fields");
    expect(prisma.relationship.create).not.toHaveBeenCalled();
  });

  it("creates a relationship between characters", async () => {
    const created = {
      id: 1,
      type: "friend",
      strength: 80,
      characterId: 1,
      relatedToId: 2,
      character: { id: 1, name: "Amara" },
      relatedTo: { id: 2, name: "Kofi" },
    };
    vi.mocked(prisma.relationship.create).mockResolvedValue(created as never);

    const request = new NextRequest("http://localhost/api/relationships", {
      method: "POST",
      body: JSON.stringify({
        characterId: 1,
        relatedToId: 2,
        type: "friend",
        strength: 80,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.type).toBe("friend");
    expect(prisma.relationship.create).toHaveBeenCalledWith({
      data: { type: "friend", strength: 80, characterId: 1, relatedToId: 2 },
      include: { character: true, relatedTo: true },
    });
  });
});
