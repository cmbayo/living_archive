import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { MediaOwner } from "@/app/generated/prisma/client";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const lot = await prisma.lot.findUnique({
      where: { id },
      include: {
        neighborhood: true,
        events: {
          include: {
            stories: {
              include: {
                story: true,
              },
            },
          },
        },
      },
    });

    if (!lot) {
      return Response.json({ error: "Lot not found" }, { status: 404 });
    }

    // fetch media attachments for this lot
    const attachments = await prisma.mediaAttachment.findMany({
      where: {
        mediaOwner: MediaOwner.Lot,
        ownerId: id,
      },
      include: {
        media: true,
      },
    });

    const media = attachments.map(a => a.media);

    return Response.json({ data: { lot, media } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch lot" }, { status: 500 });
  }
}