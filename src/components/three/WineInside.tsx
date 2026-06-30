"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { VARIETALS } from "@/lib/varietals";
import { scrollState, phaseProgress, PHASES } from "@/lib/scroll";

/* ── flavor type labels per varietal ── */
const FLAVOR_TYPES: Record<string, string[]> = {
  obsidian: ["FRUIT", "OAK", "FLORAL", "TANNIN"],
  lumiere: ["FRUIT", "FLORAL", "MINERAL", "OAK"],
};

type NotePos = { dot: [number, number, number]; label: [number, number, number] };

function noteLayouts(id: string, count: number): NotePos[] {
  const seed = id === "lumiere" ? 0.7 : 0;
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + seed;
    // stagger radius by index so dots sit at varying depths
    const r = 0.28 + (i % 2 === 0 ? 0.08 : -0.02);
    const y = -0.45 + (i / (count - 1 || 1)) * 0.9;
    return {
      dot: [
        Math.cos(angle) * r,
        y,
        Math.sin(angle) * r * 0.5,
      ] as [number, number, number],
      label: [
        Math.cos(angle) * (r + 0.55),
        y,
        Math.sin(angle) * r * 0.5 + 0.1,
      ] as [number, number, number],
    };
  });
}

/* ── pin-point dot with ring halo ── */
function PinDot({ opacity }: { opacity: number }) {
  return (
    <group>
      {/* outer ring */}
      <mesh>
        <torusGeometry args={[0.08, 0.012, 8, 16]} />
        <meshStandardMaterial
          color="#c8a24b"
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={opacity * 0.6}
        />
      </mesh>
      {/* inner core */}
      <mesh>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial
          color="#ecd089"
          roughness={0.2}
          metalness={0.7}
          transparent
          opacity={opacity * 0.95}
        />
      </mesh>
      {/* pin tail — tiny cone pointing toward the label direction */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.07, 0, 0]}>
        <coneGeometry args={[0.025, 0.06, 6]} />
        <meshStandardMaterial
          color="#8a6e34"
          roughness={0.5}
          metalness={0.5}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>
    </group>
  );
}

/* ── ONE connecting line: dot → label ── */
function Connector({ from, to, opacity }: { from: NotePos; to: NotePos; opacity: number }) {
  return (
    <Line
      points={[from.dot, to.label]}
      color="#8a6e34"
      lineWidth={0}
      transparent
      opacity={opacity * 0.35}
    />
  );
}

/* ── particle system for suspended sediment in the wine ── */
function Particles({ accent }: { accent: string }) {
  const ref = useRef<THREE.Points>(null);
  const count = 160;

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.3 + Math.random() * 0.8;
      p[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      p[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r - 0.1;
      p[i * 3 + 2] = Math.cos(phi) * r * 0.6;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i++) sizes[i] = 0.005 + Math.random() * 0.015;
    g.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    return g;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      positions[idx] += Math.sin(performance.now() * 0.0003 + i * 2.1) * 0.0002;
      positions[idx + 1] += Math.sin(performance.now() * 0.0002 + i * 1.3) * 0.00015;
      if (Math.abs(positions[idx]) > 1.1) positions[idx] *= -0.8;
      if (positions[idx + 1] > 0.6) positions[idx + 1] = -0.6;
      if (positions[idx + 1] < -0.8) positions[idx + 1] = 0.4;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={accent}
        size={0.015}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function WineInside() {
  const group = useRef<THREE.Group>(null);
  const interiorRef = useRef<THREE.Mesh>(null);
  const dotRefs = useRef<(THREE.Group | null)[]>([]);

  const v = VARIETALS[scrollState.varietal] ?? VARIETALS[0];
  const layouts = useMemo(() => noteLayouts(v.id, v.notes.length), [v]);
  const types = FLAVOR_TYPES[v.id] ?? FLAVOR_TYPES.obsidian;

  useFrame(() => {
    const p = phaseProgress(scrollState.progress, PHASES.INSIDE_BOTTLE);
    if (!group.current) return;
    // wider visibility window keeps the component alive for smooth
    // transitions, but the opacity is zero by p=0.65 so nothing shows.
    group.current.visible = p > 0.01 && p < 0.85;

    // fade in: 0→1 over the first 15% of phase
    // fade out: 1→0 from 50%→65% of phase (before camera emerges)
    // This prevents the interior sphere from lingering as a haze over
    // the bottle when the camera pulls back.
    const fadeIn = Math.min(p / 0.15, 1);
    const fadeOut = 1 - Math.min(Math.max((p - 0.5) / 0.15, 0), 1);
    const opacity = Math.min(fadeIn, fadeOut, 1);

    // interior volume opacity — very subtle
    if (interiorRef.current) {
      const mat = interiorRef.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = opacity * 0.18;
    }

    // dot pulse
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      const t = performance.now() * 0.001 + i * 1.2;
      const pulse = 1 + Math.sin(t * 1.5) * 0.15 * opacity;
      dot.scale.setScalar(Math.max(0.01, pulse));
    });
  });

  return (
    <group ref={group} visible={false}>
      {/* atmospheric wine interior */}
      <mesh ref={interiorRef}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshPhysicalMaterial
          color={v.accent}
          transparent
          opacity={0}
          roughness={0.3}
          metalness={0}
          side={THREE.BackSide}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* suspended sediment particles */}
      <Particles accent={v.accent} />

      {/* annotation system: pin-point dot + line + label for each note */}
      {v.notes.map((note, i) => {
        const layout = layouts[i];
        if (!layout) return null;
        return (
          <group key={note}>
            {/* pin-point dot */}
            <group
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              position={layout.dot}
            >
              <PinDot opacity={0.9} />
            </group>

            {/* connecting line — dim, secondary to the pin */}
            <Connector from={layout} to={layout} opacity={0.7} />

            {/* label: flavor category on top, note name below */}
            <group position={layout.label}>
              {/* category — small mono, gold */}
              <Text
                position={[0, 0.09, 0]}
                fontSize={0.05}
                color="#c8a24b"
                anchorX="left"
                anchorY="bottom"
                font={undefined}
              >
                {types[i] ?? "NOTE"}
              </Text>
              {/* flavor name — cream, display-style */}
              <Text
                position={[0, -0.04, 0]}
                fontSize={0.11}
                color="#f6f1e7"
                anchorX="left"
                anchorY="top"
                font={undefined}
                maxWidth={0.8}
              >
                {note}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
}
