import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/app/api/utils";
import { MediaType, MediaOwner } from "@/app/generated/prisma/client";

export async function GET() {
  const media = await prisma.media.findMany({
    include: {
      attachments: true,
    },
  });

  return Response.json({ data: media });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as MediaType;
    const mediaOwner = formData.get("mediaOwner") as MediaOwner | null;
    const ownerIdRaw = formData.get("ownerId");
    const ownerId = ownerIdRaw ? parseInt(ownerIdRaw as string) : null;

    if (!file || !type ) { // mediaOwner and ownerId are optional for testing purposes
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const url = await uploadFile(file);

    const media = await prisma.media.create({
      data: {
        url,
        type,
        ...(mediaOwner && ownerId && {
          attachments: {
              create: {
              mediaOwner,
              ownerId,
              },
          },
        }),
      },
      include: {
        attachments: true,
      },
    });

    return Response.json({ data: media }, { status: 201 });
  } catch (error) {
    console.error("Error uploading media:", error);
    return Response.json({ error: "Failed to upload media" }, { status: 500 });
  }
}