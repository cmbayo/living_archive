"use client";

import { useState, useEffect } from "react";

interface AudioPlayerProps {
  url: string;
  label?: string;
}

export default function AudioPlayer({ url, label }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(() => new Audio(url));

  const toggle = () => {
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  return (
    <div className="audio-player">
      <button className="audio-btn" onClick={toggle}>
        {playing ? "⏸" : "▶"} {label ?? "play audio"}
      </button>
    </div>
  );
}