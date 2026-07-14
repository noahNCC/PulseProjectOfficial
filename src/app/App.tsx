import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import {
  ArrowRight, Users, Layers, Cpu,
  FlaskConical, ChevronDown, Linkedin, Mail, Menu, X,
  Heart, Target, Award, BookOpen, Globe, Zap,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoSrc        from "@/imports/image.png";
import leaderSrc      from "@/imports/image-3.png";
import teamPicSrc     from "@/imports/Pulse_Team_Pic.jpg";
import leaderFacesSrc from "@/imports/image-7.png";
import advisorFacesSrc from "@/imports/image-8.png";

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const RED   = "#e8320a";
const BLUE  = "#2b4ea8";
const RED_L = "#f07090";
const BLU_L = "#5b82e8";

// ─── Data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home",     href: "#home"     },
  { label: "About",    href: "#about"    },
  { label: "Research", href: "#research" },
  { label: "Team",     href: "#team"     },
  { label: "Sponsors", href: "#sponsors" },
  { label: "Join Us",  href: "#join"     },
];

const STATS = [
  { value: 70,  suffix: "+", label: "Team Members"           },
  { value: 8,   suffix: "",  label: "Engineering Disciplines" },
  { value: 200, suffix: "+", label: "CAD Models Created"      },
  { value: 150, suffix: "+", label: "CFD Simulations"         },
  { value: 5,   suffix: "",  label: "Prototype Iterations"    },
];

const RESEARCH_AREAS = [
  { Icon: Layers,       abbr: "MECH", title: "Mechanical",
    description: "CAD modeling, CFD simulation, prototype fabrication, and testing of pump housing, impeller geometry, and biocompatible materials.",
    from: BLUE, to: BLU_L, glow: `${BLUE}55` },
  { Icon: Cpu,          abbr: "ELEC", title: "Electrical",
    description: "Custom PCB design, motor driver circuits, wireless power transfer, and embedded firmware for real-time adaptive pump control.",
    from: RED,  to: "#ff6040", glow: `${RED}55` },
  { Icon: FlaskConical, abbr: "RES",  title: "Research",
    description: 'Literature reviews, physiology reference ("Heart Bible"), biomaterial evaluation, and hemocompatibility assessment for our TAH design.',
    from: BLUE, to: BLU_L, glow: `${BLUE}44` },
  { Icon: Users,        abbr: "BIZ",  title: "Business",
    description: "Sponsorship outreach, technical documentation, competition strategy, and partnerships supporting Pulse Project's ISMCS goals.",
    from: RED,  to: RED_L, glow: `${RED}44` },
];

const TIMELINE_ITEMS = [
  { date: "Sept 2023",     title: "Team Formation",        desc: "Pulse Project is founded as UCI's first and only Biomedical Engineering project team, uniting students around the goal of designing a Total Artificial Heart.", future: false },
  { date: "Nov 2023",      title: "Concept Development",   desc: "Comprehensive literature review of existing TAH devices — AbioCor, SynCardia, and continuous-flow LVADs — establishes the foundation for our axial flow approach.", future: false },
  { date: "Jan 2024",      title: "CAD Development",       desc: "Full parametric pump model completed in SolidWorks. Target cardiac output of 5 L/min at 100 mmHg mean arterial pressure.", future: false },
  { date: "Apr 2024",      title: "CFD Simulations",       desc: "ANSYS Fluent analysis of blood flow pathlines, wall shear stress distribution, and pressure gradient across rotor and stator stages.", future: false },
  { date: "Aug 2024",      title: "First Prototype",       desc: "First physical pump prototype assembled. Custom mock circulatory loop (MCL) constructed to simulate physiological blood flow conditions.", future: false },
  { date: "Dec 2024",      title: "Hydraulic Testing",     desc: "MCL pressure-flow characterization complete. Hydraulic efficiency benchmarked, identifying key geometry improvements for the next generation.", future: false },
  { date: "2025",          title: "ISMCS Heart Hackathon", desc: "Pulse Project enters the 32nd Annual Meeting of the International Society for Mechanical Circulatory Support — one of only two U.S. teams competing internationally.", future: false },
  { date: "June 2026",     title: "TAH Symposium",         desc: "Finalize system architecture and present progress at the 2026 TAH Symposium.", future: true },
  { date: "Jul–Aug 2026",  title: "Prototype Fabrication", desc: "Fabricate prototype components, conduct benchtop testing, and iterate toward a final TAH concept.", future: true },
  { date: "Sept–Oct 2026", title: "Grand Finals",          desc: "Prepare and submit Final Report; develop Grand Final presentation for ISMCS 2026.", future: true },
  { date: "Nov–Dec 2026",  title: "Project Evaluation",    desc: "Evaluate outcomes, document lessons learned, and define improvements for the next-generation TAH design.", future: true },
  { date: "2027",          title: "Next Generation",       desc: "Leadership transition, onboarding, and literature review to develop next-gen TAH concepts — with submission of 2027 Preliminary Report.", future: true },
];

const LEADERSHIP = [
  { name: "Madi Duarte",         role: "President",             side: "red",  bgX: -211, bgY: -170 },
  { name: "Adani Ahmad",         role: "Vice President",        side: "blue", bgX: -365, bgY: -170 },
  { name: "Raden Nelson",        role: "Chief Mechanical Eng.", side: "blue", bgX: -518, bgY: -170 },
  { name: "Shota Maekawa",       role: "Chief Electrical Eng.", side: "red",  bgX: -58,  bgY: -170 },
  { name: "Tamanpreet Dhaliwal", role: "Chief Researcher",      side: "blue", bgX: -320, bgY: -263 },
  { name: "Rylan Rubiono",       role: "Chief Business Lead",   side: "red",  bgX: -134, bgY: -263 },
];

const ADVISORS = [
  { name: "Dr. Pim Oomen", role: "Faculty Advisor",  sub: "Asst. Professor, BME · UCI",                bgX: -45,  bgY: -177 },
  { name: "Hao Tran M.D.", role: "Clinical Advisor", sub: "Transplant Cardiologist · Hoag",             bgX: -198, bgY: -177 },
  { name: "Eric Wu",       role: "Industry Advisor", sub: "Engineer Lead at ICETLab · Former BIVACOR", bgX: -365, bgY: -177 },
  { name: "Ryan Krippner", role: "Industry Advisor", sub: "Hackathon Alumni · JenaValve",              bgX: -518, bgY: -177 },
];

const SUBTEAM_LEADS = [
  { name: "Noah Chie",           role: "CFD & Business Lead"                },
  { name: "Makaila Purser",      role: "Housing Lead"                       },
  { name: "Derek Coelho",        role: "Controls Specialist"                },
  { name: "Nathan Hii",          role: "Motor Lead"                         },
  { name: "Zoran Siddiqui",      role: "Mock Circulatory Loop Lead"         },
  { name: "Andrew Heang",        role: "Novelty Lead"                       },
  { name: "Denise Estana",       role: "Electrical System Integration Lead" },
  { name: "Frank Yeh",           role: "Controls & Algos Lead"              },
  { name: "Inaya Nayaz",         role: "Electrical Control & Algos Lead"    },
  { name: "Francis Tran",        role: "Power Systems Lead"                 },
  { name: "Sarah Huerta",        role: "Power Systems Lead"                 },
  { name: "Isabel Divinagracia", role: "Mechanical Specialist"              },
  { name: "Katherine Montalvo",  role: "Technical Dev. & Sponsorship Lead"  },
  { name: "Michelle Nguyen",     role: "Motor Integration Specialist"       },
];

const SPONSORS = ["Ansys", "CIRC", "UCI Engineering", "ISMCS"];

const SPONSOR_BLURBS: Record<string, string> = {
  "Ansys":           "Provides our CFD and FEA simulation licenses, enabling high-fidelity analysis of blood flow dynamics within the TAH.",
  "CIRC":            "UCI's Center for Innovative Research & Commercialization supports our path from concept to prototype with resources and mentorship.",
  "UCI Engineering": "The Henry Samueli School of Engineering provides institutional backing, lab access, and faculty advisorship for our team.",
  "ISMCS":           "The International Society for Mechanical Circulatory Support hosts the Heart Hackathon competition we compete in annually.",
};

const CFD_STAGES = [
  { label: "Axial Flow Design",     body: "Our TAH uses an axial flow pump design, drawing blood through a rotating impeller to generate continuous, physiologically appropriate flow.", col: BLU_L },
  { label: "Rotor & Stator Stages", body: "The rotor spins at ~3,000 RPM while the downstream stator blades remain stationary, converting rotational kinetic energy into pressure rise.", col: RED_L },
  { label: "Mock Circulatory Loop", body: "We validate our design using a custom-built MCL which simulates physiological blood flow to test performance under realistic conditions.", col: BLU_L },
  { label: "Electrical System",     body: "Wireless power transfer, a high-efficiency motor, and sensor-driven feedback control deliver adaptive, physiologically responsive blood flow.", col: RED_L },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCounter(target: number, active: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick); else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [target, active, duration]);
  return count;
}

// ─── Word Reveal ──────────────────────────────────────────────────────────────

function WordReveal({ children, className, style, delay = 0 }: {
  children: string; className?: string; style?: React.CSSProperties; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className={className} style={style} aria-label={children}>
      {children.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16, filter: "blur(5px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.24em] last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

// ─── Face Avatar ──────────────────────────────────────────────────────────────

function FaceAvatar({ src, bgX, bgY, col, size = 64 }: {
  src: string; bgX: number; bgY: number; col: string; size?: number;
}) {
  return (
    <div className="rounded-full flex-shrink-0" style={{
      width: size, height: size,
      backgroundImage: `url(${src})`,
      backgroundSize: "1000%",
      backgroundPosition: `${bgX}px ${bgY}px`,
      backgroundRepeat: "no-repeat",
      border: `2px solid ${col}55`,
      boxShadow: `0 0 16px ${col}30`,
    }} />
  );
}

// ─── Particle canvas ──────────────────────────────────────────────────────────

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.3 + 0.4, red: Math.random() > 0.5,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.red ? "rgba(232,50,10,0.5)" : "rgba(91,130,232,0.5)";
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = pts[i].red || pts[j].red
            ? `rgba(232,50,10,${(1 - d / 120) * 0.1})`
            : `rgba(43,78,168,${(1 - d / 120) * 0.1})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.5 }} />;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 mb-5">
      <div className="w-4 h-px" style={{ background: `linear-gradient(90deg,${RED},${BLUE})` }} />
      <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: BLU_L }}>{text}</span>
      <div className="w-4 h-px" style={{ background: `linear-gradient(90deg,${BLUE},transparent)` }} />
    </div>
  );
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCounter(value, inView);
  return (
    <div ref={ref} className="text-center px-4">
      <div className="font-['Bricolage_Grotesque',sans-serif] text-5xl md:text-6xl font-bold text-white tabular-nums leading-none">
        {count}<span className="grad-suffix">{suffix}</span>
      </div>
      <div className="mt-3 text-[11px] font-mono text-[#6b7fa8] uppercase tracking-[0.18em]">{label}</div>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (href: string) => { setOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 3.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-3 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 rounded-2xl transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(0,4,14,0.92)] backdrop-blur-2xl border border-white/[0.07] shadow-[0_8px_48px_rgba(0,0,0,0.7)]"
          : "bg-[rgba(0,4,14,0.2)] backdrop-blur-sm border border-white/[0.04]"
      }`}>
      <div className="flex items-center justify-between px-5 py-2.5">
        <button onClick={() => go("#home")} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <ImageWithFallback src={logoSrc} alt="Pulse Project logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-sm tracking-widest">PULSE PROJECT</span>
        </button>
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <button key={label} onClick={() => go(href)}
              className="px-4 py-2 text-sm text-[#6b7fa8] hover:text-white rounded-xl transition-colors hover:bg-white/[0.04] font-medium">
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => go("#join")}
          className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg,${RED},${BLUE})`, boxShadow: `0 0 20px ${RED}44` }}>
          Join Us <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white/60 hover:text-white transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/[0.06] px-4 pb-4 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <button key={label} onClick={() => go(href)}
              className="px-4 py-3 text-sm text-[#6b7fa8] hover:text-white text-left rounded-xl hover:bg-white/[0.04] transition-colors">
              {label}
            </button>
          ))}
        </div>
      )}
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll();
  const heroHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const photoOpacity = useTransform(scrollY, [0, heroHeight * 0.38, heroHeight * 0.72], [1, 1, 0]);
  const bgScale = useTransform(scrollY, [0, heroHeight], [1.1, 1.4]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* Team photo — fades on scroll */}
      <motion.div className="absolute inset-0 z-0" style={{ opacity: photoOpacity }}>
        {/* height:130% + top:-22% shifts the photo container upward so faces appear above heading */}
        <motion.div
          className="absolute w-full overflow-hidden"
          style={{
            scale: bgScale,
            height: "130%",
            top: "-22%",
            transformOrigin: "50% 60%",
          }}
        >
          <ImageWithFallback
            src={teamPicSrc}
            alt="Pulse Project full team at UCI"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 10%" }}
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "rgba(0,8,20,0.52)" }} />
      </motion.div>

      {/* Gradient overlays — always present, never fade */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        background: `linear-gradient(to top,
          #000a1e 0%,
          #000a1e 5%,
          rgba(0,10,30,0.97) 13%,
          rgba(0,10,30,0.85) 24%,
          rgba(0,10,30,0.46) 42%,
          rgba(0,10,30,0.10) 62%,
          transparent 82%
        )`
      }} />
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 130% 90% at 50% 50%, transparent 30%, rgba(0,8,20,0.5) 100%)" }} />

      {/* Brand orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]">
          <div className="absolute left-0 top-0 w-1/2 h-full rounded-full opacity-[0.04]"
            style={{ background: `radial-gradient(ellipse at right center, ${RED}, transparent)`, filter: "blur(60px)" }} />
          <div className="absolute right-0 top-0 w-1/2 h-full rounded-full opacity-[0.04]"
            style={{ background: `radial-gradient(ellipse at left center, ${BLUE}, transparent)`, filter: "blur(60px)" }} />
        </div>
      </div>

      {/* Beating logo */}
      <motion.div className="relative z-10 mb-12 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="relative w-36 h-36 flex items-center justify-center"
          animate={{ scale: [1, 1.14, 0.96, 1.06, 1, 1, 1, 1] }}
          transition={{ duration: 1.1, times: [0, 0.12, 0.22, 0.32, 0.42, 0.55, 0.75, 1], repeat: Infinity, repeatDelay: 0.7 }}>
          <motion.div className="absolute inset-0 rounded-full"
            animate={{ opacity: [0, 0.55, 0.2, 0.45, 0.1, 0, 0, 0] }}
            transition={{ duration: 1.1, times: [0, 0.12, 0.22, 0.32, 0.42, 0.55, 0.75, 1], repeat: Infinity, repeatDelay: 0.7 }}
            style={{ background: `radial-gradient(circle, ${RED} 0%, ${BLUE} 50%, transparent 75%)`, filter: "blur(18px)" }} />
          <ImageWithFallback src={logoSrc} alt="Pulse Project" className="relative w-full h-full object-contain drop-shadow-2xl"
            style={{ filter: `drop-shadow(0 0 16px ${RED}66) drop-shadow(0 0 32px ${BLUE}44)` }} />
        </motion.div>
        {[0, 0.18, 0.36].map((d, i) => (
          <motion.div key={i} className="absolute w-36 h-36 rounded-full"
            style={{ border: `1px solid ${i % 2 === 0 ? RED : BLUE}55` }}
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ duration: 1.0, delay: d, repeat: Infinity, repeatDelay: 1.8 }} />
        ))}
        <motion.div className="text-center mt-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
          <div className="font-['Bricolage_Grotesque',sans-serif] text-xl font-bold text-white tracking-[0.35em]">PULSE</div>
          <div className="font-['Bricolage_Grotesque',sans-serif] text-[10px] font-light text-[#6b7fa8] tracking-[0.55em] mt-0.5">PROJECT</div>
        </motion.div>
      </motion.div>

      <div
        className="relative z-10 text-center max-w-4xl px-6 font-['Bricolage_Grotesque',sans-serif] leading-[1.05] tracking-tight"
        style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}>
          <span className="text-white">Engineering the Future</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 2.72, ease: [0.22, 1, 0.36, 1] }}>
          <span className="grad-text">of Artificial Hearts</span>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 3.0, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-xl px-6 mt-6 text-[#6b7fa8] leading-relaxed"
        style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)" }}>
        Designing a next-generation Total Artificial Heart through biomedical engineering,
        computational modeling, and interdisciplinary innovation at UC Irvine.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 3.3 }}
        className="relative z-10 flex flex-wrap gap-4 mt-10 justify-center">
        <button onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white text-sm font-bold transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg,${RED},${BLUE})`, boxShadow: `0 0 32px ${RED}55` }}>
          Learn More <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={() => document.querySelector("#team")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white text-sm font-semibold border transition-all hover:scale-105 hover:bg-white/[0.06]"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)" }}>
          Meet the Team
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
        onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}>
        <span className="text-[10px] font-mono text-[#6b7fa8] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4 text-[#6b7fa8]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="about" ref={ref} className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
          <SectionLabel text="About" />
          <h2 className="font-['Bricolage_Grotesque',sans-serif] font-bold leading-[1.08] mb-6"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}>
            <WordReveal delay={0} className="text-white">Building the Heart</WordReveal>
            <WordReveal delay={0.2} className="block" style={{ color: BLU_L }}>of Tomorrow</WordReveal>
          </h2>
          <p className="text-[#6b7fa8] leading-relaxed mb-5 text-[0.95rem]">
            Pulse Project is UC Irvine's first and only Biomedical Engineering project team. We take pride
            in building a highly respected organization that provides undergraduate students with meaningful,
            hands-on engineering experience. Our mission is not only to prepare students for successful
            careers in engineering, medicine, and technology — but to contribute to the advancement of
            cardiac engineering through the design of a Total Artificial Heart.
          </p>
          <p className="text-[#6b7fa8] leading-relaxed mb-8 text-[0.95rem]">
            Through our participation in the <span className="text-white font-medium">ISMCS Heart Hackathon Competition</span>,
            Pulse Project is one of only two teams from the United States competing on an international
            stage at the 32nd Annual Meeting of the International Society for Mechanical Circulatory Support.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { Icon: Heart,  label: "Mission-Driven", desc: "Saving lives through engineering",  col: RED  },
              { Icon: Target, label: "Research-First",  desc: "Rigorous computational approach",   col: BLUE },
              { Icon: Users,  label: "Student-Led",     desc: "70+ interdisciplinary engineers",   col: RED  },
              { Icon: Award,  label: "Industry Ready",  desc: "FDA design controls framework",     col: BLUE },
            ].map(({ Icon, label, desc, col }) => (
              <div key={label} className="flex items-start gap-3 p-4 rounded-2xl border cursor-default"
                style={{ background: "rgba(0,4,14,0.7)", borderColor: `${col}22` }}>
                <div className="mt-0.5 p-1.5 rounded-lg" style={{ background: `${col}18` }}>
                  <Icon className="w-4 h-4" style={{ color: col }} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{label}</div>
                  <div className="text-xs text-[#6b7fa8] mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <div className="relative rounded-2xl overflow-hidden bg-[#030915]" style={{ border: `1px solid ${BLUE}30` }}>
            <ImageWithFallback src={leaderSrc} alt="Pulse Project Executive Leadership" className="w-full object-cover" />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, transparent 55%, rgba(0,4,14,0.9) 100%)" }} />
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg,${RED},${BLUE})` }} />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest mb-0.5" style={{ color: BLU_L }}>Executive Leadership</div>
                <div className="text-sm font-semibold text-white">6 Officers · UCI Biomedical Engineering</div>
              </div>
              <div className="rounded-xl px-3 py-2 backdrop-blur-xl flex items-center gap-2"
                style={{ background: "rgba(0,4,14,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: RED }} />
                <span className="text-xs text-white font-medium">Est. 2023</span>
              </div>
            </div>
          </div>
          <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 rounded-2xl px-4 py-3 shadow-2xl"
            style={{ background: "rgba(0,4,14,0.9)", border: `1px solid ${BLUE}25`, backdropFilter: "blur(20px)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: RED }} />
              <span className="text-xs text-white font-medium">Heart Hackathon 2026</span>
            </div>
            <div className="text-[11px] text-[#6b7fa8] mt-1">ISMCS International · 1 of 2 U.S. Teams</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function Stats() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl px-8 py-16 relative overflow-hidden"
          style={{ background: "rgba(0,4,14,0.9)", border: `1px solid ${BLUE}25` }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -left-24 top-0 bottom-0 w-1/2"
              style={{ background: `radial-gradient(ellipse at left center, ${RED}08, transparent 70%)` }} />
            <div className="absolute -right-24 top-0 bottom-0 w-1/2"
              style={{ background: `radial-gradient(ellipse at right center, ${BLUE}08, transparent 70%)` }} />
          </div>
          <Reveal className="text-center mb-12">
            <SectionLabel text="By the Numbers" />
            <h2 className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>Built on rigorous engineering</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}><StatItem {...s} /></Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PUMP SVG RENDER ──────────────────────────────────────────────────────────
// Blade geometry based on image-19 (Ansys 3D) and image-20 (SolidWorks CAD):
//  - Wide-chord, highly-swept propeller/impeller blades (marine propeller shape)
//  - Aggressive backward sweep: LE at root x=-8, LE at tip x=-36 (28px sweep)
//  - Chord at tip ~50px — matches the wide blade visible in image-20
//  - Blood flow particles swirl as they pass through rotor zone (image-19 helical flow)
//  - Particles enter axially → get deflected by spinning blades → straighten at outlet stator

function PumpRenderSVG({ stage }: { stage: 1 | 2 | 3 }) {
  const cfd  = stage === 3;
  const fast = stage >= 2;
  const uid  = `s${stage}`;

  // Blood flow streamlines: each particle swirls up/down as it passes through the rotor zone
  // baseY = axial lane, swirl = how much it deflects at rotor midpoint (mimics blade sweep)
  const FLOW_LINES = [
    { baseY: 148, swirl: 16,  delay: 0.00 },
    { baseY: 160, swirl: -13, delay: 0.28 },
    { baseY: 172, swirl: 18,  delay: 0.55 },
    { baseY: 184, swirl: -11, delay: 0.82 },
    { baseY: 196, swirl: 15,  delay: 0.10 },
    { baseY: 208, swirl: -14, delay: 0.38 },
    { baseY: 220, swirl: 17,  delay: 0.65 },
    { baseY: 232, swirl: -10, delay: 0.92 },
    { baseY: 244, swirl: 14,  delay: 0.20 },
  ];

  const flowDur = cfd ? 1.0 : 1.9;

  return (
    <svg viewBox="0 0 640 420" className="w-full h-full">
      <defs>
        {/* Circumferential CFD: red top (high velocity) → blue bottom (low velocity) */}
        <linearGradient id={`pCFDCirc${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#cc0011" stopOpacity="0.97"/>
          <stop offset="10%"  stopColor="#ff3300" stopOpacity="0.94"/>
          <stop offset="22%"  stopColor="#ff7700"/>
          <stop offset="35%"  stopColor="#ffcc00"/>
          <stop offset="48%"  stopColor="#aaff00"/>
          <stop offset="60%"  stopColor="#00ffaa"/>
          <stop offset="72%"  stopColor="#00aaff"/>
          <stop offset="86%"  stopColor="#0044dd"/>
          <stop offset="100%" stopColor="#001188" stopOpacity="0.93"/>
        </linearGradient>

        {/* Colorbar (Ansys legend: blue 0 → red 3.2 m/s) */}
        <linearGradient id={`pCFDBar${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#001188"/>
          <stop offset="30%"  stopColor="#0044dd"/>
          <stop offset="50%"  stopColor="#00ffaa"/>
          <stop offset="70%"  stopColor="#ffcc00"/>
          <stop offset="100%" stopColor="#cc0011"/>
        </linearGradient>

        {/* Housing fill non-CFD */}
        <linearGradient id={`pHousing${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#1a2a5a"/>
          <stop offset="50%"  stopColor="#0d1840"/>
          <stop offset="100%" stopColor="#040810"/>
        </linearGradient>

        {/* Torpedo */}
        <linearGradient id={`pTorp${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3060b0"/>
          <stop offset="40%"  stopColor="#1a3478"/>
          <stop offset="100%" stopColor="#060c22"/>
        </linearGradient>

        {/* Outlet disc — solid dark red (image-19: solid maroon end disc) */}
        <radialGradient id={`pOutlet${uid}`} cx="40%" cy="36%" r="62%">
          <stop offset="0%"   stopColor="#cc2200"/>
          <stop offset="50%"  stopColor="#881400"/>
          <stop offset="100%" stopColor="#440800"/>
        </radialGradient>

        {/* Rotor blade — blue-steel, lighter toward tip */}
        <linearGradient id={`pBlade${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="#1a3068"/>
          <stop offset="55%"  stopColor="#2a50b8"/>
          <stop offset="100%" stopColor="#4070d8"/>
        </linearGradient>

        {/* Stator vane — darker blue */}
        <linearGradient id={`pVane${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="#0c1838"/>
          <stop offset="100%" stopColor="#1e3478"/>
        </linearGradient>

        {/* Housing front ring face */}
        <radialGradient id={`pFaceInlet${uid}`} cx="38%" cy="36%" r="64%">
          <stop offset="0%"   stopColor="#1a2a5a"/>
          <stop offset="100%" stopColor="#04081a"/>
        </radialGradient>

        {/* Rotor glow */}
        <filter id={`pGlow${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Clip isocontour lines to housing rectangle */}
        <clipPath id={`pClip${uid}`}>
          <rect x="216" y="114" width="232" height="172"/>
        </clipPath>
      </defs>

      {/* Whole pump tilted ~22° isometrically; all centers at y=200 = coaxial */}
      <g transform="rotate(-22, 320, 200)">

        {/* OUTLET DISC — solid dark maroon (image-19: solid red disc at right end) */}
        <g transform="translate(528, 200)">
          <circle r="82" fill={`url(#pOutlet${uid})`} stroke="#991100" strokeWidth="1.8"/>
          {/* 3 wide swept vane blades on disc face (static outlet stator) */}
          {[20, 140, 260].map(a => (
            <g key={a} transform={`rotate(${a})`}>
              {/* Wide swept propeller blade: root 18px chord, tip 48px chord, aggressive LE sweep */}
              <path d="M-4,-18 L-16,-66 Q-10,-74 10,-66 L8,-18 Q0,-12 -4,-18 Z"
                fill={`url(#pVane${uid})`} stroke={`${BLU_L}50`} strokeWidth="0.9"/>
            </g>
          ))}
          <circle r="14" fill="#06091e" stroke={`${BLU_L}55`} strokeWidth="1.5"/>
        </g>

        {/* Housing back end-cap */}
        <ellipse cx="448" cy="200" rx="12" ry="86"
          fill="#05081a" stroke={BLU_L} strokeWidth="0.8" strokeOpacity="0.28"/>

        {/* Housing cylinder body */}
        <rect x="216" y="114" width="232" height="172"
          fill={cfd ? `url(#pCFDCirc${uid})` : `url(#pHousing${uid})`}/>

        {/* CFD isocontour lines clipped to housing */}
        {cfd && (
          <g clipPath={`url(#pClip${uid})`}>
            {[122,135,148,160,172,184,196,208,220,232,244,258,270].map((y, i) => {
              const w1 = i % 2 === 0 ? 3.5 : -3.5;
              const w2 = i % 3 === 0 ? 2.2 : -2.2;
              const t = (y - 114) / 172;
              const col = t < 0.15 ? "#ff4400" : t < 0.30 ? "#ff9900" : t < 0.45 ? "#ffdd00"
                        : t < 0.55 ? "#88ff00" : t < 0.68 ? "#00ffaa" : t < 0.82 ? "#00aaff" : "#0044dd";
              return (
                <path key={y} fill="none"
                  d={`M216,${y} C248,${y+w1} 288,${y-w1} 330,${y+w2} S400,${y-w2} 448,${y}`}
                  stroke={col} strokeWidth="0.75" strokeOpacity="0.48"/>
              );
            })}
          </g>
        )}

        {/* Housing rim lines */}
        <line x1="216" y1="114" x2="448" y2="114" stroke={BLU_L} strokeWidth="2" strokeOpacity="0.52"/>
        <line x1="216" y1="286" x2="448" y2="286" stroke={BLU_L} strokeWidth="0.7" strokeOpacity="0.22"/>

        {/* Blood channel interior dark core */}
        <rect x="216" y="132" width="232" height="136" fill="#030810" fillOpacity="0.78"/>

        {/* ── BLOOD FLOW PARTICLES ──────────────────────────────────────────────
            Each particle enters axially (cx 220), gets swept/deflected by the rotor
            at cx≈320-345 (swirl in Y), then straightened by outlet stator (cx 380+).
            Mimics the helical streamlines visible in image-19's CFD velocity contours. */}
        {FLOW_LINES.map(({ baseY, swirl, delay }, i) => {
          const hot  = baseY < 168 || baseY > 228;
          const warm = baseY < 184 || baseY > 212;
          const pCol = cfd
            ? (hot ? "#ff5500" : warm ? "#ffcc00" : i % 2 === 0 ? "#00ffcc" : "#00aaff")
            : `rgba(91,130,232,${0.42 + (i % 3) * 0.1})`;
          const r = cfd ? 2.8 : 1.8;
          // cx keyframes: enter → pre-rotor → rotor peak → post-rotor → exit
          // cy keyframes: straight → straight → deflected → returning → straight
          return (
            <motion.circle
              key={`fl${uid}${i}`}
              r={r}
              fill={pCol}
              animate={{
                cx: [222, 298, 332, 366, 442],
                cy: [baseY, baseY, baseY + swirl, baseY + swirl * 0.3, baseY],
                opacity: [0, 0.92, 0.92, 0.88, 0],
              }}
              transition={{
                duration: flowDur + i * 0.06,
                delay: delay,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.34, 0.50, 0.64, 1],
              }}
            />
          );
        })}

        {/* ── ROTOR — spinning impeller, coaxial at (330, 200) ─────────────────
            Blade geometry from image-19 (Ansys 3D) and image-20 (SolidWorks):
            - Wide-chord propeller/marine-impeller blades
            - Root chord 18px, tip chord ~50px
            - Aggressive backward LE sweep: root x=-8, tip x=-36 (28px sweep)
            - This matches the swept-back blade profile in image-20 top assembly */}
        <g transform="translate(330, 200)">
          <g className={fast ? "rotor-fast" : "rotor-spin"} filter={`url(#pGlow${uid})`}>
            {[0, 120, 240].map(a => (
              <g key={a} transform={`rotate(${a})`}>
                {/* Propeller blade: wide chord, aggressive backward sweep at LE, slight forward TE */}
                <path d="M-5,-18 C-9,-36 -18,-56 -22,-72 Q-14,-80 10,-72 C6,-56 4,-36 5,-18 Q0,-12 -5,-18 Z"
                  fill={`url(#pBlade${uid})`} stroke={BLU_L} strokeWidth="1.2" strokeOpacity="0.9"/>
              </g>
            ))}
            <circle r="14" fill="#0a1332" stroke={BLU_L} strokeWidth="2.2"/>
          </g>
        </g>

        {/* TORPEDO — central bullet shaft */}
        <path d="M76,200 Q108,185 216,178 L216,222 Q108,215 76,200 Z" fill={`url(#pTorp${uid})`}/>
        <rect x="216" y="178" width="232" height="44" fill={`url(#pTorp${uid})`}/>
        <line x1="82" y1="188" x2="448" y2="188" stroke={BLU_L} strokeWidth="1" strokeOpacity="0.28"/>
        <path d="M448,178 Q482,182 532,200 Q482,218 448,222 L448,178 Z" fill={`url(#pTorp${uid})`}/>

        {/* Housing front cap ring (inlet end) */}
        <ellipse cx="216" cy="200" rx="13" ry="86"
          fill={`url(#pFaceInlet${uid})`} stroke={BLU_L} strokeWidth="2" strokeOpacity="0.68"/>
        <ellipse cx="216" cy="200" rx="8" ry="70"
          fill="#030810" stroke={`${BLU_L}44`} strokeWidth="0.5"/>

        {/* INLET DISC — thin white circle outline (image-19: transparent ring at inlet end) */}
        <g transform="translate(108, 200)">
          <circle r="92" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5"/>
          <circle r="74" fill="none" stroke={`${BLU_L}38`} strokeWidth="0.8"/>
          {/* 3 wide swept inlet stator vanes (same propeller blade shape as rotor) */}
          {[20, 140, 260].map(a => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M-4,-18 L-18,-76 Q-12,-84 10,-76 L8,-18 Q0,-12 -4,-18 Z"
                fill={`url(#pVane${uid})`} stroke={BLU_L} strokeWidth="1.3" strokeOpacity="0.72"/>
            </g>
          ))}
          <circle r="14" fill="#0c1a3a" stroke={BLU_L} strokeWidth="1.5" strokeOpacity="0.6"/>
        </g>

      </g>

      {/* CFD velocity colorbar */}
      {cfd && (
        <g>
          <text x="108" y="392" fontSize="8.5" fill={BLU_L}
            fontFamily="'JetBrains Mono',monospace" fillOpacity="0.52">0 m/s</text>
          <rect x="134" y="382" width="190" height="7" rx="2.5"
            fill={`url(#pCFDBar${uid})`} opacity="0.9"/>
          <text x="328" y="392" fontSize="8.5" fill={RED}
            fontFamily="'JetBrains Mono',monospace" fillOpacity="0.52">3.2 m/s</text>
        </g>
      )}

      <text x="320" y={cfd ? 372 : 388} textAnchor="middle" fontSize="9" fill={BLU_L}
        fontFamily="'JetBrains Mono',monospace" fillOpacity="0.28" letterSpacing="3.5">
        {cfd ? "VELOCITY FIELD — ANSYS FLUENT" : "PULSE TAH — AXIAL FLOW PUMP"}
      </text>
    </svg>
  );
}

// ─── TAH Scroll Visualizer ────────────────────────────────────────────────────

function HeartVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const s1Opacity = useTransform(scrollYProgress, [0, 0.26, 0.42], [1, 1, 0]);
  const s2Opacity = useTransform(scrollYProgress, [0.26, 0.44, 0.60, 0.76], [0, 1, 1, 0]);
  const s3Opacity = useTransform(scrollYProgress, [0.60, 0.78], [0, 1]);
  const cardsOpacity = useTransform(scrollYProgress, [0.06, 0.24], [0, 1]);
  const cardsY       = useTransform(scrollYProgress, [0.06, 0.24], [20, 0]);
  const zoomScale     = useTransform(scrollYProgress, [0.30, 0.58], [1, 2.4]);
  const bubbleOpacity = useTransform(scrollYProgress, [0.44, 0.60], [0, 1]);

  return (
    <div id="heart" ref={containerRef} style={{ height: "280vh", position: "relative" }}>
      <div className="sticky top-0 h-screen flex items-center"
        style={{ background: "#000814", overflow: "hidden" }}>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.07]"
            style={{ background: `radial-gradient(ellipse, ${RED}, transparent)`, filter: "blur(80px)" }} />
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.07]"
            style={{ background: `radial-gradient(ellipse, ${BLUE}, transparent)`, filter: "blur(80px)" }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <div className="relative flex-shrink-0 w-full lg:w-[54%] rounded-2xl overflow-hidden"
              style={{ aspectRatio: "16/10", background: "#080f1e", border: `1px solid ${BLUE}28` }}>

              <motion.div className="absolute inset-0" style={{ opacity: s1Opacity }}>
                <PumpRenderSVG stage={1} />
                <div className="absolute bottom-3 left-3 flex gap-2 pointer-events-none">
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-lg text-white"
                    style={{ background: `${BLUE}cc`, backdropFilter: "blur(8px)" }}>Exterior View</span>
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-lg text-white"
                    style={{ background: "rgba(0,4,14,0.8)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>Axial Flow Pump</span>
                </div>
              </motion.div>

              <motion.div className="absolute inset-0" style={{ opacity: s2Opacity }}>
                <motion.div className="w-full h-full" style={{ scale: zoomScale, transformOrigin: "center center" }}>
                  <PumpRenderSVG stage={2} />
                </motion.div>
                <motion.div className="absolute top-5 right-5 pointer-events-none" style={{ opacity: bubbleOpacity }}>
                  <div className="rounded-2xl p-3.5 max-w-[172px]"
                    style={{ background: "rgba(4,6,20,0.94)", border: `1px solid ${RED}45`, backdropFilter: "blur(14px)" }}>
                    <div className="text-[9px] font-mono uppercase tracking-widest mb-1.5" style={{ color: RED_L }}>Electrical Integration</div>
                    <div className="text-white font-bold text-sm leading-tight mb-1.5">Brushless Motor Drive</div>
                    <div className="text-[#6b7fa8] text-[10px] leading-relaxed">High-speed rotor at ~3,000 RPM. Wireless power via transcutaneous energy transfer system.</div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: RED }} />
                      <span className="text-[10px] font-mono" style={{ color: RED_L }}>~3,000 RPM</span>
                    </div>
                  </div>
                  <svg className="absolute top-full left-1/2 -translate-x-1/2" viewBox="0 0 60 40" width="60" height="40" style={{ overflow: "visible" }}>
                    <path d="M30,0 Q20,20 2,38" stroke={RED} strokeWidth="1.2" fill="none" strokeOpacity="0.65" strokeDasharray="3 2"/>
                    <circle cx="2" cy="38" r="2.5" fill={RED} fillOpacity="0.75"/>
                  </svg>
                </motion.div>
                <div className="absolute bottom-3 left-3 pointer-events-none">
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-lg text-white"
                    style={{ background: `${RED}bb`, backdropFilter: "blur(8px)" }}>ROTOR — Spinning</span>
                </div>
              </motion.div>

              <motion.div className="absolute inset-0" style={{ opacity: s3Opacity }}>
                <PumpRenderSVG stage={3} />
                <div className="absolute bottom-3 left-3 pointer-events-none">
                  <span className="font-mono text-[10px] px-2.5 py-1 rounded-lg text-white"
                    style={{ background: `${BLU_L}cc`, backdropFilter: "blur(8px)" }}>CFD Velocity Field</span>
                </div>
              </motion.div>

              <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: `${BLU_L}30` }} />)}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 w-full lg:w-auto">
              <div>
                <SectionLabel text="Design" />
                <WordReveal
                  delay={0}
                  className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white mb-3"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)" }}
                >
                  Inside the Pulse TAH
                </WordReveal>
              </div>
              <div className="p-4 rounded-2xl" style={{ background: "rgba(0,4,14,0.85)", border: `1px solid ${BLUE}25` }}>
                <p className="text-[#6b7fa8] text-sm leading-relaxed">
                  Our Total Artificial Heart uses an <span className="text-white font-medium">axial flow pump</span> design — a
                  rotating impeller drives continuous blood flow while upstream and downstream stator vane sets straighten the flow.
                </p>
              </div>

              <motion.div className="flex flex-col gap-3" style={{ opacity: cardsOpacity, y: cardsY }}>
                {CFD_STAGES.map(({ label, body, col }, i) => (
                  <div key={label} className="flex gap-3 p-4 rounded-2xl"
                    style={{ background: "rgba(0,4,14,0.85)", border: `1px solid ${col}22` }}>
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: `${col}18`, color: col, border: `1px solid ${col}30`, fontFamily: "'Bricolage Grotesque',sans-serif" }}>
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-sm mb-0.5">{label}</div>
                      <p className="text-[#6b7fa8] text-xs leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div className="grid grid-cols-3 gap-2" style={{ opacity: cardsOpacity }}>
                {[
                  { v: "5 L/min", l: "Cardiac Output", c: BLUE },
                  { v: "~3k RPM", l: "Rotor Speed",    c: RED  },
                  { v: "42%+",    l: "Efficiency",     c: BLUE },
                ].map(({ v, l, c }) => (
                  <div key={l} className="text-center p-3 rounded-xl"
                    style={{ background: `${c}10`, border: `1px solid ${c}20` }}>
                    <div className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white">{v}</div>
                    <div className="text-[10px] font-mono text-[#6b7fa8] uppercase tracking-wider mt-0.5">{l}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4 opacity-30">
            <div className="h-px w-8" style={{ background: `linear-gradient(90deg,transparent,${BLU_L})` }} />
            <span className="text-[10px] font-mono text-[#6b7fa8] uppercase tracking-[0.2em]">Scroll to explore all stages</span>
            <div className="h-px w-8" style={{ background: `linear-gradient(90deg,${BLU_L},transparent)` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Research ─────────────────────────────────────────────────────────────────

function Research() {
  return (
    <section id="research" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel text="Research" />
          <WordReveal
            delay={0}
            className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            Four subteams
          </WordReveal>
          <p className="text-[#6b7fa8] max-w-lg mx-auto text-[0.95rem] leading-relaxed">
            Electrical, mechanical, research, and business — every discipline engineered with the same rigor as commercial medical devices.
          </p>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESEARCH_AREAS.map(({ Icon, abbr, title, description, from, to, glow }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
                style={{ background: "rgba(0,4,14,0.85)", border: `1px solid ${from}18` }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 40px ${glow}`; e.currentTarget.style.borderColor = `${from}40`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = `${from}18`; }}>
                <div className="flex items-start justify-between mb-5">
                  <div className="p-2.5 rounded-xl" style={{ background: `${from}18`, border: `1px solid ${from}30` }}>
                    <Icon className="w-5 h-5" style={{ color: from }} />
                  </div>
                  <span className="font-mono text-xs font-medium px-2 py-1 rounded-lg"
                    style={{ background: `${from}14`, color: from }}>{abbr}</span>
                </div>
                <h3 className="font-['Bricolage_Grotesque',sans-serif] text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-[#6b7fa8] text-sm leading-relaxed">{description}</p>
                <div className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg,${from},${to},transparent)` }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function Timeline() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel text="Timeline" />
          <WordReveal
            delay={0}
            className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            Our journey
          </WordReveal>
          <p className="text-[#6b7fa8] text-[0.95rem] max-w-lg mx-auto leading-relaxed">
            From a founding idea at UCI to competing on the international stage at ISMCS 2026.
          </p>
        </Reveal>
        <Reveal className="mb-14">
          <div className="relative rounded-2xl p-6 overflow-hidden"
            style={{ background: "rgba(0,4,14,0.9)", border: `1px solid ${RED}30` }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 80% 100% at 0% 50%, ${RED}0c, transparent 60%)` }} />
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="flex-shrink-0 rounded-xl px-4 py-3 text-center"
                style={{ background: `linear-gradient(135deg,${RED},${BLUE})` }}>
                <div className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-lg leading-none">ISMCS</div>
                <div className="text-[10px] text-white/80 font-mono tracking-widest mt-0.5">2026</div>
              </div>
              <div>
                <div className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-lg mb-1">Path to Grand Finals — Heart Hackathon</div>
                <p className="text-[#6b7fa8] text-sm leading-relaxed">
                  Pulse Project competes at the <span className="text-white">32nd Annual Meeting of the ISMCS</span> — one of only two U.S. teams among an international field. Grand Finals through Oct 2026.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="relative">
          <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-px"
            style={{ background: `linear-gradient(180deg,${RED} 0%,${BLUE} 55%,${BLUE}44 75%,transparent 100%)`, transform: "translateX(-50%)" }} />
          <div className="space-y-0">
            {TIMELINE_ITEMS.map(({ date, title, desc, future }, i) => {
              const isRight = i % 2 === 0;
              const col = future ? (i % 2 === 0 ? BLU_L : RED_L) : (i % 2 === 0 ? RED : BLUE);
              return (
                <Reveal key={title} delay={i * 0.06}>
                  <div className={`relative flex items-start gap-6 md:gap-0 pb-10 ${isRight ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className="absolute left-0 md:left-1/2 w-3.5 h-3.5 rounded-full border-2 -translate-x-[3px] md:-translate-x-1/2 mt-1.5 z-10"
                      style={{ borderColor: col, background: future ? "transparent" : "#000a1e",
                        boxShadow: `0 0 ${future ? 8 : 12}px ${col}${future ? "55" : "88"}`, borderStyle: future ? "dashed" : "solid" }} />
                    <div className={`ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${isRight ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                      <div className="flex items-center gap-2 mb-1" style={{ justifyContent: isRight ? "flex-end" : "flex-start" }}>
                        <div className="text-[11px] font-mono uppercase tracking-widest" style={{ color: col }}>{date}</div>
                        {future && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                          style={{ background: `${col}18`, color: col, border: `1px solid ${col}30` }}>UPCOMING</span>}
                      </div>
                      <div className={`font-['Bricolage_Grotesque',sans-serif] font-bold text-lg mb-1.5 ${future ? "text-white/70" : "text-white"}`}>{title}</div>
                      <div className={`text-sm leading-relaxed ${future ? "text-[#6b7fa8]/70" : "text-[#6b7fa8]"}`}>{desc}</div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────

function Team() {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section id="team" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <SectionLabel text="Team" />
          <WordReveal
            delay={0}
            className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white mb-4"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
          >
            The engineers behind Pulse
          </WordReveal>
          <p className="text-[#6b7fa8] max-w-lg mx-auto text-[0.95rem]">
            70+ undergraduate engineers across four subteams, led by a dedicated executive board and team of advisors.
          </p>
        </Reveal>

        <Reveal className="mb-4">
          <div className="text-xs font-mono text-[#6b7fa8] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: `linear-gradient(90deg,${BLUE},transparent)` }} />
            Advisors
          </div>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {ADVISORS.map(({ name, role, sub, bgX, bgY }, i) => {
            const col = i === 0 ? BLUE : i % 2 === 0 ? RED : BLU_L;
            return (
              <Reveal key={name} delay={i * 0.07}>
                <div className="rounded-2xl p-5 text-center transition-all hover:-translate-y-1"
                  style={{ background: "rgba(0,4,14,0.88)", border: `1px solid ${col}20` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${col}44`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${col}20`; }}>
                  <div className="flex justify-center mb-3">
                    <FaceAvatar src={advisorFacesSrc} bgX={bgX} bgY={bgY} col={col} size={72} />
                  </div>
                  <div className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-sm leading-snug mb-0.5">{name}</div>
                  <div className="text-[11px] font-semibold mb-1" style={{ color: col }}>{role}</div>
                  <div className="text-[10px] text-[#6b7fa8] leading-snug">{sub}</div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mb-4">
          <div className="text-xs font-mono text-[#6b7fa8] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: `linear-gradient(90deg,${RED},transparent)` }} />
            Executive Leadership
          </div>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {LEADERSHIP.map(({ name, role, side, bgX, bgY }, i) => {
            const col  = side === "red" ? RED : BLUE;
            const colL = side === "red" ? RED_L : BLU_L;
            return (
              <Reveal key={name} delay={i * 0.05}>
                <div className="relative group rounded-2xl p-4 transition-all duration-300 cursor-default hover:-translate-y-1 text-center"
                  style={{ background: "rgba(0,4,14,0.88)", border: `1px solid ${col}18` }}
                  onMouseEnter={() => setHovered(name)} onMouseLeave={() => setHovered(null)}>
                  <div className="flex justify-center mb-3">
                    <FaceAvatar src={leaderFacesSrc} bgX={bgX} bgY={bgY} col={col} size={64} />
                  </div>
                  <div className="font-['Bricolage_Grotesque',sans-serif] font-semibold text-white text-xs mb-0.5 leading-snug">{name}</div>
                  <div className="text-[10px] font-medium" style={{ color: colL }}>{role}</div>
                  {hovered === name && (
                    <motion.div className="mt-2" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                      <button className="inline-flex items-center gap-1 text-[10px] text-[#6b7fa8] hover:text-white transition-colors">
                        <Linkedin className="w-3 h-3" /> LinkedIn
                      </button>
                    </motion.div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mb-4">
          <div className="text-xs font-mono text-[#6b7fa8] uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <div className="w-8 h-px" style={{ background: `linear-gradient(90deg,${BLUE},transparent)` }} />
            Subteam Leads
          </div>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {SUBTEAM_LEADS.map(({ name, role }, i) => {
            const col = [RED, BLUE, BLU_L, RED_L][i % 4];
            return (
              <Reveal key={name} delay={i * 0.03}>
                <div className="group p-3.5 rounded-xl transition-all duration-200 cursor-default hover:-translate-y-0.5"
                  style={{ background: "rgba(0,4,14,0.75)", border: `1px solid ${col}18` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${col}40`; e.currentTarget.style.background = "rgba(0,4,14,0.95)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${col}18`; e.currentTarget.style.background = "rgba(0,4,14,0.75)"; }}>
                  <div className="w-1.5 h-1.5 rounded-full mb-2.5" style={{ background: col }} />
                  <div className="font-['Bricolage_Grotesque',sans-serif] font-semibold text-white text-xs mb-0.5 leading-snug">{name}</div>
                  <div className="text-[10px] text-[#6b7fa8] leading-snug">{role}</div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Sponsors ─────────────────────────────────────────────────────────────────

function Sponsors() {
  const marqueeItems = [...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS];
  return (
    <section id="sponsors" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <SectionLabel text="Sponsors & Partners" />
          <WordReveal
            delay={0}
            className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white mb-3"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
          >
            Supported by industry leaders
          </WordReveal>
          <p className="text-[#6b7fa8] text-sm max-w-md mx-auto">
            Our sponsors provide tools, mentorship, and resources that make our work possible.
          </p>
        </Reveal>
        <div className="relative overflow-hidden mb-14">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg,#000a1e,transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{ background: "linear-gradient(270deg,#000a1e,transparent)" }} />
          <div className="flex items-center gap-8 w-max" style={{ animation: "marquee 18s linear infinite" }}>
            {marqueeItems.map((name, i) => (
              <div key={`${name}-${i}`}
                className="px-7 py-3.5 rounded-2xl whitespace-nowrap font-['Bricolage_Grotesque',sans-serif] font-semibold text-sm cursor-default select-none text-[#4a5f80] hover:text-white transition-colors"
                style={{ background: "rgba(0,4,14,0.85)", border: `1px solid ${BLUE}15` }}>
                {name}
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-14">
          {Object.entries(SPONSOR_BLURBS).map(([name, blurb], i) => (
            <Reveal key={name} delay={i * 0.07}>
              <div className="p-5 rounded-2xl"
                style={{ background: "rgba(0,4,14,0.85)", border: `1px solid ${i % 2 === 0 ? BLUE : RED}20` }}>
                <div className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white mb-1.5">{name}</div>
                <p className="text-[#6b7fa8] text-sm leading-relaxed">{blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="relative rounded-2xl p-8 overflow-hidden"
            style={{ background: "rgba(0,4,14,0.9)", border: `1px solid ${BLUE}25` }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse 60% 80% at 100% 50%, ${BLUE}08, transparent 70%)` }} />
            <div className="text-4xl font-['Bricolage_Grotesque',sans-serif] leading-none mb-4" style={{ color: RED }}>"</div>
            <p className="text-white text-base md:text-lg leading-relaxed italic max-w-3xl mb-4">
              Your contribution directly funds the tools, materials, and experiences that give undergraduate students
              real, hands-on experience designing and building a total artificial heart.
            </p>
            <div className="text-xs font-mono text-[#6b7fa8] uppercase tracking-widest">— Pulse Project</div>
          </div>
        </Reveal>
        <Reveal className="mt-10">
          <div className="rounded-2xl p-6 text-center"
            style={{ background: `linear-gradient(135deg,${RED}0a,${BLUE}0a)`, border: `1px solid ${BLUE}20` }}>
            <p className="text-[#6b7fa8] text-sm leading-relaxed mb-4 max-w-xl mx-auto">
              We welcome organizations interested in advancing cardiac technology. Get in touch to explore how we can work together.
            </p>
            <button onClick={() => document.querySelector("#join")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ color: RED_L, border: `1px solid ${RED}33`, background: `${RED}0a` }}>
              Become a sponsor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Join Us ──────────────────────────────────────────────────────────────────

function JoinUs() {
  return (
    <section id="join" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden px-8 py-20 md:py-28 text-center"
          style={{ background: "rgba(0,4,14,0.95)", border: `1px solid ${BLUE}22` }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -bottom-1/2 left-0 right-1/2 h-full"
              style={{ background: `radial-gradient(ellipse at bottom left, ${RED}10, transparent 65%)` }} />
            <div className="absolute -bottom-1/2 left-1/2 right-0 h-full"
              style={{ background: `radial-gradient(ellipse at bottom right, ${BLUE}10, transparent 65%)` }} />
          </div>
          <Reveal>
            <SectionLabel text="Get Involved" />
            <WordReveal
              delay={0}
              className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white mb-5"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}
            >
              Join the mission
            </WordReveal>
            <p className="text-[#6b7fa8] max-w-xl mx-auto mb-12 leading-relaxed text-[0.95rem]">
              Whether you are a student engineer, faculty mentor, industry collaborator, or forward-thinking sponsor — there is a place for you in Pulse Project.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16">
              {[
                { Icon: Users, title: "Join the Team",    desc: "Open to all UCI students. No experience required — just curiosity.", col: RED,  href: "mailto:pulse@uci.edu?subject=Join the Team" },
                { Icon: Zap,   title: "Become a Sponsor", desc: "Partner with us and invest in the next generation of MedTech.",     col: BLUE, href: "mailto:pulse@uci.edu?subject=Sponsorship" },
                { Icon: Mail,  title: "Contact Us",       desc: "Questions about research, collaboration, or media inquiries.",      col: RED,  href: "mailto:pulse@uci.edu" },
              ].map(({ Icon, title, desc, col, href }) => (
                <a key={title} href={href}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all hover:-translate-y-1"
                  style={{ background: `${col}08`, border: `1px solid ${col}20`, textDecoration: "none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${col}44`; (e.currentTarget as HTMLElement).style.background = `${col}12`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${col}20`; (e.currentTarget as HTMLElement).style.background = `${col}08`; }}>
                  <div className="p-3 rounded-xl" style={{ background: `${col}18` }}>
                    <Icon className="w-5 h-5" style={{ color: col }} />
                  </div>
                  <div className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white">{title}</div>
                  <div className="text-[#6b7fa8] text-xs leading-relaxed text-center">{desc}</div>
                </a>
              ))}
            </div>
          </Reveal>

          <div className="relative max-w-2xl mx-auto h-10">
            <svg viewBox="0 0 500 40" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ecgLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="transparent"/>
                  <stop offset="20%"  stopColor={RED}/>
                  <stop offset="50%"  stopColor={RED_L}/>
                  <stop offset="65%"  stopColor={BLU_L}/>
                  <stop offset="85%"  stopColor={BLUE}/>
                  <stop offset="100%" stopColor="transparent"/>
                </linearGradient>
              </defs>
              <motion.path
                d="M0,20 L95,20 L108,14 L120,26 L127,4 L135,36 L143,20 L158,10 L170,20 L250,20 L263,14 L275,26 L282,4 L290,36 L298,20 L313,10 L325,20 L500,20"
                stroke="url(#ecgLine)" strokeWidth="1.8" fill="none"
                strokeDasharray="700"
                animate={{ strokeDashoffset: [700, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5, ease: "linear" }}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 px-6" style={{ borderTop: `1px solid ${BLUE}18` }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                <ImageWithFallback src={logoSrc} alt="Pulse Project logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-sm tracking-widest">PULSE PROJECT</span>
            </div>
            <p className="text-[#6b7fa8] text-sm leading-relaxed max-w-xs">
              A student-led initiative at UC Irvine engineering the next-generation Total Artificial Heart.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { Icon: Mail,     href: "mailto:pulse@uci.edu", label: "Email"   },
                { Icon: Linkedin, href: "#",                    label: "LinkedIn" },
                { Icon: Globe,    href: "#",                    label: "Website"  },
                { Icon: BookOpen, href: "#",                    label: "Research" },
              ].map(({ Icon, href, label }, i) => (
                <a key={label} href={href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#6b7fa8] hover:text-white transition-all hover:scale-110"
                  style={{ background: `${i % 2 === 0 ? RED : BLUE}0c`, border: `1px solid ${i % 2 === 0 ? RED : BLUE}20` }}
                  aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Project",  links: ["About", "Research", "Timeline", "Publications"]    },
            { title: "Connect",  links: ["Join the Team", "Sponsorship", "Contact Us", "UC Irvine"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <div className="text-xs font-mono text-[#6b7fa8] uppercase tracking-widest mb-4">{title}</div>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}><a href="#" className="text-sm text-[#6b7fa8] hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6" style={{ borderTop: `1px solid ${BLUE}12` }}>
          <div className="h-px mb-4" style={{ background: `linear-gradient(90deg,${RED},${BLUE})` }} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="text-xs text-[#4a5f80]">© 2024 Pulse Project · University of California, Irvine</div>
            <div className="text-xs text-[#4a5f80]">Biomedical Engineering · Henry Samueli School of Engineering</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes pumpRotor { to { transform: rotate(360deg); } }
        .rotor-spin {
          animation: pumpRotor 2.2s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .rotor-fast {
          animation: pumpRotor 0.9s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        ::-webkit-scrollbar { width: 0; background: transparent; }
        ::selection { background: ${RED}55; color: #fff; }
        .grad-text {
          background: linear-gradient(135deg, ${RED} 0%, ${BLU_L} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-suffix {
          background: linear-gradient(135deg, ${RED}, ${BLU_L});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* overflow-x:clip instead of hidden — clip doesn't create a scroll container, so position:sticky works on descendants */}
      <div className="relative bg-[#000a1e] text-[#e8f0ff]" style={{ overflowX: "clip" }}>
        <ParticleCanvas />
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: `radial-gradient(circle, ${RED}, transparent)`, filter: "blur(90px)" }} />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ background: `radial-gradient(circle, ${BLUE}, transparent)`, filter: "blur(90px)" }} />
        </div>
        <div className="relative z-10">
          <Navigation />
          <Hero />
          <About />
          <Stats />
          <HeartVisual />
          <Research />
          <Timeline />
          <Team />
          <Sponsors />
          <JoinUs />
          <Footer />
        </div>
      </div>
    </>
  );
}
