"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

/**
 * Intro "calling card" — the little card that accompanies a bottle of wine.
 * Appears instantly (no loading bar), locks the page at the top, and is
 * dismissed by a scroll gesture (or the Enter affordance), sliding up to
 * reveal the landing page at its start.
 */
export default function WineCard({ onEnter }: { onEnter?: () => void }) {
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  const dismiss = useCallback(() => setOut(true), []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 1) dismiss();
    };
    const onTouch = () => dismiss();
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) dismiss();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [dismiss]);

  // Keep the main page fully locked through the entire slide-out. Only once
  // the overlay is completely removed do we release scroll, pin to the top,
  // and let the main experience (Lenis) start.
  useEffect(() => {
    if (!out) return;
    const t = window.setTimeout(() => {
      setGone(true);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      onEnter?.();
    }, 1000);
    return () => window.clearTimeout(t);
  }, [out, onEnter]);

  if (gone) return null;

  return (
    <div
      className={`winecard-overlay ${out ? "is-out" : ""}`}
      role="dialog"
      aria-label="Welcome to VÉLOUR"
    >
      <div className="winecard-inner">
        <p className="winecard-kicker">A card to accompany your bottle</p>

        <div className="winecard">
          <Image
            src="/velour-label.png"
            alt="VÉLOUR — Reserve Cabernet Sauvignon, Napa Valley 2021"
            width={440}
            height={440}
            priority
          />
        </div>

        <button type="button" className="winecard-enter" onClick={dismiss}>
          <span>Scroll to enter</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M12 5v14m0 0l-6-6m6 6l6-6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
