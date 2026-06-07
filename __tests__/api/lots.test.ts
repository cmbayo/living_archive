import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/app/api/utils", () => ({
  uploadFile: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    lot: { create: vi.fn() },
    media: { create: vi.fn() },
    mediaAttachment: { create: vi.fn() },
  },
}));

import { POST } from "@/app/api/lots/route";
import { uploadFile } from "@/app/api/utils";
import { prisma } from "@/lib/prisma";

function lotRequest(fields: Record<string, string | File>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return new NextRequest("http://localhost/api/lots", { method: "POST", body: formData });
}

describe("POST /api/lots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when name or model is missing", async () => {
    const response = await POST(
      lotRequest({ name: "Structure A", publicSpace: "true" })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Name and 3D model are required");
    expect(uploadFile).not.toHaveBeenCalled();
    expect(prisma.lot.create).not.toHaveBeenCalled();
  });
});
