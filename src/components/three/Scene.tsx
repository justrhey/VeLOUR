"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  AdaptiveDpr,
  Lightformer,
} from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import WineBottle from "./WineBottle";
import { scrollState } from "@/lib/scroll";

type Key = { px: number; py: number; pz: number; tx: number; ty: number };

/** Camera keyframes along scroll progress (0 → 1). */
const KEYS: { at: number; k: Key }[] = [
  { at: 0.0, k: { px: 0, py: 0.25, pz: 6.2, tx: 0, ty: 0 } }, // hero
  { at: 0.28, k: { px: 1.5, py: 0.5, pz: 4.4, tx: 0, ty: 0.1 } }, // varietals
  { at: 0.52, k: { px: -1.7, py: 0.7, pz: 4.6, tx: 0, ty: 0.2 } }, // tasting
  { at: 0.76, k: { px: 0, py: 1.0, pz: 6.6, tx: 0, ty: 0.05 } }, // proof
  { at: 1.0, k: { px: 0, py: 0.15, pz: 5.2, tx: 0, ty: 0.1 } }, // cta
];

function sample(p: number): Key {
  const t = THREE.MathUtils.clamp(p, 0, 1);
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i];
    const b = KEYS[i + 1];
    if (t >= a.at && t <= b.at) {
      const f = THREE.MathUtils.smoothstep(t, a.at, b.at);
      return {
        px: THREE.MathUtils.lerp(a.k.px, b.k.px, f),
        py: THREE.MathUtils.lerp(a.k.py, b.k.py, f),
        pz: THREE.MathUtils.lerp(a.k.pz, b.k.pz, f),
        tx: THREE.MathUtils.lerp(a.k.tx, b.k.tx, f),
        ty: THREE.MathUtils.lerp(a.k.ty, b.k.ty, f),
      };
    }
  }
  return KEYS[KEYS.length - 1].k;
}

function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const look = useMemo(() => new THREE.Vector3(), []);
  const dest = useMemo(() => new THREE.Vector3(), []);

  // Read the camera off the per-frame state (not a hook return value) so we
  // can mutate it freely.
  useFrame(({ camera }, delta) => {
    const d = Math.min(delta, 0.05);
    const k = reducedMotion ? KEYS[0].k : sample(scrollState.progress);
    const px = k.px + (reducedMotion ? 0 : scrollState.pointerX * 0.3);
    const py = k.py + (reducedMotion ? 0 : scrollState.pointerY * 0.2);

    camera.position.x += (px - camera.position.x) * (1 - Math.pow(0.0015, d));
    camera.position.y += (py - camera.position.y) * (1 - Math.pow(0.0015, d));
    camera.position.z += (k.pz - camera.position.z) * (1 - Math.pow(0.0015, d));

    dest.set(k.tx, k.ty, 0);
    look.lerp(dest, 1 - Math.pow(0.002, d));
    camera.lookAt(look);
  });

  return null;
}

export default function Scene({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <Canvas
      className="!fixed inset-0"
      style={{ pointerEvents: "none" }}
      shadows
      dpr={[1, 1.8]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ position: [0, 0.25, 6.2], fov: 38 }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <color attach="background" args={["#08080a"]} />
      <fog attach="fog" args={["#08080a", 7, 16]} />

      {/* cinematic dark studio: low ambient, warm key, cool rim, front label light */}
      <ambientLight intensity={0.18} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.6}
        color="#ffe9c2"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      {/* front key — lights the gold label */}
      <spotLight
        position={[0, 1.5, 6]}
        intensity={55}
        angle={0.45}
        penumbra={0.8}
        color="#fff1d6"
        distance={22}
      />
      {/* cool rim for separation */}
      <spotLight
        position={[-5, 3, -2]}
        intensity={45}
        angle={0.5}
        penumbra={1}
        color="#9fd0ff"
        distance={20}
      />
      <pointLight position={[0, -2, 3]} intensity={6} color="#c8a24b" distance={8} />

      <Suspense fallback={null}>
        <WineBottle autoRotate={!reducedMotion} />
        <ContactShadows
          position={[0, -2.05, 0]}
          opacity={0.6}
          scale={9}
          blur={3}
          far={4}
          color="#000000"
        />
        {/* Self-contained studio: lightformers shape the glass refraction
            and the gold reflections — no external HDRI fetch. */}
        <Environment resolution={256} environmentIntensity={0.6}>
          <color attach="background" args={["#050505"]} />
          {/* soft key from above */}
          <Lightformer
            form="rect"
            intensity={3}
            color="#fff4dd"
            position={[0, 4, 1]}
            scale={[8, 4, 1]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          {/* warm gold strip — reflects as the bottle's gilded edge */}
          <Lightformer
            form="rect"
            intensity={4}
            color="#e6c878"
            position={[3, 0.5, 2]}
            scale={[1.2, 5, 1]}
            rotation={[0, -Math.PI / 3, 0]}
          />
          {/* cool rim on the opposite side for separation */}
          <Lightformer
            form="rect"
            intensity={2}
            color="#bcd9ff"
            position={[-3.5, 1, -1]}
            scale={[1, 5, 1]}
            rotation={[0, Math.PI / 3, 0]}
          />
          <Lightformer
            form="circle"
            intensity={2}
            color="#ffffff"
            position={[0, 1, 4]}
            scale={[3, 3, 1]}
          />
        </Environment>
      </Suspense>

      <Rig reducedMotion={reducedMotion} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
