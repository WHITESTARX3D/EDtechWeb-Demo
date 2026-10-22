/**
 * components/CourseCard.jsx
 * ------------------------------------------------------------------
 * THE signature component. Anatomy (per the brief):
 * tinted 16:10 artwork area -> meta row (round play icon + lessons,
 * star rating) -> 2-line serif title -> hairline -> instructor footer
 * with category pill.
 *
 * Interaction:
 *  - pointer-driven 3D tilt (max ~8deg, spring) via <Tilt>
 *  - artwork layers at separate parallax depths (useTiltParallax)
 *  - moving glare + shadow shifting opposite the pointer
 *  - touch devices: no tilt, gentle float instead
 *  - every artwork loop is paused while the card is off-screen
 *    (IntersectionObserver toggles .art-paused -> animation-play-state)
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Eye } from "lucide-react";
import { Tilt, useTiltParallax, Stars, Avatar } from "./ui";
import { CAT } from "../data/content";

/* ------------------------------------------------------------------
 * Depth layer inside a <Tilt> — drifts against the pointer.
 * ---------------------------------------------------------------- */
function Layer({ depth = 1, className = "", style, children }) {
  const { x, y } = useTiltParallax(depth);
  return (
    <motion.div className={className} style={{ x, y, ...style }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------
 * 12 animated artwork scenes — layered SVG with transform/opacity
 * CSS loops (see .a-* classes in index.css). All decorative.
 * ---------------------------------------------------------------- */

const S = { strokeLinecap: "round", strokeLinejoin: "round" };

/* 1 · Machine learning — laptop with pulsing neural-node mesh */
const ArtML = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <rect x="48" y="92" width="104" height="9" rx="4.5" fill="#7B4FD8" />
    <rect x="48" y="92" width="104" height="3" rx="1.5" fill="#9A72F0" />
    <rect x="56" y="26" width="88" height="66" rx="7" fill="#fff" stroke="#CBB9F5" strokeWidth="2.5" />
    <g stroke="#D9CDF8" strokeWidth="2">
      <line x1="72" y1="44" x2="96" y2="37" className="a-mesh" />
      <line x1="96" y1="37" x2="122" y2="45" className="a-mesh" />
      <line x1="72" y1="44" x2="79" y2="66" className="a-mesh" />
      <line x1="96" y1="37" x2="101" y2="72" className="a-mesh" />
      <line x1="122" y1="45" x2="125" y2="65" className="a-mesh" />
      <line x1="79" y1="66" x2="101" y2="72" className="a-mesh" />
      <line x1="101" y1="72" x2="125" y2="65" className="a-mesh" />
    </g>
    {[
      [72, 44, "#7B4FD8", 0], [96, 37, "#FF6B0A", 0.3], [122, 45, "#7B4FD8", 0.6],
      [79, 66, "#9A72F0", 0.9], [101, 72, "#FF6B0A", 1.2], [125, 65, "#7B4FD8", 1.5],
    ].map(([cx, cy, f, d], i) => (
      <circle key={i} cx={cx} cy={cy} r="5" fill={f} className="a-node" style={{ animationDelay: `${d}s` }} />
    ))}
    <rect x="60" y="32" width="80" height="2.5" rx="1.25" fill="#FF6B0A" opacity="0.85" className="a-scan" />
  </svg>
);

/* 2 · Python basics — paper sheet with a green check badge popping */
const ArtPy = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <rect x="60" y="16" width="80" height="98" rx="8" fill="#fff" stroke="#B8E2CB" strokeWidth="2.5" />
    <path d="M122 16 h18 v18 z" fill="#DFF2E9" stroke="#B8E2CB" strokeWidth="2" />
    <rect x="70" y="28" width="42" height="5" rx="2.5" fill="#BFE3D0" />
    {[[70, 42, 54], [70, 53, 40], [70, 64, 58], [70, 75, 34]].map(([x, y, w], i) => (
      <rect key={i} x={x} y={y} width={w} height="4.5" rx="2.25" fill={i % 2 ? "#7FD3AF" : "#1FA97C"}
        className="a-type" style={{ animationDelay: `${i * 0.55}s` }} />
    ))}
    <circle cx="128" cy="98" r="17" fill="#1FA97C" opacity="0.15" />
    <g className="a-check">
      <circle cx="128" cy="96" r="15" fill="#1FA97C" stroke="#fff" strokeWidth="3" />
      <path d="M121 96 l5 5 l9 -10" fill="none" stroke="#fff" strokeWidth="3.2" {...S} />
    </g>
  </svg>
);

/* 3 · Leadership — stacked glass platforms with spinning gold coins */
const ArtLead = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <rect x="70" y="52" width="64" height="46" rx="9" fill="#FFE3D2" opacity="0.6" />
    <rect x="62" y="40" width="64" height="46" rx="9" fill="#FFFFFF" opacity="0.55" stroke="#FFD7C0" strokeWidth="2" />
    {[[126, 96, 0], [94, 98, 0.4], [64, 100, 0.8]].map(([cx, cy, d], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx="11" ry="3.4" fill="#E05A00" opacity="0.18" className="a-shadow" style={{ animationDelay: `${d}s` }} />
    ))}
    {[[126, 34, 0], [94, 26, 0.45], [66, 38, 0.9]].map(([cx, cy, d], i) => (
      <g key={i} className="a-coin" style={{ animationDelay: `${d}s` }}>
        <circle cx={cx} cy={cy} r="12" fill="#FFD23F" stroke="#E0A81A" strokeWidth="2.5" />
        <circle cx={cx} cy={cy} r="8" fill="#FFE78F" />
        <text x={cx} y={cy + 3.4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#B7791F">₹</text>
      </g>
    ))}
  </svg>
);

/* 4 · Study skills — tablet UI with orbiting skill bubbles */
const ArtStudy = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <circle cx="100" cy="66" r="51" fill="none" stroke="#C3D4F7" strokeWidth="2" strokeDasharray="2 7" />
    <rect x="76" y="36" width="48" height="60" rx="9" fill="#fff" stroke="#B9C8EC" strokeWidth="2.5" />
    <rect x="82" y="44" width="36" height="30" rx="4" fill="#EAF0FF" />
    <rect x="86" y="50" width="28" height="3.4" rx="1.7" fill="#7FA6F8" />
    <rect x="86" y="57" width="20" height="3.4" rx="1.7" fill="#B9C8EC" />
    <rect x="86" y="64" width="24" height="3.4" rx="1.7" fill="#B9C8EC" />
    <rect x="86" y="79" width="16" height="8" rx="4" fill="#2563EB" />
    <circle cx="100" cy="91" r="2.4" fill="#B9C8EC" />
    <g className="a-orbit">
      {[
        [100, 15, "#F3D93B", "#0B2B2A", "JS"],
        [151, 66, "#8B93D8", "#fff", "PHP"],
        [100, 117, "#FF6B0A", "#fff", "HTML"],
        [49, 66, "#2E6BE6", "#fff", "CSS"],
      ].map(([cx, cy, bg, fg, t], i) => (
        <g key={i} className="a-orbit-r">
          <circle cx={cx} cy={cy} r="12" fill={bg} stroke="#fff" strokeWidth="2.5" />
          <text x={cx} y={cy + 3} textAnchor="middle" fontSize={t.length > 2 ? 6.4 : 7.6} fontWeight="800" fill={fg}>{t}</text>
        </g>
      ))}
    </g>
  </svg>
);

/* 5 · Python for finance — laptop with live clock + growth candles */
const ArtFin = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <rect x="48" y="94" width="104" height="9" rx="4.5" fill="#0EA5B7" />
    <rect x="48" y="94" width="104" height="3" rx="1.5" fill="#5CD0DC" />
    <rect x="56" y="24" width="88" height="70" rx="7" fill="#fff" stroke="#A8DEE5" strokeWidth="2.5" />
    <path d="M64 72 L84 60 L98 66 L132 44 M126 44 h6 v6" fill="none" stroke="#0B2B2A" strokeWidth="2.5" className="a-bob" {...S} />
    {[
      [95, 68, 18, "#1FA97C", 0], [109, 61, 26, "#1FA97C", 0.4],
      [123, 66, 16, "#E5484D", 0.8], [137, 55, 30, "#1FA97C", 1.2],
    ].map(([x, y, h, f, d], i) => (
      <g key={i}>
        <line x1={x} y1={y - 6} x2={x} y2={y + h + 6} stroke={f} strokeWidth="2" />
        <rect x={x - 4} y={y} width="8" height={h} rx="2" fill={f} className="a-candle" style={{ animationDelay: `${d}s` }} />
      </g>
    ))}
    <circle cx="74" cy="42" r="12" fill="#fff" stroke="#5CD0DC" strokeWidth="2.5" />
    <line x1="74" y1="42" x2="74" y2="34" stroke="#0B2B2A" strokeWidth="2.4" className="a-hand" {...S} />
    <line x1="74" y1="42" x2="74" y2="35.5" stroke="#FF6B0A" strokeWidth="1.6" className="a-hand-fast" {...S} />
    <circle cx="74" cy="42" r="1.8" fill="#0B2B2A" />
  </svg>
);

/* 6 · English — laptop, floating speech bubbles, gift box, % tag */
const ArtEng = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <rect x="62" y="92" width="76" height="8" rx="4" fill="#E5484D" />
    <rect x="68" y="46" width="64" height="46" rx="7" fill="#fff" stroke="#F2BCC0" strokeWidth="2.5" />
    <rect x="76" y="54" width="48" height="4" rx="2" fill="#F2BCC0" />
    <rect x="76" y="62" width="36" height="4" rx="2" fill="#F8DBDE" />
    <rect x="76" y="70" width="42" height="4" rx="2" fill="#F8DBDE" />
    <g className="a-bob">
      <rect x="46" y="18" width="44" height="20" rx="8" fill="#fff" stroke="#F2BCC0" strokeWidth="2.5" />
      <path d="M56 38 l-4 9 12 -8 z" fill="#fff" stroke="#F2BCC0" strokeWidth="2.5" />
      <text x="68" y="32" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#E5484D">Hello!</text>
    </g>
    <g className="a-bob" style={{ animationDelay: "0.7s" }}>
      <rect x="118" y="26" width="36" height="20" rx="8" fill="#7B4FD8" />
      <path d="M140 46 l5 8 -14 -6 z" fill="#7B4FD8" />
      <text x="136" y="40" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#fff">Aa Bb</text>
    </g>
    <g className="a-beat">
      <path d="M56 72 h26 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-26 z" fill="#E5484D" />
      <circle cx="62" cy="78" r="2.2" fill="#fff" />
      <text x="76" y="88" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">%</text>
    </g>
    <g className="a-wiggle">
      <rect x="132" y="86" width="26" height="22" rx="3" fill="#FFD23F" stroke="#E0A81A" strokeWidth="2.2" />
      <rect x="143" y="86" width="5" height="22" fill="#E5484D" />
      <rect x="129" y="80" width="32" height="8" rx="2.5" fill="#FFE78F" stroke="#E0A81A" strokeWidth="2.2" />
      <path d="M140 80 c-5 -8 -12 -2 -2 0 M150 80 c5 -8 12 -2 2 0" fill="none" stroke="#E5484D" strokeWidth="2.4" {...S} />
    </g>
  </svg>
);

/* 7 · Space science — bobbing rocket, flicker flame, twinkling stars */
const ArtRocket = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    {[[36, 26, 0], [168, 20, 0.6], [150, 96, 1.1], [30, 92, 1.6], [120, 16, 0.9]].map(([cx, cy, d], i) => (
      <path key={i} d={`M${cx} ${cy - 6} l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8 z`}
        fill={i % 2 ? "#FFD23F" : "#9FB3E8"} className="a-star" style={{ animationDelay: `${d}s` }} />
    ))}
    <ellipse cx="52" cy="108" rx="26" ry="9" fill="#EAF0FF" />
    <ellipse cx="150" cy="112" rx="30" ry="10" fill="#EAF0FF" />
    <g className="a-rocket">
      <path d="M79 62 l-13 16 h13 z M105 62 l13 16 h-13 z" fill="#FF6B0A" />
      <rect x="79" y="30" width="26" height="56" rx="13" fill="#fff" stroke="#9FB3E8" strokeWidth="2.5" />
      <path d="M79 34 Q92 10 105 34 z" fill="#FF6B0A" stroke="#9FB3E8" strokeWidth="2.5" />
      <circle cx="92" cy="46" r="7" fill="#BFE3F2" stroke="#2E6BE6" strokeWidth="2.4" />
      <rect x="83" y="64" width="18" height="4" rx="2" fill="#B9C8EC" />
      <rect x="83" y="71" width="12" height="4" rx="2" fill="#B9C8EC" />
      <g className="a-flame">
        <path d="M86 88 q6 22 12 0 q-6 8 -12 0" fill="#FF8A3C" />
        <path d="M89 88 q3 12 6 0 q-3 5 -6 0" fill="#FFD23F" />
      </g>
    </g>
  </svg>
);

/* 8 · World cultures — spinning dashed-globe with orbiting satellite */
const ArtGlobe = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <ellipse cx="100" cy="66" rx="62" ry="21" fill="none" stroke="#B7DBC9" strokeWidth="2" strokeDasharray="3 6" transform="rotate(-16 100 66)" />
    <circle cx="100" cy="66" r="36" fill="#DFF2E9" stroke="#1FA97C" strokeWidth="2.5" />
    <path d="M74 56 q10 -12 22 -6 q-4 10 -14 12 q-8 -2 -8 -6 z M108 78 q12 -6 18 4 q-6 10 -18 6 q-4 -6 0 -10 z" fill="#7FCEAC" />
    <ellipse cx="100" cy="66" rx="15" ry="36" fill="none" stroke="#1FA97C" strokeWidth="2" opacity="0.75" className="a-dspin" />
    <ellipse cx="100" cy="66" rx="29" ry="36" fill="none" stroke="#1FA97C" strokeWidth="1.6" opacity="0.5" className="a-dspin" style={{ animationDirection: "reverse" }} />
    <line x1="64" y1="66" x2="136" y2="66" stroke="#1FA97C" strokeWidth="2" opacity="0.6" className="a-dspin" />
    <g className="a-sat">
      <rect x="146" y="30" width="12" height="9" rx="2" fill="#7B4FD8" />
      <rect x="134" y="32" width="10" height="5" rx="1" fill="#9FB3E8" />
      <rect x="160" y="32" width="10" height="5" rx="1" fill="#9FB3E8" />
      <line x1="152" y1="30" x2="152" y2="26" stroke="#7B4FD8" strokeWidth="2" {...S} />
      <circle cx="152" cy="24.5" r="1.7" fill="#FF6B0A" />
    </g>
  </svg>
);

/* 9 · Digital art — palette + swirling brush + drawing stroke */
const ArtPaint = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <path d="M100 96 c-24 0 -40 -12 -40 -30 c0 -22 22 -32 46 -32 c22 0 38 10 38 26 c0 9 -7 12 -14 12 q-14 0 -14 8 c0 4 2 6 2 8 c0 5 -8 8 -18 8 z"
      fill="#fff" stroke="#CBB9F5" strokeWidth="2.5" />
    {[[82, 56, "#FF6B0A"], [100, 48, "#1FA97C"], [118, 56, "#0EA5B7"], [90, 70, "#E5484D"]].map(([cx, cy, f], i) => (
      <circle key={i} cx={cx} cy={cy} r="5.5" fill={f} stroke="#fff" strokeWidth="1.8" />
    ))}
    <path d="M58 112 c20 -16 50 -16 70 0" fill="none" stroke="#FF6B0A" strokeWidth="4.5" className="a-draw" {...S} />
    <g className="a-brush">
      <rect x="143" y="12" width="7" height="34" rx="3.5" fill="#7B4FD8" />
      <rect x="143" y="46" width="7" height="7" fill="#D9D2F2" />
      <path d="M143 53 h7 l-3.5 12 q-3.5 3 -3.5 0 z" fill="#FF6B0A" />
    </g>
  </svg>
);

/* 10 · Biology lab — microscope, light pulse, drifting cells */
const ArtMicro = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <circle cx="100" cy="62" r="27" fill="#B8EDEE" opacity="0.55" className="a-glow" />
    {[[148, 36, "#1FA97C", 0], [164, 60, "#0EA5B7", 0.8], [142, 80, "#7FCEAC", 1.6]].map(([cx, cy, f, d], i) => (
      <g key={i} className="a-cell" style={{ animationDelay: `${d}s` }}>
        <circle cx={cx} cy={cy} r="9" fill="none" stroke={f} strokeWidth="2.2" />
        <circle cx={cx + 1} cy={cy - 1} r="3" fill={f} />
      </g>
    ))}
    <rect x="64" y="104" width="56" height="8" rx="4" fill="#33504E" />
    <rect x="84" y="58" width="9" height="48" fill="#67C6D1" />
    <rect x="70" y="88" width="46" height="6" rx="3" fill="#0EA5B7" />
    <rect x="84" y="84" width="22" height="4.5" rx="2" fill="#BFE3F2" />
    <circle cx="95" cy="84" r="2.4" fill="#1FA97C" />
    <g className="a-sway">
      <rect x="102" y="30" width="15" height="36" rx="6" fill="#0EA5B7" />
      <rect x="104.5" y="23" width="10" height="9" rx="3" fill="#0B2B2A" />
      <rect x="105" y="66" width="9" height="12" rx="3" fill="#8AD9E0" />
    </g>
    <path d="M109 78 L98 84 h22 z" fill="#B8EDEE" opacity="0.7" className="a-glow" style={{ animationDelay: "0.8s" }} />
  </svg>
);

/* 11 · Vedic maths — calculator, blinking display, pressing keys */
const ArtCalc = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    <rect x="64" y="18" width="72" height="96" rx="11" fill="#fff" stroke="#F2C4B4" strokeWidth="2.5" />
    <rect x="73" y="27" width="54" height="17" rx="4.5" fill="#0B2B2A" />
    <text x="100" y="40" textAnchor="middle" fontSize="10" fontWeight="800" fill="#FFD23F" className="a-dispA">128 × 8</text>
    <text x="100" y="40" textAnchor="middle" fontSize="10" fontWeight="800" fill="#35CF72" className="a-dispB">= 1024</text>
    {[0, 1, 2, 3].map((r) =>
      [0, 1, 2, 3].map((c) => {
        const x = 75 + c * 13.6, y = 51 + r * 16.5;
        const eq = r === 3 && c === 3;
        const accent = (r === 0 && c === 3) || (r === 2 && c === 0);
        return (
          <rect key={`${r}${c}`} x={x} y={y} width="10.5" height="11" rx="3"
            fill={eq ? "#FF6B0A" : accent ? "#7B4FD8" : "#FDEBDD"}
            className={eq || accent ? "a-key" : undefined}
            style={eq ? undefined : { animationDelay: `${0.5 + c * 0.6}s` }} />
        );
      })
    )}
  </svg>
);

/* 12 · Public speaking — trophy with sparkles + falling confetti */
const ArtTrophy = () => (
  <svg viewBox="0 0 200 130" className="w-full" aria-hidden="true">
    {[[58, 16, "#7B4FD8", 0], [104, 10, "#FF6B0A", 0.7], [146, 20, "#1FA97C", 1.4], [76, 6, "#0EA5B7", 2.1], [130, 12, "#E5484D", 2.8]].map(([cx, cy, f, d], i) => (
      <rect key={i} x={cx} y={cy} width="5" height="5" rx="1.5" fill={f} className="a-conf" style={{ animationDelay: `${d}s` }} />
    ))}
    <g className="a-bob">
      <path d="M78 40 c-11 0 -15 7 -15 13 c0 8 7 11 15 9 M122 40 c11 0 15 7 15 13 c0 8 -7 11 -15 9"
        fill="none" stroke="#E0A81A" strokeWidth="3" {...S} />
      <path d="M78 34 h44 v15 c0 17 -12 27 -22 27 c-10 0 -22 -10 -22 -27 z" fill="#FFD23F" stroke="#E0A81A" strokeWidth="2.5" />
      <path d="M84 36 q-2 16 6 30" stroke="#FFE78F" strokeWidth="3.6" fill="none" {...S} />
      <rect x="94" y="76" width="12" height="12" fill="#E0A81A" />
      <rect x="82" y="88" width="36" height="10" rx="3" fill="#FFD23F" stroke="#E0A81A" strokeWidth="2.2" />
      <rect x="76" y="98" width="48" height="8" rx="3" fill="#E0A81A" />
    </g>
    {[[66, 44, 0], [134, 38, 0.9]].map(([cx, cy, d], i) => (
      <path key={i} d={`M${cx} ${cy - 7} l2 4.6 4.6 2 -4.6 2 -2 4.6 -2 -4.6 -4.6 -2 4.6 -2 z`}
        fill="#fff" stroke="#E0A81A" strokeWidth="1.6" className="a-star" style={{ animationDelay: `${d}s` }} />
    ))}
  </svg>
);

// variant key -> scene component
const ART_MAP = {
  ml: ArtML, py: ArtPy, lead: ArtLead, study: ArtStudy, finpy: ArtFin,
  eng: ArtEng, rocket: ArtRocket, globe: ArtGlobe, paint: ArtPaint,
  micro: ArtMicro, calc: ArtCalc, trophy: ArtTrophy,
};

/* ------------------------------------------------------------------
 * CourseCard
 * ---------------------------------------------------------------- */
export default function CourseCard({ course, onOpen, className = "" }) {
  const artRef = useRef(null);
  const ArtScene = ART_MAP[course.art] || ArtML;
  const color = CAT[course.cat] || "#7B4FD8";

  // Pause every artwork loop while the card scrolls out of view.
  useEffect(() => {
    const el = artRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.classList.add("art-paused");
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("art-paused", !entry.isIntersecting),
      { rootMargin: "140px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const interactive = typeof onOpen === "function";

  return (
    <Tilt className={`h-full ${className}`} gentle max={8}>
      <article
        className="group relative h-full flex flex-col rounded-[1.4rem] bg-white border border-hairline overflow-hidden transition-colors duration-300 hover:border-frame"
        onClick={interactive ? () => onOpen(course) : undefined}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={interactive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(course); } } : undefined}
        aria-label={interactive ? `Quick view: ${course.title}` : undefined}
        style={interactive ? { cursor: "pointer" } : undefined}
      >
        {/* ---- Artwork area (16:10, tinted) ---- */}
        <div ref={artRef} className="relative aspect-[16/10] overflow-hidden" style={{ background: course.tint }}>
          {/* depth 1 — soft backdrop blob */}
          <Layer depth={1} className="absolute inset-0 grid place-items-center">
            <div className="w-[62%] aspect-square rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,.75), rgba(255,255,255,0) 68%)" }} />
          </Layer>
          {/* depth 2 — the animated scene */}
          <Layer depth={2} className="absolute inset-[7%_12%] grid place-items-center">
            <ArtScene />
          </Layer>
          {/* depth 3 — floating sparkles for parallax pop */}
          <Layer depth={3} className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 200 125" className="w-full h-full" aria-hidden="true">
              <path d="M24 26 v10 M19 31 h10" stroke={color} strokeWidth="2.4" className="anim-float" {...S} />
              <circle cx="176" cy="30" r="4" fill="#FFD23F" className="anim-float-slow" />
              <circle cx="26" cy="98" r="6" fill="none" stroke="#FF6B0A" strokeWidth="2.2" className="anim-float-sm" />
              <path d="M173 96 l7 7 M180 96 l-7 7" stroke={color} strokeWidth="2.2" opacity="0.6" className="anim-float-slow" {...S} />
            </svg>
          </Layer>
          {interactive && (
            <span className="chip glass text-violet absolute top-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <Eye size={12} /> Quick view
            </span>
          )}
        </div>

        {/* ---- Body ---- */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <span className="grid place-items-center w-6 h-6 rounded-full bg-violet-ghost">
                <Play size={11} className="text-violet ml-0.5" fill="#7B4FD8" />
              </span>
              <span className="text-xs font-bold text-muted">{course.lessons}x Lesson</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Stars value={course.rating} size={12} />
              <span className="text-xs font-extrabold text-ink">{course.rating.toFixed(1)}</span>
            </span>
          </div>

          <h3 className="display text-[1.1rem] leading-snug text-ink mt-3 line-clamp-2 transition-colors duration-300 group-hover:text-violet">
            {course.title}
          </h3>

          <div className="mt-auto">
            <hr className="border-t border-hairline my-3.5" />
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2.5 min-w-0">
                <Avatar name={course.inst.name} tone={course.inst.tone} size={32} />
                <span className="min-w-0">
                  <span className="block text-[0.8rem] font-bold text-ink truncate">{course.inst.name}</span>
                  <span className="block text-[0.68rem] text-muted truncate">{course.inst.role}</span>
                </span>
              </span>
              <span className="cat-pill shrink-0" style={{ "--c": color }}>{course.cat}</span>
            </div>
          </div>
        </div>
      </article>
    </Tilt>
  );
}
