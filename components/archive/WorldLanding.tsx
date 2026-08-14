"use client";

import { useState } from "react";
import CurriculumView from "@/components/archive/CurriculumView";
import LearnMoreView from "@/components/archive/LearnMoreView";

type LandingView = "landing" | "curriculum" | "learn";

interface WorldLandingProps {
  onEnterWorld: () => void;
  worldReady: boolean;
}

export default function WorldLanding({ onEnterWorld, worldReady }: WorldLandingProps) {
  const [view, setView] = useState<LandingView>("landing");

  if (view === "curriculum") {
    return <CurriculumView onBack={() => setView("landing")} />;
  }

  if (view === "learn") {
    return <LearnMoreView onBack={() => setView("landing")} />;
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
