"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lot, Media } from "@/types";
import LotHeader from "@/components/archive/LotHeader";
import AudioPlayer from "@/components/archive/AudioPlayer";
import EventList from "@/components/archive/EventList";
import PhotoGrid from "@/components/archive/PhotoGrid";
import AddCharacterModal from "@/components/archive/modals/AddCharacterModal";
import AddEventModal from "@/components/archive/modals/AddEventModal";
import AddStoryModal from "@/components/archive/modals/AddStoryModal";
// import MocapViewer from "@/components/three/MocapViewer";
// import ModelViewer from "@/components/three/ModelViewer";
import LotScene from "@/components/three/LotScene"; 

export default function LotPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lot, setLot] = useState<Lot | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCharacter, setShowAddCharacter] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);

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

  return (
    <main className="lot-page">
      <button
        className="back-btn"
        onClick={() => router.push(`/neighborhoods/${lot.neighborhood?.id}`)}
      >
        ← {lot.neighborhood?.name ?? "back"}
      </button>

      {model ? (
        // <ModelViewer url={model.url} />
        <LotScene 
          modelUrl={model?.url ?? null} 
          mocapFiles={mocap.filter(m => !!m.url)} />
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

        <div className="lot-actions">
          <button className="btn-action" onClick={() => setShowAddCharacter(true)}>
            + add character
          </button>
          <button className="btn-action" onClick={() => setShowAddEvent(true)}>
            + add event
          </button>
          <button className="btn-action" onClick={() => setShowAddStory(true)}>
            + add story
          </button>
        </div>

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
      </div>

      {showAddCharacter && (
        <AddCharacterModal
          lotId={lot.id}
          onClose={() => setShowAddCharacter(false)}
          onSuccess={() => {
            // refectch lot data so new character shows up
            fetch(`/api/lots/${id}`)
              .then(r => r.json())
              .then(data => {
                setLot(data.data.lot);
                setMedia(data.data.media);
              });
            router.refresh(); // reload so the scale works
          }}
        />
      )}

      {showAddEvent && (
        <AddEventModal
          lotId={lot.id}
          onClose={() => setShowAddEvent(false)}
          onSuccess={() => {
            // refetch lot data so new event shows up
            fetch(`/api/lots/${id}`)
              .then(r => r.json())
              .then(data => {
                setLot(data.data.lot);
                setMedia(data.data.media);
              });
          }}
        />
      )}

      {showAddStory && (
        <AddStoryModal
          events={lot.events}
          onClose={() => setShowAddStory(false)}
          onSuccess={() => {
            fetch(`/api/lots/${id}`)
              .then(r => r.json())
              .then(data => {
                setLot(data.data.lot);
                setMedia(data.data.media);
              });
          }}
        />
      )}
    </main>
  );
}