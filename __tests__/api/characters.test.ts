import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    character: {
      create: vi.fn(),
    },
  },
}));

import { POST } from "@/app/api/characters/route";
import { prisma } from "@/lib/prisma";

describe("POST /api/characters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when name is missing", async () => {
    const request = new NextRequest("http://localhost/api/characters", {
      method: "POST",
      body: JSON.stringify({ backstory: "Elder of the drum circle" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Name is required");
    expect(prisma.character.create).not.toHaveBeenCalled();
  });

  it("creates a character when name is provided", async () => {
    const created = {
      id: 1,
      name: "Amara",
      backstory: null,
      currentAge: "Adult",
      timeTraveler: false,
      story: [],
      relationships: [],
    };

    vi.mocked(prisma.character.create).mockResolvedValue(created as never);

    const request = new NextRequest("http://localhost/api/characters", {
      method: "POST",
      body: JSON.stringify({ name: "Amara", currentAge: "Adult" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.name).toBe("Amara");
    expect(prisma.character.create).toHaveBeenCalledOnce();
  });

  it("accepts boolean timeTraveler from JSON", async () => {
    const created = {
      id: 2,
      name: "Kofi",
      backstory: "Young builder",
      currentAge: "Adult",
      timeTraveler: true,
      story: [],
      relationships: [],
    };
    vi.mocked(prisma.character.create).mockResolvedValue(created as never);

    const request = new NextRequest("http://localhost/api/characters", {
      method: "POST",
      body: JSON.stringify({ name: "Kofi", timeTraveler: true }),
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(prisma.character.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ timeTraveler: true }),
      })
    );
  });
});
