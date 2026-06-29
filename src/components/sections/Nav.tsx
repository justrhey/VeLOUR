"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#collection", label: "Collection" },
  { href: "#tasting", label: "Tasting" },
  { href: "#story", label: "Story" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-[var(--color-gold-line)] bg-[var(--color-noir)]/92 backdrop-blur-0"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#main"
          className="font-display text-2xl font-bold tracking-[0.04em] text-gilded"
        >
          VÉLOUR
        </a>

        <ul className="hidden items-center gap-10 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-cream-dim md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link-line transition-colors hover:text-cream">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#cta" className="btn-gold">
          Reserve
          <span className="arr" aria-hidden>
            &rarr;
          </span>
        </a>
      </nav>
    </header>
  );
}
