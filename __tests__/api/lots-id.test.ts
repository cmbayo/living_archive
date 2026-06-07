import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    lot: { findUnique: vi.fn() },
    mediaAttachment: { findMany: vi.fn() },
  },
}));

import { GET } from "@/app/api/lots/[id]/route";
import { prisma } from "@/lib/prisma";
import { MediaOwner, MediaType } from "@/app/generated/prisma/client";

const params = (id: string) => ({ params: Promise.resolve({ id }) });

describe("GET /api/lots/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 when lot is not found", async () => {
    vi.mocked(prisma.lot.findUnique).mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/lots/99"), params("99"));
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toBe("Lot not found");
  });

  it("merges lot media with mocap from event characters", async () => {
    vi.mocked(prisma.lot.findUnique).mockResolvedValue({
      id: 1,
      name: "Structure A",
      events: [
        { characterId: 10 },
        { characterId: 20 },
        { characterId: 10 },
      ],
    } as never);

    vi.mocked(prisma.mediaAttachment.findMany)
      .mockResolvedValueOnce([
        { media: { id: 1, type: MediaType.Structure3D, url: "https://example.com/model.glb" } },
      ] as never)
      .mockResolvedValueOnce([
        { media: { id: 2, type: MediaType.Mocap, url: "https://example.com/walk.fbx" } },
      ] as never);

    const response = await GET(new Request("http://localhost/api/lots/1"), params("1"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.media).toHaveLength(2);
    expect(body.data.media.map((m: { id: number }) => m.id)).toEqual([1, 2]);

    expect(prisma.mediaAttachment.findMany).toHaveBeenNthCalledWith(1, {
      where: { mediaOwner: MediaOwner.Lot, ownerId: 1 },
      include: { media: true },
    });

    expect(prisma.mediaAttachment.findMany).toHaveBeenNthCalledWith(2, {
      where: {
        mediaOwner: MediaOwner.Character,
        ownerId: { in: [10, 20] },
        media: { type: MediaType.Mocap },
      },
      include: { media: true },
    });
  });

  it("skips mocap lookup when lot has no event characters", async () => {
    vi.mocked(prisma.lot.findUnique).mockResolvedValue({
      id: 2,
      name: "Empty lot",
      events: [{ characterId: null }],
    } as never);

    vi.mocked(prisma.mediaAttachment.findMany).mockResolvedValueOnce([] as never);

    const response = await GET(new Request("http://localhost/api/lots/2"), params("2"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.media).toEqual([]);
    expect(prisma.mediaAttachment.findMany).toHaveBeenCalledOnce();
  });
});
