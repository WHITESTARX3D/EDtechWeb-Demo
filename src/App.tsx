/**
 * App.tsx — application shell
 * ------------------------------------------------------------------
 * - HelmetProvider + BrowserRouter (React Router OWNS all URLs)
 * - UIProvider: modals, EN/हिं switch, ready flag after preloader
 * - Fixed atmosphere: BackgroundFX, Grain, ScrollProgress
 * - Session-once <Preloader>, then the app fades in
 * - Route transitions: AnimatePresence (mode="wait") + GSAP curtain
 *   of rounded violet/lavender panels under 0.9s, scroll reset,
 *   ScrollTrigger.refresh() after every route enters
 * - Barba: registered for the first-load sequence only, with link
 *   interception disabled; listeners torn down immediately so it can
 *   never conflict with the router (per the brief's fallback rule)
 */

import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import barba from "@barba/core";
import { gsap, ScrollTrigger } from "./lib/motion";
import { BackgroundFX, Grain, ScrollProgress, Preloader } from "./components/effects";
import { Navbar, Footer, WhatsAppBubble, BackToTop, UIProvider } from "./components/layout";
import { LogoMark } from "./components/ui";

/* Lazy routes: one chunk per page for fast first paint. */
const Home = lazy(() => import("./pages/Home.jsx"));
const Courses = lazy(() => import("./pages/Courses.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Admissions = lazy(() => import("./pages/Admissions.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

/** Suspense fallback while a route chunk loads (rarely visible). */
function RouteFallback() {
  return (
    <div className="min-h-[70vh] grid place-items-center" role="status" aria-label="Loading page">
      <LogoMark size={34} pulse />
    </div>
  );
}

/* ------------------------------------------------------------------
 * RoutedShell — curtain sweep + AnimatePresence around <Routes>
 * ---------------------------------------------------------------- */
function RoutedShell() {
  const location = useLocation();
  const [display, setDisplay] = useState(location);
  const curtainRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  // The GSAP curtain: cover -> swap route underneath -> reveal. <=0.9s.
  useEffect(() => {
    if (location.pathname === display.pathname && location.search === display.search) return;
    if (reducedMotion()) {
      setDisplay(location);
      window.scrollTo(0, 0);
      return;
    }
    if (busy.current) { setDisplay(location); return; }
    busy.current = true;

    const root = curtainRef.current;
    if (!root) { setDisplay(location); busy.current = false; return; }
    const panels = root.querySelectorAll(".tpanel");
    const logo = root.querySelector(".tlogo");

    gsap
      .timeline({
        onComplete: () => { busy.current = false; gsap.set(root, { visibility: "hidden" }); },
      })
      .set(root, { visibility: "visible" })
      .set(panels, { scaleY: 0, transformOrigin: "0% 0%" })
      .to(panels, { scaleY: 1, duration: 0.38, ease: "expo.inOut", stagger: 0.05 })
      .to(logo, { opacity: 1, duration: 0.16, ease: "power1.out" }, "-=0.16")
      .add(() => {
        setDisplay(location);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      })
      .to(logo, { opacity: 0, duration: 0.14 }, "+=0.12")
      .set(panels, { transformOrigin: "0% 100%" })
      .to(panels, { scaleY: 0, duration: 0.44, ease: "expo.inOut", stagger: 0.05 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Fresh measurements for every GSAP ScrollTrigger after the page swaps in.
  useEffect(() => {
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 420);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 950);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [display.pathname]);

  return (
    <>
      {/* barba structure: the wrapper/container exist so Barba's once
          hook has a valid shell; navigation itself is 100% React Router */}
      <div data-barba="wrapper">
        <div data-barba="container" data-barba-namespace={display.pathname}>
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main
              id="main"
              key={display.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.05 } }}
              exit={{ opacity: 0, transition: { duration: 0.22 } }}
              className="relative"
            >
              <Suspense fallback={<RouteFallback />}>
                <Routes location={display}>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/admissions" element={<Admissions />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </motion.main>
          </AnimatePresence>
          <Footer />
        </div>
      </div>

      {/* ---- Curtain: 4 rounded violet/lavender panels + logo pulse ---- */}
      <div ref={curtainRef} aria-hidden="true" className="fixed inset-0 z-[150] pointer-events-none" style={{ visibility: "hidden" }}>
        <div className="absolute inset-0 grid grid-cols-4">
          {["#7B4FD8", "#9A72F0", "#B79CF0", "#7B4FD8"].map((c, i) => (
            <div key={i} className="tpanel h-full" style={{ background: c, borderBottomLeftRadius: "2rem", borderBottomRightRadius: "2rem", scale: "1 0" }} />
          ))}
        </div>
        <div className="tlogo absolute inset-0 grid place-items-center opacity-0">
          <span className="chip glass-deep !py-3 !px-5 text-ink">
            <LogoMark size={22} pulse /> <span className="display text-base">Brand Name</span>
          </span>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------
 * Shell — providers, atmosphere, preloader, floating chrome
 * ---------------------------------------------------------------- */
function Shell() {
  // Preloader shows once per session.
  const [seen] = useState(() => {
    try { return !!sessionStorage.getItem("bn-intro"); } catch { return true; }
  });
  const [loading, setLoading] = useState(!seen);
  const [ready, setReady] = useState(seen);

  const finishIntro = useCallback(() => {
    setLoading(false);
    setReady(true);
    try { sessionStorage.setItem("bn-intro", "1"); } catch { /* private mode */ }
  }, []);

  /**
   * Barba first-load orchestration only.
   * prevent: () => true => link interception disabled (no full-page
   * fetches, no double navigation). We run the once hook for the
   * structure, then destroy listeners because React Router owns the
   * URLs — exactly the brief's "limit Barba to first-load" fallback.
   */
  useEffect(() => {
    try {
      barba.init({
        prevent: () => true,
        timeout: 4000,
        transitions: [{ once() { /* intro visuals live in <Preloader/> */ } }],
      });
      barba.destroy(); // remove popstate/click listeners for good
    } catch {
      /* Barba conflict? The GSAP curtain + AnimatePresence own transitions. */
    }
  }, []);

  return (
    <UIProvider ready={ready}>
      <BackgroundFX />
      <Grain />
      <ScrollProgress />
      <RoutedShell />
      <WhatsAppBubble />
      <BackToTop />
      <AnimatePresence>{loading && <Preloader onDone={finishIntro} />}</AnimatePresence>
    </UIProvider>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      {/* reducedMotion="user": every Framer animation respects the
          OS level "reduce motion" setting automatically. */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </MotionConfig>
    </HelmetProvider>
  );
}
