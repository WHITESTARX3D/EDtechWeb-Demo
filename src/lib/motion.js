/**
 * lib/motion.js
 * ------------------------------------------------------------------
 * ONE shared motion language for the whole site.
 * - EASE is the single easing curve (matching the CSS token) so
 *   Framer Motion, GSAP and CSS transitions all feel identical.
 * - GSAP + ScrollTrigger + useGSAP are registered once, here.
 * - Rule from the brief: Framer owns component motion (reveals,
 *   hover, layout), GSAP owns timelines + scroll scrub. Never both
 *   on the same element.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
// Global GSAP defaults — any timeline we write inherits this curve.
gsap.defaults({ ease: "expo.out", duration: 0.6 });

export { gsap, ScrollTrigger, useGSAP };

/** Shared easing — JS flavour of cubic-bezier(.22,1,.36,1). */
export const EASE = [0.22, 1, 0.36, 1];
/** CSS flavour, used by inline transitions. */
export const EASE_CSS = "cubic-bezier(.22,1,.36,1)";

export const DURATION = { fast: 0.25, med: 0.5, slow: 0.85 };

/* ------------------------- Framer variants ------------------------- */

/** Parent container that staggers its children. */
export const vStagger = (stagger = 0.09, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren, ease: EASE } },
});

/** Heading words: masked rise from below (used with an overflow-hidden wrapper). */
export const vWord = {
  hidden: { y: "115%", rotate: 3 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
};

/** Gentle rise + fade for body copy, rows and small blocks. */
export const vFadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Cards / tiles: fade with a soft settle-scale, never a plain fade-up. */
export const vScale = {
  hidden: { opacity: 0, scale: 0.92, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Masked clip reveal for headings (wipes top -> bottom). */
export const vMask = {
  hidden: { clipPath: "inset(0 0 100% 0)", y: 24, opacity: 0.001 },
  show: {
    clipPath: "inset(0 0 -12% 0)",
    y: 0,
    opacity: 1,
    transition: { duration: 0.85, ease: EASE },
  },
};

/** Horizontal line draw (for dividers + journey connectors). */
export const vLineX = {
  hidden: { scaleX: 0, opacity: 1 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease: EASE } },
};
