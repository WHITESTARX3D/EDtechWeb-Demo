/**
 * pages/Contact.jsx — support
 * ------------------------------------------------------------------
 * Glass info card (address, phone, email, hours, WhatsApp, socials)
 * -> tactile message form -> stylized SVG map with animated pin ->
 * counseling-slot picker -> parent corner. All submits are animated
 * placeholders.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Clock, MessageCircle,
  Navigation, CheckCircle2, BookOpen, MessagesSquare, CircleHelp, ArrowRight,
} from "lucide-react";
import siteConfig from "../config/siteConfig";
import { EASE } from "../lib/motion";
import { SEO, Reveal, SectionHead, SkeuButton, Field, SocialIcon } from "../components/ui";
import { SLOTS, PARENT_CORNER } from "../data/content";
const CORNER_ICONS = { BookOpen, MessagesSquare, CircleHelp };
const TONES = [
  ["#9A72F0", "#7B4FD8"], ["#FF8A3C", "#FF6B0A"], ["#3BC79B", "#1FA97C"],
];

/* ------------------------------------------------------------------ */
function InfoCard() {
  const c = siteConfig.contact;
  return (
    <Reveal variant="scale" className="h-full">
      <div className="glass-deep rounded-[2rem] p-7 h-full flex flex-col gap-5">
        <h2 className="display text-2xl text-ink">Talk to a human</h2>
        {[
          [MapPin, "Visit us", c.address, null],
          [Phone, "Call us", c.phone, c.phoneHref],
          [Mail, "Email us", c.email, `mailto:${c.email}`],
          [Clock, "Hours", c.hours, null],
        ].map(([Ico, label, value, href]) => (
          <div key={label} className="flex gap-3.5 items-start">
            <span className="tile-ico w-10 h-10 !rounded-xl shrink-0" style={{ "--tint1": "#9A72F0", "--tint2": "#7B4FD8", "--tintshadow": "#7B4FD880" }}>
              <Ico size={15} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.68rem] font-extrabold tracking-wide text-muted">{label}</span>
              {href ? (
                <a className="link-u text-sm font-bold text-ink break-words" href={href}>{value}</a>
              ) : (
                <span className="block text-sm font-bold text-ink">{value}</span>
              )}
            </span>
          </div>
        ))}
        <div className="mt-auto pt-3 flex flex-wrap items-center gap-3">
          <SkeuButton variant="wa" size="md" href={c.whatsappHref} target="_blank">
            <MessageCircle size={16} /> WhatsApp us
          </SkeuButton>
          <div className="flex gap-2">
            {siteConfig.socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="grid place-items-center w-10 h-10 rounded-full bg-white border border-hairline text-ink-soft hover:text-violet hover:border-frame hover:-translate-y-1 transition-all duration-200">
                <SocialIcon name={s.icon} size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
function MessageForm() {
  const [sent, setSent] = useState(false);
  return (
    <Reveal variant="scale" delay={0.1} className="h-full">
      <div className="card p-7 h-full">
        {sent ? (
          <motion.div className="h-full min-h-[360px] grid place-items-center text-center" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>
            <div>
              <motion.span className="tile-ico w-16 h-16 mx-auto !rounded-full mb-4" style={{ "--tint1": "#35CF72", "--tint2": "#1FB355", "--tintshadow": "#1FB35580" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.06 }}>
                <CheckCircle2 size={28} />
              </motion.span>
              <h3 className="display text-2xl text-ink">Message received</h3>
              <p className="text-sm text-muted mt-2 max-w-[30ch] mx-auto">We reply within one working day — usually much faster. (Design preview only.)</p>
              <SkeuButton variant="violet" size="md" className="mt-6" onClick={() => setSent(false)}>Send another</SkeuButton>
            </div>
          </motion.div>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <h2 className="display text-2xl text-ink">Send us a note</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your name"><input required className="input" placeholder="Priya Sharma" /></Field>
              <Field label="Phone"><input required type="tel" className="input" placeholder="+91 98XXX XXXXX" /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email"><input required type="email" className="input" placeholder="you@example.com" /></Field>
              <Field label="Topic">
                <select className="input" defaultValue="Admissions">
                  {["Admissions", "Courses & syllabus", "Fees & EMI", "Mentor applications", "Something else"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Message">
              <textarea rows={4} required className="input resize-none" placeholder="Ask us anything — the more specific, the faster we can help." />
            </Field>
            <SkeuButton variant="violet" size="lg" className="w-full" type="submit">
              Send message <ArrowRight size={16} />
            </SkeuButton>
          </form>
        )}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------
 * Stylized map — SVG only, animated pin (bob + ripple rings).
 * ---------------------------------------------------------------- */
function CityMap() {
  const c = siteConfig.contact;
  return (
    <Reveal variant="scale">
      <div className="relative rounded-[2rem] overflow-hidden border border-hairline shadow-[0_24px_50px_-28px_rgba(43,32,102,.3)]">
        <svg viewBox="0 0 900 380" className="w-full block bg-[#F4F2FF]" role="img" aria-label={`Stylized map showing ${siteConfig.brand} location on MG Road`}>
          {/* park + water */}
          <path d="M60 250 q60 -40 130 -10 t110 40 q50 10 20 60 q-40 40 -140 20 q-130 -20 -136 -70 q-3 -25 16 -40z" fill="#CDEBDC" />
          <path d="M640 -20 q60 90 20 190 q-30 80 10 160 l70 60 q30 -140 60 -230 t20 -160 z" fill="#CDE7F5" />
          {/* street grid */}
          <g stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round">
            <path d="M0 120 H900" /><path d="M0 300 H900" />
            <path d="M140 0 V380" /><path d="M330 0 V380" /><path d="M560 0 V380" /><path d="M770 0 V380" />
          </g>
          <g stroke="#E7E3F7" strokeWidth="3" strokeDasharray="2 10">
            <path d="M0 210 H900" /><path d="M450 0 V380" /><path d="M0 60 H900" />
          </g>
          {/* blocks */}
          <g fill="#EBE5FB">
            <rect x="165" y="140" width="120" height="46" rx="9" /><rect x="360" y="140" width="66" height="46" rx="9" />
            <rect x="455" y="60" width="80" height="40" rx="9" /><rect x="165" y="320" width="130" height="40" rx="9" />
            <rect x="600" y="135" width="60" height="55" rx="9" /><rect x="790" y="145" width="80" height="42" rx="9" />
            <rect x="455" y="315" width="86" height="42" rx="9" /><rect x="30" y="135" width="88" height="50" rx="9" />
            <rect x="790" y="320" width="76" height="40" rx="9" />
          </g>
          {/* MG Road highlight */}
          <path d="M0 300 H900" stroke="#D3C8F5" strokeWidth="7" strokeLinecap="round" />
          <text x="42" y="290" fontSize="13" fontWeight="800" fill="#7B80A0">MG Road</text>
          {/* ripple rings under the pin */}
          <g transform="translate(560,220)">
            {[0, 0.9, 1.8].map((d) => (
              <circle key={d} cx="0" cy="34" r="26" fill="none" stroke="#7B4FD8" strokeWidth="2.5"
                style={{ animation: `rippleMap 2.7s ease-out ${d}s infinite`, transformOrigin: "center", transformBox: "fill-box" }} />
            ))}
            {/* bobbing pin */}
            <g style={{ animation: "pinBob 2.2s ease-in-out infinite", transformBox: "fill-box", transformOrigin: "center bottom" }}>
              <path d="M0 -58 C 22 -58 34 -42 34 -26 C 34 -6 0 34 0 34 C 0 34 -34 -6 -34 -26 C -34 -42 -22 -58 0 -58z"
                fill="#7B4FD8" stroke="#fff" strokeWidth="5" />
              <circle cx="0" cy="-26" r="11" fill="#fff" />
              <circle cx="0" cy="-26" r="5.5" fill="#FF6B0A" />
            </g>
          </g>
          <text x="560" y="300" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0B2B2A">Sunrise Tower</text>
        </svg>
        {/* address chip + directions */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto flex flex-wrap items-center gap-3">
          <span className="chip glass-deep text-ink max-w-full"><MapPin size={12} className="text-violet shrink-0" /> <span className="truncate max-w-[46vw] sm:max-w-none">{c.address}</span></span>
          <a href="#" onClick={(e) => e.preventDefault()} className="btn btn-cream btn-sm">
            <span className="btn-sheen" aria-hidden="true" /><span className="relative z-10 inline-flex items-center gap-1.5"><Navigation size={13} /> Directions</span>
          </a>
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
function SlotPicker() {
  const [day, setDay] = useState("Wed");
  const [time, setTime] = useState("4:00 PM");
  const [done, setDone] = useState(false);
  return (
    <Reveal variant="scale">
      <div className="glass-deep rounded-[2rem] p-7 md:p-9 text-center">
        <h2 className="display text-2xl md:text-[1.7rem] text-ink">Free 20-minute counseling slot</h2>
        <p className="text-sm text-muted mt-2 max-w-[48ch] mx-auto">A real conversation about your child's goals. No scripts, no pressure.</p>
        <div className="mt-6">
          <p className="text-xs font-extrabold tracking-wide text-ink-soft mb-2.5">Pick a day</p>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Day">
            {SLOTS.days.map((d) => (
              <button key={d} type="button" aria-pressed={day === d} onClick={() => { setDay(d); setDone(false); }}
                className={`chip border cursor-pointer transition-all ${day === d ? "btn-violet !py-2" : "bg-white/70 border-hairline text-muted hover:text-ink"}`}>{d}</button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <p className="text-xs font-extrabold tracking-wide text-ink-soft mb-2.5">Pick a time</p>
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Time">
            {SLOTS.times.map((t) => (
              <button key={t} type="button" aria-pressed={time === t} onClick={() => { setTime(t); setDone(false); }}
                className={`chip border cursor-pointer transition-all ${time === t ? "btn-orange !py-2" : "bg-white/70 border-hairline text-muted hover:text-ink"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="mt-7">
          {done ? (
            <span className="chip bg-[#E7F6EE] text-cgreen !py-3 !px-6 text-sm"><CheckCircle2 size={15} /> Slot held for {day}, {time} — we'll confirm by WhatsApp (demo)</span>
          ) : (
            <SkeuButton variant="violet" size="lg" onClick={() => setDone(true)}>
              Reserve {day}, {time} <ArrowRight size={15} />
            </SkeuButton>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
function ParentCorner() {
  return (
    <section className="px-5 md:px-8 py-12 md:pb-24">
      <div className="mx-auto max-w-[1050px]">
        <SectionHead tag="Parent corner" title="Useful, even before you enroll" />
        <div className="grid sm:grid-cols-3 gap-5 md:gap-6 mt-10">
          {PARENT_CORNER.map((p, i) => {
            const Ico = CORNER_ICONS[p.icon];
            return (
              <Reveal key={p.t} variant="scale" delay={i * 0.08}>
                <motion.a
                  href="#parent-corner" onClick={(e) => e.preventDefault()}
                  className="tile p-6 h-full block group"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <span className="tile-ico w-12 h-12" style={{ "--tint1": TONES[i][0], "--tint2": TONES[i][1], "--tintshadow": `${TONES[i][1]}80` }}><Ico size={20} /></span>
                  <h3 className="display text-[1.1rem] text-ink mt-4 group-hover:text-violet transition-colors">{p.t}</h3>
                  <p className="text-sm text-muted leading-relaxed mt-2">{p.d}</p>
                </motion.a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
export default function Contact() {
  return (
    <>
      <SEO
        title="Contact us"
        description={`Call, WhatsApp or visit ${siteConfig.brand}. ${siteConfig.contact.address}. Open ${siteConfig.contact.hours}. Book a free counseling slot online.`}
        path="/contact"
        jsonLd={{ "@context": "https://schema.org", "@type": "ContactPage", name: `Contact ${siteConfig.brand}`, url: `${siteConfig.url}/contact` }}
      />
      <section className="px-5 md:px-8 pt-32 md:pt-44 pb-10 text-center">
        <h1 className="sr-only">Contact {siteConfig.brand} — talk to a counsellor today</h1>
        <SectionHead
          tag="We answer fast"
          title={<>Say hello — <span className="text-violet">a human will reply</span></>}
          sub="Between 9 AM and 7 PM, six days a week, a real counsellor picks up. Promise."
        />
      </section>

      <section className="px-5 md:px-8 pb-10">
        <div className="mx-auto max-w-[1050px] grid lg:grid-cols-[1fr_1.2fr] gap-6 items-stretch">
          <InfoCard />
          <MessageForm />
        </div>
      </section>

      <section className="px-5 md:px-8 py-6">
        <div className="mx-auto max-w-[1050px]"><CityMap /></div>
      </section>

      <section className="px-5 md:px-8 py-6">
        <div className="mx-auto max-w-[900px]"><SlotPicker /></div>
      </section>

      <ParentCorner />
    </>
  );
}
