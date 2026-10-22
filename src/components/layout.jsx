/**
 * components/layout.jsx
 * ------------------------------------------------------------------
 * Global chrome: UIContext (modals + EN/हिं switch), floating glass
 * Navbar with sliding pill indicator + rounded mobile sheet, Footer
 * with newsletter, WhatsApp bubble, Back-to-top pill, Sign-in modal
 * (Student/Parent/Instructor tabs) and Instructor-application modal.
 * All forms are animated UI placeholders — nothing is submitted.
 */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ArrowUp, MessageCircle,
  Mail, Phone, MapPin, Clock, CheckCircle2, Send,
} from "lucide-react";
import siteConfig from "../config/siteConfig";
import { EASE } from "../lib/motion";
import { SkeuButton, Modal, Field, Logo, LogoMark, SocialIcon, useLockBody } from "./ui";

/* ========================== UI Context ========================== */

const UICtx = createContext(null);
export const useUI = () => useContext(UICtx);

/** Ready flag: hero/staggered anims wait for the preloader wipe. */
const ReadyCtx = createContext(true);
export const useReady = () => useContext(ReadyCtx);

export function UIProvider({ ready, children }) {
  const [modal, setModal] = useState(null); // 'signin' | 'instructor' | null
  const [tab, setTab] = useState("student");
  const [lang, setLang] = useState("en");

  const value = useMemo(() => ({
    modal, tab, lang,
    setLang,
    openSignIn: (t = "student") => { setTab(t); setModal("signin"); },
    openInstructor: () => setModal("instructor"),
    close: () => setModal(null),
  }), [modal, tab, lang]);

  return (
    <UICtx.Provider value={value}>
      <ReadyCtx.Provider value={ready}>
        {children}
        <SignInModal />
        <InstructorModal />
      </ReadyCtx.Provider>
    </UICtx.Provider>
  );
}

/* ============================ Navbar ============================
 * Layer order (bottom -> top): page content < blur scrim (z-40) <
 * navbar (z-50) < menu panel (z-50, under the pill). EVERYTHING is
 * portaled to document.body, so no ancestor with backdrop-filter /
 * transform / opacity-animations can trap stacking or fixed
 * positioning — the navbar itself must never sit inside the glass
 * container (its own backdrop-filter creates a stacking context and
 * the blur samples the page, not siblings).
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, openSignIn } = useUI();
  const location = useLocation();
  const navigate = useNavigate();
  useLockBody(open); // body scroll locked while the menu is open

  // Close whenever the route actually changes.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Esc closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const labels = lang === "hi" ? siteConfig.navHi : siteConfig.nav.map((n) => n.label);

  const sheetItem = {
    hidden: { opacity: 0, x: -14 },
    show: (i) => ({ opacity: 1, x: 0, transition: { delay: 0.05 + i * 0.05, duration: 0.35, ease: EASE } }),
  };

  return (
    <>
      <a href="#main" className="skip-link chip glass-deep text-violet">Skip to content</a>

      {createPortal(
        <>
          {/* Blur scrim — BELOW the navbar, blurs only the page behind it */}
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-40 bg-white/35 backdrop-blur-md lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* Navbar — direct fixed child of <body>, always crisp */}
          <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6">
            {/* NOTE: no opacity animations on this wrapper — that would
                break the backdrop-filter sampling layer below. */}
            <motion.nav
              aria-label="Primary"
              className={`relative mx-auto mt-3 max-w-[1100px] rounded-full transition-shadow duration-300 ${
                scrolled && !open ? "shadow-[0_18px_50px_-20px_rgba(88,60,180,.55)]" : ""
              }`}
              initial={{ y: -78 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
            >
              {/* The frosted glass lives on its own inset-0 layer */}
              <span className="glass-nav rounded-full" aria-hidden="true" />
              <div className="relative z-10 flex items-center justify-between gap-4 pl-5 pr-3 py-2.5">
                <Link to="/" aria-label={`${siteConfig.brand} — home`} className="shrink-0" onClick={() => setOpen(false)}>
                  <Logo />
                </Link>

                {/* Center links with sliding pill indicator */}
                <ul className="hidden lg:flex items-center gap-1">
                  {siteConfig.nav.map((n, i) => (
                    <li key={n.to}>
                      <NavLink
                        to={n.to}
                        end={n.to === "/"}
                        className="relative px-3.5 py-2 text-[0.82rem] font-bold"
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.span
                                layoutId="nav-pill"
                                className="absolute inset-0 rounded-full bg-violet-ghost border border-frame"
                                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                              />
                            )}
                            <span className={`relative z-10 transition-colors duration-200 ${isActive ? "text-violet" : "text-ink-soft hover:text-violet"}`}>
                              {labels[i]}
                            </span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2">
                  {/* EN / हिं switch (UI placeholder) */}
                  <div className="hidden sm:flex items-center rounded-full bg-white/60 border border-white/70 p-0.5" role="group" aria-label="Language">
                    {["en", "hi"].map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setLang(l)}
                        aria-pressed={lang === l}
                        className={`px-2.5 py-1 rounded-full text-[0.68rem] font-extrabold transition-colors duration-200 cursor-pointer ${
                          lang === l ? "bg-violet text-white shadow-sm" : "text-muted hover:text-ink"
                        }`}
                      >
                        {l === "en" ? "EN" : "हिं"}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => openSignIn("student")}
                    className="hidden md:inline-flex link-u text-[0.82rem] font-bold text-ink hover:text-violet cursor-pointer"
                  >
                    {lang === "hi" ? "साइन इन" : "Sign in"}
                  </button>
                  <SkeuButton variant="violet" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/contact")}>
                    {lang === "hi" ? "संपर्क करें" : "Contact us"}
                  </SkeuButton>
                  {/* Hamburger — morphs to X, stays crisp above the scrim */}
                  <button
                    type="button"
                    className="lg:hidden grid place-items-center w-10 h-10 rounded-full bg-white/70 border border-white/80 text-ink cursor-pointer"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={open ? "x" : "menu"}
                        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.22, ease: EASE }}
                        className="grid place-items-center"
                      >
                        {open ? <X size={18} /> : <Menu size={18} />}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </div>
              </div>
            </motion.nav>
          </header>

          {/* Menu panel — sibling of the navbar, same glass treatment,
              full width below desktop (it IS the dropdown) */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="navsheet"
                className="fixed top-[76px] left-4 right-4 z-50 lg:hidden"
                initial={{ opacity: 0, y: -18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.35, ease: EASE }}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
              >
                <div className="relative rounded-[1.8rem]">
                  <span className="glass-nav rounded-[1.8rem]" aria-hidden="true" />
                  <div className="relative z-10 p-6">
                    <ul className="space-y-1">
                      {siteConfig.nav.map((n, i) => (
                        <motion.li key={n.to} custom={i} variants={sheetItem} initial="hidden" animate="show">
                          <NavLink
                            to={n.to}
                            onClick={() => setOpen(false)} // also closes when tapping the CURRENT page's link
                            className={({ isActive }) =>
                              `display block text-[1.35rem] py-2 px-3 rounded-xl transition-colors ${
                                isActive ? "text-violet bg-violet-ghost" : "text-ink hover:text-violet"
                              }`
                            }
                          >
                            {labels[i]}
                          </NavLink>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="flex gap-3 mt-5">
                      <SkeuButton variant="cream" size="md" className="flex-1" onClick={() => { setOpen(false); openSignIn("student"); }}>
                        {lang === "hi" ? "साइन इन" : "Sign in"}
                      </SkeuButton>
                      <SkeuButton variant="violet" size="md" className="flex-1" onClick={() => { setOpen(false); navigate("/contact"); }}>
                        {lang === "hi" ? "संपर्क करें" : "Contact us"}
                      </SkeuButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </>
  );
}

/* ============================ Footer ============================ */

function Newsletter() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="flex flex-col sm:flex-row gap-3"
      onSubmit={(e) => { e.preventDefault(); setSent(true); }} // PLACEHOLDER: wire to ESP later
      aria-label="Newsletter signup"
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        className="input flex-1 !rounded-full"
        aria-label="Email address"
      />
      <SkeuButton variant={sent ? "wa" : "violet"} size="md" type="submit">
        {sent ? <><CheckCircle2 size={16} /> You're in!</> : <><Send size={15} /> Subscribe</>}
      </SkeuButton>
    </form>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const { openSignIn } = useUI();
  return (
    <footer className="px-4 sm:px-6 pb-6 pt-4">
      <div className="mx-auto max-w-[1200px] rounded-[2.4rem] bg-panel border border-frame/60 px-6 sm:px-10 py-12">
        <div className="grid md:grid-cols-[1.3fr_1fr_1fr_1.4fr] gap-10">
          <div>
            <Logo />
            <p className="text-sm text-muted leading-relaxed mt-4 max-w-[26ch]">
              Live, small-batch classes that make kids curious, confident and kind.
            </p>
            <div className="flex gap-2.5 mt-5">
              {siteConfig.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid place-items-center w-10 h-10 rounded-full bg-white border border-hairline text-ink-soft hover:text-violet hover:border-frame hover:-translate-y-1 transition-all duration-200"
                >
                  <SocialIcon name={s.icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Explore">
            <p className="text-xs font-extrabold tracking-wider text-ink-soft mb-4">Explore</p>
            <ul className="space-y-2.5 text-sm font-semibold text-muted">
              {siteConfig.nav.map((n) => (
                <li key={n.to}><Link className="link-u hover:text-violet" to={n.to}>{n.label}</Link></li>
              ))}
              <li>
                <button type="button" onClick={() => openSignIn("instructor")} className="link-u hover:text-violet cursor-pointer">
                  Become a mentor
                </button>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-xs font-extrabold tracking-wider text-ink-soft mb-4">Contact</p>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-2.5"><MapPin size={15} className="text-violet shrink-0 mt-0.5" />{siteConfig.contact.address}</li>
              <li className="flex gap-2.5"><Phone size={15} className="text-violet shrink-0 mt-0.5" /><a className="link-u" href={siteConfig.contact.phoneHref}>{siteConfig.contact.phone}</a></li>
              <li className="flex gap-2.5"><Mail size={15} className="text-violet shrink-0 mt-0.5" /><a className="link-u" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></li>
              <li className="flex gap-2.5"><Clock size={15} className="text-violet shrink-0 mt-0.5" />{siteConfig.contact.hours}</li>
            </ul>
          </div>

          <div>
            <p className="display text-lg text-ink">One useful email, every Sunday.</p>
            <p className="text-sm text-muted mt-2 mb-4">Study tips, new courses and free workshop invites. No spam, ever.</p>
            <Newsletter />
          </div>
        </div>

        <hr className="border-t border-frame/70 my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>© {year} {siteConfig.brand}. All rights reserved.</p>
          <p className="display text-sm text-violet/80 italic">Skills of tomorrow, starting today.</p>
          <p className="flex gap-4">
            <Link to="/admissions" className="link-u">Refund policy</Link>
            <Link to="/admissions" className="link-u">Privacy</Link>
            <Link to="/admissions" className="link-u">Safety</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ====================== Floating utilities ====================== */

export function WhatsAppBubble() {
  return (
    <motion.a
      href={siteConfig.contact.whatsappHref}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-[95] grid place-items-center w-14 h-14 rounded-full btn-wa text-white"
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.94 }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border-2 border-[#25c665]"
        style={{ animation: "ringPulse 2.6s ease-out infinite" }}
      />
      <MessageCircle size={24} fill="rgba(255,255,255,.25)" />
    </motion.a>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 640);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          className="btn btn-cream btn-sm fixed bottom-5 left-5 z-[95] !px-3.5"
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={15} /> Top
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ========================== Sign-in modal ======================= */

const TABS = [
  { id: "student", label: "Student" },
  { id: "parent", label: "Parent" },
  { id: "instructor", label: "Instructor" },
];

function SuccessPane({ title, note, onDone }) {
  return (
    <motion.div
      className="text-center py-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.span
        className="tile-ico w-16 h-16 mx-auto mb-4 !rounded-full"
        style={{ "--tint1": "#35CF72", "--tint2": "#1FB355", "--tintshadow": "rgba(31,179,85,.5)" }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.08 }}
      >
        <CheckCircle2 size={28} />
      </motion.span>
      <h3 className="display text-2xl text-ink">{title}</h3>
      <p className="text-sm text-muted mt-2 max-w-[30ch] mx-auto">{note}</p>
      <SkeuButton variant="violet" size="md" className="mt-6" onClick={onDone}>Done</SkeuButton>
    </motion.div>
  );
}

export function SignInModal() {
  const { modal, tab, close } = useUI();
  const [t, setT] = useState(tab);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { if (modal === "signin") { setT(tab); setSent(false); } }, [modal, tab]);

  return (
    <Modal open={modal === "signin"} onClose={close} labelledBy="signin-title">
      {sent ? (
        <SuccessPane
          title={`Welcome back!`}
          note={`You're signed in as ${TABS.find((x) => x.id === t)?.label}. This is a design preview, so no real session was created.`}
          onDone={close}
        />
      ) : (
        <>
          <div className="text-center mb-5">
            <LogoMark size={30} />
            <h3 id="signin-title" className="display text-2xl text-ink mt-3">Sign in to continue</h3>
            <p className="text-sm text-muted mt-1">Pick your role — we'll tailor the dashboard.</p>
          </div>
          <div className="flex gap-1 p-1 rounded-full bg-panel border border-frame mb-5" role="tablist" aria-label="Choose role">
            {TABS.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={t === x.id}
                type="button"
                onClick={() => setT(x.id)}
                className={`relative flex-1 py-2 rounded-full text-[0.8rem] font-extrabold transition-colors cursor-pointer ${t === x.id ? "text-white" : "text-muted hover:text-ink"}`}
              >
                {t === x.id && (
                  <motion.span layoutId="role-pill" className="absolute inset-0 rounded-full btn-violet" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative z-10">{x.label}</span>
              </button>
            ))}
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <Field label={t === "student" ? "Student email" : "Email address"}>
              <input type="email" required className="input" placeholder="you@example.com" />
            </Field>
            <Field label="Password">
              <input type="password" required className="input" placeholder="••••••••" minLength={4} />
            </Field>
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="inline-flex items-center gap-2 text-muted cursor-pointer">
                <input type="checkbox" className="accent-[#7B4FD8] w-3.5 h-3.5" defaultChecked /> Remember me
              </label>
              <a href="#signin-title" onClick={(e) => e.preventDefault()} className="link-u text-violet">Forgot password?</a>
            </div>
            <SkeuButton variant="violet" size="lg" className="w-full" type="submit">
              Sign in as {TABS.find((x) => x.id === t)?.label}
            </SkeuButton>
          </form>
          <p className="text-center text-xs text-muted mt-4">
            New here?{" "}
            <button
              type="button"
              className="link-u font-bold text-violet cursor-pointer"
              onClick={() => { close(); navigate("/admissions"); }}
            >
              Book a free demo class
            </button>
          </p>
        </>
      )}
    </Modal>
  );
}

/* ==================== Instructor application ==================== */

export function InstructorModal() {
  const { modal, close } = useUI();
  const [sent, setSent] = useState(false);
  useEffect(() => { if (modal === "instructor") setSent(false); }, [modal]);

  return (
    <Modal open={modal === "instructor"} onClose={close} labelledBy="inst-title" wide>
      {sent ? (
        <SuccessPane
          title="Application received"
          note="Our mentor team reviews applications every Friday. Expect a friendly email within a week. (Design preview — nothing was sent.)"
          onDone={close}
        />
      ) : (
        <>
          <div className="mb-6">
            <span className="chip glass text-orange">For educators</span>
            <h3 id="inst-title" className="display text-2xl sm:text-3xl text-ink mt-3">Join as an instructor</h3>
            <p className="text-sm text-muted mt-2 max-w-[46ch]">
              Teach 6 curious kids at a time, from home, with full curriculum support. Under 6% of applicants make it — bring your best.
            </p>
          </div>
          <form className="grid sm:grid-cols-2 gap-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <Field label="Full name"><input required className="input" placeholder="Dr. Asha Verma" /></Field>
            <Field label="Email"><input type="email" required className="input" placeholder="you@example.com" /></Field>
            <Field label="Subject expertise" className="sm:col-span-2">
              <select className="input" defaultValue="" required>
                <option value="" disabled>Choose a subject</option>
                {["Coding & AI", "Mathematics", "English & Communication", "Science", "Art & Design", "Life Skills"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Why you? (2–3 lines)" className="sm:col-span-2">
              <textarea rows={3} className="input resize-none" placeholder="Tell us about a class you taught that kids still remember…" />
            </Field>
            <div className="sm:col-span-2">
              <SkeuButton variant="orange" size="lg" className="w-full" type="submit">Submit application</SkeuButton>
              <p className="text-[0.7rem] text-muted text-center mt-2.5">We reply to every serious application — usually within 7 days.</p>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
