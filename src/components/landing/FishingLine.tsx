"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { smoothPath, type Pt } from "@/lib/smoothPath";

type Anchor = {
  x: number; // resolved to px
  y: number; // px from container top
  sway: number;
  ring: boolean;
  i: number; // index in the built point list (for matching the wire's tremor phase)
};

const TREMOR_FREQ = 1.7;
const TREMOR_AMP = 2.1;

/**
 * ONE continuous fishing wire. A single global SVG, the height of the whole
 * document, routed through invisible `[data-fish-anchor]` markers that live
 * inside the real sections. The wire is always fully present from above the
 * fold to the hook at the very bottom — it never draws on, never breaks, never
 * disappears. It leans with scroll velocity like something with weight, settles
 * taut at rest, and carries a faint constant tremor. A travelling specular bead
 * runs along it as you scroll, and tiny metal guide rings sit on the sharpest
 * bends.
 */
export default function FishingLine({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        const cRect = el.getBoundingClientRect();
        const cTop = cRect.top;
        const cLeft = cRect.left;
        const nodes = Array.from(
          el.querySelectorAll<HTMLElement>("[data-fish-anchor]")
        );
        const next: Anchor[] = nodes.map((n, idx) => {
          const r = n.getBoundingClientRect();
          // `data-x="auto"` pins the point to the marker's real position (used
          // for the rod tip); otherwise x is a 0–1000 fraction of page width.
          const auto = n.dataset.x === "auto";
          return {
            x: auto
              ? r.left - cLeft + r.width / 2
              : (Number(n.dataset.x ?? "500") / 1000) * w,
            y: r.top - cTop + r.height / 2,
            sway: Number(n.dataset.sway ?? "1"),
            ring: n.dataset.ring === "1",
            i: idx + 1,
          };
        });
        setSize({ w, h: el.offsetHeight });
        setAnchors(next);
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    const t = window.setTimeout(measure, 450);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [containerRef]);

  // Scroll velocity → a soft lateral lean with pendulum settle (gravity-ish).
  const { scrollY, scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollY);
  const leanTarget = useTransform(velocity, (v) =>
    reduce ? 0 : Math.max(-40, Math.min(40, v / 100))
  );
  const lean = useSpring(leanTarget, { stiffness: 50, damping: 13, mass: 0.8 });

  // Constant, almost-invisible tremor so the wire is never frozen.
  const tremor = useMotionValue(0);
  useAnimationFrame((t) => {
    if (!reduce) tremor.set(t / 1000);
  });

  // The single, continuous path string — recomputed from live motion values.
  // It begins exactly at the first marker (the rod tip) and never breaks.
  const d = useTransform([lean, tremor] as MotionValue[], (latest: number[]) => {
    const [s, time] = latest;
    if (anchors.length < 2 || !size.w) return "";
    const pts: Pt[] = anchors.map((a) => {
      const factor = Math.min(1, a.sway); // anchored points (sway 0) stay still
      const vib = reduce
        ? 0
        : Math.sin(time * TREMOR_FREQ + a.i * 0.85) * TREMOR_AMP * factor;
      return { x: a.x + s * a.sway + vib, y: a.y };
    });
    return smoothPath(pts, 0.92);
  });

  // A travelling specular bead, driven by scroll, kept smooth by a spring.
  const glintRaw = useTransform(scrollYProgress, (p) => -p * 1.4);
  const glint = useSpring(glintRaw, { stiffness: 70, damping: 22, mass: 0.4 });

  if (!size.h || anchors.length < 2) return null;

  const rings = anchors.filter((a) => a.ring);

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        {/* barely-there lighting, not an obvious gradient */}
        <linearGradient id="fl-graphite" x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0" stopColor="#8b9198" stopOpacity="0.42" />
          <stop offset="0.5" stopColor="#aab0b7" stopOpacity="0.6" />
          <stop offset="1" stopColor="#878d94" stopOpacity="0.46" />
        </linearGradient>
        <radialGradient id="fl-ring" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#d9dde2" />
          <stop offset="0.55" stopColor="#999fa6" />
          <stop offset="1" stopColor="#6c7176" />
        </radialGradient>
      </defs>

      {/* depth twin — the wire slipping into shadow behind content */}
      <motion.path
        d={d}
        stroke="#000000"
        strokeOpacity={0.5}
        strokeWidth={3.5}
        strokeLinecap="round"
        style={{ filter: "blur(2.5px)", y: 6 }}
      />

      {/* the wire */}
      <motion.path
        d={d}
        stroke="url(#fl-graphite)"
        strokeWidth={1.3}
        strokeLinecap="round"
      />

      {/* travelling metallic reflections — soft silver beads, never bright white */}
      <motion.path
        d={d}
        pathLength={1}
        stroke="#cfd4da"
        strokeOpacity={0.5}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="0.014 0.34 0.009 0.52 0.011 0.27"
        style={{ strokeDashoffset: glint, filter: "blur(0.4px)" }}
      />

      {/* guide rings where the wire changes direction */}
      {rings.map((a) => (
        <GuideRing
          key={a.i}
          x={a.x}
          y={a.y}
          sway={a.sway}
          phase={a.i}
          lean={lean}
          tremor={tremor}
          reduce={!!reduce}
        />
      ))}
    </svg>
  );
}

function GuideRing({
  x,
  y,
  sway,
  phase,
  lean,
  tremor,
  reduce,
}: {
  x: number;
  y: number;
  sway: number;
  phase: number;
  lean: MotionValue<number>;
  tremor: MotionValue<number>;
  reduce: boolean;
}) {
  // Track the wire exactly: same offset formula the path uses for this point.
  const tx = useTransform([lean, tremor] as MotionValue[], (l: number[]) => {
    const [s, time] = l;
    const factor = Math.min(1, sway);
    const vib = reduce
      ? 0
      : Math.sin(time * TREMOR_FREQ + phase * 0.85) * TREMOR_AMP * factor;
    return s * sway + vib;
  });

  return (
    <motion.g style={{ x: tx }}>
      <circle cx={x} cy={y} r={5} fill="none" stroke="url(#fl-ring)" strokeWidth={1.4} />
      <circle cx={x} cy={y} r={2.6} fill="none" stroke="#000000" strokeOpacity={0.35} strokeWidth={1} />
      <circle cx={x - 1.6} cy={y - 1.8} r={0.9} fill="#eef0f3" fillOpacity={0.8} />
    </motion.g>
  );
}

/**
 * A zero-footprint marker the wire routes through. `x` is 0–1000 across the page
 * width (500 = centre); `sway` scales how much this point leans with scroll
 * velocity; `ring` drops a small metal guide ring on this bend.
 */
export function LineAnchor({
  x,
  sway = 1,
  ring = false,
}: {
  x: number;
  sway?: number;
  ring?: boolean;
}) {
  return (
    <span
      aria-hidden
      data-fish-anchor
      data-x={x}
      data-sway={sway}
      data-ring={ring ? "1" : "0"}
      className="pointer-events-none block h-0 w-0"
    />
  );
}
