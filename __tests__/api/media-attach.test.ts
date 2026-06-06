import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    mediaAttachment: { create: vi.fn() },
  },
}));

import { POST } from "@/app/api/media/attach/route";
import { prisma } from "@/lib/prisma";
import { MediaOwner } from "@/app/generated/prisma/client";

describe("POST /api/media/attach", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const request = new NextRequest("http://localhost/api/media/attach", {
      method: "POST",
      body: JSON.stringify({ mediaId: 1, mediaOwner: MediaOwner.Character }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Missing required fields");
    expect(prisma.mediaAttachment.create).not.toHaveBeenCalled();
  });

  it("creates a media attachment", async () => {
    const created = {
      id: 1,
      mediaId: 9,
      mediaOwner: MediaOwner.Character,
      ownerId: 2,
      media: { id: 9, url: "https://example.com/walk.fbx" },
    };
    vi.mocked(prisma.mediaAttachment.create).mockResolvedValue(created as never);

    const request = new NextRequest("http://localhost/api/media/attach", {
      method: "POST",
      body: JSON.stringify({
        mediaId: 9,
        mediaOwner: MediaOwner.Character,
        ownerId: 2,
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.mediaId).toBe(9);
    expect(prisma.mediaAttachment.create).toHaveBeenCalledWith({
      data: { mediaId: 9, mediaOwner: MediaOwner.Character, ownerId: 2 },
      include: { media: true },
    });
  });
});
