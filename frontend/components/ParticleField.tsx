"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const ParticleCanvas = dynamic(
  () => import("./ParticleField.client").then((m) => m.ParticleCanvas),
  { ssr: false },
);

type ParticleFieldProps = {
  height?: string;
};

export function ParticleField({ height = "100vh" }: ParticleFieldProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0"
      style={{ height }}
    >
      <ParticleCanvas height={height} />
    </div>
  );
}

// Re-exported for tree-shaking to keep the wrapper portable.
