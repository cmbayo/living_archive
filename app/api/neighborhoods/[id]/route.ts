import { prisma } from "@/lib/prisma";

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

    return Response.json({ data: neighborhood });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch neighborhood" }, { status: 500 });
  }
}