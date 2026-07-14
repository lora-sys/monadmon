"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 1400;

function buildGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i += 1) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    const palette = Math.random();
    if (palette < 0.55) {
      colors[i * 3 + 0] = 0.478;
      colors[i * 3 + 1] = 0.941;
      colors[i * 3 + 2] = 0.729;
    } else if (palette < 0.85) {
      colors[i * 3 + 0] = 0.788;
      colors[i * 3 + 1] = 0.654;
      colors[i * 3 + 2] = 1.0;
    } else {
      colors[i * 3 + 0] = 0.96;
      colors[i * 3 + 1] = 0.96;
      colors[i * 3 + 2] = 0.98;
    }
    sizes[i] = 0.014 + Math.random() * 0.022;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  return geo;
}

function DriftingParticles() {
  const ref = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / size.width) * 2 - 1;
      mouse.current.y = -((event.clientY / size.height) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [size.width, size.height]);

  useFrame((state, delta) => {
    const points = ref.current;
    if (!points) return;
    const positions = points.geometry.attributes.position as THREE.BufferAttribute;
    const array = positions.array as Float32Array;
    const drift = 0.18 * delta;
    for (let i = 0; i < COUNT; i += 1) {
      array[i * 3 + 1] += drift * 0.4;
      array[i * 3 + 0] += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.0008;
      if (array[i * 3 + 1] > 9) array[i * 3 + 1] = -9;
    }
    positions.needsUpdate = true;
    points.rotation.y += delta * 0.04;
    points.rotation.x += (mouse.current.y * 0.1 - points.rotation.x) * 0.02;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <primitive object={buildGeometry()} attach="geometry" />
      <pointsMaterial
        vertexColors
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticleCanvas({ height }: { height: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0"
      style={{ height }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.5], fov: 55, near: 0.1, far: 50 }}
      >
        <color attach="background" args={["#04060B"]} />
        <DriftingParticles />
      </Canvas>
    </div>
  );
}
