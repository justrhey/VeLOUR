/**
 * Engraved gold flourish divider — a centered ornament on a tapering hairline,
 * echoing the filigree on the VÉLOUR label. Sits on a section's top boundary.
 */
export default function Flourish() {
  return (
    <div aria-hidden className="divider-flourish">
      <span className="fl-rule" />
      <svg viewBox="0 0 150 24" className="fl-mark" fill="none">
        {/* center diamond */}
        <path
          d="M75 3 L84 12 L75 21 L66 12 Z"
          stroke="var(--color-gold)"
          strokeWidth="1.2"
        />
        <circle cx="75" cy="12" r="1.7" fill="var(--color-gold)" />
        {/* tapering arms + end points */}
        <path d="M62 12 H30" stroke="var(--color-gold-line)" strokeWidth="1" />
        <circle cx="26" cy="12" r="1.5" fill="var(--color-gold)" />
        <path d="M88 12 H120" stroke="var(--color-gold-line)" strokeWidth="1" />
        <circle cx="124" cy="12" r="1.5" fill="var(--color-gold)" />
      </svg>
      <span className="fl-rule fl-flip" />
    </div>
  );
}
