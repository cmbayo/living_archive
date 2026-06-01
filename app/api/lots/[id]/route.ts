import { prisma } from "@/lib/prisma";
import { MediaOwner, MediaType } from "@/app/generated/prisma/client";

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

    // fetch characters attached to this lot
    // 1. Go through the events and get the character Id
    const characterIds = [
      ...new Set(
        lot.events.map(e => e.characterId)
                  .filter((id): id is number => id != null)
      ),
    ];
    // 2. From the character Id get the mocap data
    const mocap = await prisma.mediaAttachment.findMany({
      where: {
        mediaOwner: MediaOwner.Character,
        ownerId: {
          in: characterIds,
        },
        media: {
          type: MediaType.Mocap,
        },
      },
      include: {
        media: true,
      },
    });
    // 3. appened it to media? 
    const media = [
      ...attachments.map(a => a.media),
      ...mocap.map(a => a.media),
    ];

    return Response.json({ data: { lot, media } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch lot" }, { status: 500 });
  }
}