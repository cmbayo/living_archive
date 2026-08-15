import { prisma } from "@/lib/prisma";
import { MediaOwner, MediaType } from "@/app/generated/prisma/client";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);

    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id },
      include: {
        lots: {
          include: {
            events: true,
          },
        },
      },
    });

    if (!neighborhood) {
      return Response.json({ error: "Neighborhood not found" }, { status: 404 });
    }

    const lotIds = neighborhood.lots.map(l => l.id);
    const attachments = lotIds.length > 0
      ? await prisma.mediaAttachment.findMany({
          where: {
            mediaOwner: MediaOwner.Lot,
            ownerId: { in: lotIds },
            media: { type: MediaType.Structure3D },
          },
          include: { media: true },
        })
      : [];

    const modelByLotId = new Map(
      attachments.map(a => [a.ownerId, a.media.url])
    );

    const lots = neighborhood.lots.map(lot => ({
      ...lot,
      modelUrl: modelByLotId.get(lot.id) ?? null,
    }));

    return Response.json({ data: { ...neighborhood, lots } });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch neighborhood" }, { status: 500 });
  }
}