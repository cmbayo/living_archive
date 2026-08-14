"use client";

import { useState } from "react";

interface LearnMoreViewProps {
  onBack: () => void;
}

export default function LearnMoreView({ onBack }: LearnMoreViewProps) {
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

  return (
    <div className="world-landing">
      <button className="back-btn" onClick={onBack}>← back</button>
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
