/**
 * Wine coating the left/right walls of a section, with slow "wine legs"
 * (tears) sliding down the glass. Pairs with <Wave/> at the top so the
 * section reads as a vessel filled with wine. Decorative only.
 */
const LEGS = [
  { pos: "16%", delay: "0s", dur: "7.5s" },
  { pos: "44%", delay: "2.6s", dur: "9s" },
  { pos: "72%", delay: "4.3s", dur: "6.8s" },
];

export default function WineSides() {
  return (
    <div aria-hidden className="wine-sides">
      <div className="wine-edge wine-edge-l">
        {LEGS.map((g, i) => (
          <span
            key={i}
            className="wine-leg"
            style={{ left: g.pos, animationDelay: g.delay, animationDuration: g.dur }}
          />
        ))}
      </div>
      <div className="wine-edge wine-edge-r">
        {LEGS.map((g, i) => (
          <span
            key={i}
            className="wine-leg"
            style={{ right: g.pos, animationDelay: g.delay, animationDuration: g.dur }}
          />
        ))}
      </div>
    </div>
  );
}
