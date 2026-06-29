import Marquee from "../Marquee";

const QUOTES = [
  {
    quote:
      "The most quietly confident Cabernet to come out of the country in a decade.",
    who: "The Cellar Review",
    score: "97",
    unit: "pts",
  },
  {
    quote:
      "Lumière is sunlight you can drink. Restrained, precise, unforgettable.",
    who: "Noble Rot Quarterly",
    score: "95",
    unit: "pts",
  },
  {
    quote: "A label that treats patience as the primary ingredient.",
    who: "Decanter Field Notes",
    score: "Editor's",
    unit: "Pick",
  },
];

export default function Proof() {
  return (
    <section className="relative isolate bg-[var(--color-noir)] px-5 pb-28 pt-40 sm:px-8">

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="reveal mb-14 flex flex-col items-center gap-3 text-center">
          <p className="kicker">Acclaim</p>
          <div className="flex items-center gap-1.5 text-gold" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7L12 2z" />
              </svg>
            ))}
          </div>
          <p className="font-serif text-cream-dim">
            Rated by critics who taste in the dark, too.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-hairline)] bg-[var(--color-hairline)] md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <figure
              key={q.who}
              className="reveal panel-hover panel flex flex-col bg-[var(--color-panel)] p-10"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-baseline gap-1 font-display">
                <span className="text-4xl text-gilded">{q.score}</span>
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
                  {q.unit}
                </span>
              </div>
              <blockquote className="mt-6 flex-1 font-display text-xl italic leading-snug text-cream">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-8 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cream-mute">
                — {q.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-20 border-y border-[var(--color-hairline)] py-6">
        <Marquee
          slow
          items={["DECANTER", "NOBLE ROT", "THE CELLAR", "VINOUS", "HALLIDAY", "JAMES SUCKLING"]}
        />
      </div>
    </section>
  );
}
