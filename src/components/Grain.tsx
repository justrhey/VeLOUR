/** Fixed film-grain + vignette overlay for cinematic depth. Purely decorative. */
export default function Grain() {
  return (
    <div aria-hidden className="grain-layer">
      <div className="grain" />
      <div className="vignette-overlay" />
    </div>
  );
}
