"use client";

import { useState, type ReactNode } from "react";
import { unlock } from "@/lib/achievements";
import { crunch } from "@/lib/sound";

/**
 * Shows the hand-drawn sketch of a game; "Play it here" swaps it for the real game
 * (itch.io's embed), loaded only when asked so the page stays light.
 */
export function GamePlayer({
  uploadId, title, href, note, label = "Insert coin: play it here", children,
}: {
  label?: string;
  uploadId: number;
  title: string;
  href: string;
  note: string;
  children: ReactNode;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={`player${playing ? " is-playing" : ""}`}>
      {playing ? (
        <div className="player-screen">
          <iframe
            src={`https://itch.io/embed-upload/${uploadId}?color=f9f6ee`}
            title={`Play ${title}`}
            allow="autoplay; fullscreen; gamepad; gyroscope; accelerometer; clipboard-write"
            allowFullScreen
          />
        </div>
      ) : (
        children
      )}
      <div className="player-bar">
        {playing ? (
          <>
            <button type="button" className="player-btn" onClick={() => setPlaying(false)}>Stop playing</button>
            <a className="player-link" href={href} target="_blank" rel="noopener noreferrer">Open full screen on itch.io</a>
          </>
        ) : (
          <>
            <button
              type="button"
              className="player-btn coin"
              onClick={() => {
                crunch();
                setPlaying(true);
                unlock("player");
              }}
            >
              <span aria-hidden="true" className="coin-dot" /> {label}
            </button>
            <span className="note player-note">{note}</span>
          </>
        )}
      </div>
    </div>
  );
}
