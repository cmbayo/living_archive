import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaOwner } from "@/app/generated/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mediaId = body.mediaId as number;
    const mediaOwner = body.mediaOwner as MediaOwner;
    const ownerId = body.ownerId as number;

    if (!mediaId || !mediaOwner || !ownerId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const attachment = await prisma.mediaAttachment.create({
      data: { mediaId, mediaOwner, ownerId },
      include: { media: true },
    });

    return Response.json({ data: attachment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to attach media" }, { status: 500 });
  }
}