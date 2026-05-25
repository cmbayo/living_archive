import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const events = await prisma.event.findMany({
        include: {
            lot: true,
            character: true,
            stories: true,
        },
    });

    return Response.json({ data: events });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const name = body.name as string;
        const datetime = body.datetime as string;
        const description = body.description as string;
        const major = body.major === "true";

        const lotIdRaw = body.lotId;
        const characterIdRaw = body.characterId;
        // const storyIdsRaw = body.storyIds;

        const lotId = lotIdRaw ? parseInt(lotIdRaw as string) : null;
        const characterId = characterIdRaw ? parseInt(characterIdRaw as string) : null;
        // const storyIds: number[] = storyIdsRaw ? JSON.parse(storyIdsRaw as string) : [];
        
        if (!name || !description) {
            return Response.json({ error: "Name and description is required" }, { status: 400 });
        }

        const event = await prisma.event.create({
            data: {
                name,
                datetime: new Date(datetime),
                description,
                major,
                ...(lotId && { lot: { connect: { id: lotId } } }),
                ...(characterId && { character: { connect: { id: characterId } } }),
                // ...(storyIds.length > 0 && { 
                //     stories: {
                //         create: storyIds.map(id => ({
                //         story: { connect: { id } }
                //         })),
                //     }
                // }),
            },
            
            include: {
                lot: true,
                character: true,
                stories: true,
            },
        });

        return Response.json({ data: event }, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to create event" }, { status: 500 });
    }
}