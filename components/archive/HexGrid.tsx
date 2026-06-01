"use client";

import { useRouter } from "next/navigation";

interface Lot {
  id: number;
  name: string;
  architectDesigner: string | null;
  publicSpace: boolean;
}

interface HexGridProps {
  lots: Lot[];
  neighborhoodId: number;
  onAddLot: () => void;
}

const HEX_SIZE = 80;
const HEX_WIDTH = HEX_SIZE * 2;
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
const COL_SPACING = HEX_WIDTH * 0.75;
const ROW_SPACING = HEX_HEIGHT;

function hexPoints(cx: number, cy: number, size: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
  }).join(" ");
}

function getHexPosition(index: number): { x: number; y: number } {
  const col = index % 4;
  const row = Math.floor(index / 4);
  const x = col * COL_SPACING + HEX_SIZE;
  const y = row * ROW_SPACING + (col % 2 === 1 ? ROW_SPACING / 2 : 0) + HEX_SIZE;
  return { x, y };
}

export default function HexGrid({ lots, neighborhoodId, onAddLot }: HexGridProps) {
  const router = useRouter();
  const allHexes = [...lots, null]; // null is the + add structure hex

  const cols = 4;
  const rows = Math.ceil(allHexes.length / cols);
  const svgWidth = cols * COL_SPACING + HEX_SIZE * 2;
  const svgHeight = rows * ROW_SPACING + HEX_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      className="hex-grid"
    >
      {allHexes.map((lot, i) => {
        const { x, y } = getHexPosition(i);
        const points = hexPoints(x, y, HEX_SIZE - 4);
        const isAdd = lot === null;

        return (
          <g
            key={lot?.id ?? "add"}
            className={isAdd ? "hex-add" : "hex-lot"}
            onClick={() =>
              isAdd
                ? onAddLot()
                : router.push(`/lots/${lot!.id}`)
            }
            style={{ cursor: "pointer" }}
          >
            <polygon
              points={points}
              fill={isAdd ? "transparent" : "rgba(196, 146, 42, 0.05)"}
              stroke={isAdd ? "#c4922a" : "rgba(196, 146, 42, 0.4)"}
              strokeWidth={isAdd ? "1" : "1"}
              strokeDasharray={isAdd ? "4 4" : "none"}
            />
            {isAdd ? (
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#c4922a"
                fontSize="24"
                fontFamily="Space Mono"
              >
                +
              </text>
            ) : (
              <>
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#e8d5b0"
                  fontSize="11"
                  fontFamily="Cormorant Garamond"
                  fontStyle="italic"
                >
                  {lot!.name.length > 12
                    ? lot!.name.slice(0, 12) + "…"
                    : lot!.name}
                </text>
                {lot!.architectDesigner && (
                  <text
                    x={x}
                    y={y + 14}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#c4922a"
                    fontSize="8"
                    fontFamily="Space Mono"
                  >
                    {lot!.architectDesigner.length > 14
                      ? lot!.architectDesigner.slice(0, 14) + "…"
                      : lot!.architectDesigner}
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}