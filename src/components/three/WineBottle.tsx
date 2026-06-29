"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { VARIETALS } from "@/lib/varietals";
import { scrollState } from "@/lib/scroll";

/** Bordeaux-style bottle silhouette as a lathe profile (radius, height). */
function bottleProfile() {
  const p: THREE.Vector2[] = [];
  const add = (r: number, y: number) => p.push(new THREE.Vector2(r, y));
  // base → body
  add(0.0, -2.0);
  add(0.6, -2.0);
  add(0.64, -1.94);
  add(0.66, -1.82);
  add(0.66, 0.42);
  // shoulder
  add(0.655, 0.6);
  add(0.62, 0.78);
  add(0.52, 0.98);
  add(0.38, 1.18);
  add(0.26, 1.36);
  // neck
  add(0.205, 1.5);
  add(0.2, 1.7);
  add(0.2, 2.0);
  // lip
  add(0.235, 2.06);
  add(0.245, 2.16);
  add(0.235, 2.24);
  add(0.18, 2.26);
  return p;
}

export default function WineBottle({ autoRotate = true }: { autoRotate?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const glassMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const capMat = useRef<THREE.MeshStandardMaterial>(null);

  const geometry = useMemo(
    () => new THREE.LatheGeometry(bottleProfile(), 80),
    [],
  );
  const capGeometry = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.205, 1.62),
          new THREE.Vector2(0.255, 1.66),
          new THREE.Vector2(0.255, 2.02),
          new THREE.Vector2(0.25, 2.18),
          new THREE.Vector2(0.245, 2.27),
        ],
        64,
      ),
    [],
  );
  const labelTex = useTexture("/velour-label.png", (t) => {
    const tex = t as THREE.Texture;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    // crop the artwork in slightly so the printed frame sits within the panel
    tex.center.set(0.5, 0.5);
    tex.repeat.set(0.92, 0.92);
    tex.offset.set(0.04, 0.04);
  });

  // colours we lerp between as the varietal changes
  const target = useMemo(() => new THREE.Color(VARIETALS[0].glassTint), []);
  const targetAccent = useMemo(() => new THREE.Color(VARIETALS[0].accent), []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const v = VARIETALS[scrollState.varietal] ?? VARIETALS[0];
    target.set(v.glassTint);
    targetAccent.set(v.accent);

    if (glassMat.current) {
      glassMat.current.color.lerp(target, 1 - Math.pow(0.001, d));
      glassMat.current.attenuationColor.lerp(targetAccent, 1 - Math.pow(0.01, d));
    }

    if (group.current) {
      if (!autoRotate) {
        // reduced-motion: hold a tasteful three-quarter pose, no movement
        group.current.rotation.y +=
          (-0.5 - group.current.rotation.y) * (1 - Math.pow(0.01, d));
        group.current.rotation.x += (0 - group.current.rotation.x) * 0.1;
        group.current.position.y += (-0.1 - group.current.position.y) * 0.1;
        return;
      }
      // gentle sway keeps the label facing camera in the hero; scroll reveals
      // the other faces through the sections.
      const base = Math.sin(performance.now() * 0.00022) * 0.22;
      const scrollSpin = scrollState.progress * Math.PI * 1.4;
      const targetRotY = base + scrollSpin + scrollState.pointerX * 0.25;
      group.current.rotation.y +=
        (targetRotY - group.current.rotation.y) * (1 - Math.pow(0.002, d));
      const targetRotX = -scrollState.pointerY * 0.12;
      group.current.rotation.x +=
        (targetRotX - group.current.rotation.x) * (1 - Math.pow(0.01, d));
      // float
      group.current.position.y =
        -0.1 + Math.sin(performance.now() * 0.0009) * 0.04;
    }
  });

  return (
    <group ref={group}>
      {/* glass body */}
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial
          ref={glassMat}
          color={VARIETALS[0].glassTint}
          roughness={0.06}
          metalness={0}
          transmission={0.55}
          thickness={1.4}
          ior={1.46}
          attenuationColor={VARIETALS[0].accent}
          attenuationDistance={0.6}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.4}
          specularIntensity={1}
        />
      </mesh>

      {/* gold capsule over the neck */}
      <mesh geometry={capGeometry}>
        <meshStandardMaterial
          ref={capMat}
          color="#c8a24b"
          metalness={1}
          roughness={0.28}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* curved label panel on the front — the real VÉLOUR label */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.662, 0.662, 1.16, 96, 1, true, -0.62, 1.24]} />
        <meshStandardMaterial
          map={labelTex}
          roughness={0.5}
          metalness={0.15}
          envMapIntensity={1.1}
          side={THREE.FrontSide}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
    </group>
  );
}
