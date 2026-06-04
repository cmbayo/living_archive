"use client";

import { useState } from "react";
import { Event } from "@/types";

interface AddStoryModalProps {
  events: Event[];
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddStoryModal({ events, onClose, onSuccess }: AddStoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);

  function toggleEvent(id: number) {
    setSelectedEventIds(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  }

  async function handleSubmit() {
    if (!content) {
      setError("Story content is required");
      return;
    }

    if (selectedEventIds.length === 0) {
      setError("Select at least one event this story is about");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        eventIds: selectedEventIds,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to create story");
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
          <h2 className="modal-title">add a story</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-field">
            <label className="form-label">your story *</label>
            <textarea
              className="form-input form-textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="what do you want to add to this world?"
              rows={6}
            />
          </div>

          <div className="form-field">
            <label className="form-label">which events does this story touch? *</label>
            <div className="event-select-list">
              {events.sort((a, b) => a.datetime > b.datetime ? 1 : -1).map(event => (
                <button
                  key={event.id}
                  className={`event-select-item ${selectedEventIds.includes(event.id) ? "event-select-active" : ""}`}
                  onClick={() => toggleEvent(event.id)}
                >
                  <span className="event-select-name">{event.name}</span>
                  <span className="event-select-date">
                    {new Date(event.datetime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>cancel</button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "weaving the story..." : "add story"}
          </button>
        </div>
      </div>
    </div>
  );
}