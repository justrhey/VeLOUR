"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { scrollState, phaseProgress, PHASES } from "@/lib/scroll";

/* ── Material palette ── */
const WOOD_DARK = "#1f1610";
const WOOD_MID = "#2d1f14";
const WOOD_LIGHT = "#3d2b1a";
const WOOD_WARM = "#4a3522";
const VELVET = "#3d0d24";
const VELVET_LIGHT = "#5a1535";
const GOLD = "#c8a24b";
const GOLD_DIM = "#8a6e34";

/* ── crate dimensions (fit one bottle + padding + dividers) ── */
const IW = 2.2; // interior width
const IH = 5.0; // interior height
const ID = 2.2; // interior depth
const WT = 0.10; // wall / plank thickness
const EW = IW + WT * 2; // exterior width
const EH = IH + WT * 2; // exterior height
const ED = ID + WT * 2; // exterior depth

/* ── build one wall from offset planks ── */
function Plank({
  w,
  h,
  d,
  pos,
  rot = [0, 0, 0] as [number, number, number],
  color,
}: {
  w: number;
  h: number;
  d: number;
  pos: [number, number, number];
  rot?: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
}

/* ── one face built from vertical planks ── */
function SlattedFace({
  width,
  height,
  depth,
  center,
  rot = [0, 0, 0],
  plankCount = 7,
  colors,
}: {
  width: number;
  height: number;
  depth: number;
  center: [number, number, number];
  rot?: [number, number, number];
  plankCount?: number;
  colors: [string, string, string, string];
}) {
  const gap = 0.006;
  const pw = (width - gap * (plankCount - 1)) / plankCount;
  const planks = useMemo(
    () =>
      Array.from({ length: plankCount }, (_, i) => ({
        pos: [
          center[0] -
            width / 2 +
            pw / 2 +
            i * (pw + gap),
          center[1],
          center[2],
        ] as [number, number, number],
        color: colors[i % colors.length],
      })),
    [plankCount, pw, gap, width, center, colors],
  );

  return (
    <group position={[0, 0, 0]} rotation={rot}>
      {planks.map((p, i) => (
        <Plank key={i} w={pw} h={height} d={depth} pos={p.pos} color={p.color} />
      ))}
    </group>
  );
}

/* ── velvet interior panel ── */
function VelvetPanel({
  w,
  h,
  pos,
  rot = [0, 0, 0],
}: {
  w: number;
  h: number;
  pos: [number, number, number];
  rot?: [number, number, number];
}) {
  return (
    <mesh position={pos} rotation={rot}>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial
        color={VELVET}
        roughness={1}
        metalness={0}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

/* ── corner bracket (small gold angle) ── */
function CornerBracket({ pos, rot = [0, 0, 0] }: { pos: [number, number, number]; rot?: [number, number, number] }) {
  return (
    <mesh position={pos} rotation={rot} castShadow>
      <boxGeometry args={[0.12, 0.08, 0.12]} />
      <meshStandardMaterial color={GOLD} roughness={0.5} metalness={0.7} />
    </mesh>
  );
}

function CornerBrackets() {
  const s = EW / 2;
  const t = EH / 2;
  const d = ED / 2;
  const corners = useMemo(() => {
    const positions: [number, number, number][] = [];
    // front face corners
    positions.push([-s, -t, d], [s, -t, d], [-s, t, d], [s, t, d]);
    // back face corners
    positions.push([-s, -t, -d], [s, -t, -d], [-s, t, -d], [s, t, -d]);
    return positions;
  }, []);

  return (
    <>
      {corners.map((pos, i) => (
        <CornerBracket
          key={i}
          pos={pos}
          rot={i < 4 ? [0, 0, 0] : [0, 0, 0]}
        />
      ))}
    </>
  );
}

export default function WineCrate() {
  const group = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = phaseProgress(scrollState.progress, PHASES.CRATE_REVEAL);
    if (!group.current) return;
    // full visibility window
    group.current.visible = p > 0.01 && p < 0.99;
    // scale in from nothing
    const s = Math.min(p * 5, 1);
    group.current.scale.setScalar(s);

    // lid: opens → stays open → closes ("ready to ship")
    //  p=0.00→0.30:  open (0 → 68°)
    //  p=0.30→0.55:  stay open (68°)
    //  p=0.55→0.95:  close (68° → 0)
    //  p=0.95→1.00:  sealed
    if (lidRef.current) {
      let a = 0;
      if (p < 0.30) {
        a = (p / 0.30) * -Math.PI * 0.38;         // opening
      } else if (p < 0.55) {
        a = -Math.PI * 0.38;                       // stay open
      } else {
        const t = Math.min((p - 0.55) / 0.40, 1);   // 0→1 as lid closes
        a = -Math.PI * 0.38 * (1 - t);              // 68° → 0
      }
      lidRef.current.rotation.x = a;
    }
  });

  return (
    <group ref={group} visible={false}>
      {/* ========== BACK WALL (slatted) ========== */}
      <SlattedFace
        width={EW}
        height={EH}
        depth={WT}
        center={[0, 0, -ED / 2]}
        plankCount={9}
        colors={[WOOD_MID, WOOD_DARK, WOOD_LIGHT, WOOD_MID]}
      />

      {/* ========== LEFT WALL ========== */}
      <SlattedFace
        width={ED}
        height={EH}
        depth={WT}
        center={[-EW / 2, 0, 0]}
        rot={[0, Math.PI / 2, 0]}
        plankCount={7}
        colors={[WOOD_DARK, WOOD_MID, WOOD_LIGHT, WOOD_DARK]}
      />

      {/* ========== RIGHT WALL ========== */}
      <SlattedFace
        width={ED}
        height={EH}
        depth={WT}
        center={[EW / 2, 0, 0]}
        rot={[0, -Math.PI / 2, 0]}
        plankCount={7}
        colors={[WOOD_DARK, WOOD_MID, WOOD_LIGHT, WOOD_DARK]}
      />

      {/* ========== BOTTOM ========== */}
      <SlattedFace
        width={EW}
        height={ED}
        depth={WT}
        center={[0, -EH / 2, 0]}
        rot={[-Math.PI / 2, 0, 0]}
        plankCount={7}
        colors={[WOOD_LIGHT, WOOD_MID, WOOD_MID, WOOD_LIGHT]}
      />

      {/* ========== FRONT WALL (slatted, lower section only — the lid is separate) ========== */}
      <SlattedFace
        width={EW}
        height={EH * 0.6}
        depth={WT}
        center={[0, -EH * 0.2, ED / 2]}
        plankCount={9}
        colors={[WOOD_MID, WOOD_DARK, WOOD_LIGHT, WOOD_MID]}
      />

      {/* ========== LID (hinged, opens backward) ========== */}
      <group ref={lidRef} position={[0, EH / 2, -ED / 2]}>
        <SlattedFace
          width={EW}
          height={ED}
          depth={WT}
          center={[0, 0, ED / 2]}
          rot={[0, 0, 0]}
          plankCount={9}
          colors={[WOOD_DARK, WOOD_MID, WOOD_LIGHT, WOOD_DARK]}
        />
        {/* lid strap hinges */}
        <mesh position={[-EW / 2 + 0.25, -0.05, ED / 2 + 0.02]}>
          <boxGeometry args={[0.25, 0.03, 0.06]} />
          <meshStandardMaterial color={GOLD_DIM} roughness={0.6} metalness={0.5} />
        </mesh>
        <mesh position={[EW / 2 - 0.25, -0.05, ED / 2 + 0.02]}>
          <boxGeometry args={[0.25, 0.03, 0.06]} />
          <meshStandardMaterial color={GOLD_DIM} roughness={0.6} metalness={0.5} />
        </mesh>
        {/* front latch plate */}
        <mesh position={[0, -0.05, ED - 0.02]}>
          <boxGeometry args={[0.3, 0.04, 0.08]} />
          <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.8} />
        </mesh>
      </group>

      {/* ========== VELVET INTERIOR LINING ==========
          The bottle sits at (0, -0.1, 0). The interior cavity is
          IW × IH × ID centered at (0, 0, 0). */}
      {/* back velvet */}
      <VelvetPanel w={IW} h={IH} pos={[0, 0, -ID / 2 + 0.01]} />
      {/* left velvet */}
      <VelvetPanel w={ID} h={IH} pos={[-IW / 2 + 0.01, 0, 0]} rot={[0, Math.PI / 2, 0]} />
      {/* right velvet */}
      <VelvetPanel w={ID} h={IH} pos={[IW / 2 - 0.01, 0, 0]} rot={[0, -Math.PI / 2, 0]} />
      {/* bottom velvet */}
      <VelvetPanel w={IW} h={ID} pos={[0, -IH / 2 + 0.01, 0]} rot={[-Math.PI / 2, 0, 0]} />
      {/* front lower velvet */}
      <VelvetPanel w={IW} h={IH * 0.58} pos={[0, -EH * 0.2, ID / 2 - 0.01]} />
      {/* front upper (behind lid) velvet */}
      <VelvetPanel w={IW} h={IH * 0.35} pos={[0, EH * 0.31, ID / 2 - 0.01]} />

      {/* ========== DIVIDERS (2 vertical wooden panels with velvet wrap) ==========
          These create 3 compartments: left, center (bottle), right */}
      <mesh position={[-IW / 3, -0.1, 0]} castShadow>
        <boxGeometry args={[0.06, IH - 1.2, ID - 0.4]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.85} metalness={0} />
      </mesh>
      <mesh position={[-IW / 3, -0.1, 0]}>
        <boxGeometry args={[0.04, IH - 1.4, ID - 0.6]} />
        <meshStandardMaterial color={VELVET} roughness={1} metalness={0} />
      </mesh>
      <mesh position={[IW / 3, -0.1, 0]} castShadow>
        <boxGeometry args={[0.06, IH - 1.2, ID - 0.4]} />
        <meshStandardMaterial color={WOOD_MID} roughness={0.85} metalness={0} />
      </mesh>
      <mesh position={[IW / 3, -0.1, 0]}>
        <boxGeometry args={[0.04, IH - 1.4, ID - 0.6]} />
        <meshStandardMaterial color={VELVET} roughness={1} metalness={0} />
      </mesh>

      {/* ========== BOTTOM PADDING (velvet cushion the bottle rests on) ========== */}
      <mesh position={[0, -IH / 2 + 0.15, 0]}>
        <boxGeometry args={[1.2, 0.15, 1.2]} />
        <meshStandardMaterial color={VELVET_LIGHT} roughness={1} metalness={0} />
      </mesh>

      {/* ========== SIDE PADDING BLOCKS (prevent the bottle from shifting) ========== */}
      <mesh position={[-IW / 2 + 0.25, -1.0, 0]}>
        <boxGeometry args={[0.25, 2.0, 0.25]} />
        <meshStandardMaterial color={VELVET_LIGHT} roughness={1} metalness={0} />
      </mesh>
      <mesh position={[IW / 2 - 0.25, -1.0, 0]}>
        <boxGeometry args={[0.25, 2.0, 0.25]} />
        <meshStandardMaterial color={VELVET_LIGHT} roughness={1} metalness={0} />
      </mesh>

      {/* ========== GOLD CORNER BRACKETS ========== */}
      <CornerBrackets />

      {/* ========== BRAND STENCIL ON FRONT ========== */}
      <Text
        position={[0, 0.4, ED / 2 + 0.02]}
        fontSize={0.2}
        color={GOLD_DIM}
        anchorX="center"
        anchorY="middle"
      >
        VÉLOUR
      </Text>
      <Text
        position={[0, 0.1, ED / 2 + 0.02]}
        fontSize={0.075}
        color="#5a4a30"
        anchorX="center"
        anchorY="middle"
      >
        RESERVE CELLAR
      </Text>

      {/* ========== HANDLE CUT-OUT SIMULATION ON SIDES ========== */}
      <mesh position={[EW / 2 + 0.02, 0.3, 0]}>
        <planeGeometry args={[0.02, 0.2]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      <mesh position={[-EW / 2 - 0.02, 0.3, 0]}>
        <planeGeometry args={[0.02, 0.2]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
    </group>
  );
}
