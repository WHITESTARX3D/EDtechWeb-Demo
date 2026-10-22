/**
 * pages/Home.jsx — convert + trust
 * ------------------------------------------------------------------
 * Sections: framed hero -> partner strip -> Popular Courses panel ->
 * glass stat tiles -> Why parents trust us -> 4-step journey (scroll-
 * drawn line) -> tilted 3D parent-dashboard mock -> instructor
 * capsules -> testimonial slider -> journal teaser -> demo CTA band.
 * Framer owns component motion; GSAP owns hero-path draw + journey scrub.
 */

import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Video, BadgeCheck, Users, LineChart, CalendarClock, Gift,
  ArrowUpRight, ArrowRight, ArrowLeft, PenLine, Mic2, Brain, FileText,
  ChevronRight, Sparkles,
} from "lucide-react";
import siteConfig from "../config/siteConfig";
import { gsap, useGSAP, EASE, vWord, vFadeUp } from "../lib/motion";
import {
  SEO, Reveal, SectionHead, SkeuButton, CountUp, Avatar, PortraitFrame, useReduced,
} from "../components/ui";
import { useUI, useReady } from "../components/layout";
import CourseCard from "../components/CourseCard";
import {
  COURSES, STATS, WHY, JOURNEY, PARTNERS, MENTORS, TESTIMONIALS, MEDIA,
} from "../data/content";

/* icon name -> component (why-tiles) */
const WHY_ICONS = { BadgeCheck, Users, Video, LineChart, CalendarClock, Gift };
const TONES = [
  ["#9A72F0", "#7B4FD8"], ["#FF8A3C", "#FF6B0A"], ["#3BC79B", "#1FA97C"],
  ["#4FC9D8", "#0EA5B7"], ["#F2787C", "#E5484D"], ["#6488F0", "#2563EB"],
];

/* ------------------------------------------------------------------
 * HERO — the one place the design is allowed to be loud.
 * ---------------------------------------------------------------- */
function Accent({ color = "o", children }) {
  // Gradient sheen text + blurred duplicate behind (glow pulse).
  return (
    <span className="glow">
      <i className={`sheen-${color}`} aria-hidden="true">{children}</i>
      <span className={`sheen-${color} relative`}>{children}</span>
    </span>
  );
}
const Word = ({ children }) => (
  <span className="wordmask"><motion.span variants={vWord}>{children}</motion.span></span>
);

function Hero() {
  const heroRef = useRef(null);
  const ready = useReady();
  const reduced = useReduced();
  const { openSignIn, openInstructor, lang } = useUI();

  // GSAP: lavender frame + arrow paths draw in; light pulses travel them.
  useGSAP(() => {
    const q = gsap.utils.selector(heroRef);
    if (reduced || !ready) { gsap.set(q(".draw"), { strokeDashoffset: 0 }); return; }
    gsap.to(q(".draw"), {
      strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut", stagger: 0.22, delay: 1.05,
    });
    gsap.fromTo(q(".travel"), { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 2.6, ease: "none", repeat: -1, stagger: 0.5, delay: 2.6,
    });
  }, { dependencies: [ready, reduced], scope: heroRef });

  const headlineWrap = {
    hidden: {},
    show: { transition: { staggerChildren: 0.075, delayChildren: 0.25 } },
  };

  return (
    <section ref={heroRef} aria-label="Introduction" className="relative px-5 md:px-8 pt-28 md:pt-36 pb-14 md:pb-20">
      <div className="relative mx-auto max-w-[1148px]">

        {/* —— Lavender frame w/ arrow paths (desktop) —— */}
        <svg
          className="absolute -inset-x-3 -top-6 bottom-auto hidden md:block w-[calc(100%+24px)] h-[calc(100%+48px)] pointer-events-none"
          viewBox="0 0 1148 640"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* rounded border with a gap at the bottom centre */}
          <path
            className="hero-path draw" pathLength="1" strokeDasharray="1" strokeDashoffset="1"
            vectorEffect="non-scaling-stroke"
            d="M60 16 H1088 A44 44 0 0 1 1132 60 V500 A44 44 0 0 1 1088 544 H700 M448 544 H60 A44 44 0 0 1 16 500 V60 A44 44 0 0 1 60 16"
          />
          {/* frame sides curve inward into arrows pointing at the CTAs */}
          <path className="hero-path draw" pathLength="1" strokeDasharray="1" strokeDashoffset="1" vectorEffect="non-scaling-stroke"
            d="M448 544 C 420 568, 424 574, 442 586 M432 572 L442 586 L452 574" />
          <path className="hero-path draw" pathLength="1" strokeDasharray="1" strokeDashoffset="1" vectorEffect="non-scaling-stroke"
            d="M700 544 C 728 568, 724 574, 706 586 M716 572 L706 586 L696 574" />
          {/* light pulses travelling along the arrow paths */}
          <path className="travel" pathLength="1" strokeDasharray="0.07 0.93" strokeDashoffset="1" fill="none"
            stroke="#7B4FD8" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            d="M448 544 C 420 568, 424 574, 442 586" />
          <path className="travel" pathLength="1" strokeDasharray="0.07 0.93" strokeDashoffset="1" fill="none"
            stroke="#FF6B0A" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            d="M700 544 C 728 568, 724 574, 706 586" />
        </svg>
        {/* simplified frame on mobile */}
        <div className="absolute -inset-3 rounded-[2rem] border-2 border-frame md:hidden pointer-events-none" aria-hidden="true" />

        {/* —— Floating decor —— (lavender quarter-ring only; the yellow
             outline square crossed the left portrait, so it was removed) */}
        <div className="absolute -top-10 right-6 lg:right-14 w-24 h-24 hidden md:block anim-float-slow" aria-hidden="true">
          <div className="w-full h-full rounded-full border-[10px] border-frame border-b-transparent border-l-transparent -rotate-45 opacity-80" />
        </div>

        {/* —— Content —— */}
        <div className="relative text-center px-2 sm:px-10 md:px-24 py-10 md:py-14">
          <Reveal variant="fade" delay={0.1}>
            <span className="chip glass text-violet">
              <Sparkles size={12} className="text-orange" />
              Live online classes for ages 8–16
            </span>
          </Reveal>

          <motion.h1
            className="display text-ink text-[clamp(2.35rem,6.2vw,4.6rem)] mt-6"
            variants={headlineWrap}
            initial="hidden"
            animate={ready ? "show" : "hidden"}
          >
            <span className="block">
              <Word>Give</Word> <Word>your</Word> <Word>child</Word> <Word>the</Word>
            </span>
            <span className="block mt-1">
              <Word>skills</Word> <Word>of</Word>{" "}
              <Word><Accent color="o">tomorrow,</Accent></Word>
            </span>
            <span className="block mt-1">
              <Word><Accent color="v">starting&nbsp;today.</Accent></Word>
            </span>
          </motion.h1>

          {/* hand-drawn arrow beside the last line */}
          <svg className="hidden lg:block absolute right-[9%] top-[46%] w-28 h-20 pointer-events-none" viewBox="0 0 112 80" aria-hidden="true">
            <path className="draw" pathLength="1" strokeDasharray="1" strokeDashoffset="1"
              style={{ stroke: "#FF6B0A", strokeWidth: 2.4, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }}
              d="M8 10 C 34 44, 62 58, 96 50 M86 38 L96 50 L84 60" />
          </svg>

          <Reveal variant="fade" delay={1.1}>
            <p className="measure mx-auto mt-5 text-muted text-[0.95rem] md:text-base leading-relaxed">
              Live classes in coding, communication and creative thinking — in batches of
              six, with certified mentors parents can actually talk to.
            </p>
          </Reveal>

          {/* CTA row joined by a dash */}
          <Reveal variant="fade" delay={1.3}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <SkeuButton variant="orange" size="lg" onClick={openInstructor}>
                Join as Instructor
              </SkeuButton>
              <span aria-hidden="true" className="hidden sm:block w-6 h-[2px] rounded-full bg-frame" />
              <SkeuButton variant="violet" size="lg" onClick={() => openSignIn("student")}>
                Join as Student
              </SkeuButton>
            </div>
            <p className="mt-4 text-xs font-semibold text-muted">Free demo class included · No card required</p>
          </Reveal>

          {/* —— Capsule portraits on the bottom corners (desktop) —— */}
          <div className="hidden md:block">
            <motion.div
              className="absolute -bottom-7 left-10 lg:left-20"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 1.5 }}
            >
              <div className="anim-float">
                <PortraitFrame
                  src={MEDIA.heroLeft}
                  alt={MEDIA.heroLeftAlt}
                  className="w-[104px] lg:w-[124px] h-[168px] lg:h-[200px]"
                  imgProps={{ width: 800, height: 1200, loading: "eager" }}
                />
                <span className="chip glass-deep text-ink absolute -top-4 -right-14 anim-float-sm">
                  <Star size={12} className="text-amber" fill="#F59E0B" /> 4.9 parent rating
                </span>
              </div>
            </motion.div>
            <motion.div
              className="absolute -bottom-7 right-10 lg:right-20"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 1.65 }}
            >
              <div className="anim-float-slow">
                <PortraitFrame
                  src={MEDIA.heroRight}
                  alt={MEDIA.heroRightAlt}
                  className="w-[104px] lg:w-[124px] h-[168px] lg:h-[200px]"
                  imgProps={{ width: 800, height: 1200, loading: "eager" }}
                />
                <span className="chip glass-deep text-ink absolute -bottom-4 -left-16 anim-float-sm">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-cgreen opacity-70" style={{ animation: "ringPulse 1.8s ease-out infinite" }} />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-cgreen" />
                  </span>
                  Live class 10:00 AM
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Portraits under CTAs (mobile only, per brief) */}
        <div className="flex md:hidden justify-center gap-4 mt-10">
          <PortraitFrame src={MEDIA.heroLeft} alt={MEDIA.heroLeftAlt} className="w-20 h-32" imgProps={{ loading: "lazy", decoding: "async" }} />
          <PortraitFrame src={MEDIA.heroRight} alt={MEDIA.heroRightAlt} className="w-20 h-32 mt-6" imgProps={{ loading: "lazy", decoding: "async" }} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function PartnerStrip() {
  return (
    <section aria-label="Partners" className="px-5 md:px-8 py-10 md:py-14">
      <Reveal variant="fade" className="mx-auto max-w-[1100px] text-center">
        <p className="text-xs font-bold text-muted tracking-wide">Trusted by forward-thinking schools & families</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PARTNERS.map((p, i) => (
            <span
              key={p}
              className={`grayscale opacity-45 hover:opacity-90 hover:grayscale-0 transition-all duration-300 text-ink text-lg select-none ${
                ["font-black tracking-tight", "display italic", "font-extrabold lowercase tracking-widest", "display font-semibold", "font-bold tracking-tight"][i % 5]
              }`}
            >
              {p === "OrbitEd" ? "◦ " + p : p}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function PopularCourses() {
  const navigate = useNavigate();
  return (
    <section aria-label="Popular courses" className="px-5 md:px-8 py-10 md:py-16">
      <div className="relative mx-auto max-w-[1200px] rounded-[2.5rem] bg-panel border border-frame/60 px-5 sm:px-8 md:px-12 py-10 md:py-14 overflow-hidden">
        {/* peach triangle accent */}
        <svg className="absolute -top-4 right-8 w-24 h-24 rotate-[24deg] opacity-90" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 6 L94 90 H6 Z" fill="none" stroke="#F8CFC4" strokeWidth="7" strokeLinejoin="round" />
        </svg>

        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9">
          <SectionHead
            align="left"
            title={<>Popular <span className="text-violet">Courses</span></>}
            sub="The classes families rebook most — small batches, real projects, visible progress."
            className="max-w-xl !mt-0"
          />
          <Reveal variant="fade" delay={0.15}>
            <button type="button" onClick={() => navigate("/courses")} className="link-u inline-flex items-center gap-1.5 font-extrabold text-violet text-sm cursor-pointer shrink-0">
              Explore Courses <ArrowUpRight size={16} />
            </button>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {COURSES.slice(0, 6).map((c, i) => (
            <Reveal key={c.slug} variant="scale" delay={(i % 3) * 0.09}>
              <CourseCard course={c} onOpen={() => navigate("/courses")} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function StatTiles() {
  return (
    <section aria-label="Our numbers" className="px-5 md:px-8 py-10 md:py-16">
      <div className="mx-auto max-w-[1100px] grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((s, i) => (
          <Reveal key={s.label} variant="scale" delay={i * 0.08}>
            <div className="glass rounded-[1.6rem] px-6 py-7 text-center">
              <p className="display text-[2rem] md:text-4xl text-ink">
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </p>
              <p className="text-[0.82rem] font-extrabold text-ink mt-1.5">{s.label}</p>
              <p className="text-[0.7rem] text-muted mt-0.5">{s.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function WhyTrust() {
  return (
    <section aria-label="Why parents trust us" className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead
          tag="Why parents trust us"
          title="Built like a school, warm like a family"
          sub="Six promises we keep every single week — audited, reported and reviewed with parents."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-12">
          {WHY.map((w, i) => {
            const Ico = WHY_ICONS[w.icon];
            const [t1, t2] = TONES[i % TONES.length];
            return (
              <Reveal key={w.title} variant="scale" delay={(i % 3) * 0.08}>
                <div className="tile p-6 h-full">
                  <span className="tile-ico w-12 h-12" style={{ "--tint1": t1, "--tint2": t2, "--tintshadow": `${t2}80` }}>
                    <Ico size={20} />
                  </span>
                  <h3 className="display text-[1.15rem] text-ink mt-4">{w.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mt-2">{w.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Journey() {
  const ref = useRef(null);
  const reduced = useReduced();
  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    if (reduced) { gsap.set([q(".jline"), q(".jrail")], { strokeDashoffset: 0, scaleY: 1 }); return; }
    gsap.to(q(".jline"), {
      strokeDashoffset: 0, ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 75%", scrub: 1 },
    });
    gsap.fromTo(q(".jrail"), { scaleY: 0 }, {
      scaleY: 1, ease: "none", transformOrigin: "top",
      scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 75%", scrub: 1 },
    });
  }, { dependencies: [reduced], scope: ref });

  return (
    <section ref={ref} aria-label="How it works" className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHead
          tag="The journey"
          title="Four steps from curious to confident"
          sub="A simple, honest path — no pressure tactics, no jargon."
        />
        <div className="relative mt-14">
          {/* desktop scroll-drawn line */}
          <svg className="hidden lg:block absolute top-9 left-0 w-full h-3" viewBox="0 0 1200 12" preserveAspectRatio="none" aria-hidden="true">
            <path className="jline" d="M40 6 H1160" pathLength="1" strokeDasharray="1" strokeDashoffset="1"
              stroke="#D3C8F5" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </svg>
          <div className="relative pl-10 lg:pl-0 grid lg:grid-cols-4 gap-6 lg:gap-7">
            {/* mobile rail */}
            <span className="jrail lg:hidden absolute left-[18px] top-2 bottom-2 w-[3px] rounded-full bg-frame" aria-hidden="true" />
            {JOURNEY.map((j, i) => (
              <Reveal key={j.t} variant="scale" delay={i * 0.1} className="relative">
                <div className="card p-6 h-full relative lg:text-center">
                  <span className="tile-ico w-[4.4rem] h-[4.4rem] !rounded-full lg:mx-auto text-lg display"
                    style={{ "--tint1": TONES[i][0], "--tint2": TONES[i][1], "--tintshadow": `${TONES[i][1]}80` }}>
                    {i + 1}
                  </span>
                  <h3 className="display text-[1.12rem] text-ink mt-4">{j.t}</h3>
                  <p className="text-sm text-muted leading-relaxed mt-2">{j.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Tilted 3D parent-dashboard preview (skeuomorphic mock).
 * ---------------------------------------------------------------- */
function DashboardMock() {
  const navigate = useNavigate();
  const R = 40;
  const C = 2 * Math.PI * R;
  return (
    <section aria-label="Parent dashboard preview" className="px-5 md:px-8 py-12 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-[1100px] grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHead
            align="left"
            tag="For parents"
            title="You see every win, every week"
            sub="Progress ring, next class, attendance and a mentor note — all in one calm dashboard. No digging through apps."
          />
          <Reveal variant="fade" delay={0.2}>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                [FileText, "Weekly report lands every Friday at 6 PM"],
                [CalendarClock, "Reschedule any class up to 4 hours before"],
                [LineChart, "Attendance and skill growth, visualised"],
              ].map(([Ico, t], i) => (
                <li key={i} className="flex items-center gap-3 text-ink-soft font-semibold">
                  <span className="tile-ico w-9 h-9 !rounded-xl" style={{ "--tint1": TONES[i][0], "--tint2": TONES[i][1], "--tintshadow": `${TONES[i][1]}80` }}>
                    <Ico size={15} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal variant="fade" delay={0.3}>
            <div className="mt-8">
              <SkeuButton variant="violet" size="lg" onClick={() => navigate("/admissions")}>
                Book a free demo class <ArrowRight size={16} />
              </SkeuButton>
            </div>
          </Reveal>
        </div>

        {/* the mock itself */}
        <div className="tilt-scene grid place-items-center">
          <motion.div
            className="tilt-body relative w-[min(92vw,420px)]"
            initial={{ opacity: 0, y: 60, rotateX: 14, rotateY: -16, rotateZ: 3 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 8, rotateY: -10, rotateZ: 3 }}
            whileHover={{ rotateX: 3, rotateY: -4 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ transformPerspective: 1200 }}
          >
            <div className="glass-deep rounded-[2rem] p-6 shadow-[0_50px_90px_-40px_rgba(88,60,180,.5)]">
              <div className="flex items-center gap-3">
                <Avatar name="Shalini Verma" tone="#7B4FD8" size={38} />
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-ink truncate">Anaya's progress</p>
                  <p className="text-[0.68rem] text-muted">Python Basics · Batch of 6</p>
                </div>
                <span className="chip bg-violet-ghost text-violet ml-auto">Week 6</span>
              </div>

              <div className="mt-6 grid grid-cols-[auto_1fr] gap-6 items-center">
                {/* progress ring */}
                <div className="relative w-[104px] h-[104px] grid place-items-center">
                  <svg width="104" height="104" viewBox="0 0 104 104" className="-rotate-90" aria-hidden="true">
                    <circle cx="52" cy="52" r={R} fill="none" stroke="#EDE8FF" strokeWidth="10" />
                    <motion.circle
                      cx="52" cy="52" r={R} fill="none" stroke="#7B4FD8" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={C}
                      initial={{ strokeDashoffset: C }}
                      whileInView={{ strokeDashoffset: C * 0.22 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease: EASE, delay: 0.4 }}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="display text-2xl text-ink leading-none">78%</p>
                    <p className="text-[0.58rem] font-bold text-muted mt-1">term goal</p>
                  </div>
                </div>
                {/* attendance bars */}
                <div>
                  <p className="text-[0.68rem] font-extrabold text-ink-soft mb-2.5">Attendance this month</p>
                  <div className="flex items-end gap-[7px] h-[72px]">
                    {[["M", 55], ["T", 80], ["W", 65], ["T", 95], ["F", 70], ["S", 88], ["S", 60]].map(([d, h], i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                        <motion.span
                          className={`w-full max-w-[16px] rounded-full ${i === 3 ? "bg-gradient-to-t from-violet to-violet-bright" : "bg-frame"}`}
                          style={{ height: `${h}%`, transformOrigin: "bottom" }}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, ease: EASE, delay: 0.5 + i * 0.07 }}
                        />
                        <span className="text-[0.55rem] font-bold text-muted">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* next live class */}
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/80 border border-white p-3.5">
                <span className="tile-ico w-10 h-10 !rounded-xl" style={{ "--tint1": "#FF8A3C", "--tint2": "#FF6B0A", "--tintshadow": "#FF6B0A80" }}>
                  <Video size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[0.8rem] font-extrabold text-ink">Next live class</p>
                  <p className="text-[0.68rem] text-muted">Loops & patterns · Sat, 10:00 AM</p>
                </div>
                <span className="chip bg-[#E7F6EE] text-cgreen ml-auto">On track</span>
              </div>
            </div>

            {/* floating chips around the mock */}
            <span className="chip glass-deep text-ink absolute -top-4 -left-3 anim-float-sm"><FileText size={12} className="text-violet" /> Report ready</span>
            <span className="chip glass-deep text-ink absolute -bottom-4 -right-2 anim-float"><Star size={12} className="text-amber" fill="#F59E0B" /> Mentor note: "Brilliant questions!"</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function MentorCapsules() {
  return (
    <section aria-label="Meet our mentors" className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead
          tag="Mentors"
          title="Teachers your child will actually miss"
          sub="Engineers, scientists, and coaches — background-verified, warmth-tested."
        />
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12">
          {MENTORS.map((m, i) => (
            <Reveal key={m.name} variant="scale" delay={i * 0.12}>
              <motion.figure className="text-center group" whileHover={{ y: -6 }} transition={{ duration: 0.3, ease: EASE }}>
                <PortraitFrame
                  src={m.img}
                  alt={m.alt}
                  className="mx-auto w-[132px] md:w-[150px] h-[212px] md:h-[240px] transition-transform duration-500 group-hover:scale-[1.03]"
                  imgProps={{ width: 800, height: 1200, loading: "lazy", decoding: "async" }}
                />
                <figcaption className="mt-4">
                  <p className="display text-[1.05rem] text-ink">{m.name}</p>
                  <p className="text-[0.72rem] font-bold text-muted mt-1">{m.role}</p>
                </figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </div>
        <Reveal variant="fade" delay={0.2} className="text-center mt-10">
          <Link to="/about" className="link-u inline-flex items-center gap-1.5 font-extrabold text-violet text-sm">
            Meet the whole faculty <ArrowRight size={15} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Testimonials() {
  const [[i, dir], setI] = useState([0, 0]);
  const reduced = useReduced();
  const n = TESTIMONIALS.length;
  const go = (d) => setI(([p]) => [(p + d + n) % n, d]);

  // Gentle auto-advance; pauses without motion for reduced users.
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => go(1), 5600);
    return () => window.clearInterval(t);
  }, [reduced]);

  const t = TESTIMONIALS[i];
  return (
    <section aria-label="What parents say" className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[900px] text-center">
        <SectionHead tag="Parent stories" title="Loved at the dinner table, not just in class" />
        <div className="relative mt-10" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.blockquote
              key={i}
              custom={dir}
              initial={{ opacity: 0, x: dir >= 0 ? 70 : -70, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: dir >= 0 ? -70 : 70, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass-deep rounded-[2.2rem] px-6 sm:px-12 py-10 md:py-12"
            >
              <div className="flex justify-center gap-1 mb-5">
                {[0, 1, 2, 3, 4].map((s) => <Star key={s} size={16} className="text-amber" fill="#F59E0B" />)}
              </div>
              <p className="display text-[1.25rem] md:text-[1.55rem] leading-snug text-ink">"{t.quote}"</p>
              <footer className="mt-7 flex items-center justify-center gap-3.5">
                <Avatar name={t.name} tone={TONES[i % TONES.length][1]} size={44} />
                <span className="text-left">
                  <span className="block text-sm font-extrabold text-ink">{t.name}</span>
                  <span className="block text-[0.72rem] font-bold text-muted">{t.meta}</span>
                </span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          {/* controls */}
          <div className="mt-7 flex items-center justify-center gap-4">
            <button type="button" aria-label="Previous story" onClick={() => go(-1)}
              className="btn btn-cream !p-3 rounded-full cursor-pointer"><ArrowLeft size={16} /></button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, d) => (
                <button
                  key={d} type="button" aria-label={`Go to story ${d + 1}`} onClick={() => setI([d, d > i ? 1 : -1])}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${d === i ? "w-7 bg-violet" : "w-2 bg-frame hover:bg-violet/50"}`}
                />
              ))}
            </div>
            <button type="button" aria-label="Next story" onClick={() => go(1)}
              className="btn btn-cream !p-3 rounded-full cursor-pointer"><ArrowRight size={16} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
const JOURNAL = [
  { icon: PenLine, tint: "#EFE9FF", color: "#7B4FD8", cat: "Study habits", title: "The 25-minute focus ritual that calmed our homework battles", meta: "5 min read" },
  { icon: Mic2, tint: "#FDECEA", color: "#E5484D", cat: "Communication", title: "How we teach shy kids to present without forcing the spotlight", meta: "4 min read" },
  { icon: Brain, tint: "#E7F6EE", color: "#1FA97C", cat: "Parenting", title: "Screen time that builds skills: a parent's honest checklist", meta: "6 min read" },
];

function JournalTeaser() {
  return (
    <section aria-label="From the journal" className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9">
          <SectionHead align="left" title="From the learning journal" sub="Short, honest reads by our mentors — no clickbait, no fear." className="!mt-0 max-w-xl" />
          <Reveal variant="fade" delay={0.15}>
            <span className="chip glass text-muted">New essays every Sunday</span>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {JOURNAL.map((j, i) => (
            <Reveal key={j.title} variant="scale" delay={i * 0.09}>
              <motion.a
                href="#journal" onClick={(e) => e.preventDefault()}
                className="card block overflow-hidden group h-full"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: EASE }}
                aria-label={j.title}
              >
                <div className="h-36 grid place-items-center" style={{ background: j.tint }}>
                  <span className="tile-ico w-14 h-14 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                    style={{ "--tint1": j.color, "--tint2": j.color, "--tintshadow": `${j.color}80` }}>
                    <j.icon size={22} />
                  </span>
                </div>
                <div className="p-6">
                  <span className="cat-pill" style={{ "--c": j.color }}>{j.cat}</span>
                  <h3 className="display text-[1.08rem] leading-snug text-ink mt-3 group-hover:text-violet transition-colors">{j.title}</h3>
                  <p className="inline-flex items-center gap-1.5 text-[0.72rem] font-extrabold text-muted mt-3 link-u">
                    {j.meta} <ChevronRight size={13} />
                  </p>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function CtaBand() {
  const navigate = useNavigate();
  return (
    <section aria-label="Book a free demo" className="px-5 md:px-8 py-12 md:py-20">
      <Reveal variant="scale" className="mx-auto max-w-[1100px]">
        <div className="relative overflow-hidden rounded-[2.5rem] px-6 sm:px-12 py-14 md:py-20 text-center text-white"
          style={{ background: "linear-gradient(135deg,#9A72F0 0%, #7B4FD8 55%, #5B34A8 100%)", boxShadow: "0 40px 80px -34px rgba(91,52,168,.7)" }}>
          {/* decorative skeu circles */}
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full border-[14px] border-white/10" aria-hidden="true" />
          <div className="absolute -bottom-20 -right-12 w-64 h-64 rounded-full bg-white/10 anim-float-slow" aria-hidden="true" />
          <div className="absolute top-10 right-[16%] w-10 h-10 rounded-xl border-[3px] border-sun/70 rotate-12 anim-float" aria-hidden="true" />

          <h2 className="display text-[clamp(1.9rem,4.4vw,3.1rem)] relative">
            Give your child a head start<br className="hidden sm:block" /> this very weekend.
          </h2>
          <p className="relative mt-4 text-white/85 max-w-[52ch] mx-auto text-[0.95rem]">
            One free, real class with a real batch. If it isn't right, we'll say so — and suggest what is.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <SkeuButton variant="orange" size="lg" onClick={() => navigate("/admissions")}>
              Book a free demo class <ArrowRight size={16} />
            </SkeuButton>
            <SkeuButton
              variant="cream" size="lg" onClick={() => navigate("/courses")}
            >
              Explore courses
            </SkeuButton>
          </div>
          <p className="relative mt-5 text-[0.72rem] font-bold text-white/70 tracking-wide">No card · No commitment · Batches of six</p>
        </div>
      </Reveal>
    </section>
  );
}

/* ================================================================== */
export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: siteConfig.brand,
      url: siteConfig.url,
      slogan: siteConfig.tagline,
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      address: { "@type": "PostalAddress", streetAddress: siteConfig.contact.address, addressCountry: "IN" },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: COURSES.slice(0, 6).map((c, i) => ({
        "@type": "ListItem", position: i + 1,
        item: {
          "@type": "Course", name: c.title, description: c.desc,
          provider: { "@type": "Organization", name: siteConfig.brand, sameAs: siteConfig.url },
        },
      })),
    },
  ];

  return (
    <>
      <SEO
        description="Live, small-batch online classes in coding, communication and creative thinking for ages 8–16. Certified mentors, weekly parent reports, free demo class."
        path="/"
        jsonLd={jsonLd}
      />
      <Hero />
      <PartnerStrip />
      <PopularCourses />
      <StatTiles />
      <WhyTrust />
      <Journey />
      <DashboardMock />
      <MentorCapsules />
      <Testimonials />
      <JournalTeaser />
      <CtaBand />
    </>
  );
}
