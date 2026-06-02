import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stories = await prisma.story.findMany({
    include: {
      events: true,
    },
  });

  return Response.json({ data: stories });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const content = body.content as string;
        const layer = body.layer;
        
        const eventIdsRaw = body.eventIds;
        const eventIds: number[] = eventIdsRaw ?? [];

        // if the layer isn't given. 
        // find the highest layer number for stories linked to these events

        if (!content) {
            return Response.json({ error: "Content is required" }, { status: 400 });
        }

        const story = await prisma.story.create({
            data: {
                content,
                layer,
                ...(eventIds.length > 0 && { 
                    events: {
                        create: eventIds.map(id => ({
                        event: { connect: { id } }
                        })),
                    }
                }),
            },
            include: {
                events: {
                    include: {
                        event: true,
                    },  
                }
            },
        });

        return Response.json({ data: story }, { status: 201 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to create story" }, { status: 500 });
    }
}