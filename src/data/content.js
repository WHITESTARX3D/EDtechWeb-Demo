/**
 * data/content.js
 * ------------------------------------------------------------------
 * All site content for the UI-only build. No backend, no API:
 * every card, price, slot and form is a visual placeholder.
 * // PLACEHOLDER: swap with CMS / API data at integration time.
 */

/* ---------------------------- Media ---------------------------- */
// Stock photography (Pexels CDN) — used only where people are shown,
// always inside the capsule mask treatment.
export const MEDIA = {
  heroLeft:
    "https://images.pexels.com/photos/6255933/pexels-photo-6255933.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  heroLeftAlt: "Teenage learner attending an online class from her sofa",
  heroRight:
    "https://images.pexels.com/photos/8472789/pexels-photo-8472789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  heroRightAlt: "Smiling student with glasses taking a live online lesson",
  mission:
    "https://images.pexels.com/photos/8923965/pexels-photo-8923965.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  missionAlt: "A globe on a study table in a bright learning space",
};

// Mentor portraits for the instructor capsules on the home page.
export const MENTORS = [
  {
    name: "Priya Menon",
    role: "Coding mentor · ex-Google",
    img: "https://images.pexels.com/photos/6503001/pexels-photo-6503001.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    alt: "Mentor with a headset teaching an online class",
  },
  {
    name: "Anita Deshpande",
    role: "English & debate coach · TESOL",
    img: "https://images.pexels.com/photos/6267032/pexels-photo-6267032.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    alt: "Mentor teaching online in a home library",
  },
  {
    name: "Kavita Rao",
    role: "Maths mentor · IIT Delhi",
    img: "https://images.pexels.com/photos/6503000/pexels-photo-6503000.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    alt: "Mentor wearing a headset during a live online meeting",
  },
];

export const GALLERY = [
  {
    src: "https://images.pexels.com/photos/5212331/pexels-photo-5212331.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Students engaged in a modern, bright classroom",
    cap: "Live online studios, designed for focus",
  },
  {
    src: "https://images.pexels.com/photos/36834053/pexels-photo-36834053.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Colorful modern indoor learning space",
    cap: "Our Bengaluru counselling studio",
  },
  {
    src: "https://images.pexels.com/photos/8423430/pexels-photo-8423430.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Modern classroom with desks and whiteboard",
    cap: "Weekend maker workshops",
  },
];

/* ------------------------- Categories ---------------------------- */
// Pill palette for course categories (green, cyan, red, violet, orange, blue).
export const CAT = {
  Coding: "#1FA97C",
  Technology: "#7B4FD8",
  Creative: "#7B4FD8",
  "Life Skills": "#FF6B0A",
  Academics: "#2563EB",
  Finance: "#0EA5B7",
  Language: "#E5484D",
  Science: "#0EA5B7",
  Discovery: "#1FA97C",
  Maths: "#FF6B0A",
  Communication: "#E5484D",
};

/* --------------------------- Courses ----------------------------- */
// `art` maps to an animated object in CourseArt.jsx (one per course).
export const COURSES = [
  {
    slug: "machine-learning-teens",
    title: "Machine Learning for Curious Teens",
    cat: "Technology",
    tint: "#EFE9FF",
    lessons: 32,
    rating: 4.9,
    level: "Ages 12–16",
    duration: "10 weeks",
    price: "₹X,XXX",
    art: "ml",
    inst: { name: "Ananya Rao", role: "AI Engineer", tone: "#7B4FD8" },
    desc: "Train real models with playful projects — no heavy maths required up front.",
    syllabus: [
      { m: "Thinking in data", topics: ["What is a model?", "Patterns vs. rules", "Sorting games with data", "Bias detective"] },
      { m: "Build your first model", topics: ["Teachable machines", "Image classifier project", "Train, test, improve", "Demo day prep"] },
      { m: "ML in the real world", topics: ["Recommendation engines", "Voice assistants", "Ethics for young builders", "Capstone showcase"] },
    ],
  },
  {
    slug: "python-basics",
    title: "Python Basics: Zero to First Program",
    cat: "Coding",
    tint: "#E7F6EE",
    lessons: 25,
    rating: 4.8,
    level: "Ages 8–12",
    duration: "8 weeks",
    price: "₹X,XXX",
    art: "py",
    inst: { name: "Kabir Mehta", role: "Software Engineer", tone: "#1FA97C" },
    desc: "Type real code from lesson one and ship a mini game by week eight.",
    syllabus: [
      { m: "Hello, Python", topics: ["Setup & first lines", "Variables as boxes", "Input & output", "Bug-hunting basics"] },
      { m: "Making decisions", topics: ["If / else logic", "Loops & patterns", "Turtle art project", "Quiz game build"] },
      { m: "Ship a mini game", topics: ["Functions", "Score keeping", "Polish & playtest", "Family demo night"] },
    ],
  },
  {
    slug: "young-leaders-lab",
    title: "Young Leaders Lab",
    cat: "Life Skills",
    tint: "#FFF0E6",
    lessons: 18,
    rating: 4.7,
    level: "Ages 11–15",
    duration: "6 weeks",
    price: "₹X,XXX",
    art: "lead",
    inst: { name: "Sarah D'Souza", role: "Leadership Coach", tone: "#FF6B0A" },
    desc: "Team challenges that teach planning, empathy and calm decision-making.",
    syllabus: [
      { m: "Lead yourself", topics: ["Goals that stick", "Time ownership", "Handling setbacks"] },
      { m: "Lead a team", topics: ["Listening first", "Clear requests", "Fair decisions"] },
      { m: "Lead a project", topics: ["Plan a real event", "Delegate & track", "Showcase & reflect"] },
    ],
  },
  {
    slug: "study-skills",
    title: "Study Skills & Smart Note-taking",
    cat: "Academics",
    tint: "#EAF0FF",
    lessons: 20,
    rating: 4.8,
    level: "Ages 9–14",
    duration: "6 weeks",
    price: "₹X,XXX",
    art: "study",
    inst: { name: "Dr. Nidhi Sharma", role: "Learning Scientist", tone: "#2563EB" },
    desc: "Science-backed techniques that cut revision time and beat exam stress.",
    syllabus: [
      { m: "How memory works", topics: ["Spaced practice", "Active recall", "The forgetting curve"] },
      { m: "Notes that think", topics: ["Cornell method", "Mind maps", "Sketchnotes"] },
      { m: "Calm exam prep", topics: ["Plan backwards", "Focus sprints", "Sleep & recall"] },
    ],
  },
  {
    slug: "python-finance",
    title: "Python for Young Finance Minds",
    cat: "Finance",
    tint: "#E5F7FA",
    lessons: 24,
    rating: 4.9,
    level: "Ages 13–16",
    duration: "8 weeks",
    price: "₹X,XXX",
    art: "finpy",
    inst: { name: "Arjun Kapoor", role: "Fintech Analyst", tone: "#0EA5B7" },
    desc: "Use code to read markets, budget pocket money and simulate investments.",
    syllabus: [
      { m: "Money meets code", topics: ["Budget tracker", "Interest simulator", "Charts in Python"] },
      { m: "Reading markets", topics: ["Candlestick anatomy", "CSV data dives", "Moving averages"] },
      { m: "Build a dashboard", topics: ["Portfolio simulator", "Risk basics", "Final pitch"] },
    ],
  },
  {
    slug: "confident-english",
    title: "Speak Confident English",
    cat: "Language",
    tint: "#FDECEA",
    lessons: 30,
    rating: 4.8,
    level: "Ages 8–14",
    duration: "10 weeks",
    price: "₹X,XXX",
    art: "eng",
    inst: { name: "Emily Clark", role: "TESOL Coach", tone: "#E5484D" },
    desc: "Conversations, stories and games that make speaking feel natural.",
    syllabus: [
      { m: "Find your voice", topics: ["Warm-up games", "Everyday phrases", "Story telling"] },
      { m: "Real conversations", topics: ["Asking questions", "Opinions politely", "Role plays"] },
      { m: "Present yourself", topics: ["Show & tell", "Mini speeches", "Family open house"] },
    ],
  },
  {
    slug: "space-rocketry",
    title: "Space Science & Rocketry",
    cat: "Science",
    tint: "#EAF0FF",
    lessons: 22,
    rating: 4.9,
    level: "Ages 9–13",
    duration: "8 weeks",
    price: "₹X,XXX",
    art: "rocket",
    inst: { name: "Dr. Vikram Nair", role: "Aerospace Scientist", tone: "#2563EB" },
    desc: "Design, build and virtually launch rockets while learning the physics of flight.",
    syllabus: [
      { m: "Why rockets fly", topics: ["Thrust & drag", "Famous launches", "Paper rocket lab"] },
      { m: "Design your rocket", topics: ["Nose & fins", "Stability tests", "Simulator runs"] },
      { m: "Mission control", topics: ["Countdown roles", "Telemetry basics", "Launch day"] },
    ],
  },
  {
    slug: "world-cultures",
    title: "World Cultures & Geography Club",
    cat: "Discovery",
    tint: "#E7F6EE",
    lessons: 16,
    rating: 4.7,
    level: "Ages 8–12",
    duration: "6 weeks",
    price: "₹X,XXX",
    art: "globe",
    inst: { name: "Meera Iyer", role: "Global Educator", tone: "#1FA97C" },
    desc: "A passport-style journey through maps, festivals, food and flags.",
    syllabus: [
      { m: "Reading the world", topics: ["Maps & globes", "Continents game", "Time zones"] },
      { m: "Festivals & food", topics: ["Celebrations tour", "Taste traditions", "Folk tales"] },
      { m: "Passport project", topics: ["Pick a country", "Culture presentation", "Stamp ceremony"] },
    ],
  },
  {
    slug: "digital-art-studio",
    title: "Digital Art & Design Studio",
    cat: "Creative",
    tint: "#EFE9FF",
    lessons: 26,
    rating: 4.8,
    level: "Ages 9–15",
    duration: "9 weeks",
    price: "₹X,XXX",
    art: "paint",
    inst: { name: "Rhea Kapoor", role: "Product Designer", tone: "#7B4FD8" },
    desc: "From colour theory to a personal portfolio of posters, characters and logos.",
    syllabus: [
      { m: "Seeing like a designer", topics: ["Colour & contrast", "Shapes tell stories", "Critique kindly"] },
      { m: "Digital toolkit", topics: ["Layers & brushes", "Vector basics", "Poster project"] },
      { m: "Your portfolio", topics: ["Character design", "Logo sprint", "Gallery walk"] },
    ],
  },
  {
    slug: "young-scientist-bio",
    title: "Young Scientist: Biology Lab",
    cat: "Science",
    tint: "#E5F7FA",
    lessons: 20,
    rating: 4.8,
    level: "Ages 8–12",
    duration: "7 weeks",
    price: "₹X,XXX",
    art: "micro",
    inst: { name: "Dr. Farah Ali", role: "Microbiologist", tone: "#0EA5B7" },
    desc: "Kitchen-microscope experiments that turn curiosity into real lab habits.",
    syllabus: [
      { m: "The invisible world", topics: ["Cells up close", "Kitchen microscope", "Lab notebook"] },
      { m: "Life in action", topics: ["Seed diary", "Yeast balloons", "Butterfly counts"] },
      { m: "Scientist showcase", topics: ["Ask testable questions", "Fair experiments", "Poster day"] },
    ],
  },
  {
    slug: "vedic-maths",
    title: "Vedic Maths Speed Club",
    cat: "Maths",
    tint: "#FFF0E6",
    lessons: 24,
    rating: 4.9,
    level: "Ages 9–14",
    duration: "8 weeks",
    price: "₹X,XXX",
    art: "calc",
    inst: { name: "Rohan Bhat", role: "Mathematician", tone: "#FF6B0A" },
    desc: "Mental-maths patterns that make calculation fast, accurate and fun.",
    syllabus: [
      { m: "Friendly numbers", topics: ["Complements", "Base methods", "Estimation wins"] },
      { m: "Speed techniques", topics: ["Vertically & crosswise", "Squares in seconds", "Check digits"] },
      { m: "Mathlete arena", topics: ["Timed ladders", "Team relays", "Speed certificate"] },
    ],
  },
  {
    slug: "public-speaking",
    title: "Public Speaking Championships",
    cat: "Communication",
    tint: "#FDECEA",
    lessons: 18,
    rating: 4.9,
    level: "Ages 10–15",
    duration: "6 weeks",
    price: "₹X,XXX",
    art: "trophy",
    inst: { name: "Zoya Ahmed", role: "Debate Coach", tone: "#E5484D" },
    desc: "Structure, stagecraft and friendly tournaments that build unshakeable stage confidence.",
    syllabus: [
      { m: "Own the stage", topics: ["Posture & breath", "Voice variety", "Calming nerves"] },
      { m: "Craft a talk", topics: ["Hook stories", "Point-example-point", "Strong endings"] },
      { m: "Tournament season", topics: ["Timed debates", "Graceful rebuttals", "Finals night"] },
    ],
  },
];

// Three starter learning-path bundles shown under the course grid.
export const PATHS = [
  {
    name: "Coder's Journey",
    color: "#1FA97C",
    steps: ["Python Basics", "Machine Learning", "Python for Finance"],
    blurb: "From first line of code to a portfolio project parents can see.",
  },
  {
    name: "Confident Communicator",
    color: "#E5484D",
    steps: ["Speak Confident English", "Public Speaking", "Young Leaders Lab"],
    blurb: "Turn quiet kids into calm, clear presenters — stage by stage.",
  },
  {
    name: "Future Scientist",
    color: "#2563EB",
    steps: ["Biology Lab", "Space & Rocketry", "Study Skills"],
    blurb: "Experiments, launches and the study habits to keep curiosity compounding.",
  },
];

/* --------------------------- Home data --------------------------- */

export const STATS = [
  { value: 12000, suffix: "+", label: "Happy learners", note: "across 14 states" },
  { value: 98, suffix: "%", label: "Parent satisfaction", note: "from term-end surveys" },
  { value: 40, suffix: "+", label: "Certified mentors", note: "background-verified" },
  { value: 4.9, suffix: "/5", label: "Average class rating", note: "12,000+ reviews", decimals: 1 },
];

// "Why parents trust us" — six skeuomorphic icon tiles (icons resolved in Home.jsx).
export const WHY = [
  { icon: "BadgeCheck", title: "Certified mentors", text: "Every mentor clears subject tests, teaching demos and police verification before their first class." },
  { icon: "Users", title: "Small batches", text: "Six learners per class, never more. Your child speaks, gets heard and gets feedback every session." },
  { icon: "Video", title: "Safe, monitored classes", text: "Sessions are recorded and audited weekly. Only verified adults ever enter a classroom." },
  { icon: "LineChart", title: "Weekly parent reports", text: "A crisp progress note lands in your inbox every Friday — what clicked, what needs a nudge." },
  { icon: "CalendarClock", title: "Flexible timings", text: "Morning, evening and weekend batches. Reschedule a class up to 4 hours before it starts." },
  { icon: "Gift", title: "Free demo class", text: "Meet the mentor and try a real lesson before you spend a rupee. No card required." },
];

// Four-step learning journey (scroll-drawn connector line in Home).
export const JOURNEY = [
  { t: "Book a free demo", d: "Pick a course and a slot. Your child joins a real live class — free, zero commitment." },
  { t: "Get a learning plan", d: "Our counsellor maps strengths and goals into a simple plan you approve together." },
  { t: "Learn in small batches", d: "Live classes of six, with projects, games and a mentor who knows your child by name." },
  { t: "Track & celebrate", d: "Weekly reports, certificates and showcase days keep progress visible and fun." },
];

export const PARTNERS = ["EduTrust", "SkillBridge", "LearnSphere", "NorthPeak U", "BrightPath"];
export const PARTNER_WALL = ["EduTrust", "SkillBridge", "LearnSphere", "NorthPeak U", "BrightPath", "CodeJunior", "STEM League", "OrbitEd", "VidyaFund", "CampusLink"];

export const TESTIMONIALS = [
  {
    quote: "My daughter went from hiding her camera to hosting the class showcase. The weekly report tells me exactly what to ask her about at dinner.",
    name: "Shalini Verma",
    meta: "Parent of Anaya, 10 · Python Basics",
  },
  {
    quote: "The mentors genuinely know my son — his strengths, his distracted days. It feels like a small school, not an app.",
    name: "Rohit Kulkarni",
    meta: "Parent of Aarav, 12 · Young Leaders Lab",
  },
  {
    quote: "We compared five platforms. Brand Name was the only one where the counsellor listened before selling. The demo class sealed it.",
    name: "Farah Siddiqui",
    meta: "Parent of Zara, 9 · Speak Confident English",
  },
  {
    quote: "He finished the finance course and now tracks his own pocket money in a spreadsheet. Worth every rupee.",
    name: "Deepak Nair",
    meta: "Parent of Nikhil, 14 · Python for Finance",
  },
  {
    quote: "Small batches are the real thing. Six kids, one patient mentor, and my child who finally asks questions out loud.",
    name: "Meenakshi Iyer",
    meta: "Parent of Dhruv, 11 · Vedic Maths",
  },
];

/* --------------------------- About data -------------------------- */

export const VALUES = [
  { icon: "HeartHandshake", t: "Children first, always", d: "Every policy — from batch size to refunds — starts with what is kindest and safest for the child." },
  { icon: "Sparkles", t: "Curiosity over cramming", d: "Projects and questions beat worksheets. We teach children how to learn, not what to memorise." },
  { icon: "MessagesSquare", t: "Parents as partners", d: "You see what we see: reports, recordings and an open line to every mentor." },
  { icon: "ShieldCheck", t: "Safety, audited", d: "Monitored classes, verified mentors and a child-safety officer who answers to parents." },
];

export const TIMELINE = [
  { year: "2016", t: "Two tutors, one living room", d: "We started with weekend coding classes for six neighbourhood kids in Bengaluru." },
  { year: "2018", t: "First online batch", d: "Parents asked for live online classes. We went digital — and kept batches at six." },
  { year: "2020", t: "Weekly parent reports", d: "We launched the report every parent now expects: honest, weekly, in plain language." },
  { year: "2022", t: "5,000 learners", d: "Teaching expanded to communication, maths and science with the same mentor-first model." },
  { year: "2025", t: "12,000+ and counting", d: "Today we run 300+ live classes a week across 14 states — still six kids per class." },
];

export const FACULTY = [
  { name: "Ananya Rao", cred: "AI Engineer · IISc Bengaluru", subject: "Machine Learning", tone: "#7B4FD8" },
  { name: "Kabir Mehta", cred: "Software Engineer · IIT Bombay", subject: "Python", tone: "#1FA97C" },
  { name: "Dr. Nidhi Sharma", cred: "PhD Learning Sciences · NCERT fellow", subject: "Study Skills", tone: "#2563EB" },
  { name: "Sarah D'Souza", cred: "Certified Leadership Coach · ICF", subject: "Leadership", tone: "#FF6B0A" },
  { name: "Emily Clark", cred: "TESOL, CELTA · 12 yrs teaching", subject: "English", tone: "#E5484D" },
  { name: "Dr. Vikram Nair", cred: "Aerospace Scientist · ex-ISRO", subject: "Space Science", tone: "#0EA5B7" },
];

export const ACCRED = [
  { icon: "ShieldCheck", t: "ISO 21001:2018", d: "Educational organisation management" },
  { icon: "BadgeCheck", t: "Mentor-verified", d: "100% background checks, renewed yearly" },
  { icon: "Lock", t: "COPPA-aligned", d: "Child data kept minimal and encrypted" },
];

/* ------------------------ Admissions data ------------------------ */

export const STEPS = [
  { t: "Book a free demo", d: "Choose a course and a slot — it takes two minutes." },
  { t: "Meet the counsellor", d: "A 20-minute call to understand goals and build a plan." },
  { t: "Pick your batch", d: "Choose timings that fit school, sport and sleep." },
  { t: "Start learning", d: "Join your batch, meet your mentor, get weekly reports." },
];

export const PLANS = [
  {
    name: "Starter",
    blurb: "Dip a toe in with one course.",
    monthly: "₹X,XXX",
    annual: "₹X,XXX",
    note: "per month, billed per course",
    annualNote: "save 15% when billed annually",
    features: ["1 live course", "Batch of 6 learners", "Weekly parent report", "Class recordings", "Reschedule up to 4 hrs before"],
    cta: "Start with Starter",
    popular: false,
  },
  {
    name: "Growth",
    blurb: "Two courses, the full routine.",
    monthly: "₹X,XXX",
    annual: "₹X,XXX",
    note: "per month, billed per course",
    annualNote: "save 20% when billed annually",
    features: ["2 live courses", "Priority batch choice", "Weekly report + monthly call", "Certificates & showcase days", "Free make-up classes"],
    cta: "Choose Growth",
    popular: true,
  },
  {
    name: "Achiever",
    blurb: "A full learning path, mentored.",
    monthly: "₹X,XXX",
    annual: "₹X,XXX",
    note: "per month, billed per path",
    annualNote: "save 25% when billed annually",
    features: ["Full 3-course path", "Dedicated mentor lead", "1:1 doubt sessions weekly", "Competition prep support", "Scholarship fast-track"],
    cta: "Go Achiever",
    popular: false,
  },
];

// Comparison table: ✓ / — per plan column (Starter, Growth, Achiever).
export const COMPARISON = [
  { label: "Live classes per week", row: ["2", "4", "6"] },
  { label: "Batch size of six", row: [true, true, true] },
  { label: "Weekly parent report", row: [true, true, true] },
  { label: "Monthly counsellor call", row: [false, true, true] },
  { label: "1:1 doubt sessions", row: [false, false, true] },
  { label: "Certificates & showcases", row: [true, true, true] },
  { label: "Competition preparation", row: [false, false, true] },
];

export const ASSIST = [
  { icon: "Wallet", t: "Easy EMI", d: "Split any plan into 3–6 monthly payments at zero extra cost. // PLACEHOLDER: payment partner TBD." },
  { icon: "GraduationCap", t: "Merit scholarships", d: "Up to 50% off for toppers of our seasonal aptitude challenge." },
  { icon: "HandHeart", t: "Sibling benefit", d: "10% off when a brother or sister is learning with us too." },
];

export const FAQS = [
  { q: "How do live classes actually run?", a: "Classes meet over our secure video platform at fixed weekly times. Batches are capped at six learners, sessions are recorded for revision, and mentors use shared whiteboards, quizzes and breakout games to keep energy high." },
  { q: "What if my child misses a class?", a: "No stress — reschedule up to 4 hours before a session, or watch the recording and bring doubts to the next class. Growth and Achiever plans include free make-up classes." },
  { q: "Who are the mentors?", a: "Working professionals and educators — engineers, scientists, coaches — who clear our subject test, a teaching demo, and police verification. Fewer than 6% of applicants make it through." },
  { q: "Is there really a free demo?", a: "Yes. One full, real class with a real batch. No card, no commitment. If it isn't right for your child, we'll tell you honestly and suggest alternatives." },
  { q: "How will I know my child is improving?", a: "Every Friday you receive a short report: attendance, concepts covered, what clicked and one suggestion for home. Growth and Achiever plans add a monthly counsellor call." },
  { q: "What is your refund policy?", a: "Full refund within 7 days of starting a course, no questions asked. After that, unused months are refundable on annual plans. The fine print is short, we promise." },
  { q: "Is my child's data safe?", a: "We collect the minimum we need, never sell data, and encrypt everything at rest. Class recordings are visible only to the batch parents and auto-delete after 60 days." },
];

export const POLICIES = [
  { icon: "RotateCcw", t: "Refund policy", d: "7-day full refund, no questions asked. Unused annual months are always refundable." },
  { icon: "Lock", t: "Privacy promise", d: "Minimal data, encrypted at rest, never sold. Recordings auto-delete in 60 days." },
  { icon: "ShieldCheck", t: "Child safety", d: "Verified mentors, monitored classes and a named safety officer for every batch." },
];

/* -------------------------- Contact data ------------------------- */

export const SLOTS = {
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  times: ["10:00 AM", "12:00 PM", "4:00 PM", "6:00 PM"],
};

export const PARENT_CORNER = [
  { icon: "BookOpen", t: "The learning journal", d: "Short reads on raising curious, calm learners — by our mentors." },
  { icon: "MessagesSquare", t: "Parent community", d: "Monthly open house where parents swap notes with mentors." },
  { icon: "CircleHelp", t: "Honest answers", d: "Every admission question, answered in plain language in our FAQ." },
];
