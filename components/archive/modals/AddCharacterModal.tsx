"use client";

import { useState } from "react";

interface AddCharacterModalProps {
  lotId: number;
  onClose: () => void;
}

const AGE_STAGES = ["Infant", "Toddler", "Child", "Teen", "Adult", "Elder"] as const;
type AgeStage = typeof AGE_STAGES[number];

export default function AddCharacterModal({ lotId, onClose }: AddCharacterModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [backstory, setBackstory] = useState("");
  const [currentAge, setCurrentAge] = useState<AgeStage>("Adult");
  const [timeTraveler, setTimeTraveler] = useState(false);
  const [mocapFile, setMocapFile] = useState<File | null>(null);

  async function handleSubmit() {
    if (!name || !mocapFile) {
      setError("Name and mocap file are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // step 1 - create character
      const characterRes = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          backstory,
          currentAge,
          timeTraveler,
        }),
      });

      const characterData = await characterRes.json();

      if (!characterRes.ok) {
        setError(characterData.error ?? "Failed to create character");
        setLoading(false);
        return;
      }

      const characterId = characterData.data.id;

      // step 2 - upload mocap file
      const formData = new FormData();
      formData.append("file", mocapFile);
      formData.append("type", "Mocap");

      const mediaRes = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const mediaData = await mediaRes.json();

      if (!mediaRes.ok) {
        setError(mediaData.error ?? "Failed to upload mocap");
        setLoading(false);
        return;
      }

      const mediaId = mediaData.data.id;

      // step 3 - attach mocap to character
      const attachRes = await fetch("/api/media/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaId,
          mediaOwner: "Character",
          ownerId: characterId,
        }),
      });

      if (!attachRes.ok) {
        setError("Failed to attach mocap to character");
        setLoading(false);
        return;
      }

      // step 4 - create event linking character to lot
      const eventRes = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${name} arrives`,
          datetime: new Date().toISOString(),
          description: `${name} entered this space`,
          major: false,
          lotId,
          characterId,
        }),
      });

      if (!eventRes.ok) {
        setError("Failed to link character to lot");
        setLoading(false);
        return;
      }

      onClose();
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">add a character</h2>
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
              placeholder="who are you in this world?"
            />
          </div>

          <div className="form-field">
            <label className="form-label">backstory</label>
            <textarea
              className="form-input form-textarea"
              value={backstory}
              onChange={e => setBackstory(e.target.value)}
              placeholder="where do you come from? what do you carry?"
              rows={4}
            />
          </div>

          <div className="form-field">
            <label className="form-label">age</label>
            <select
              className="form-input form-select"
              value={currentAge}
              onChange={e => setCurrentAge(e.target.value as AgeStage)}
            >
              {AGE_STAGES.map(age => (
                <option key={age} value={age}>{age.toLowerCase()}</option>
              ))}
            </select>
          </div> 

          <div className="form-field form-field-row">
            <label className="form-label">time traveler</label>
            <button
              className={`toggle-btn ${timeTraveler ? "toggle-on" : ""}`}
              onClick={() => setTimeTraveler(!timeTraveler)}
            >
              {timeTraveler ? "yes" : "no"}
            </button>
          </div>

          <div className="form-field">
            <label className="form-label">mocap file (.fbx / .bvh) *</label>
            <input
              className="form-input-file"
              type="file"
              accept=".fbx,.bvh"
              onChange={e => setMocapFile(e.target.files?.[0] ?? null)}
            />
            {mocapFile && (
              <div className="file-item">
                <span className="file-name">{mocapFile.name}</span>
                <button
                  className="file-remove"
                  onClick={() => setMocapFile(null)}
                >
                  ✕
                </button>
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
            {loading ? "entering the archive..." : "add character"}
          </button>
        </div>
      </div>
    </div>
  );
}