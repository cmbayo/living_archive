import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getMediaType, uploadFile } from "@/app/api/utils";
import { AgeStage } from "@/app/generated/prisma/client"; // eventually MediaType, MediaOwner,
import { MediaOwner } from "@/app/generated/prisma/client";

export async function GET() {
  const characters = await prisma.character.findMany({
    include: {
      story: true,
      relationships: true,
      relatedTo: true
    },
  });

  // fetch media attachments for each character
  const charactersWithMedia = await Promise.all(
    characters.map(async character => {
      const attachments = await prisma.mediaAttachment.findMany({
        where: {
          mediaOwner: MediaOwner.Character,
          ownerId: character.id,
        },
        include: { media: true },
      });
      return { ...character, media: attachments.map(a => a.media) };
    })
  );

  return Response.json({ data: charactersWithMedia });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const name = body.name as string;
        const backstory = body.backstory as string || null;
        const currentAge = body.currentAge as AgeStage || AgeStage.Adult;
        const timeTraveler = body.timeTraveler === "true";

        const storyIdsRaw = body.storyIds;
        const storyIds: number[] = storyIdsRaw ? JSON.parse(storyIdsRaw as string) : [];
        const relationshipsRaw = body.relationship;
        const relationships: {
            relatedCharacterId: number;
            relationshipType: string;
        }[] = typeof relationshipsRaw === "string"? JSON.parse(relationshipsRaw): [];
        
        if (!name) {
            return Response.json({ error: "Name is required" }, { status: 400 });
        }

        const character = await prisma.character.create({
            data: {
                name,
                backstory,
                currentAge,
                timeTraveler,
                ...(storyIds.length > 0 && { 
                    story: {
                        connect: storyIds.map(id => ( { id } )),
                    }
                }),
                ...(relationships.length > 0 && {
                    relationships: {
                        create: relationships.map(rel => ({
                            type: rel.relationshipType,
                            relatedTo: {
                            connect: { id: rel.relatedCharacterId }
                            }
                        })),
                    }
                }),
            },
            include: {
                story: true,
                relationships: true,
            },
        });

        return Response.json({ data: character }, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to create character" }, { status: 500 });
    }
}