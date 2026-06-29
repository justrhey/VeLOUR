"use client";

import { useEffect, useRef, useState } from "react";

export default function Stat({
  to,
  suffix = "",
  label,
}: {
  to: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        if (reduce) {
          setN(to);
          return;
        }
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <div ref={ref}>
      <div className="font-display text-5xl text-gilded sm:text-6xl">
        {n}
        <span className="text-gold">{suffix}</span>
      </div>
      <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cream-mute">
        {label}
      </div>
    </div>
  );
}
