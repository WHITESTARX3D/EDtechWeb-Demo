/**
 * pages/Courses.jsx — browse
 * ------------------------------------------------------------------
 * Compact hero with glass search, sticky category chips + sort,
 * 12 signature course cards, learning-path bundles (they actually
 * filter the grid) and a glass quick-view modal with syllabus
 * accordion, instructor row, price placeholder and Enroll CTA.
 * Everything is UI-only — no backend calls.
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, SlidersHorizontal, Star, Clock3, Users, Play, ArrowRight,
  CheckCircle2, Route, CircleCheck,
} from "lucide-react";
import siteConfig from "../config/siteConfig";
import { EASE } from "../lib/motion";
import {
  SEO, Reveal, SectionHead, SkeuButton, Modal, Accordion, Stars, Avatar, EmptyState, Field,
} from "../components/ui";
import CourseCard from "../components/CourseCard";
import { COURSES, PATHS, CAT } from "../data/content";

const SORTS = [
  { id: "popular", label: "Most popular" },
  { id: "rating", label: "Top rated" },
  { id: "lessons", label: "Most lessons" },
  { id: "az", label: "A to Z" },
];

// path bundles -> course slugs (order preserved for display)
const PATH_SLUGS = [
  ["python-basics", "machine-learning-teens", "python-finance"],
  ["confident-english", "public-speaking", "young-leaders-lab"],
  ["young-scientist-bio", "space-rocketry", "study-skills"],
];

/* ------------------------------------------------------------------
 * Glass quick-view modal
 * ---------------------------------------------------------------- */
function QuickView({ course, onClose }) {
  const [enrolled, setEnrolled] = useState(false);
  const navigate = useNavigate();
  const color = course ? CAT[course.cat] : "#7B4FD8";

  return (
    <Modal open={!!course} onClose={() => { setEnrolled(false); onClose(); }} labelledBy="qv-title" wide>
      {course && (
        <div key={course.slug}>
          {/* header */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="cat-pill" style={{ "--c": color }}>{course.cat}</span>
            <span className="chip bg-panel text-muted border border-hairline"><Users size={12} /> {course.level}</span>
            <span className="chip bg-panel text-muted border border-hairline"><Clock3 size={12} /> {course.duration}</span>
          </div>
          <h3 id="qv-title" className="display text-[1.7rem] md:text-3xl text-ink mt-4">{course.title}</h3>
          <p className="text-sm text-muted leading-relaxed mt-2 max-w-[50ch]">{course.desc}</p>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="inline-flex items-center gap-1.5"><Stars value={course.rating} size={13} /><b className="text-ink">{course.rating.toFixed(1)}</b></span>
            <span className="inline-flex items-center gap-1.5 text-muted font-bold text-xs"><Play size={11} className="text-violet" /> {course.lessons} live lessons</span>
          </div>

          {/* instructor */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/70 border border-white p-3.5">
            <Avatar name={course.inst.name} tone={course.inst.tone} size={42} />
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-ink">{course.inst.name}</p>
              <p className="text-[0.7rem] font-bold text-muted">{course.inst.role} · Mentor since 2019</p>
            </div>
            <span className="chip bg-violet-ghost text-violet ml-auto hidden sm:inline-flex"><CircleCheck size={12} /> Verified</span>
          </div>

          {/* syllabus accordion */}
          <p className="text-xs font-extrabold tracking-wide text-ink-soft mt-7 mb-3">What your child will learn</p>
          <Accordion
            defaultOpen={0}
            ns="qv"
            items={course.syllabus.map((s, i) => ({
              q: `${i + 1}. ${s.m}`,
              a: s.topics.join(" · "),
            }))}
          />

          {/* price + actions (sticky-ish footer) */}
          <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-panel border border-frame/60 p-4">
            <div className="sm:mr-auto">
              <p className="display text-2xl text-ink">{course.price} <span className="text-xs font-sans font-bold text-muted">per course</span></p>
              <p className="text-[0.68rem] text-muted mt-0.5">Zero-cost EMI available · 7-day refund</p>
            </div>
            {enrolled ? (
              <span className="chip bg-[#E7F6EE] text-cgreen !py-3 !px-5 text-sm"><CheckCircle2 size={16} /> Seat reserved — we'll call you (demo)</span>
            ) : (
              <>
                <SkeuButton variant="cream" size="md" onClick={() => { onClose(); navigate("/admissions"); }}>
                  Book free demo
                </SkeuButton>
                <SkeuButton variant="violet" size="md" onClick={() => setEnrolled(true)}>
                  Enroll now <ArrowRight size={15} />
                </SkeuButton>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
export default function Courses() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("popular");
  const [path, setPath] = useState(null); // active learning-path bundle
  const [selected, setSelected] = useState(null);

  const cats = useMemo(() => ["All", ...new Set(COURSES.map((c) => c.cat))], []);

  const list = useMemo(() => {
    let l = COURSES.filter((c) => {
      const q = query.trim().toLowerCase();
      const hit = !q || [c.title, c.cat, c.inst.name, c.level].join(" ").toLowerCase().includes(q);
      const inCat = cat === "All" || c.cat === cat;
      return hit && inCat;
    });
    if (path !== null) {
      const order = PATH_SLUGS[path];
      l = order.map((s) => COURSES.find((c) => c.slug === s)).filter(Boolean);
    } else {
      if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
      if (sort === "lessons") l = [...l].sort((a, b) => b.lessons - a.lessons);
      if (sort === "az") l = [...l].sort((a, b) => a.title.localeCompare(b.title));
    }
    return l;
  }, [query, cat, sort, path]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: COURSES.map((c, i) => ({
      "@type": "ListItem", position: i + 1,
      item: {
        "@type": "Course", name: c.title, description: c.desc,
        provider: { "@type": "Organization", name: siteConfig.brand, sameAs: siteConfig.url },
      },
    })),
  };

  return (
    <>
      <SEO
        title="Courses"
        description="Browse 12 live, small-batch courses in coding, maths, English, science and life skills for ages 8–16. Free demo class on every course."
        path="/courses"
        jsonLd={jsonLd}
      />

      {/* compact hero */}
      <section className="px-5 md:px-8 pt-32 md:pt-40 pb-8 text-center">
        <h1 className="sr-only">Courses at {siteConfig.brand} — live online classes for ages 8–16</h1>
        <SectionHead
          tag="Course library"
          title={<>Find the class your child <span className="text-violet">will love</span></>}
          sub="Twelve flagship courses. Batches of six. One free demo before you decide anything."
        />
        {/* glass search */}
        <Reveal variant="fade" delay={0.15} className="max-w-xl mx-auto mt-8">
          <div className="glass rounded-full flex items-center gap-2 pl-5 pr-2 py-2">
            <Search size={17} className="text-muted shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (path !== null) setPath(null); }}
              placeholder="Search courses, mentors, skills…"
              aria-label="Search courses"
              className="flex-1 bg-transparent outline-none text-sm font-semibold text-ink placeholder:text-muted min-w-0"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="chip bg-white/70 text-muted hover:text-ink cursor-pointer">Clear</button>
            )}
          </div>
        </Reveal>
      </section>

      {/* sticky filter bar */}
      <div className="sticky top-[84px] z-[60] px-5 md:px-8">
        <div className="glass mx-auto max-w-[1200px] rounded-full py-2 pl-4 pr-2 flex items-center gap-3">
          <SlidersHorizontal size={15} className="text-violet shrink-0 hidden sm:block" />
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto" role="tablist" aria-label="Filter by category" style={{ scrollbarWidth: "none" }}>
            {cats.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c && path === null}
                type="button"
                onClick={() => { setCat(c); setPath(null); }}
                className={`relative px-3.5 py-1.5 rounded-full text-[0.74rem] font-extrabold whitespace-nowrap transition-colors cursor-pointer ${
                  cat === c && path === null ? "text-white" : "text-ink-soft hover:text-violet"
                }`}
              >
                {cat === c && path === null && (
                  <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full btn-violet" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPath(null); }}
            aria-label="Sort courses"
            className="chip bg-white/80 border border-hairline text-ink font-extrabold cursor-pointer outline-none shrink-0"
          >
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* grid */}
      <section className="px-5 md:px-8 pt-10 pb-8">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-xs font-bold text-muted mb-5" aria-live="polite">
            {path !== null
              ? <>Showing the <b className="text-violet">{PATHS[path].name}</b> path — <button type="button" className="link-u text-violet cursor-pointer" onClick={() => setPath(null)}>show all courses</button></>
              : <>{list.length} course{list.length === 1 ? "" : "s"} {cat !== "All" ? `in ${cat}` : "available"}</>}
          </p>
          {list.length === 0 ? (
            <EmptyState title="No courses match that search" sub="Try a different keyword — or clear the filter to see all twelve courses." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
              {list.map((c, i) => (
                <Reveal key={c.slug} variant="scale" delay={(i % 3) * 0.07}>
                  <CourseCard course={c} onOpen={setSelected} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* learning-path bundles */}
      <section className="px-5 md:px-8 py-12 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <SectionHead
            tag="Learning paths"
            title="Not sure where to start? Follow a path"
            sub="Three guided journeys, sequenced by our counsellors. Each step builds on the last."
          />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {PATHS.map((p, i) => (
              <Reveal key={p.name} variant="scale" delay={i * 0.1}>
                <div className={`tile p-6 h-full flex flex-col ${path === i ? "!border-violet ring-2 ring-violet/30" : ""}`}>
                  <span className="tile-ico w-12 h-12" style={{ "--tint1": p.color, "--tint2": p.color, "--tintshadow": `${p.color}80` }}>
                    <Route size={20} />
                  </span>
                  <h3 className="display text-xl text-ink mt-4">{p.name}</h3>
                  <ol className="mt-4 space-y-2">
                    {p.steps.map((s, si) => (
                      <li key={s} className="flex items-center gap-2.5 text-[0.82rem] font-bold text-ink-soft">
                        <span className="grid place-items-center w-5 h-5 rounded-full text-[0.62rem] font-extrabold text-white shrink-0" style={{ background: p.color }}>{si + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <p className="text-sm text-muted leading-relaxed mt-4">{p.blurb}</p>
                  <div className="mt-auto pt-5">
                    <SkeuButton
                      variant={path === i ? "violet" : "cream"} size="md" className="w-full"
                      onClick={() => { setPath(path === i ? null : i); setCat("All"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      {path === i ? "Showing this path" : "View this path"} <ArrowRight size={14} />
                    </SkeuButton>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* certificate teaser */}
      <section className="px-5 md:px-8 pb-16 md:pb-24">
        <Reveal variant="scale" className="mx-auto max-w-[900px]">
          <div className="glass rounded-[2rem] p-7 md:p-9 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative shrink-0">
              <div className="w-24 h-32 rounded-xl bg-white border border-frame shadow-md rotate-[-6deg] grid place-items-center">
                <span className="display text-violet text-lg leading-tight">Course<br/>Certificate</span>
              </div>
              <span className="absolute -bottom-2 -right-2 tile-ico w-10 h-10 !rounded-full" style={{ "--tint1": "#FFD23F", "--tint2": "#E0A81A", "--tintshadow": "#E0A81A80" }}>
                <Star size={16} fill="#fff" />
              </span>
            </div>
            <div className="flex-1">
              <h2 className="display text-2xl text-ink">Every course ends with a certificate & showcase</h2>
              <p className="text-sm text-muted mt-2 measure">Kids present a real project to their batch and families, then get a certificate that names the skills they proved.</p>
            </div>
            <SkeuButton variant="orange" size="md" onClick={() => setSelected(COURSES[0])}>
              Peek a course <ArrowRight size={15} />
            </SkeuButton>
          </div>
        </Reveal>
      </section>

      <QuickView course={selected} onClose={() => setSelected(null)} />
    </>
  );
}
