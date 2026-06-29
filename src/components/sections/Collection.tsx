"use client";

import { VARIETALS } from "@/lib/varietals";
import { useVarietal } from "../Experience";

export default function Collection() {
  const { index, setIndex } = useVarietal();
  const v = VARIETALS[index];

  return (
    <section
      id="collection"
      className="relative mx-auto flex min-h-dvh max-w-7xl items-center px-5 py-32 sm:px-8"
    >
      <div className="ml-auto w-full max-w-lg">
        <div className="reveal mb-6 flex items-center justify-between">
          <p className="kicker">The Collection</p>
          <span className="section-index">01 / 02</span>
        </div>

        <h2 className="reveal display-xl text-[clamp(2.6rem,6vw,4.6rem)]">
          Two expressions,
          <br />
          <span className="italic font-normal text-gilded">one philosophy.</span>
        </h2>

        {/* mono underlined tabs */}
        <div
          role="tablist"
          aria-label="Choose a varietal"
          className="reveal mt-10 flex gap-8 border-b border-[var(--color-hairline)]"
        >
          {VARIETALS.map((item, i) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`relative -mb-px pb-3 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                i === index
                  ? "text-cream"
                  : "text-cream-mute hover:text-cream-dim"
              }`}
            >
              <span className="mr-2 text-gold">{String(i + 1).padStart(2, "0")}</span>
              {item.name}
              <span
                className={`absolute inset-x-0 -bottom-px h-[2px] bg-gold transition-transform duration-300 ${
                  i === index ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>

        {/* solid spec panel */}
        <article key={v.id} className="reveal in panel panel-gold panel-hover mt-8 p-8 sm:p-10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-4xl text-cream">{v.name}</h3>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-gold">
                {v.kind} · {v.year}
              </p>
            </div>
            <span
              className="mt-2 h-4 w-4 rounded-full ring-1 ring-[var(--color-gold-line)]"
              style={{ background: v.accent }}
              aria-hidden
            />
          </div>

          <p className="mt-6 font-display text-xl italic leading-snug text-cream-dim">
            “{v.tagline}”
          </p>

          <dl className="mt-8 grid grid-cols-2 divide-x divide-[var(--color-hairline)] border-y border-[var(--color-hairline)]">
            <div className="py-4 pr-4">
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream-mute">
                Region
              </dt>
              <dd className="mt-1 font-serif text-cream">{v.region}</dd>
            </div>
            <div className="py-4 pl-4">
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream-mute">
                ABV
              </dt>
              <dd className="mt-1 font-mono text-cream">{v.abv}</dd>
            </div>
          </dl>

          <a href="#cta" className="btn-gold mt-8 w-full justify-center">
            Reserve {v.name}
            <span className="arr" aria-hidden>
              &rarr;
            </span>
          </a>
        </article>
      </div>
    </section>
  );
}
