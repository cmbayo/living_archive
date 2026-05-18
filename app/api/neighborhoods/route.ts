import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Lot } from "@/app/generated/prisma/browser";

export async function GET() {
  const neighborhoods = await prisma.neighborhood.findMany({
    include: {
      lots: true,
    },
  });

  return Response.json({ data: neighborhoods });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name  = formData.get("name") as string;
    const lotsIdRaw = formData.get("lotsId");
    const lotIds : number[] = lotsIdRaw? JSON.parse(lotsIdRaw as string): [];
    
    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const neighborhood = await prisma.neighborhood.create({
      data: { 
        name,
        ...(lotIds.length > 0 && {
            lots: {
                connect: lotIds.map(id => ({ id })),
            },
        }),
    },
      include: {
        lots: true, 
      },
    });

    return Response.json({ data: neighborhood }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to create neighborhood" }, { status: 500 });
  }
}   