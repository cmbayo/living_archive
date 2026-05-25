import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getMediaType, uploadFile } from "@/app/api/utils";
import { AgeStage } from "@/app/generated/prisma/client"; // eventually MediaType, MediaOwner,

export async function GET() {
  const stories = await prisma.character.findMany({
    include: {
      story: true,
    //   mediaAttachments: true,
      relationships: true,
      relatedTo: true
    },
  });

  return Response.json({ data: stories });
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const backstory = formData.get("backstory") as string || null;
        const currentAge = formData.get("currentAge") as AgeStage || AgeStage.Adult;
        const timeTraveler = formData.get("timeTraveler") === "true";

        const storyIdsRaw = formData.get("storyIds");
        const storyIds: number[] = storyIdsRaw ? JSON.parse(storyIdsRaw as string) : [];
        const relationshipsRaw = formData.get("relationship");
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