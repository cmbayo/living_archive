"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import HexGrid from "@/components/archive/HexGrid";
import AddLotModal from "@/components/archive/modals/AddLotModal";
import NeighborhoodScene from "@/components/three/NeighborhoodScene";


interface Lot {
  id: number;
  name: string;
  architectDesigner: string | null;
  publicSpace: boolean;
  modelUrl?: string | null;
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
  const [showAddLot, setShowAddLot] = useState(false);

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

      <NeighborhoodScene lots={neighborhood.lots} />

      <div className="fractal-divider" />
      <HexGrid
        lots={neighborhood.lots} 
        neighborhoodId={neighborhood.id} 
        onAddLot={() => setShowAddLot(true)}
      />
      {showAddLot && (
        <AddLotModal
        neighborhoodId={neighborhood.id}
        onClose={() => setShowAddLot(false)}
        />
      )}
    </main>
  );
}