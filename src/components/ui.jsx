/**
 * components/ui.jsx
 * ------------------------------------------------------------------
 * Shared UI primitives: Reveal, SkeuButton, Tilt (3D + parallax ctx),
 * SectionHead, Accordion, Modal, CountUp, Stars, Avatar, Switch,
 * Field, Logo, EmptyState and <SEO> (react-helmet-async).
 * Motion rule: Framer Motion only in this file — GSAP stays in
 * pages/effects for timelines and scroll scrub.
 */

import {
  createContext, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { createPortal } from "react-dom";
import {
  motion, AnimatePresence, useInView, useMotionValue, useSpring,
  useTransform, useMotionTemplate, useReducedMotion, LayoutGroup,
} from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Star, X, SearchX } from "lucide-react";
import siteConfig from "../config/siteConfig";
import { EASE, vFadeUp, vMask, vScale, vLineX, vWord } from "../lib/motion";

/* ============================ Hooks ============================= */

/** True when the user prefers reduced motion. */
export const useReduced = () => !!useReducedMotion();

/**
 * "Light mode" for low-end hardware + touch + reduced motion:
 * no tilt, fewer background shapes, simpler preloader.
 */
export function useLightMode() {
  const reduced = useReduced();
  return useMemo(() => {
    if (reduced) return true;
    if (typeof navigator !== "undefined" && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;
    return false;
  }, [reduced]);
}

export const isCoarse = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(pointer: coarse)")?.matches ?? false);

/** Lock body scroll while a modal/drawer is open. */
export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [locked]);
}

/* =========================== Reveal ============================= */

const REVEAL_VARIANTS = { fade: vFadeUp, scale: vScale, mask: vMask, line: vLineX };

/**
 * One reusable <Reveal> whose *style fits the content*:
 *  - "mask"  headings (clip wipe)
 *  - "scale" cards/tiles (settle-scale)
 *  - "fade"  copy/rows (soft rise)
 *  - "line"  hairlines (scaleX draw)
 */
export function Reveal({ variant = "fade", delay = 0, amount = 0.35, once = true, className = "", style, children, as = "div" }) {
  const v = REVEAL_VARIANTS[variant] || vFadeUp;
  const Tag = motion[as] || motion.div;
  const variants = useMemo(() => ({
    hidden: v.hidden,
    show: { ...v.show, transition: { ...(v.show.transition || {}), delay } },
  }), [v, delay]);
  return (
    <Tag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </Tag>
  );
}

/** Masked word-by-word rise for hero headlines. */
export function WordReveal({ words, className = "", delayStep = 0.07, startDelay = 0 }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: delayStep, delayChildren: startDelay } } }}
    >
      {words.map((w, i) => (
        <span className="wordmask" key={i}>
          <motion.span variants={vWord}>{w}</motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ========================== SkeuButton ========================== */

const BTN_VARIANTS = {
  violet: "btn-violet",
  orange: "btn-orange",
  cream: "btn-cream",
  wa: "btn-wa",
};
const BTN_SIZES = { sm: "btn-sm", md: "btn-md", lg: "btn-lg" };

/**
 * Skeuomorphic pill button: layered gradient, inner highlight/shade,
 * colored drop shadow, sheen sweep on hover, 1px :active press,
 * click ripple, and a gentle magnetic pull (desktop pointers only).
 */
export function SkeuButton({
  variant = "violet", size = "md", className = "", children,
  onClick, href, type = "button", magnetic = true, ariaLabel, target,
}) {
  const reduced = useReduced();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const spawnRipple = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const s = Math.max(r.width, r.height);
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = `${s}px`;
    span.style.left = `${(e.clientX || r.left + r.width / 2) - r.left - s / 2}px`;
    span.style.top = `${(e.clientY || r.top + r.height / 2) - r.top - s / 2}px`;
    el.appendChild(span);
    window.setTimeout(() => span.remove(), 700);
  };

  const handleClick = (e) => { spawnRipple(e); onClick?.(e); };
  const onPointerMove = (e) => {
    if (!magnetic || reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onPointerLeave = () => { x.set(0); y.set(0); };

  const cls = `btn ${BTN_SIZES[size]} ${BTN_VARIANTS[variant]} ${className}`;
  const inner = (
    <>
      <span className="btn-sheen" aria-hidden="true" />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </>
  );

  const Tag = href ? motion.a : motion.button;
  return (
    <Tag
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer noopener" : undefined}
      type={href ? undefined : type}
      aria-label={ariaLabel}
      className={cls}
      style={{ x: sx, y: sy }}
      onClick={handleClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileTap={{ scale: 0.97 }}
    >
      {inner}
    </Tag>
  );
}

/* ===================== Tilt (3D + parallax) ===================== */

const TiltCtx = createContext(null);

/**
 * Parallax layer hook: children of <Tilt> use depth 1..3 to drift
 * laterally against the pointer. Guaranteed visible parallax without
 * relying on preserve-3d inheritance chains.
 */
export function useTiltParallax(depth = 1) {
  const ctx = useContext(TiltCtx);
  const fallback = useMotionValue(0);
  const px = ctx?.px ?? fallback;
  const py = ctx?.py ?? fallback;
  const x = useTransform(px, (v) => v * depth * -13);
  const y = useTransform(py, (v) => v * depth * -13);
  return { x, y };
}

/**
 * Pointer-driven 3D tilt: max ~8deg, spring-settled, moving glare,
 * shadow shifting the opposite way. Disabled on touch / reduced
 * motion / low-end (falls back to a gentle float).
 */
export function Tilt({ children, className = "", max = 8, gentle = false }) {
  const reduced = useReduced();
  const light = useLightMode();
  const [coarse] = useState(isCoarse);
  // Touch, reduced-motion and low-end devices never tilt.
  const off = reduced || light || coarse;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.6 });
  const spy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.6 });
  const rotateX = useTransform(spy, (v) => -v * max);
  const rotateY = useTransform(spx, (v) => v * max);
  const glareX = useTransform(spx, (v) => v * 120);
  const glareY = useTransform(spy, (v) => v * 120);
  const glareOp = useTransform([spx, spy], ([a, b]) => Math.min(0.55, Math.abs(a) + Math.abs(b) > 0.02 ? 0.5 : 0));
  const shX = useTransform(spy, (v) => -v * max * 1.6);
  const shY = useTransform(spx, (v) => 30 + v * max * 1.1);
  const shadow = useMotionTemplate`${shX}px ${shY}px 52px -26px rgba(43,32,102,0.26)`;

  const onPointerMove = (e) => {
    if (off || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { px.set(0); py.set(0); };

  if (off) {
    // Touch / low-end: gentle scroll-independent float, zero tilt.
    return (
      <div className={`tilt-scene ${className}`}>
        <div className={`h-full ${gentle ? "anim-float-sm" : ""}`}>{children}</div>
      </div>
    );
  }

  return (
    <TiltCtx.Provider value={{ px: spx, py: spy }}>
      <div className={`tilt-scene ${className}`}>
        <motion.div
          className="tilt-body relative h-full rounded-[1.4rem]"
          style={{ rotateX, rotateY, boxShadow: shadow, transformPerspective: 1000 }}
          onPointerMove={onPointerMove}
          onPointerLeave={reset}
        >
          {children}
          <motion.div
            aria-hidden="true"
            className="card-glare"
            style={{ x: glareX, y: glareY, opacity: glareOp }}
          />
        </motion.div>
      </div>
    </TiltCtx.Provider>
  );
}

/* ========================= Section bits ========================= */

export function SectionHead({ tag, title, sub, align = "center", className = "" }) {
  const center = align !== "left";
  return (
    <div className={`${center ? "text-center mx-auto" : "text-left"} max-w-2xl ${className}`}>
      {tag && (
        <Reveal variant="fade" className={center ? "flex justify-center" : ""}>
          <span className="chip glass text-violet">{tag}</span>
        </Reveal>
      )}
      <Reveal variant="mask" delay={0.08}>
        <h2 className="display text-ink text-[clamp(1.85rem,3.8vw,2.8rem)] mt-4">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal variant="fade" delay={0.16}>
          <p className={`mt-4 text-muted leading-relaxed measure ${center ? "mx-auto" : ""}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Count-up stat number (formats with Indian digit grouping). */
export function CountUp({ value, suffix = "", decimals = 0, duration = 1.7, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / (duration * 1000));
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // expo ease-out
      const v = value * e;
      ref.current.textContent =
        (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-IN")) + suffix;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, suffix, decimals, duration]);
  return <span ref={ref} className={className}>0</span>;
}

/** Amber star rating row. */
export function Stars({ value = 4.8, size = 13, className = "" }) {
  const filled = Math.round(value);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`Rated ${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          className={i < filled ? "text-amber" : "text-frame"}
          fill={i < filled ? "#F59E0B" : "none"}
        />
      ))}
    </span>
  );
}

/** Initials avatar in a category-colored gradient disc. */
export function Avatar({ name = "", tone = "#7B4FD8", size = 36, className = "" }) {
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <span
      aria-hidden="true"
      className={`inline-grid place-items-center rounded-full text-white font-extrabold shrink-0 ${className}`}
      style={{
        width: size, height: size, fontSize: size * 0.34,
        background: `linear-gradient(160deg, ${tone}, color-mix(in srgb, ${tone} 62%, #0b2b2a))`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.4), inset 0 -2px 4px rgba(0,0,0,.18), 0 5px 10px -4px ${tone}88`,
      }}
    >
      {initials}
    </span>
  );
}

/* ========================== Accordion =========================== */

export function Accordion({ items = [], defaultOpen = 0, className = "", itemClass = "", ns = "acc" }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`card overflow-hidden ${itemClass}`}>
            <button
              type="button"
              className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer"
              aria-expanded={isOpen}
              aria-controls={`acc-${ns}-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="font-bold text-[0.95rem] text-ink">{it.q ?? it.title}</span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="grid place-items-center w-7 h-7 rounded-full bg-violet-ghost text-violet font-bold shrink-0"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`acc-${ns}-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 -mt-1 text-sm leading-relaxed text-muted">{it.a ?? it.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ============================ Modal ============================= */

export function Modal({ open, onClose, children, labelledBy, wide = false }) {
  const panelRef = useRef(null);
  useLockBody(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Minimal but correct focus trap inside the dialog.
        const els = panelRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!els || els.length === 0) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    // Autofocus the first interactive element when the dialog opens.
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector("input,select,textarea,button")?.focus();
    }, 90);
    return () => { document.removeEventListener("keydown", onKey); window.clearTimeout(t); };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            aria-label="Close dialog"
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className={`glass-deep relative w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-[1.8rem] p-6 sm:p-8 max-h-[88vh] overflow-y-auto`}
            initial={{ opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.42, ease: EASE }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 grid place-items-center w-9 h-9 rounded-full bg-white/70 border border-white/80 text-ink hover:bg-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ===================== Forms & small pieces ===================== */

export function Field({ label, children, className = "", htmlFor }) {
  return (
    <label className={`block text-left ${className}`} htmlFor={htmlFor}>
      <span className="block text-xs font-extrabold tracking-wide text-ink-soft mb-1.5">{label}</span>
      {children}
    </label>
  );
}

/** Skeuomorphic segmented switch (monthly/annual etc.).
 *  LayoutGroup scopes the shared "seg-knob" layoutId so several
 *  switches on one page animate independently. */
export function Segmented({ options = [], value, onChange, ariaLabel = "toggle" }) {
  return (
    <LayoutGroup>
      <div className="switch" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
          >
            {active && (
              <motion.span
                layoutId="seg-knob"
                className="switch-knob absolute inset-0"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{opt}</span>
          </button>
        );
      })}
      </div>
    </LayoutGroup>
  );
}

export function EmptyState({ title = "Nothing here yet", sub }) {
  return (
    <div className="card grid place-items-center text-center px-8 py-14">
      <span className="tile-ico w-14 h-14 mb-4"><SearchX size={22} /></span>
      <p className="display text-xl">{title}</p>
      {sub && <p className="text-sm text-muted mt-2 max-w-xs">{sub}</p>}
    </div>
  );
}

/**
 * The ONE person-photo treatment used everywhere (hero, mentors,
 * faculty, testimonials): capsule shape + a single even violet
 * border + soft violet shadow. No plates, rings or offset shapes.
 */
export function PortraitFrame({ src, alt, className = "", imgProps = {} }) {
  return (
    <div className={`pframe ${className}`}>
      <img src={src} alt={alt} {...imgProps} />
    </div>
  );
}

/* ========================== Logo marks ========================== */

/** Two overlapping circles — the brand mark. */
export function LogoMark({ size = 30, pulse = false }) {
  const r = size / 2;
  return (
    <svg
      width={size * 1.55}
      height={size}
      viewBox="0 0 46 30"
      aria-hidden="true"
      className={pulse ? "origin-center" : ""}
      style={pulse ? { animation: "logoPulse 1.1s ease-in-out infinite" } : undefined}
    >
      <circle cx="14" cy="15" r={r * 0.82} fill={siteConfig.logo.circleA} fillOpacity="0.92" />
      <circle cx="30" cy="15" r={r * 0.82} fill={siteConfig.logo.circleB} fillOpacity="0.95" />
      <circle cx="14" cy="13" r={r * 0.3} fill="#ffffff" fillOpacity="0.35" />
    </svg>
  );
}

export function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={26} />
      {!compact && (
        <span className="font-extrabold tracking-tight text-[1.02rem] text-ink leading-none">
          {siteConfig.brand}
        </span>
      )}
    </span>
  );
}

/* ====================== Social brand icons ====================== */
// Lucide dropped brand icons in recent versions, so the four marks
// we need are hand-drawn here in the same 24px grid / stroke style.

const Ico = ({ size = 16, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const SOC = {
  instagram: ({ size }) => (
    <Ico size={size}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.5" fill="currentColor" /></Ico>
  ),
  youtube: ({ size }) => (
    <Ico size={size}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.4l5.2 2.6-5.2 2.6z" fill="currentColor" stroke="none" /></Ico>
  ),
  linkedin: ({ size }) => (
    <Ico size={size}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 11v5M8 8v.01M12 16v-3.2c0-1.5 1-2.8 2.5-2.8S17 11.3 17 12.8V16" /></Ico>
  ),
  facebook: ({ size }) => (
    <Ico size={size}><path d="M14.5 8H17V5h-2.5C12.6 5 11 6.6 11 8.5V10H8.5v3H11v6h3v-6h2.5l.5-3H14V8.7c0-.4.2-.7.5-.7z" /></Ico>
  ),
};
/** Brand icon by config name ("Instagram" | "Youtube" | "Linkedin" | "Facebook"). */
export function SocialIcon({ name = "", size = 16 }) {
  const key = name.toLowerCase().replace(/\s+/g, "");
  const Cmp = SOC[key] || SOC.instagram;
  return <Cmp size={size} />;
}

/* ============================== SEO ============================= */

export function SEO({ title, description, path = "/", jsonLd }) {
  const url = siteConfig.url + path;
  const fullTitle = title
    ? `${title} — ${siteConfig.brand}`
    : `${siteConfig.brand} — ${siteConfig.tagline}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteConfig.brand} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
