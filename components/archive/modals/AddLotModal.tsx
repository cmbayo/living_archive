"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AddLotModalProps {
  neighborhoodId: number;
  onClose: () => void;
}

export default function AddLotModal({ neighborhoodId, onClose }: AddLotModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [architectDesigner, setArchitectDesigner] = useState("");
  const [dateFounded, setDateFounded] = useState("");
  const [publicSpace, setPublicSpace] = useState(true);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);


  async function handleSubmit() {
    if (!name || !modelFile) {
      setError("Name and 3D model are required");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("model", modelFile);
    formData.append("publicSpace", String(publicSpace));
    formData.append("neighborhoodId", String(neighborhoodId));
    if (architectDesigner) formData.append("architectDesigner", architectDesigner);
    if (dateFounded) formData.append("dateFounded", dateFounded);

    additionalFiles.forEach(file => {
        formData.append("media", file);
    });

    const res = await fetch("/api/lots", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to create lot");
      setLoading(false);
      return;
    }

    router.push(`/lots/${data.data.id}`);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">add a structure</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-field">
            <label className="form-label">name *</label>
            <input
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="what is this structure called?"
            />
          </div>

          <div className="form-field">
            <label className="form-label">architect / designer</label>
            <input
              className="form-input"
              value={architectDesigner}
              onChange={e => setArchitectDesigner(e.target.value)}
              placeholder="who built it?"
            />
          </div>

          <div className="form-field">
            <label className="form-label">date founded</label>
            <input
              className="form-input"
              type="date"
              value={dateFounded}
              onChange={e => setDateFounded(e.target.value)}
            />
          </div>

          <div className="form-field form-field-row">
            <label className="form-label">public space</label>
            <button
              className={`toggle-btn ${publicSpace ? "toggle-on" : ""}`}
              onClick={() => setPublicSpace(!publicSpace)}
            >
              {publicSpace ? "yes" : "no"}
            </button>
          </div>

          <div className="form-field">
            <label className="form-label">3D model (.glb) *</label>
            <input
              className="form-input-file"
              type="file"
              accept=".glb"
              onChange={e => setModelFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">additional media (audio, photos)</label>
            <input
                className="form-input-file"
                type="file"
                accept=".mp3,.wav,.jpg,.jpeg,.png"
                multiple
                onChange={e => setAdditionalFiles(prev => [
                    ...prev,
                    ...Array.from(e.target.files ?? [])
                ])}
            />
            {additionalFiles.length > 0 && (
                <div className="file-list">
                    {additionalFiles.map((file, i) => (
                    <div key={i} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <button
                        className="file-remove"
                        onClick={() => setAdditionalFiles(prev => prev.filter((_, j) => j !== i))}
                        >
                        ✕
                        </button>
                    </div>
                    ))}
                </div>
                )}
          </div>
        </div>



        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "adding..." : "add structure"}
          </button>
        </div>
      </div>
    </div>
  );
}