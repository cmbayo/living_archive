"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hexPoints, getHexPosition, getGridDimensions } from "@/components/archive/HexUtils";
import WorldLanding from "@/components/archive/WorldLanding";
import CurriculumView from "@/components/archive/CurriculumView";
import LearnMoreView from "@/components/archive/LearnMoreView";

interface Lot { id: number; name: string; architectDesigner: string | null; publicSpace: boolean; }
interface Neighborhood { id: number; name: string; lots: Lot[]; }

type WorldOverlay = "none" | "curriculum" | "learn";

const HEX_SIZE = 40;
const CLUSTER_GAP = 0;
const ENTERED_KEY = "living-archive-entered";

function hasEnteredWorld() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ENTERED_KEY) === "true";
}

export default function WorldMap() {
  const router = useRouter();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [entered, setEntered] = useState(hasEnteredWorld);
  const [overlay, setOverlay] = useState<WorldOverlay>("none");

  useEffect(() => {
    fetch("/api/neighborhoods")
      .then(r => r.json())
      .then(data => { setNeighborhoods(data.data); setLoading(false); });
  }, []);

  if (!entered) {
    return (
      <WorldLanding
        worldReady={!loading}
        onEnterWorld={() => {
          sessionStorage.setItem(ENTERED_KEY, "true");
          setEntered(true);
        }}
      />
    );
  }

  // Guard against rendering before neighborhoods have loaded. This matters
  // because `entered` is seeded synchronously from sessionStorage, so on a
  // repeat visit it can be `true` on the very first render — before the
  // fetch() in useEffect has resolved and neighborhoods is still [].
  if (loading || neighborhoods.length === 0) {
    return (
      <main className="world-map">
        <div className="world-header">
          <h1 className="world-title">Crafting Our Legacy</h1>
          <p className="world-subtitle">A Living Archive</p>
        </div>
      </main>
    );
  }
  
  // calculate cluster offsets — lay them out in rows
  const CLUSTERS_PER_ROW = 3;
  const clusterOffsets: { x: number; y: number }[] = [];
  let currentX = HEX_SIZE;
  let currentY = HEX_SIZE * 2;
  let rowMaxHeight = 0;

  neighborhoods.forEach((n, i) => {
    const lots = n.lots.length > 0 ? n.lots : [{ id: 0, name: "", architectDesigner: null, publicSpace: false }];
    const { height, width } = getGridDimensions(lots.length, HEX_SIZE);

    if (i % CLUSTERS_PER_ROW === 0 && i !== 0) {
      currentX = HEX_SIZE;
      currentY += rowMaxHeight + CLUSTER_GAP;
      rowMaxHeight = 0;
    }

    clusterOffsets.push({ x: currentX, y: currentY });
    currentX += width + CLUSTER_GAP;
    rowMaxHeight = Math.max(rowMaxHeight, height);
  });

  const totalWidth = Math.max(...neighborhoods.map((n, i) => {
    const lots = n.lots.length > 0 ? n.lots : [null];
    const { width } = getGridDimensions(lots.length, HEX_SIZE);
    return clusterOffsets[i].x + width;
  })) + HEX_SIZE * 2;

  const lastOffset = clusterOffsets[clusterOffsets.length - 1];
  const lastLots = neighborhoods[neighborhoods.length - 1].lots;
  const { height: lastHeight } = getGridDimensions(
    Math.max(lastLots.length, 1), HEX_SIZE
  );
  const totalHeight = lastOffset.y + lastHeight + HEX_SIZE * 3;

  if (overlay === "curriculum") {
    return <CurriculumView onBack={() => setOverlay("none")} />;
  }

  if (overlay === "learn") {
    return <LearnMoreView onBack={() => setOverlay("none")} />;
  }

  return (
    <main className="world-map">
      <div className="world-header">
        <div>
          <h1 className="world-title">Crafting Our Legacy</h1>
          <p className="world-subtitle">A Living Archive</p>
        </div>
        <nav className="world-nav">
          <button className="world-nav-btn" onClick={() => setOverlay("curriculum")}>
            Curriculum
          </button>
          <button className="world-nav-btn" onClick={() => setOverlay("learn")}>
            Learn More
          </button>
        </nav>
      </div>

      <div className="world-svg-wrapper">
        <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} width="100%" className="world-svg">
          {neighborhoods.map((neighborhood, ni) => {
            const offset = clusterOffsets[ni];
            const lots = neighborhood.lots.length > 0
              ? neighborhood.lots
              : [{ id: 0, name: "", architectDesigner: null, publicSpace: false }];

            return (
              <g 
                key={neighborhood.id} 
                className="neighborhood-group"
                onClick={() => router.push(`/neighborhoods/${neighborhood.id}`)}
                      style={{ cursor: "pointer" }}
              >
                {/* neighborhood label */}
                <text
                  x={offset.x + HEX_SIZE}
                  y={offset.y - HEX_SIZE * 0.5}
                  fill="#c4922a"
                  fontSize="9"
                  fontFamily="Space Mono"
                  letterSpacing="0.1em"
                >
                  {neighborhood.name}
                </text>

                {/* lots as hexagons */}
                {lots.map((lot, li) => {
                  const { x, y } = getHexPosition(li, HEX_SIZE, offset);
                  const points = hexPoints(x, y, HEX_SIZE - 3);
                  const isEmpty = lot.id === 0;

                  return (
                    <g
                      key={lot.id}
                      className={"hex-lot"}
                    >
                      <polygon
                        points={points}
                        fill={isEmpty ? "transparent" : "rgba(196, 146, 42, 0.05)"}
                        stroke={isEmpty ? "rgba(196, 146, 42, 0.15)" : "rgba(196, 146, 42, 0.4)"}
                        strokeWidth="1"
                        strokeDasharray={isEmpty ? "3 3" : "none"}
                      />
                      {!isEmpty && (
                        <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                          fill="#e8d5b0" fontSize="7" fontFamily="Cormorant Garamond" fontStyle="italic">
                          {lot.name.length > 8 ? lot.name.slice(0, 8) + "…" : lot.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </main>
  );
}