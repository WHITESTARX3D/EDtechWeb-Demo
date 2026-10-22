/**
 * pages/NotFound.jsx — minimal themed 404
 * ------------------------------------------------------------------
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { EASE } from "../lib/motion";
import { SEO, SkeuButton, LogoMark } from "../components/ui";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <SEO title="Page not found" description="This page skipped class. Head back home or explore our courses." path="/404" />
      <section className="min-h-[80vh] grid place-items-center px-5 pt-28 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 26, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: EASE }}>
          <div className="flex justify-center"><LogoMark size={34} pulse /></div>
          <p className="display mt-6 text-[clamp(4rem,14vw,8rem)] leading-none">
            <span className="sheen-v">404</span>
          </p>
          <h1 className="display text-2xl md:text-3xl text-ink mt-2">This page skipped class</h1>
          <p className="text-muted mt-3 max-w-[42ch] mx-auto text-sm leading-relaxed">
            The link you followed doesn't exist (or graduated early). Let's get you back to something useful.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <SkeuButton variant="violet" size="lg" onClick={() => navigate("/")}>
              <ArrowLeft size={16} /> Back home
            </SkeuButton>
            <SkeuButton variant="cream" size="lg" onClick={() => navigate("/courses")}>
              <Compass size={16} /> Explore courses
            </SkeuButton>
          </div>
        </motion.div>
      </section>
    </>
  );
}
