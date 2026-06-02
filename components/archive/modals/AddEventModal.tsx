"use client";

import { useState } from "react";

interface AddEventModalProps {
  lotId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddEventModal({ lotId, onClose, onSuccess }: AddEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [major, setMajor] = useState(false);

  async function handleSubmit() {
    if (!name || !description || !datetime) {
      setError("Name, description and date are required");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        datetime: new Date(datetime).toISOString(),
        major,
        lotId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to create event");
      setLoading(false);
      return;
    }

    onSuccess?.();
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">add an event</h2>
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
              placeholder="what happened here?"
            />
          </div>

          <div className="form-field">
            <label className="form-label">description *</label>
            <textarea
              className="form-input form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="tell us more..."
              rows={4}
            />
          </div>

          <div className="form-field">
            <label className="form-label">date *</label>
            <input
              className="form-input"
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
            />
          </div>

          <div className="form-field form-field-row">
            <label className="form-label">major event</label>
            <button
              className={`toggle-btn ${major ? "toggle-on" : ""}`}
              onClick={() => setMajor(!major)}
            >
              {major ? "yes" : "no"}
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>cancel</button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "adding..." : "add event"}
          </button>
        </div>
      </div>
    </div>
  );
}