/**
 * pages/Admissions.jsx — enroll
 * ------------------------------------------------------------------
 * 4-step process -> pricing (skeuomorphic monthly/annual toggle,
 * highlighted middle plan, ₹X,XXX placeholders) -> comparison table
 * -> EMI & scholarship tiles -> demo booking / enrollment form ->
 * FAQ accordion -> policy tiles. Forms animate only.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Minus, Wallet, GraduationCap, HandHeart, RotateCcw, Lock,
  ShieldCheck, CalendarCheck, PhoneCall, CheckCircle2, ArrowRight, Star,
} from "lucide-react";
import siteConfig from "../config/siteConfig";
import { EASE } from "../lib/motion";
import {
  SEO, Reveal, SectionHead, SkeuButton, Accordion, Segmented, Field,
} from "../components/ui";
import { STEPS, PLANS, COMPARISON, ASSIST, FAQS, POLICIES, COURSES, SLOTS } from "../data/content";

const ASSIST_ICONS = { Wallet, GraduationCap, HandHeart };
const POLICY_ICONS = { RotateCcw, Lock, ShieldCheck };
const TONES = [
  ["#9A72F0", "#7B4FD8"], ["#FF8A3C", "#FF6B0A"], ["#3BC79B", "#1FA97C"],
];

/* ------------------------------------------------------------------ */
function Steps() {
  return (
    <section className="px-5 md:px-8 py-12 md:py-16">
      <div className="mx-auto max-w-[1100px] grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((s, i) => (
          <Reveal key={s.t} variant="scale" delay={i * 0.08}>
            <div className="card p-6 h-full relative overflow-hidden">
              <span className="absolute -top-4 -right-2 display text-[4.6rem] leading-none text-violet-ghost select-none" aria-hidden="true">{i + 1}</span>
              <span className="tile-ico w-11 h-11 !rounded-full text-sm display" style={{ "--tint1": TONES[i % 3][0], "--tint2": TONES[i % 3][1], "--tintshadow": `${TONES[i % 3][1]}80` }}>{i + 1}</span>
              <h3 className="display text-[1.1rem] text-ink mt-4 relative">{s.t}</h3>
              <p className="text-sm text-muted leading-relaxed mt-2 relative">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Pricing() {
  const [cycle, setCycle] = useState("Monthly");
  return (
    <section className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1100px]">
        <SectionHead
          tag="Pricing"
          title="Simple plans, honest numbers"
          sub="Prices below are placeholders for launch — the structure is exactly what your child gets. No hidden fees, ever."
        />
        <Reveal variant="fade" className="flex justify-center mt-8">
          <Segmented options={["Monthly", "Annual"]} value={cycle} onChange={setCycle} ariaLabel="Billing cycle" />
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-7 mt-10 items-stretch">
          {PLANS.map((p, i) => {
            const price = cycle === "Monthly" ? p.monthly : p.annual;
            const note = cycle === "Monthly" ? p.note : p.annualNote;
            if (p.popular) {
              // Highlighted middle plan: violet fill + meaningful outline frame.
              return (
                <Reveal key={p.name} variant="scale" delay={0.08} className="lg:-my-4">
                  <div className="relative h-full rounded-[2rem] border-2 border-frame p-1.5">
                    <span className="chip absolute -top-3.5 left-1/2 -translate-x-1/2 bg-sun text-ink border border-[#E0A81A] shadow-sm z-10">
                      <Star size={11} fill="#0B2B2A" /> Most popular
                    </span>
                    <div className="h-full rounded-[1.7rem] p-7 text-white flex flex-col"
                      style={{ background: "linear-gradient(160deg,#9A72F0, #7B4FD8 60%, #5B34A8)", boxShadow: "0 34px 64px -26px rgba(91,52,168,.7)" }}>
                      <h3 className="display text-2xl">{p.name}</h3>
                      <p className="text-white/80 text-sm mt-1">{p.blurb}</p>
                      <p className="mt-5">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={cycle}
                            className="display text-[2.6rem] leading-none inline-block"
                            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}
                            transition={{ duration: 0.28, ease: EASE }}
                          >
                            {price}
                          </motion.span>
                        </AnimatePresence>
                      </p>
                      <p className="text-[0.7rem] text-white/75 mt-1.5 font-bold">{note}</p>
                      <ul className="mt-6 space-y-2.5 flex-1">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-[0.84rem] font-semibold text-white/95">
                            <Check size={15} className="text-sun shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                      <a href="#enroll" className="btn btn-orange btn-lg w-full mt-7">
                        <span className="btn-sheen" aria-hidden="true" />
                        <span className="relative z-10 inline-flex items-center gap-2">{p.cta} <ArrowRight size={15} /></span>
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            }
            return (
              <Reveal key={p.name} variant="scale" delay={i * 0.08}>
                <div className="card p-7 h-full flex flex-col hover:-translate-y-1.5 transition-transform duration-300">
                  <h3 className="display text-2xl text-ink">{p.name}</h3>
                  <p className="text-muted text-sm mt-1">{p.blurb}</p>
                  <p className="mt-5">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={cycle}
                        className="display text-[2.6rem] leading-none text-ink inline-block"
                        initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                      >
                        {price}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                  <p className="text-[0.7rem] text-muted mt-1.5 font-bold">{note}</p>
                  <ul className="mt-6 space-y-2.5 flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[0.84rem] font-semibold text-ink-soft">
                        <Check size={15} className="text-cgreen shrink-0 mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#enroll" className="btn btn-cream btn-lg w-full mt-7">
                    <span className="btn-sheen" aria-hidden="true" />
                    <span className="relative z-10 inline-flex items-center gap-2">{p.cta} <ArrowRight size={15} /></span>
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal variant="fade" className="text-center mt-8">
          <p className="text-xs text-muted font-bold">Every plan starts with a free demo class · 7-day full refund · GST invoice on request</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function CompareTable() {
  return (
    <section className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[900px]">
        <SectionHead tag="Compare" title="Everything, side by side" />
        <Reveal variant="scale" className="mt-10">
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-panel/70">
                    <th scope="col" className="text-left font-extrabold text-ink px-6 py-4">What you get</th>
                    {PLANS.map((p) => (
                      <th key={p.name} scope="col" className={`px-4 py-4 font-extrabold ${p.popular ? "text-violet" : "text-ink"}`}>
                        {p.name}
                        {p.popular && <span className="block text-[0.6rem] text-muted font-bold">most chosen</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, ri) => (
                    <tr key={row.label} className={ri % 2 ? "bg-panel/40" : "bg-white"}>
                      <td className="px-6 py-3.5 font-bold text-ink-soft">{row.label}</td>
                      {row.row.map((v, ci) => (
                        <td key={ci} className="px-4 py-3.5 text-center">
                          {v === true && <Check size={16} className="text-cgreen inline" aria-label="Included" />}
                          {v === false && <Minus size={16} className="text-frame inline" aria-label="Not included" />}
                          {typeof v === "string" && <span className="font-extrabold text-ink">{v}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function AssistTiles() {
  return (
    <section className="px-5 md:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-[1000px]">
        <SectionHead tag="Make it easier" title="EMI, scholarships and sibling benefits" sub="Money should never be the reason a curious child stops learning." />
        <div className="grid sm:grid-cols-3 gap-5 md:gap-6 mt-12">
          {ASSIST.map((a, i) => {
            const Ico = ASSIST_ICONS[a.icon];
            return (
              <Reveal key={a.t} variant="scale" delay={i * 0.08}>
                <div className="tile p-6 h-full">
                  <span className="tile-ico w-12 h-12" style={{ "--tint1": TONES[i][0], "--tint2": TONES[i][1], "--tintshadow": `${TONES[i][1]}80` }}><Ico size={20} /></span>
                  <h3 className="display text-[1.12rem] text-ink mt-4">{a.t}</h3>
                  <p className="text-sm text-muted leading-relaxed mt-2">{a.d.replace(" // PLACEHOLDER: payment partner TBD.", "")}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Demo booking + enrollment form (animated placeholder).
 * ---------------------------------------------------------------- */
function BookingForm() {
  const [mode, setMode] = useState("Book a free demo");
  const [day, setDay] = useState("Sat");
  const [time, setTime] = useState("10:00 AM");
  const [sent, setSent] = useState(false);

  return (
    <section id="enroll" className="px-5 md:px-8 py-12 md:py-20 scroll-mt-28">
      <div className="mx-auto max-w-[1050px] grid lg:grid-cols-[1fr_1.15fr] gap-10 items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHead
            align="left"
            tag="Get started"
            title="Book a seat — it takes two minutes"
            sub="Pick demo or enrollment, choose a slot, and our counsellor calls you back within working hours. No payment today."
          />
          <Reveal variant="fade" delay={0.2}>
            <ul className="mt-6 space-y-3.5">
              {[
                [CalendarCheck, "Demo class within 48 hours, free"],
                [PhoneCall, "Counsellor call to build a plan — no selling"],
                [ShieldCheck, "7-day refund if it isn't right"],
              ].map(([Ico, t], i) => (
                <li key={t} className="flex items-center gap-3 text-sm font-bold text-ink-soft">
                  <span className="tile-ico w-10 h-10 !rounded-xl" style={{ "--tint1": TONES[i][0], "--tint2": TONES[i][1], "--tintshadow": `${TONES[i][1]}80` }}><Ico size={16} /></span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal variant="scale">
          <div className="glass-deep rounded-[2rem] p-6 sm:p-8">
            {sent ? (
              <motion.div className="text-center py-10" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>
                <motion.span
                  className="tile-ico w-16 h-16 mx-auto !rounded-full mb-4"
                  style={{ "--tint1": "#35CF72", "--tint2": "#1FB355", "--tintshadow": "#1FB35580" }}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.06 }}
                >
                  <CheckCircle2 size={28} />
                </motion.span>
                <h3 className="display text-2xl text-ink">You're on the list!</h3>
                <p className="text-sm text-muted mt-2 max-w-[34ch] mx-auto">
                  {mode === "Book a free demo"
                    ? `We'll confirm your ${day}, ${time} demo slot shortly by call and WhatsApp.`
                    : "Our admissions team will call you within working hours to complete enrollment."}
                  {" "}(Design preview — nothing was actually booked.)
                </p>
                <SkeuButton variant="violet" size="md" className="mt-6" onClick={() => setSent(false)}>Book another</SkeuButton>
              </motion.div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <Segmented options={["Book a free demo", "Enroll now"]} value={mode} onChange={setMode} ariaLabel="Booking mode" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Child's name"><input required className="input" placeholder="Anaya Verma" /></Field>
                  <Field label="Grade / age">
                    <select required className="input" defaultValue="">
                      <option value="" disabled>Select grade</option>
                      {[3, 4, 5, 6, 7, 8, 9, 10].map((g) => <option key={g}>Grade {g}</option>)}
                    </select>
                  </Field>
                  <Field label="Parent's phone"><input required type="tel" className="input" placeholder="+91 98XXX XXXXX" /></Field>
                  <Field label="Email"><input required type="email" className="input" placeholder="you@example.com" /></Field>
                </div>
                <Field label="Course of interest">
                  <select required className="input" defaultValue="">
                    <option value="" disabled>Choose a course</option>
                    {COURSES.map((c) => <option key={c.slug}>{c.title}</option>)}
                  </select>
                </Field>
                <div>
                  <p className="text-xs font-extrabold tracking-wide text-ink-soft mb-2">Preferred day</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Preferred day">
                    {SLOTS.days.map((d) => (
                      <button key={d} type="button" aria-pressed={day === d} onClick={() => setDay(d)}
                        className={`chip border cursor-pointer transition-all duration-200 ${day === d ? "btn-violet !py-2" : "bg-white/70 border-hairline text-muted hover:text-ink"}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-extrabold tracking-wide text-ink-soft mb-2">Preferred time</p>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Preferred time">
                    {SLOTS.times.map((t) => (
                      <button key={t} type="button" aria-pressed={time === t} onClick={() => setTime(t)}
                        className={`chip border cursor-pointer transition-all duration-200 ${time === t ? "btn-orange !py-2" : "bg-white/70 border-hairline text-muted hover:text-ink"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <SkeuButton variant={mode === "Book a free demo" ? "violet" : "orange"} size="lg" className="w-full" type="submit">
                  {mode === "Book a free demo" ? `Book free demo · ${day} ${time}` : "Request enrollment call"} <ArrowRight size={16} />
                </SkeuButton>
                <p className="text-[0.68rem] text-muted text-center">By submitting you agree to be contacted about admissions. Nothing is charged.</p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function Faq() {
  return (
    <section id="faq" className="px-5 md:px-8 py-12 md:py-20 scroll-mt-28">
      <div className="mx-auto max-w-[820px]">
        <SectionHead tag="Questions" title="Honest answers, in plain language" sub="Anything else — call us. A human answers between 9 AM and 7 PM." />
        <Reveal variant="fade" className="mt-10"><Accordion items={FAQS} defaultOpen={0} ns="faq" /></Reveal>
      </div>
    </section>
  );
}

function Policies() {
  return (
    <section className="px-5 md:px-8 py-12 md:pb-24">
      <div className="mx-auto max-w-[1000px] grid sm:grid-cols-3 gap-5 md:gap-6">
        {POLICIES.map((p, i) => {
          const Ico = POLICY_ICONS[p.icon];
          return (
            <Reveal key={p.t} variant="scale" delay={i * 0.08}>
              <div className="glass rounded-[1.6rem] p-6 h-full">
                <span className="tile-ico w-11 h-11" style={{ "--tint1": TONES[i][0], "--tint2": TONES[i][1], "--tintshadow": `${TONES[i][1]}80` }}><Ico size={18} /></span>
                <h3 className="font-extrabold text-ink mt-3.5">{p.t}</h3>
                <p className="text-[0.8rem] text-muted leading-relaxed mt-1.5">{p.d}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ================================================================== */
export default function Admissions() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <>
      <SEO
        title="Admissions"
        description="Book a free demo class, compare plans with EMI and scholarships, and enroll your child in small-batch live courses. 7-day refund, no hidden fees."
        path="/admissions"
        jsonLd={faqLd}
      />
      {/* compact hero */}
      <section className="px-5 md:px-8 pt-32 md:pt-44 pb-6 text-center">
        <h1 className="sr-only">Admissions at {siteConfig.brand} — book a free demo class and enroll</h1>
        <SectionHead
          tag="Admissions open · 2026 batch"
          title={<>Four steps to a <span className="text-violet">seat in class six</span></>}
          sub="That's a batch of six learners, by the way — never more. Here's exactly how joining works."
        />
      </section>
      <Steps />
      <Pricing />
      <CompareTable />
      <AssistTiles />
      <BookingForm />
      <Faq />
      <Policies />
    </>
  );
}
