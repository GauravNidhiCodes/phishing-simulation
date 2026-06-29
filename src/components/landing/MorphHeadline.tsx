"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;


export default function MorphHeadline({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px -25% 0px" });
  const [active, setActive] = useState(false);

  
  useEffect(() => {
    if (reduce) return;
    const hoverCapable =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hoverCapable) return;

    const el = triggerRef.current;
    if (!el) return;
    const enter = () => setActive(true);
    el.addEventListener("mouseenter", enter);
    return () => el.removeEventListener("mouseenter", enter);
  }, [triggerRef, reduce]);

  useEffect(() => {
    if (reduce) return;
    const hoverCapable =
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hoverCapable && inView) setActive(true);
  }, [inView, reduce]);

  const headingClass =
    "text-[clamp(2.6rem,7.4vw,5.4rem)] font-semibold leading-[1.04] tracking-[-0.04em]";

  
  if (reduce) {
    return (
      <h1 ref={ref} className={headingClass}>
        <span className="block">
          The email isn&apos;t the <span className="font-bold">danger.</span>
        </span>
        <span className="block text-ink-soft">
          Your <span className="font-bold text-ink">next click</span> is.
        </span>
      </h1>
    );
  }

  return (
    <h1
      ref={ref}
      className={headingClass}
      aria-label="The email isn't the danger. Your next click is."
    >
      <span className="block" aria-hidden>
        The email isn&apos;t the <span className="font-bold">danger.</span>
      </span>

      {}
      <motion.span
        className="block text-ink-soft will-change-transform"
        aria-hidden
        initial={false}
        animate={
          active
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 24, filter: "blur(6px)" }
        }
        transition={{
          y: { type: "spring", stiffness: 130, damping: 19, mass: 1 },
          opacity: { duration: 0.65, ease: EASE },
          filter: { duration: 0.65, ease: EASE },
        }}
      >
        Your <span className="font-bold text-ink">next click</span> is.
      </motion.span>
    </h1>
  );
}
