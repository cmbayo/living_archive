import { supabaseAdmin } from "@/lib/supabase";

// Utility function to upload a file to Supabase Storage and return its public URL
export async function uploadFile(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const { data, error } = await supabaseAdmin.storage
    .from("archive-media")
    .upload(fileName, file);

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("archive-media")
    .getPublicUrl(data.path);

  return publicUrl;
}