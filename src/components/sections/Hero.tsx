import Marquee from "../Marquee";

export default function Hero() {
  return (
    <section
      id="main"
      className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-5 pt-24 sm:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <p className="kicker reveal mb-8">Boutique Winery — Est. MMXIV</p>

        <h1 className="reveal display-xl text-[clamp(3.5rem,15vw,13rem)]">
          <span className="line-mask">
            <span className="text-gilded">AGED IN</span>
          </span>
          <span className="line-mask">
            <span className="pl-[0.06em] italic font-normal text-cream">shadow.</span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="reveal max-w-md font-serif text-lg leading-relaxed text-cream-dim">
            Small-batch wines rested in darkness until they are ready to speak.
            Turn the bottle. Read the light.
          </p>

          <div className="reveal flex flex-wrap items-center gap-4">
            <a href="#collection" className="btn-gold">
              Explore collection
              <span className="arr" aria-hidden>
                &rarr;
              </span>
            </a>
            <a href="#story" className="btn-ghost">
              Our craft
            </a>
          </div>
        </div>
      </div>

      {/* ticker */}
      <div className="absolute inset-x-0 bottom-0 border-y border-[var(--color-hairline)] bg-[var(--color-noir)]/70 py-3">
        <Marquee
          items={[
            "Single Vineyard",
            "Hand-picked at Night",
            "Aged in Shadow",
            "Released When Ready",
            "Barossa Valley",
          ]}
        />
      </div>
    </section>
  );
}
