"use client";

import { useState } from "react";

type LandingView = "landing" | "curriculum" | "learn";

interface WorldLandingProps {
  onEnterWorld: () => void;
  worldReady: boolean;
}

export default function WorldLanding({ onEnterWorld, worldReady }: WorldLandingProps) {
  const [view, setView] = useState<LandingView>("landing");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setContactStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setContactStatus("sent");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch {
      setContactStatus("error");
    }
  }

  if (view === "curriculum") {
    return (
      <div className="world-landing">
        <button className="back-btn" onClick={() => setView("landing")}>← back</button>
        <div className="world-landing-content">
          <p className="world-landing-eyebrow">Workshop Program</p>
          <h1 className="world-landing-title">Curriculum</h1>
          <div className="world-landing-divider" />

          <div className="world-landing-section">
            <h2 className="section-title">Overview</h2>
            <p className="world-landing-body">
              Crafting Our Legacy is a community archive workshop inspired by the fractal urban
              design of medieval Benin City. Participants explore how neighborhoods grow
              organically — then contribute their own stories, structures, and memories to a shared
              digital world.
            </p>
          </div>

          <div className="world-landing-section">
            <h2 className="section-title">Modules</h2>
            <ol className="world-landing-list">
              <li>
                <strong>Mapping the World</strong> — Navigate the hex grid, understand
                neighborhoods and lots, and learn how the archive mirrors Benin City&apos;s
                repeating patterns.
              </li>
              <li>
                <strong>Building a Lot</strong> — Document a physical or imagined structure:
                upload 3D scans, photos, and audio recordings tied to a specific place.
              </li>
              <li>
                <strong>Layering Stories</strong> — Add characters, events, and multi-layered
                narratives that connect personal history to community memory.
              </li>
              <li>
                <strong>Preserving Process</strong> — Reflect on what it means to archive not
                just artifacts, but the act of imagining and building together.
              </li>
            </ol>
          </div>

          <div className="world-landing-section">
            <h2 className="section-title">For Educators</h2>
            <p className="world-landing-body">
              Designed for 5–20 participants in workshop settings. Sessions can run as a single
              afternoon or span several weeks. No prior technical experience required — the
              interface guides contributors through each step.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === "learn") {
    return (
      <div className="world-landing">
        <button className="back-btn" onClick={() => setView("landing")}>← back</button>
        <div className="world-landing-content">
          <p className="world-landing-eyebrow">Getting Started</p>
          <h1 className="world-landing-title">How to Explore</h1>
          <div className="world-landing-divider" />

          <div className="world-landing-section">
            <h2 className="section-title">Navigation</h2>
            <ul className="world-landing-list">
              <li>Click <em>Enter the World</em> to open the hex map of neighborhoods and lots.</li>
              <li>Select a neighborhood cluster to see its lots in detail.</li>
              <li>Open a lot to view 3D structures, listen to audio stories, browse photos, and read event timelines.</li>
              <li>Use the action buttons on lot pages to add characters, events, and layered stories.</li>
            </ul>
          </div>

          <div className="world-landing-section">
            <h2 className="section-title">Contributing</h2>
            <p className="world-landing-body">
              Each lot holds layered media — 3D models, mocap characters, audio recordings, and
              photographs. Stories can span multiple events and connect to characters who inhabit
              the space. Your contributions become part of a living, growing archive.
            </p>
          </div>

          <div className="world-landing-section">
            <h2 className="section-title">Contact</h2>
            <p className="world-landing-body">
              Questions about the workshop, curriculum, or contributing to the archive? Reach out below.
            </p>

            <form className="world-landing-form" onSubmit={handleContactSubmit}>
              {contactStatus === "sent" && (
                <div className="world-landing-success">Message sent — thank you!</div>
              )}
              {contactStatus === "error" && (
                <div className="modal-error">Something went wrong. Please try again.</div>
              )}

              <div className="form-field">
                <label className="form-label">Name</label>
                <input
                  className="form-input"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="your name"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input form-textarea"
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="what would you like to know?"
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={contactStatus === "sending"}
              >
                {contactStatus === "sending" ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="world-landing">
      <div className="world-landing-content world-landing-center">
        <p className="world-landing-eyebrow">A Living Archive</p>
        <h1 className="world-landing-title">Crafting Our Legacy</h1>
        <p className="world-landing-tagline">
          An Afrofuturist community archive inspired by the fractal design of Benin City
        </p>
        <div className="world-landing-divider" />

        <div className="world-landing-actions">
          <button
            className="world-landing-btn world-landing-btn-primary"
            onClick={onEnterWorld}
            disabled={!worldReady}
          >
            {worldReady ? "Enter the World" : "Preparing the World…"}
          </button>
          <button
            className="world-landing-btn"
            onClick={() => setView("curriculum")}
          >
            Curriculum
          </button>
          <button
            className="world-landing-btn"
            onClick={() => setView("learn")}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
