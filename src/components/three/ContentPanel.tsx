"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { scrollState, phaseProgress, PHASES } from "@/lib/scroll";
import { VARIETALS } from "@/lib/varietals";

/* ── Story steps ── */
const STEPS = [
  {
    n: "01",
    title: "Hand-picked at night",
    body: "Fruit comes in under moonlight, cool and unhurried, so nothing is lost to the heat of the day.",
  },
  {
    n: "02",
    title: "Rested in darkness",
    body: "Barrels sleep in a cellar without a single window. Time, not light, does the work.",
  },
  {
    n: "03",
    title: "Released when ready",
    body: "No vintage leaves before it speaks. When it does, we bottle it and not a moment sooner.",
  },
];

const FLAVOR_TYPES: Record<string, string[]> = {
  obsidian: ["FRUIT", "OAK", "FLORAL", "TANNIN"],
  lumiere: ["FRUIT", "FLORAL", "MINERAL", "OAK"],
};

const NF = {
  display: "'Playfair Display', Georgia, serif",
  serif: "'Source Serif 4', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
};

export default function ContentPanel() {
  const ref = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (!ref.current) return;

    const insidePp = phaseProgress(scrollState.progress, PHASES.INSIDE_BOTTLE);
    const cratePp = phaseProgress(scrollState.progress, PHASES.CRATE_REVEAL);

    const insideOpacity =
      insidePp > 0.01 && insidePp < 0.85
        ? Math.min(insidePp / 0.08, (0.85 - insidePp) / 0.06, 1)
        : 0;
    const crateOpacity =
      cratePp > 0.01 && cratePp < 0.95
        ? Math.min(cratePp / 0.08, (0.95 - cratePp) / 0.06, 1)
        : 0;

    const opacity = Math.max(insideOpacity, crateOpacity);
    ref.current.style.opacity = String(Math.min(opacity, 0.95));
    ref.current.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
  });

  const v = VARIETALS[scrollState.varietal] ?? VARIETALS[0];
  const types = FLAVOR_TYPES[v.id] ?? FLAVOR_TYPES.obsidian;

  const insidePp = phaseProgress(scrollState.progress, PHASES.INSIDE_BOTTLE);
  const cratePp = phaseProgress(scrollState.progress, PHASES.CRATE_REVEAL);
  const showInside = insidePp > 0.01 && insidePp < 0.85;
  const showCrate = cratePp > 0.01 && cratePp < 0.95;

  return (
    <Html transform={false}>
      <div
        ref={ref}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "44%",
          zIndex: 9999,
          background: "rgba(8,8,10,0.75)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          padding: "clamp(28px, 5vh, 60px) clamp(24px, 3vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          opacity: 0,
          pointerEvents: "none",
          borderRight: "1px solid rgba(200,162,75,0.1)",
          transition: "opacity 0.35s ease",
        }}
      >
        <div style={{ maxWidth: 440, width: "100%" }}>
          {showInside && (
            <div>
              <p
                style={{
                  fontFamily: NF.mono,
                  fontSize: "clamp(0.55rem, 0.8vw, 0.7rem)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#c8a24b",
                  marginBottom: 20,
                }}
              >
                Tasting Notes
              </p>

              <h2
                style={{
                  fontFamily: NF.display,
                  fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                  lineHeight: 1.1,
                  color: "#f6f1e7",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                What the
                <br />
                <span
                  style={{
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "#c8a24b",
                  }}
                >
                  darkness drew out.
                </span>
              </h2>

              <p
                style={{
                  fontFamily: NF.serif,
                  fontSize: "clamp(0.85rem, 1.1vw, 1.05rem)",
                  lineHeight: 1.7,
                  color: "#b8aea0",
                  marginTop: 16,
                  maxWidth: 360,
                }}
              >
                {v.name} reveals itself in layers. Let it open, and these will
                surface in turn.
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "28px 0 0",
                  borderTop: "1px solid rgba(200,162,75,0.12)",
                }}
              >
                {v.notes.map((note, i) => (
                  <li
                    key={note}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 12,
                      padding: "14px 0",
                      borderBottom: "1px solid rgba(200,162,75,0.08)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: NF.mono,
                        fontSize: "0.6rem",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "#c8a24b",
                        whiteSpace: "nowrap",
                        minWidth: 60,
                      }}
                    >
                      {types[i] ?? "NOTE"}
                    </span>
                    <span
                      style={{
                        fontFamily: NF.display,
                        fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
                        color: "#f6f1e7",
                      }}
                    >
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showCrate && (
            <div>
              <p
                style={{
                  fontFamily: NF.mono,
                  fontSize: "clamp(0.55rem, 0.8vw, 0.7rem)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#c8a24b",
                  marginBottom: 20,
                }}
              >
                Our Craft
              </p>

              <h2
                style={{
                  fontFamily: NF.display,
                  fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
                  lineHeight: 1.15,
                  color: "#f6f1e7",
                  fontWeight: 400,
                  margin: 0,
                }}
              >
                We don&apos;t rush what the
                <span style={{ fontStyle: "italic", color: "#c8a24b" }}>
                  {" "}
                  dark{" "}
                </span>
                is patient enough to finish.
              </h2>

              <div style={{ marginTop: 32 }}>
                {STEPS.map((s) => (
                  <div
                    key={s.n}
                    style={{
                      padding: "14px 0 14px 20px",
                      borderLeft: "2px solid rgba(200,162,75,0.35)",
                      marginBottom: 22,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: NF.display,
                        fontSize: "1.5rem",
                        color: "#c8a24b",
                        display: "block",
                        marginBottom: 2,
                      }}
                    >
                      {s.n}
                    </span>
                    <h3
                      style={{
                        fontFamily: NF.display,
                        fontSize: "1.1rem",
                        color: "#f6f1e7",
                        fontWeight: 400,
                        margin: 0,
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: NF.serif,
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        color: "#b8aea0",
                        margin: "4px 0 0",
                      }}
                    >
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Html>
  );
}
