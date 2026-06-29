/**
 * Wine-liquid section divider. The wave is ONLY the surface (the wavy top
 * edge of the wine). Below it the liquid body holds slow internal currents
 * that drift inside the wine (clipped to the body) — no glow, no stacked
 * waves underneath.
 */
const SURFACE =
  "M-80,96 C220,52 470,140 720,100 C980,58 1230,140 1520,98";
const BODY = `${SURFACE} L1520,210 L-80,210 Z`;

export default function Wave({
  fill = "var(--color-panel)",
  flip = false,
  animate = false,
  className = "",
}: {
  fill?: string;
  flip?: boolean;
  animate?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 ${
        flip ? "bottom-full" : "top-0 -translate-y-[48%]"
      } ${animate ? "wave-animated " : ""}${className}`}
    >
      <svg
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className={`block h-[80px] w-full sm:h-[130px] md:h-[180px] ${
          flip ? "rotate-180" : ""
        }`}
      >
        <defs>
          <linearGradient id="wineBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b0e2d" />
            <stop offset="30%" stopColor="#420a21" />
            <stop offset="66%" stopColor="#280713" />
            <stop offset="100%" stopColor={fill} />
          </linearGradient>
          <clipPath id="wineClip">
            <path d={BODY} />
          </clipPath>
        </defs>

        {/* wine body — its top edge is the only wave (the surface) */}
        <path d={BODY} fill="url(#wineBody)" />

        {/* details INSIDE the wine: slow currents drifting within the body */}
        <g clipPath="url(#wineClip)">
          <path
            className="wave-drift"
            d="M-160,150 C180,120 460,182 760,148 C1060,116 1340,182 1640,150 L1640,260 L-160,260 Z"
            fill="#2a0613"
            opacity="0.55"
          />
          <path
            className="wave-drift-2"
            d="M-160,126 C200,104 470,152 780,126 C1080,102 1360,152 1640,126 L1640,260 L-160,260 Z"
            fill="#3a0a1c"
            opacity="0.4"
          />
          <path
            className="wave-drift-slow"
            d="M-160,178 C220,160 520,198 800,174 C1100,150 1380,198 1640,176 L1640,260 L-160,260 Z"
            fill="#1d0610"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}
