"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";


export default function Tilt({
  children,
  className,
  max = 3,
  glare = true,
  lift = 0,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  lift?: number; 
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 160, damping: 18, mass: 0.5 });

  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);

  const glareX = useTransform(sx, [0, 1], ["12%", "88%"]);
  const glareY = useTransform(sy, [0, 1], ["8%", "92%"]);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.07), transparent 60%)`;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      whileHover={lift ? { y: -lift } : undefined}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1300,
        transformStyle: "preserve-3d",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={`relative ${className ?? ""}`}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit]"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  );
}
