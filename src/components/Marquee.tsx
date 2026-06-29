/** Seamless marquee. Renders the item set twice and translates -50%. */
function MarqueeRow({ items }: { items: string[] }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden>
      {items.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className="px-8 font-display text-lg italic text-cream-dim">
            {t}
          </span>
          <span className="text-gold">&#9670;</span>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee({
  items,
  slow = false,
  className = "",
}: {
  items: string[];
  slow?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`marquee ${slow ? "marquee-slow" : ""}`}>
        <MarqueeRow items={items} />
        <MarqueeRow items={items} />
      </div>
    </div>
  );
}
