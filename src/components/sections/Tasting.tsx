"use client";

import { VARIETALS } from "@/lib/varietals";
import { useVarietal } from "../Experience";

export default function Tasting() {
  const { index } = useVarietal();
  const v = VARIETALS[index];

  return (
    <section
      id="tasting"
      className="relative mx-auto flex min-h-dvh max-w-7xl items-center px-5 py-32 sm:px-8"
    >
      <div className="w-full max-w-lg">
        <div className="reveal mb-6 flex items-center justify-between">
          <p className="kicker">Tasting Notes</p>
          <span className="section-index">{v.name}</span>
        </div>

        <h2 className="reveal display-xl text-[clamp(2.6rem,6vw,4.6rem)]">
          What the
          <br />
          <span className="italic font-normal text-gilded">darkness drew out.</span>
        </h2>

        <p className="reveal mt-6 max-w-sm font-serif text-lg leading-relaxed text-cream-dim">
          {v.name} reveals itself in layers. Let it open, and these will surface
          in turn.
        </p>

        <ul className="mt-10 border-t border-[var(--color-hairline)]">
          {v.notes.map((note, i) => (
            <li
              key={note}
              className="reveal group flex items-baseline gap-6 border-b border-[var(--color-hairline)] py-5 transition-colors hover:bg-[var(--color-panel)]"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className="font-display text-3xl leading-none text-gold/70 transition-colors group-hover:text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-2xl text-cream">{note}</span>
              <span className="ml-auto self-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cream-mute opacity-0 transition-opacity group-hover:opacity-100">
                Note
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
