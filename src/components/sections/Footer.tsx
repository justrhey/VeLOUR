export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-noir)] px-5 pb-12 pt-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* oversized wordmark */}
        <p className="font-display text-[clamp(3.5rem,16vw,12rem)] font-black leading-none tracking-[-0.03em] text-gilded">
          VÉLOUR
        </p>

        <div className="mt-10 flex flex-col gap-8 border-t border-[var(--color-hairline)] pt-10 md:flex-row md:items-start md:justify-between">
          <p className="max-w-xs font-serif text-cream-dim">
            Boutique wine, aged in shadow. Crafted in small batches and released
            without compromise.
          </p>

          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.16em] text-cream-dim"
          >
            <a href="#collection" className="link-line hover:text-cream">Collection</a>
            <a href="#tasting" className="link-line hover:text-cream">Tasting</a>
            <a href="#story" className="link-line hover:text-cream">Craft</a>
            <a href="#cta" className="link-line hover:text-cream">Reserve</a>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-cream-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VÉLOUR Estate — A fictional brand</p>
          <p>Please enjoy responsibly · 18+</p>
        </div>
      </div>
    </footer>
  );
}
