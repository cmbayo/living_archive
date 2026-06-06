import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getMediaType } from "@/lib/media";
import { uploadFile } from "@/app/api/utils";
import { MediaType, MediaOwner } from "@/app/generated/prisma/client";

export async function GET() {
  const lots = await prisma.lot.findMany({
    include: {
      neighborhood: true,
      events: true,
    },
  });

  return Response.json({ data: lots });
}

// we didn't take care of events in this one
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const model = formData.get("model") as File;
    const dateFounded = formData.get("dateFounded") as string | null;
    const architectDesigner = formData.get("architectDesigner") as string | null;
    const publicSpace = formData.get("publicSpace") === "true";
    const neighborhoodId = formData.get("neighborhoodId");
    const files = formData.getAll("media") as File[];

    if (!name || !model) {
      return Response.json(
        { error: "Name and 3D model are required" },
        { status: 400 }
      );
    }

    // create the lot
    const lot = await prisma.lot.create({
      data: {
        name,
        dateFounded: dateFounded ? new Date(dateFounded) : null,
        architectDesigner,
        publicSpace,
        ...(neighborhoodId && {
          neighborhoodId: parseInt(neighborhoodId as string),
        }),
      },
      include: {
        neighborhood: true,
      },
    });

    // upload the model
    const modelUrl = await uploadFile(model);

    // create media row
    const media = await prisma.media.create({
      data: {
        url: modelUrl,
        type: MediaType.Structure3D,
      },
    });

    // create the mediaAttachment with the real lot id
    await prisma.mediaAttachment.create({
      data: {
        mediaId: media.id,
        mediaOwner: MediaOwner.Lot,
        ownerId: lot.id,
      },
    });

    // loop through additional media files and upload them
    for (const file of files) {
        const url = await uploadFile(file);
        const media = await prisma.media.create({
            data: { url, type: getMediaType(file) }
        });
        await prisma.mediaAttachment.create({
            data: { mediaId: media.id, mediaOwner: MediaOwner.Lot, ownerId: lot.id }
        });
    }
    return Response.json({ data: lot }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}