import { supabaseAdmin } from "@/lib/supabase";

// Utility function to upload a file to Supabase Storage and return its public URL
export async function uploadFile(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  console.log("Attempting upload to bucket: archive-media");
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Service key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY);
 
  const { data, error } = await supabaseAdmin.storage
    .from("archive-media")
    .upload(fileName, file);

  console.log("Uploaded result:", {data, error});

  if (error) throw new Error(error.message);

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("archive-media")
    .getPublicUrl(data.path);

  return publicUrl;
}