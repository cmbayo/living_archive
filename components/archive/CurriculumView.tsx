"use client";

import { useState } from "react";
import {
  CURRICULUM_MODULES,
  CURRICULUM_UNLOCK_KEY,
  type CurriculumModule,
} from "@/lib/curriculumData";

interface CurriculumViewProps {
  onBack: () => void;
}

function isUnlocked() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CURRICULUM_UNLOCK_KEY) === "true";
}

function ModuleDetail({ module }: { module: CurriculumModule }) {
  return (
    <div className="curriculum-detail">
      <p className="world-landing-eyebrow">{module.subtitle}</p>
      <h1 className="world-landing-title">{module.title}</h1>
      <div className="world-landing-divider" />

      {(module.duration || module.ageRange) && (
        <div className="curriculum-meta">
          {module.duration && <span>Duration: {module.duration}</span>}
          {module.ageRange && <span>Age: {module.ageRange}</span>}
        </div>
      )}

      {module.materials && (
        <div className="world-landing-section">
          <h2 className="section-title">Materials</h2>
          <ul className="world-landing-list">
            {module.materials.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {module.objectives && (
        <div className="world-landing-section">
          <h2 className="section-title">Learning Objectives</h2>
          <ul className="world-landing-list">
            {module.objectives.map(obj => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {module.description && (
        <div className="world-landing-section">
          <h2 className="section-title">Description</h2>
          <p className="world-landing-body">{module.description}</p>
        </div>
      )}

      {module.accessibility && (
        <div className="world-landing-section">
          <h2 className="section-title">Accessibility</h2>
          <ul className="world-landing-list">
            {module.accessibility.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {module.outline && (
        <div className="world-landing-section">
          <h2 className="section-title">Outline</h2>
          <div className="curriculum-outline">
            {module.outline.map(section => (
              <div key={section.title} className="curriculum-outline-item">
                <h3 className="curriculum-outline-title">{section.title}</h3>
                <p className="world-landing-body">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LockPrompt({
  onUnlock,
  onCancel,
}: {
  onUnlock: () => void;
  onCancel: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/curriculum/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Incorrect password");
        setLoading(false);
        return;
      }

      sessionStorage.setItem(CURRICULUM_UNLOCK_KEY, "true");
      onUnlock();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Unlock Module</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}
          <p className="world-landing-body">
            This module requires a facilitator password. Enter it below to continue.
          </p>
          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="enter password"
              autoFocus
              required
            />
          </div>
          <div className="modal-footer" style={{ padding: 0, border: "none" }}>
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Checking…" : "Unlock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CurriculumView({ onBack }: CurriculumViewProps) {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const selected = CURRICULUM_MODULES.find(m => m.id === selectedId);

  function handleModuleClick(module: CurriculumModule) {
    if (module.locked && !unlocked) {
      setPendingId(module.id);
      return;
    }
    setSelectedId(module.id);
  }

  if (selected) {
    return (
      <div className="world-landing">
        <button className="back-btn" onClick={() => setSelectedId(null)}>← modules</button>
        <div className="world-landing-content curriculum-content-wide">
          <ModuleDetail module={selected} />
        </div>
      </div>
    );
  }

  return (
    <div className="world-landing">
      <button className="back-btn" onClick={onBack}>← back</button>
      <div className="world-landing-content">
        <p className="world-landing-eyebrow">Workshop Program</p>
        <h1 className="world-landing-title">Curriculum</h1>
        <p className="world-landing-body">
          Five modules guiding participants from Benin City worldbuilding to circuits,
          mapping, and storytelling in the living archive.
        </p>
        <div className="world-landing-divider" />

        <div className="curriculum-modules">
          {CURRICULUM_MODULES.map(module => {
            const isLocked = module.locked && !unlocked;
            return (
              <button
                key={module.id}
                className={`curriculum-module-card${isLocked ? " curriculum-module-locked" : ""}`}
                onClick={() => handleModuleClick(module)}
              >
                <span className="curriculum-module-num">Module {module.id}</span>
                <span className="curriculum-module-title">{module.title}</span>
                {module.duration && (
                  <span className="curriculum-module-meta">{module.duration}</span>
                )}
                {isLocked && <span className="curriculum-module-lock">🔒 Password required</span>}
              </button>
            );
          })}
        </div>
      </div>

      {pendingId !== null && (
        <LockPrompt
          onUnlock={() => {
            setUnlocked(true);
            setSelectedId(pendingId);
            setPendingId(null);
          }}
          onCancel={() => setPendingId(null)}
        />
      )}
    </div>
  );
}
