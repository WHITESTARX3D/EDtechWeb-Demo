/**
 * pages/About.jsx — credibility
 * ------------------------------------------------------------------
 * Mission split hero -> values -> scroll-drawn timeline -> faculty
 * grid -> partner/university logo wall -> accreditations + child-
 * safety promise -> learning-space gallery.
 */

import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HeartHandshake, Sparkles, MessagesSquare, ShieldCheck, BadgeCheck,
  Lock, ArrowRight, Star, Users,
} from "lucide-react";
import siteConfig from "../config/siteConfig";
import { gsap, useGSAP, EASE } from "../lib/motion";
import { SEO, Reveal, SectionHead, SkeuButton, Avatar, useReduced } from "../components/ui";
import { VALUES, TIMELINE, FACULTY, PARTNER_WALL, ACCRED, GALLERY, MEDIA } from "../data/content";

const VALUE_ICONS = { HeartHandshake, Sparkles, MessagesSquare, ShieldCheck };
const ACCRED_ICONS = { ShieldCheck, BadgeCheck, Lock };
const TONES = [
  ["#9A72F0", "#7B4FD8"], ["#FF8A3C", "#FF6B0A"], ["#3BC79B", "#1FA97C"], ["#4FC9D8", "#0EA5B7"],
];

/* ------------------------------------------------------------------ */
function MissionHero() {
  const navigate = useNavigate();
  return (
    <section className="px-5 md:px-8 pt-32 md:pt-44 pb-14 md:pb-20">
      <div className="mx-auto max-w-[1100px] grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal variant="fade"><span className="chip glass text-violet">Our story · est. 2016</span></Reveal>
          <Reveal variant="mask" delay={0.1}>
            <h1 className="display text-ink text-[clamp(2.1rem,4.6vw,3.4rem)] mt-5">
              We make kids brave enough to ask <span className="text-orange">"why?"</span>
            </h1>
          </Reveal>
          <Reveal variant="fade" delay={0.2}>
            <p className="text-muted leading-relaxed mt-5 measure">
              {siteConfig.brand} began as six kids around a living-room table in Bengaluru.
              Nine years later we're 12,000 learners strong — but every class still feels
              like that table: small, warm, and led by a mentor who knows every child's name.
            </p>
          </Reveal>
          <Reveal variant="fade" delay={0.3}>
            <div className="mt-7 flex flex-wrap gap-4">
              <SkeuButton variant="orange" size="lg" onClick={() => navigate("/admissions")}>
                Book a free demo class <ArrowRight size={16} />
              </SkeuButton>
              <SkeuButton variant="cream" size="lg" onClick={() => navigate("/courses")}>See courses</SkeuButton>
            </div>
          </Reveal>
          <Reveal variant="fade" delay={0.4}>
            <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2.5 text-[0.82rem] font-extrabold text-ink-soft">
              {["Batches of six", "40+ certified mentors", "14 states, online", "4.9★ parent rating"].map((t) => (
                <li key={t} className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="relative">
          {/* offset outline frame behind the photo — meaningful emphasis only */}
          <div className="absolute -inset-3 rounded-[2.6rem] border-2 border-frame translate-x-4 translate-y-4" aria-hidden="true" />
          <motion.div
            className="relative rounded-[2.6rem] overflow-hidden shadow-[0_40px_80px_-36px_rgba(88,60,180,.55)]"
            initial={{ opacity: 0, scale: 0.94, rotate: 1.5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <img src={MEDIA.mission} alt={MEDIA.missionAlt} className="w-full h-[320px] md:h-[420px] object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" aria-hidden="true" />
          </motion.div>
          <span className="chip glass-deep text-ink absolute top-6 -left-3 anim-float-sm"><Users size={12} className="text-violet" /> 12,000+ learners</span>
          <span className="chip glass-deep text-ink absolute -bottom-4 right-8 anim-float"><Star size={12} className="text-amber" fill="#F59E0B" /> Rated 4.9 by parents</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Values() {
  return (
    <section className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead tag="What we believe" title="Four values we hire, teach and refund by" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-12">
          {VALUES.map((v, i) => {
            const Ico = VALUE_ICONS[v.icon];
            const [t1, t2] = TONES[i];
            return (
              <Reveal key={v.t} variant="scale" delay={i * 0.08}>
                <div className="tile p-6 h-full">
                  <span className="tile-ico w-12 h-12" style={{ "--tint1": t1, "--tint2": t2, "--tintshadow": `${t2}80` }}><Ico size={20} /></span>
                  <h3 className="display text-[1.12rem] text-ink mt-4">{v.t}</h3>
                  <p className="text-sm text-muted leading-relaxed mt-2">{v.d}</p>
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
function Timeline() {
  const ref = useRef(null);
  const reduced = useReduced();
  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    if (reduced) { gsap.set(q(".tl-rail"), { scaleY: 1 }); return; }
    gsap.fromTo(q(".tl-rail"), { scaleY: 0 }, {
      scaleY: 1, ease: "none", transformOrigin: "top",
      scrollTrigger: { trigger: ref.current, start: "top 65%", end: "bottom 80%", scrub: 1 },
    });
  }, { dependencies: [reduced], scope: ref });

  return (
    <section ref={ref} className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[900px]">
        <SectionHead tag="Milestones" title="Nine years, one unchanged promise" sub="Batches of six. Mentors first. Parents in the loop." />
        <div className="relative mt-14">
          {/* the scroll-drawn rail */}
          <span className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-[3px] bg-violet-ghost rounded-full" aria-hidden="true" />
          <span className="tl-rail absolute left-5 lg:left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-violet to-orange rounded-full" aria-hidden="true" />
          <ol className="space-y-10">
            {TIMELINE.map((t, i) => {
              const leftSide = i % 2 === 0;
              return (
                <li key={t.year} className={`relative pl-14 lg:pl-0 lg:w-[calc(50%-2.6rem)] ${leftSide ? "" : "lg:ml-auto"}`}>
                  {/* node on the rail */}
                  <Reveal variant="scale" amount={0.6} className={`absolute left-5 lg:left-auto ${leftSide ? "lg:-right-[4.05rem]" : "lg:-left-[4.05rem]"} top-1 -translate-x-1/2 lg:translate-x-0`}>
                    <span className="tile-ico w-8 h-8 !rounded-full text-[0.68rem] font-extrabold" style={{ "--tint1": TONES[i % 4][0], "--tint2": TONES[i % 4][1], "--tintshadow": `${TONES[i % 4][1]}80` }}>
                      {i + 1}
                    </span>
                  </Reveal>
                  <Reveal variant="fade" delay={0.08}>
                    <div className="card p-6">
                      <p className="display text-2xl text-violet">{t.year}</p>
                      <h3 className="font-extrabold text-ink mt-1.5">{t.t}</h3>
                      <p className="text-sm text-muted leading-relaxed mt-2">{t.d}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Faculty() {
  const { openInstructor } = useGetUI();
  return (
    <section className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead
          tag="Faculty"
          title="Certified, verified, and genuinely kind"
          sub="Under 6% of applicants clear our subject tests, teaching demos and background checks."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mt-12">
          {FACULTY.map((f, i) => (
            <Reveal key={f.name} variant="scale" delay={(i % 3) * 0.08}>
              <div className="card p-6 hover:-translate-y-1.5 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <Avatar name={f.name} tone={f.tone} size={56} />
                  <div>
                    <h3 className="display text-[1.08rem] text-ink">{f.name}</h3>
                    <span className="cat-pill mt-1.5" style={{ "--c": f.tone }}>{f.subject}</span>
                  </div>
                </div>
                <p className="text-[0.78rem] font-bold text-muted mt-4 flex items-center gap-1.5">
                  <BadgeCheck size={14} className="text-cgreen shrink-0" /> {f.cred}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal variant="fade" delay={0.2} className="text-center mt-10">
          <SkeuButton variant="cream" size="md" onClick={openInstructor}>
            Passionate about teaching? Apply to mentor <ArrowRight size={15} />
          </SkeuButton>
        </Reveal>
      </div>
    </section>
  );
}

// Late import to keep this file's top section purely presentational.
import { useUI as useGetUI } from "../components/layout";

/* ------------------------------------------------------------------ */
function PartnerWall() {
  return (
    <section className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead tag="Partners & universities" title="In good company" sub="Curriculum reviews, internship pipelines and scholarship partners." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          {PARTNER_WALL.map((p, i) => (
            <Reveal key={p} variant="scale" delay={(i % 5) * 0.05}>
              <div className="grid place-items-center h-24 rounded-2xl bg-white border border-hairline grayscale opacity-55 hover:opacity-100 hover:grayscale-0 hover:border-frame hover:-translate-y-1 transition-all duration-300">
                <span className={`text-ink text-[0.95rem] ${["font-black", "display italic", "font-extrabold tracking-widest lowercase", "display font-semibold", "font-bold"][i % 5]}`}>{p}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Safety() {
  return (
    <section className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid sm:grid-cols-3 gap-5 md:gap-6">
          {ACCRED.map((a, i) => {
            const Ico = ACCRED_ICONS[a.icon];
            return (
              <Reveal key={a.t} variant="scale" delay={i * 0.08}>
                <div className="glass rounded-[1.6rem] p-6 text-center h-full">
                  <span className="tile-ico w-12 h-12 mx-auto" style={{ "--tint1": TONES[i][0], "--tint2": TONES[i][1], "--tintshadow": `${TONES[i][1]}80` }}><Ico size={20} /></span>
                  <h3 className="font-extrabold text-ink mt-3.5">{a.t}</h3>
                  <p className="text-[0.78rem] text-muted mt-1.5">{a.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal variant="scale" className="mt-8">
          <div className="relative rounded-[2rem] overflow-hidden p-7 md:p-10 text-white"
            style={{ background: "linear-gradient(135deg,#33504E, #0B2B2A)", boxShadow: "0 34px 70px -34px rgba(11,43,42,.8)" }}>
            <div className="absolute -right-14 -top-14 w-52 h-52 rounded-full border-[12px] border-white/10" aria-hidden="true" />
            <div className="relative flex flex-col md:flex-row gap-7 md:items-center">
              <span className="tile-ico w-16 h-16 shrink-0 !rounded-[1.3rem]" style={{ "--tint1": "#3BC79B", "--tint2": "#1FA97C", "--tintshadow": "#1FA97C80" }}>
                <ShieldCheck size={26} />
              </span>
              <div className="flex-1">
                <h2 className="display text-2xl md:text-[1.8rem]">Our child-safety promise</h2>
                <p className="text-white/80 text-sm leading-relaxed mt-2.5 max-w-[58ch]">
                  Every class is monitored, every mentor is police-verified, and every batch has a
                  named child-safety officer parents can message directly. Safety is not a policy
                  page here — it's the operating system.
                </p>
              </div>
              <ul className="grid gap-2 text-[0.78rem] font-bold">
                {["Verified mentors", "Monitored classes", "Recordings auto-delete in 60 days", "Named safety officer"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-2"><BadgeCheck size={14} className="text-cgreen shrink-0" /> {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function SpaceGallery() {
  return (
    <section className="px-5 md:px-8 py-12 md:py-24">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead tag="Our spaces" title="Where the learning happens" sub="Live online studios, plus our Bengaluru counselling and workshop spaces." />
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 mt-12">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src} variant="scale" delay={i * 0.09} className={i === 1 ? "md:-translate-y-4" : ""}>
              <figure className="group relative rounded-[1.8rem] overflow-hidden h-64 md:h-72 border border-hairline shadow-[0_24px_48px_-28px_rgba(43,32,102,.3)]">
                <img
                  src={g.src} alt={g.alt} loading="lazy" decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent opacity-80" aria-hidden="true" />
                <figcaption className="absolute bottom-4 left-4 right-4">
                  <span className="chip glass-deep text-ink">{g.cap}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
export default function About() {
  return (
    <>
      <SEO
        title="About us"
        description={`Meet ${siteConfig.brand}: nine years of small-batch online classes, verified mentors, audited child safety and 12,000+ happy learners across India.`}
        path="/about"
        jsonLd={{ "@context": "https://schema.org", "@type": "AboutPage", name: `About ${siteConfig.brand}`, url: `${siteConfig.url}/about` }}
      />
      <MissionHero />
      <Values />
      <Timeline />
      <Faculty />
      <PartnerWall />
      <Safety />
      <SpaceGallery />
    </>
  );
}
