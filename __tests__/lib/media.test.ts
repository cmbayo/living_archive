import { describe, it, expect } from "vitest";
import { getMediaType } from "@/lib/media";
import { MediaType } from "@/app/generated/prisma/client";

function mockFile(name: string, type = ""): File {
  return new File(["content"], name, { type });
}

describe("getMediaType", () => {
  it("maps audio extensions", () => {
    expect(getMediaType(mockFile("story.mp3"))).toBe(MediaType.Audio);
    expect(getMediaType(mockFile("story.wav"))).toBe(MediaType.Audio);
  });

  it("maps 3D and mocap extensions", () => {
    expect(getMediaType(mockFile("structure.glb"))).toBe(MediaType.Structure3D);
    expect(getMediaType(mockFile("walk.bvh"))).toBe(MediaType.Mocap);
    expect(getMediaType(mockFile("character.fbx"))).toBe(MediaType.Mocap);
  });

  it("maps image extensions", () => {
    expect(getMediaType(mockFile("photo.jpg"))).toBe(MediaType.Photo);
    expect(getMediaType(mockFile("photo.png"))).toBe(MediaType.Photo);
  });

  it("defaults unknown extensions to Photo", () => {
    expect(getMediaType(mockFile("notes.txt"))).toBe(MediaType.Photo);
  });
});
