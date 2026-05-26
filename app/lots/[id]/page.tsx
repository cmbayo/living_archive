"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Lot, Media } from "@/types";
import ModelViewer from "@/components/three/ModelViewer";
import LotHeader from "@/components/archive/LotHeader";
import AudioPlayer from "@/components/archive/AudioPlayer";
import EventList from "@/components/archive/EventList";
import PhotoGrid from "@/components/archive/PhotoGrid";
import MocapViewer from "@/components/archive/MocapViewer";


export default function LotPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lot, setLot] = useState<Lot | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLot() {
      const res = await fetch(`/api/lots/${id}`);
      const data = await res.json();
      setLot(data.data.lot);
      setMedia(data.data.media);
      setLoading(false);
    }
    fetchLot();
  }, [id]);

  if (loading) return <div className="loading">entering the archive...</div>;
  if (!lot) return <div className="loading">lot not found</div>;

  const model = media.find(m => m.type === "Structure3D");
  const audio = media.filter(m => m.type === "Audio");
  const photos = media.filter(m => m.type === "Photo");
  const mocap = media.filter(m => m.type === "Mocap");

//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Space+Mono:wght@400;700&display=swap');

  return (
    <main className="lot-page">
      <button
        className="back-btn"
        onClick={() => router.push(`/neighborhoods/${lot.neighborhood?.id}`)}
      >
        ← {lot.neighborhood?.name ?? "back"}
      </button>

      {model ? (
        <ModelViewer url={model.url} />
      ) : (
        <div className="model-placeholder">no model yet</div>
      )}

      <div className="lot-content">
        <LotHeader
          name={lot.name}
          neighborhood={lot.neighborhood}
          dateFounded={lot.dateFounded}
          architectDesigner={lot.architectDesigner}
          publicSpace={lot.publicSpace}
        />

        <div className="fractal-divider" />

        {audio.length > 0 && (
          <section className="lot-section">
            <div className="section-title">listen</div>
            {audio.map(a => (
              <AudioPlayer key={a.id} url={a.url} />
            ))}
          </section>
        )}

        {lot.events.length > 0 && (
          <section className="lot-section">
            <div className="section-title">events + stories</div>
            <EventList events={lot.events} />
          </section>
        )}

        {photos.length > 0 && (
          <section className="lot-section">
            <div className="section-title">photos</div>
            <PhotoGrid photos={photos} lotName={lot.name} />
          </section>
        )}

        {mocap.length > 0 && (
          <section className="lot-section">
            <div className="section-title">movement</div>
            <MocapViewer mocapFiles={mocap} />
          </section>
        )}
      </div>
    </main>
  );
}