import Wave from "../Wave";
import Stat from "../Stat";

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

export default function Story() {
  return (
    <section
      id="story"
      className="relative isolate bg-[var(--color-panel)] px-5 pb-32 pt-40 sm:px-8"
    >
      <Wave fill="var(--color-panel)" animate />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="reveal mb-6 flex items-center justify-between">
          <p className="kicker">Our Craft</p>
          <span className="section-index">02 — Method</span>
        </div>

        <h2 className="reveal display-xl max-w-4xl text-[clamp(2.6rem,7vw,6rem)]">
          We don&apos;t rush what the
          <span className="italic font-normal text-gilded"> dark </span>
          is patient enough to finish.
        </h2>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-[var(--color-hairline)] md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="reveal panel-hover panel group bg-[var(--color-panel-2)] p-10"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="font-display text-6xl text-gilded">{s.n}</span>
              <h3 className="mt-6 font-display text-2xl text-cream">{s.title}</h3>
              <p className="mt-3 font-serif leading-relaxed text-cream-dim">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* stats strip */}
        <div className="reveal mt-20 grid grid-cols-2 gap-10 border-t border-[var(--color-hairline)] pt-12 sm:grid-cols-4">
          <Stat to={30} suffix="mo" label="Average aging" />
          <Stat to={11} suffix="yr" label="Established" />
          <Stat to={480} label="Cases per vintage" />
          <Stat to={97} suffix="pts" label="Critic high" />
        </div>
      </div>
    </section>
  );
}
