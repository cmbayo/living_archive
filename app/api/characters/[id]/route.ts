import { prisma } from "@/lib/prisma";
import { MediaOwner } from "@/app/generated/prisma/client";

export async function GET(
    _: Request, 
    { params } : { params: Promise<{ id: string}> }
) {
    try {
        const {id: rawId } = await params;
        const id = parseInt(rawId);
        const character = await prisma.character.findUnique({
            where: { id },
            include: {
              relationships: {
                include: {
                  character: true,
                }
              },
              relatedTo: {
                include: {
                    character: true,
                }
              },
              story: {
                include: {
                  stories: {
                    include: {
                      story: true,
                    },
                  },
                },
              },
            }
        });

        if(!character) {
            return Response.json({ error: "Character not found"}, { status: 404});
        }

        // fetch media attachaments for this character
        const attachaments = await prisma.mediaAttachment.findMany({
            where: {
                mediaOwner: MediaOwner.Character,
                ownerId: id,
            },
            include: {
                media: true, 
            },
        });
        
        const media = attachaments.map(a => a.media);
        return Response.json({ data: {character, media } });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to fetch character" }, { status: 500 });
    }
}