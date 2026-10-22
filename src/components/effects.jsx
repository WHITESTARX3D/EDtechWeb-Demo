/**
 * components/effects.jsx
 * ------------------------------------------------------------------
 * Site-wide atmosphere + choreography:
 *  - <BackgroundFX>  fixed mesh-gradient world: 18 reference shapes
 *    (blobs, rings, square, plusses, triangle, pills, dots, squiggles)
 *    drifting at 3 parallax depths (mouse) + GSAP scroll scrub + a
 *    scroll-tint crossfade. Light mode: 6 marked shapes, no listeners.
 *  - <Grain>         static film grain (<=4% opacity, CSS only)
 *  - <ScrollProgress> 2px violet reading bar
 *  - <Preloader>     session-once: circles merge, ring + counter,
 *                    rounded wipe away (<=1.6s)
 * GSAP lives here (scroll scrub) — Framer never touches these nodes.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { gsap, ScrollTrigger, useGSAP, EASE } from "../lib/motion";
import { useLightMode, useReduced, LogoMark } from "./ui";
import siteConfig from "../config/siteConfig";

/* ------------------------------------------------------------------
 * BackgroundFX — 18 reference shapes (blobs, rings, square, plusses,
 * triangle, dots, pills, squiggles) drifting at 3 parallax depths.
 * `dur`/`delay` phase-offset every loop so nothing drifts in sync.
 * `lite: true` marks the calm 6-shape set used in light mode.
 * ---------------------------------------------------------------- */
const SHAPES = [
  /* — Band 1 · fastest parallax, biggest soft blobs — */
  { band: 1, kind: "blob", x: "10%", y: "14%", s: 260, c: "#D3C8F5", o: 0.4, drift: "a", dur: "26s", lite: true },
  { band: 1, kind: "ring", x: "78%", y: "10%", s: 130, c: "#D3C8F5", o: 0.8, drift: "b", dur: "32s" },
  { band: 1, kind: "blob", x: "86%", y: "34%", s: 190, c: "#F8CFC4", o: 0.34, drift: "a", dur: "30s", delay: "-6s", lite: true },
  { band: 1, kind: "blob", x: "34%", y: "8%", s: 170, c: "#F8CFC4", o: 0.24, drift: "c", dur: "24s", delay: "-3s" },
  { band: 1, kind: "ring", x: "4%", y: "26%", s: 60, c: "#F8CFC4", o: 0.5, drift: "b", dur: "28s" },
  /* — Band 2 · mid depth, the reference accents — */
  { band: 2, kind: "blob", x: "28%", y: "76%", s: 210, c: "#FFE9A8", o: 0.3, drift: "b", dur: "34s", delay: "-8s", lite: true },
  { band: 2, kind: "square", x: "7%", y: "58%", s: 92, c: "#FFD23F", o: 0.85, drift: "a", r: 14, dur: "26s", delay: "-4s", lite: true },
  { band: 2, kind: "plus", x: "44%", y: "22%", s: 34, c: "#7B4FD8", o: 0.35, drift: "a", dur: "22s" },
  { band: 2, kind: "plus", x: "90%", y: "55%", s: 26, c: "#FF8A3C", o: 0.42, drift: "b", dur: "24s", delay: "-5s" },
  { band: 2, kind: "triangle", x: "82%", y: "66%", s: 84, c: "#F8CFC4", o: 0.85, drift: "b", r: 22, dur: "30s", delay: "-7s" },
  { band: 2, kind: "dot", x: "36%", y: "48%", s: 16, c: "#FFD23F", o: 0.7, drift: "c", dur: "20s", delay: "-2s", lite: true },
  { band: 2, kind: "squiggle", x: "12%", y: "86%", s: 52, c: "#B79CF0", o: 0.5, drift: "a", dur: "27s", delay: "-9s" },
  /* — Band 3 · slowest, foreground glints — */
  { band: 3, kind: "blob", x: "56%", y: "6%", s: 150, c: "#B79CF0", o: 0.22, drift: "b", dur: "36s", delay: "-5s" },
  { band: 3, kind: "ring", x: "93%", y: "82%", s: 74, c: "#FF8A3C", o: 0.5, drift: "a", dur: "25s", delay: "-3s" },
  { band: 3, kind: "blob", x: "18%", y: "40%", s: 130, c: "#F8CFC4", o: 0.26, drift: "b", dur: "29s", delay: "-11s" },
  { band: 3, kind: "plus", x: "64%", y: "88%", s: 28, c: "#7B4FD8", o: 0.4, drift: "b", dur: "23s", delay: "-6s" },
  { band: 3, kind: "pill", x: "70%", y: "18%", s: 44, c: "#D3C8F5", o: 0.7, drift: "c", r: -18, dur: "21s", delay: "-4s" },
  { band: 3, kind: "dot", x: "46%", y: "80%", s: 12, c: "#FF8A3C", o: 0.55, drift: "a", dur: "19s", delay: "-7s" },
  { band: 3, kind: "squiggle", x: "82%", y: "44%", s: 40, c: "#F8CFC4", o: 0.6, drift: "c", dur: "26s", delay: "-10s" },
];

const DRIFT = { a: "blob-anim-a", b: "blob-anim-b", c: "blob-anim-c" };

function Shape({ s }) {
  const base = {
    position: "absolute", left: s.x, top: s.y, opacity: s.o,
    transform: s.r ? `rotate(${s.r}deg)` : undefined,
  };
  const cls = DRIFT[s.drift] || "blob-anim-a";
  // Per-shape phase offsets so the whole field never moves in sync.
  const anim = { animationDuration: s.dur, animationDelay: s.delay };

  if (s.kind === "blob") {
    return (
      <div style={{ ...base, width: s.s, height: s.s }}>
        <div className={cls} style={{
          width: "100%", height: "100%", borderRadius: "42% 58% 61% 39% / 45% 43% 57% 55%",
          background: `radial-gradient(circle at 32% 28%, ${s.c}, transparent 72%)`, ...anim,
        }} />
      </div>
    );
  }
  if (s.kind === "ring") {
    return (
      <div style={{ ...base, width: s.s, height: s.s }}>
        <div className={cls} style={{ width: "100%", height: "100%", borderRadius: "50%", border: `3px solid ${s.c}`, ...anim }} />
      </div>
    );
  }
  if (s.kind === "square") {
    return (
      <div style={{ ...base, width: s.s, height: s.s }}>
        <div className={cls} style={{ width: "100%", height: "100%", borderRadius: 18, border: `3px solid ${s.c}`, ...anim }} />
      </div>
    );
  }
  if (s.kind === "dot") {
    return (
      <div style={{ ...base, width: s.s, height: s.s }}>
        <div className={cls} style={{ width: "100%", height: "100%", borderRadius: "50%", background: s.c, ...anim }} />
      </div>
    );
  }
  if (s.kind === "pill") {
    return (
      <div style={{ ...base, width: s.s, height: s.s }}>
        <div className={cls} style={{ width: "100%", height: "34%", margin: "33% 0", borderRadius: 999, background: s.c, ...anim }} />
      </div>
    );
  }
  if (s.kind === "triangle") {
    return (
      <svg width={s.s} height={s.s} viewBox="0 0 100 100" style={base} aria-hidden="true">
        <g className={cls} style={{ transformOrigin: "center", ...anim }}>
          <path d="M50 10 L92 88 H8 Z" fill="none" stroke={s.c} strokeWidth="6" strokeLinejoin="round" />
        </g>
      </svg>
    );
  }
  if (s.kind === "squiggle") {
    return (
      <svg width={s.s} height={s.s * 0.42} viewBox="0 0 108 44" style={base} aria-hidden="true">
        <g className={cls} style={{ transformOrigin: "center", ...anim }}>
          <path d="M5 24 Q13 8 25 24 T45 24 T65 24 T85 24 T105 24" fill="none" stroke={s.c} strokeWidth="5" strokeLinecap="round" />
        </g>
      </svg>
    );
  }
  // plus
  return (
    <svg width={s.s} height={s.s} viewBox="0 0 30 30" style={base} aria-hidden="true">
      <g className={cls} style={{ transformOrigin: "center", ...anim }}>
        <path d="M15 6 v18 M6 15 h18" stroke={s.c} strokeWidth="3.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function BackgroundFX() {
  const light = useLightMode();
  const reduced = useReduced();
  const ref = useRef(null);

  // Mouse parallax (3 depth bands) — springs keep it butter-smooth.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 38, damping: 16, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 38, damping: 16, mass: 0.8 });
  const b1x = useTransform(sx, (v) => v * 26), b1y = useTransform(sy, (v) => v * 26);
  const b2x = useTransform(sx, (v) => v * 15), b2y = useTransform(sy, (v) => v * 15);
  const b3x = useTransform(sx, (v) => v * 7), b3y = useTransform(sy, (v) => v * 7);

  useEffect(() => {
    if (light || reduced) return;
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [light, reduced, mx, my]);

  // GSAP scroll scrub: bands slide/rotate at different speeds,
  // plus a lavender->peach tint crossfade across the whole page.
  useGSAP(() => {
    if (light || reduced || !ref.current) return;
    const q = gsap.utils.selector(ref.current);
    [
      [".fx-b1", -60, -4],
      [".fx-b2", -140, 5],
      [".fx-b3", -240, -7],
    ].forEach(([sel, y, rot]) => {
      gsap.to(q(sel), {
        y, rotation: rot, ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "max", scrub: 1.2 },
      });
    });
    gsap.fromTo(q(".fx-veil-b"), { opacity: 0 }, {
      opacity: 0.75, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "max", scrub: 1.2 },
    });
    return () => ScrollTrigger.getAll().forEach((t) => { if (q(t.trigger)?.length) t.kill(); });
  }, { dependencies: [light, reduced], scope: ref });

  const bandStyle = "fixed inset-0 pointer-events-none";
  // Light mode (low-end/touch/reduced): the calm, marked subset only.
  const shapes = light ? SHAPES.filter((s) => s.lite) : SHAPES;

  return (
    <div ref={ref} aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-page">
      {/* mesh-gradient base */}
      <div className="absolute inset-0" style={{
        background:
          "radial-gradient(60% 50% at 18% 8%, rgba(211,200,245,.5), transparent 70%)," +
          "radial-gradient(55% 45% at 86% 18%, rgba(248,207,196,.4), transparent 70%)," +
          "radial-gradient(65% 55% at 50% 95%, rgba(255,233,168,.38), transparent 72%)," +
          "linear-gradient(180deg,#FBFAFF, #F8F6FF)",
      }} />
      {/* scroll-tint crossfade veil */}
      <div className="fx-veil-b absolute inset-0 opacity-0" style={{
        background: "radial-gradient(60% 50% at 82% 78%, rgba(248,207,196,.5), transparent 72%)",
      }} />
      {light ? (
        <div className={bandStyle}>{shapes.map((s, i) => <Shape key={i} s={s} />)}</div>
      ) : (
        <>
          <motion.div className={`fx-b1 ${bandStyle}`} style={{ x: b1x, y: b1y }}>
            {SHAPES.filter((s) => s.band === 1).map((s, i) => <Shape key={i} s={s} />)}
          </motion.div>
          <motion.div className={`fx-b2 ${bandStyle}`} style={{ x: b2x, y: b2y }}>
            {SHAPES.filter((s) => s.band === 2).map((s, i) => <Shape key={i} s={s} />)}
          </motion.div>
          <motion.div className={`fx-b3 ${bandStyle}`} style={{ x: b3x, y: b3y }}>
            {SHAPES.filter((s) => s.band === 3).map((s, i) => <Shape key={i} s={s} />)}
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
export const Grain = () => <div className="grain" aria-hidden="true" />;

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[140] origin-left"
      style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg,#7B4FD8,#FF6B0A)" }}
    />
  );
}

/* ------------------------------------------------------------------
 * Preloader — session-once, <=1.6s, rounded wipe exit.
 * ---------------------------------------------------------------- */
export function Preloader({ onDone }) {
  const [p, setP] = useState(0);

  useEffect(() => {
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const v = Math.min(1, (t - t0) / 1150);
      setP(v);
      if (v < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(onDone, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const R = 48;
  const C = 2 * Math.PI * R;

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-panel"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{ borderBottomLeftRadius: "3.5rem", borderBottomRightRadius: "3.5rem" }}
      role="status"
      aria-label="Loading"
    >
      <div className="relative grid place-items-center">
        {/* progress ring */}
        <svg width="150" height="150" viewBox="0 0 150 150" aria-hidden="true" className="-rotate-90">
          <circle cx="75" cy="75" r={R} fill="none" stroke="#E2DAF8" strokeWidth="4" />
          <circle
            cx="75" cy="75" r={R} fill="none" stroke="#7B4FD8" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - p)}
          />
        </svg>
        {/* merging circles — the logo slide-together */}
        <div className="absolute inset-0 grid place-items-center">
          <span className="relative flex">
            <motion.span
              className="block w-7 h-7 rounded-full"
              style={{ background: siteConfig.logo.circleA }}
              initial={{ x: -46, opacity: 0 }}
              animate={{ x: -7, opacity: 0.94 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            />
            <motion.span
              className="block w-7 h-7 rounded-full -ml-3"
              style={{ background: siteConfig.logo.circleB }}
              initial={{ x: 46, opacity: 0 }}
              animate={{ x: 7, opacity: 0.96 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            />
          </span>
        </div>
        <div className="absolute -bottom-16 text-center">
          <p className="display text-lg text-ink">{siteConfig.brand}</p>
          <p className="text-xs font-bold text-muted mt-1 tabular-nums">{Math.round(p * 100)}%</p>
        </div>
      </div>
    </motion.div>
  );
}
