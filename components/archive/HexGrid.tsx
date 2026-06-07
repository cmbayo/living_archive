"use client";

import { useRouter } from "next/navigation";
import { hexPoints, getHexPosition, getGridDimensions } from "./HexUtils"; 

interface Lot {
  id: number;
  name: string;
  architectDesigner: string | null;
  publicSpace: boolean;
}

interface HexGridProps {
  lots: Lot[];
  neighborhoodId: number;
  onAddLot?: () => void;
  hexSize?: number;
  showAdd?: boolean;
}

const HEX_SIZE = 80;
const HEX_WIDTH = HEX_SIZE * 2;
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE;
const COL_SPACING = HEX_WIDTH * 0.75;
const ROW_SPACING = HEX_HEIGHT;

export default function HexGrid({ 
  lots, 
  neighborhoodId, 
  onAddLot,
  hexSize = HEX_SIZE,
  showAdd = true, 
}: HexGridProps) {

  const router = useRouter();
  const allHexes = showAdd ? [...lots, null] : lots; // null is the + add structure hex
  const { width, height } = getGridDimensions(allHexes.length, hexSize);

  // const cols = 4;
  // const rows = Math.ceil(allHexes.length / cols);
  // const svgWidth = cols * COL_SPACING + HEX_SIZE * 2;
  // const svgHeight = rows * ROW_SPACING + HEX_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      className="hex-grid"
    >
      {allHexes.map((lot, i) => {
        const { x, y } = getHexPosition(i, hexSize);
        const points = hexPoints(x, y, hexSize - 4);
        const isAdd = lot === null;

        return (
          <g
            key={lot?.id ?? "add"}
            className={isAdd ? "hex-add" : "hex-lot"}
            onClick={() =>
              isAdd
                ? onAddLot?.()
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