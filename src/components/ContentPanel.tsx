"use client";

import { useEffect } from "react";
import { scrollState, phaseProgress, PHASES } from "@/lib/scroll";
import { VARIETALS } from "@/lib/varietals";

const STEPS = [
  { n: "01", title: "Hand-picked at night", body: "Fruit comes in under moonlight, cool and unhurried, so nothing is lost to the heat of the day." },
  { n: "02", title: "Rested in darkness", body: "Barrels sleep in a cellar without a single window. Time, not light, does the work." },
  { n: "03", title: "Released when ready", body: "No vintage leaves before it speaks. When it does, we bottle it and not a moment sooner." },
];

const FLAVOR_TYPES: Record<string, string[]> = {
  obsidian: ["FRUIT", "OAK", "FLORAL", "TANNIN"],
  lumiere: ["FRUIT", "FLORAL", "MINERAL", "OAK"],
};

export default function ContentPanel() {
  useEffect(() => {
    const panel = document.createElement("div");
    panel.id = "velour-panel";
    panel.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 36%;
      z-index: 99999;
      background: rgba(8,8,10,0.7);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      padding: clamp(28px, 5vh, 60px) clamp(24px, 3vw, 48px);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      opacity: 0;
      visibility: hidden;
      border-right: 1px solid rgba(200,162,75,0.1);
      box-sizing: border-box;
      overflow-y: auto;
      pointer-events: none;
    `;
    document.body.appendChild(panel);

    // inner content wrapper
    const inner = document.createElement("div");
    inner.style.cssText = "max-width:420px;width:100%;";
    panel.appendChild(inner);

    // --- Tasting section ---
    const tasting = document.createElement("div");
    tasting.style.display = "block";
    inner.appendChild(tasting);

    // --- Crate section ---
    const craft = document.createElement("div");
    craft.style.display = "none";
    inner.appendChild(craft);

    const updateContent = () => {
      const v = VARIETALS[scrollState.varietal] ?? VARIETALS[0];
      const types = FLAVOR_TYPES[v.id] ?? FLAVOR_TYPES.obsidian;
      tasting.innerHTML = `
        <p style="font-family:'JetBrains Mono',monospace;font-size:clamp(.55rem,.8vw,.7rem);letter-spacing:.2em;text-transform:uppercase;color:#c8a24b;margin:0 0 20px">Tasting Notes</p>
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.8rem,4vw,3.2rem);line-height:1.1;color:#f6f1e7;font-weight:400;margin:0">
          What the<br>
          <span style="font-style:italic;font-weight:300;color:#c8a24b">darkness drew out.</span>
        </h2>
        <p style="font-family:'Source Serif 4',Georgia,serif;font-size:clamp(.85rem,1.1vw,1.05rem);line-height:1.7;color:#b8aea0;margin:16px 0 0;max-width:360px">
          ${v.name} reveals itself in layers. Let it open, and these will surface in turn.
        </p>
        <ul style="list-style:none;padding:0;margin:28px 0 0;border-top:1px solid rgba(200,162,75,.12)">
          ${v.notes.map((n, i) => `
            <li style="display:flex;align-items:baseline;gap:12px;padding:14px 0;border-bottom:1px solid rgba(200,162,75,.08)">
              <span style="font-family:'JetBrains Mono',monospace;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:#c8a24b;white-space:nowrap;min-width:60px">${types[i] ?? "NOTE"}</span>
              <span style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1rem,1.4vw,1.25rem);color:#f6f1e7">${n}</span>
            </li>
          `).join("")}
        </ul>
      `;
      craft.innerHTML = `
        <p style="font-family:'JetBrains Mono',monospace;font-size:clamp(.55rem,.8vw,.7rem);letter-spacing:.2em;text-transform:uppercase;color:#c8a24b;margin:0 0 20px">Our Craft</p>
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.6rem,3.5vw,2.6rem);line-height:1.15;color:#f6f1e7;font-weight:400;margin:0">
          We don&apos;t rush what the<span style="font-style:italic;color:#c8a24b"> dark </span>is patient enough to finish.
        </h2>
        <div style="margin-top:32px">
          ${STEPS.map(s => `
            <div style="padding:14px 0 14px 20px;border-left:2px solid rgba(200,162,75,.35);margin-bottom:22px">
              <span style="font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;color:#c8a24b;display:block;margin-bottom:2px">${s.n}</span>
              <h3 style="font-family:'Playfair Display',Georgia,serif;font-size:1.1rem;color:#f6f1e7;font-weight:400;margin:0">${s.title}</h3>
              <p style="font-family:'Source Serif 4',Georgia,serif;font-size:.9rem;line-height:1.6;color:#b8aea0;margin:4px 0 0">${s.body}</p>
            </div>
          `).join("")}
        </div>
      `;
    };
    updateContent();

    // --- rAF loop: control opacity & visibility ---
    let frame = 0;
    let raf: number;

    function tick() {
      frame++;
      const insidePp = phaseProgress(scrollState.progress, PHASES.INSIDE_BOTTLE);
      const cratePp = phaseProgress(scrollState.progress, PHASES.CRATE_REVEAL);

      const insideOpacity = insidePp > 0.01 && insidePp < 0.85
        ? Math.min(insidePp / 0.08, (0.85 - insidePp) / 0.06, 1) : 0;
      const crateOpacity = cratePp > 0.01 && cratePp < 0.95
        ? Math.min(cratePp / 0.08, (0.95 - cratePp) / 0.06, 1) : 0;

      const opacity = Math.min(Math.max(insideOpacity, crateOpacity), 0.95);

      // Only activate after a few frames (avoid initial flash from scroll restoration)
      if (frame < 10 || opacity < 0.01) {
        panel.style.opacity = "0";
        panel.style.visibility = "hidden";
      } else {
        panel.style.opacity = String(opacity);
        panel.style.visibility = "visible";
      }

      tasting.style.display = insidePp > 0.01 ? "block" : "none";
      craft.style.display = cratePp > 0.01 ? "block" : "none";

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (panel.parentNode) panel.parentNode.removeChild(panel);
    };
  }, []);

  return null;
}
