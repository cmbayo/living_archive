import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile, getMediaType } from "@/app/api/utils";

export async function GET() {
  const relationships = await prisma.relationship.findMany({
    include: {
      character: true,
      relatedTo: true,
    },
  });

  return Response.json({ data: relationships });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as string;
    const strengthRaw = formData.get("strength") as string;
    const strength = strengthRaw ? parseInt(strengthRaw) : 0;
    const characterIdRaw = formData.get("characterId");
    const characterId = characterIdRaw ? parseInt(characterIdRaw as string) : null;
    const relatedToIdRaw = formData.get("relatedToId");
    const relatedToId = relatedToIdRaw ? parseInt(relatedToIdRaw as string) : null;

    if (!type || !characterId || !relatedToId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const relationship = await prisma.relationship.create({
      data: {
        type,
        strength,
        characterId,
        relatedToId,
      },
      include: {
        character: true,
        relatedTo: true,
      },
    });

    return Response.json({ data: relationship }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create relationship" }, { status: 500 });
  }
}