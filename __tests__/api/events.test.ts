import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    event: { create: vi.fn() },
  },
}));

import { POST } from "@/app/api/events/route";
import { prisma } from "@/lib/prisma";

describe("POST /api/events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when name or description is missing", async () => {
    const request = new NextRequest("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ name: "Gaia speaks" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Name and description is required");
    expect(prisma.event.create).not.toHaveBeenCalled();
  });

  it("creates an event linked to lot and character", async () => {
    const created = {
      id: 1,
      name: "Gaia speaks",
      description: "The day the structure was named",
      major: true,
      lot: { id: 3 },
      character: { id: 7 },
      stories: [],
    };
    vi.mocked(prisma.event.create).mockResolvedValue(created as never);

    const request = new NextRequest("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({
        name: "Gaia speaks",
        datetime: "2026-05-18T00:00:00Z",
        description: "The day the structure was named",
        major: "true",
        lotId: "3",
        characterId: "7",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.name).toBe("Gaia speaks");
    expect(prisma.event.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: "Gaia speaks",
          major: true,
          lot: { connect: { id: 3 } },
          character: { connect: { id: 7 } },
        }),
      })
    );
  });
});
