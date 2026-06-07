import { MediaType } from "@/app/generated/prisma/client";

const MEDIA_TYPE_BY_EXTENSION: Record<string, MediaType> = {
  mp3: MediaType.Audio,
  wav: MediaType.Audio,
  ogg: MediaType.Audio,
  glb: MediaType.Structure3D,
  bvh: MediaType.Mocap,
  fbx: MediaType.Mocap,
  jpg: MediaType.Photo,
  jpeg: MediaType.Photo,
  png: MediaType.Photo,
};

export function getMediaType(file: File): MediaType {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  return MEDIA_TYPE_BY_EXTENSION[fileExt ?? ""] ?? MediaType.Photo;
}
