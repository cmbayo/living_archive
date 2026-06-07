import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/app/api/utils", () => ({
  uploadFile: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    media: { create: vi.fn() },
  },
}));

import { POST } from "@/app/api/media/route";
import { uploadFile } from "@/app/api/utils";
import { prisma } from "@/lib/prisma";
import { MediaOwner, MediaType } from "@/app/generated/prisma/client";

function mediaRequest(fields: Record<string, string | File>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return new NextRequest("http://localhost/api/media", { method: "POST", body: formData });
}

describe("POST /api/media", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(uploadFile).mockResolvedValue("https://example.com/uploaded.glb");
  });

  it("returns 400 when file or type is missing", async () => {
    const response = await POST(mediaRequest({ type: MediaType.Audio }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Missing required fields");
    expect(uploadFile).not.toHaveBeenCalled();
  });

  it("creates media without attachment when owner fields are omitted", async () => {
    const created = { id: 1, url: "https://example.com/uploaded.glb", type: MediaType.Structure3D, attachments: [] };
    vi.mocked(prisma.media.create).mockResolvedValue(created as never);

    const file = new File(["model"], "structure.glb");
    const response = await POST(
      mediaRequest({ file, type: MediaType.Structure3D })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.url).toBe("https://example.com/uploaded.glb");
    expect(prisma.media.create).toHaveBeenCalledWith({
      data: { url: "https://example.com/uploaded.glb", type: MediaType.Structure3D },
      include: { attachments: true },
    });
  });

  it("creates media with attachment when owner fields are provided", async () => {
    const created = {
      id: 2,
      url: "https://example.com/uploaded.glb",
      type: MediaType.Mocap,
      attachments: [{ mediaOwner: MediaOwner.Character, ownerId: 5 }],
    };
    vi.mocked(prisma.media.create).mockResolvedValue(created as never);

    const file = new File(["mocap"], "walk.fbx");
    const response = await POST(
      mediaRequest({
        file,
        type: MediaType.Mocap,
        mediaOwner: MediaOwner.Character,
        ownerId: "5",
      })
    );

    expect(response.status).toBe(201);
    expect(prisma.media.create).toHaveBeenCalledWith({
      data: {
        url: "https://example.com/uploaded.glb",
        type: MediaType.Mocap,
        attachments: {
          create: { mediaOwner: MediaOwner.Character, ownerId: 5 },
        },
      },
      include: { attachments: true },
    });
  });
});
