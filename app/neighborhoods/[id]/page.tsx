"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import HexGrid from "@/components/archive/HexGrid";


interface Lot {
  id: number;
  name: string;
  architectDesigner: string | null;
  publicSpace: boolean;
}

interface Neighborhood {
  id: number;
  name: string;
  lots: Lot[];
}

export default function NeighborhoodPage() {
  const { id } = useParams();
  const router = useRouter();
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNeighborhood() {
      const res = await fetch(`/api/neighborhoods/${id}`);
      const data = await res.json();
      setNeighborhood(data.data);
      setLoading(false);
    }
    fetchNeighborhood();
  }, [id]);

  if (loading) return <div className="loading">entering the neighborhood...</div>;
  if (!neighborhood) return <div className="loading">neighborhood not found</div>;

  return (
    <main className="neighborhood-page">
      <button className="back-btn" onClick={() => router.push("/")}>
        ← the world
      </button>

      <div className="neighborhood-header">
        <h1 className="neighborhood-name">{neighborhood.name}</h1>
        <p className="neighborhood-meta">{neighborhood.lots.length} structures</p>
      </div>

      <div className="fractal-divider" />
      <HexGrid lots={neighborhood.lots} neighborhoodId={neighborhood.id} />

      {/*<div className="lots-grid">
         {neighborhood.lots.map(lot => (
          <button
            key={lot.id}
            className="lot-card"
            onClick={() => router.push(`/lots/${lot.id}`)}
          >
            <svg
                className="lot-hex-bg"
                viewBox="0 0 100 115"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <polygon points="50,0 100,29 100,86 50,115 0,86 0,29" />
            </svg>
            <div className="lot-hex-content">
                <div className="lot-card-name">{lot.name}</div>
                {lot.architectDesigner && (
                <div className="lot-card-meta">{lot.architectDesigner}</div>
                )}
                {lot.publicSpace && (
                <div className="lot-card-tag">public</div>
                )}
            { </div> }
          </button>
        ))}

        <button className="lot-card lot-card-add">
          <div className="lot-card-name">+ add structure</div>
        </button>
      </div> */}
    </main>
  );
}