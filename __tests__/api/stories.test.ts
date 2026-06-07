import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    story: { create: vi.fn() },
  },
}));

import { POST } from "@/app/api/stories/route";
import { prisma } from "@/lib/prisma";

describe("POST /api/stories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when content is missing", async () => {
    const request = new NextRequest("http://localhost/api/stories", {
      method: "POST",
      body: JSON.stringify({ eventIds: [1] }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Content is required");
    expect(prisma.story.create).not.toHaveBeenCalled();
  });

  it("creates a story linked to events", async () => {
    const created = {
      id: 1,
      content: "This is the story of how the structure came to be",
      layer: 1,
      events: [{ event: { id: 4 } }],
    };
    vi.mocked(prisma.story.create).mockResolvedValue(created as never);

    const request = new NextRequest("http://localhost/api/stories", {
      method: "POST",
      body: JSON.stringify({
        content: "This is the story of how the structure came to be",
        layer: 1,
        eventIds: [4],
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.content).toContain("structure came to be");
    expect(prisma.story.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          content: "This is the story of how the structure came to be",
          events: {
            create: [{ event: { connect: { id: 4 } } }],
          },
        }),
      })
    );
  });
});
