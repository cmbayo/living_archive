import { supabaseAdmin } from "@/lib/supabase";
import { MediaType } from "@/app/generated/prisma/client";

// Utility function to upload a file to Supabase Storage and return its public URL
export async function uploadFile(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop()?.toLowerCase();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const arrayBuffer = await file.arrayBuffer(); // using arrayBuffer so we can set content type explicitly
  const buffer = Buffer.from(arrayBuffer);

  const contentTypeMap: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    glb: "model/gltf-binary",
    bvh: "application/octet-stream",
    fbx: "application/octet-stream",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
  };

  const contentType = contentTypeMap[fileExt ?? ""] ?? file.type ?? "application/octet-stream";

  console.log("contentType:", contentType);

  const { data, error } = await supabaseAdmin.storage
    .from("archive-media")
    .upload(fileName, buffer, {
        contentType,
    });

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("archive-media")
    .getPublicUrl(data.path);

  return publicUrl;
}

export function getMediaType(file: File): MediaType {
  const fileExt = file.name.split(".").pop()?.toLowerCase();

  const mediaTypeMap: Record<string, MediaType> = {
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

  return mediaTypeMap[fileExt ?? ""] ?? MediaType.Photo;
}