import { supabaseAdmin } from "@/lib/supabase";

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