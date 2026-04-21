'use client';

import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════ */
const T = {
  bg:      '#04040a',
  surface: '#0a0a12',
  card:    '#0f0f1a',
  border:  'rgba(255,255,255,0.06)',
  lime:    '#c6ff47',
  cyan:    '#47e5ff',
  coral:   '#ff5757',
  text:    '#f0efe8',
  muted:   'rgba(240,239,232,0.55)',
  faint:   'rgba(240,239,232,0.12)',
};

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const NAV_LINKS = ['Services', 'Work', 'Process', 'Experience', 'Contact'];

const STATS = [
  { num: 8,  suffix: '+', label: 'Years of\nExperience' },
  { num: 50, suffix: '+', label: 'Projects\nDelivered' },
  { num: 3,  suffix: '',  label: 'Countries\nServed' },
  { num: 99, suffix: '%', label: 'Client\nSatisfaction' },
];

const TECH_MARQUEE = [
  'C# · .NET 8', 'ASP.NET Core', 'React', 'Next.js', 'TypeScript', 'Azure',
  'SQL Server', 'Redis', 'Docker', 'SignalR', 'PostgreSQL', 'Microservices',
  'Entity Framework', 'CI/CD', 'REST APIs', 'Azure DevOps',
];

const SERVICES = [
  {
    num: '01',
    title: 'Custom Software & Web Apps',
    desc: 'I build the software your business actually needs - from scratch. Websites, internal tools, customer portals, SaaS platforms. If you can describe it, I can build it reliably and on time.',
    tags: ['C# / .NET 8', 'ASP.NET Core', 'React', 'Next.js', 'REST APIs'],
    color: T.lime,
  },
  {
    num: '02',
    title: 'Business Systems & ERP',
    desc: 'Replace spreadsheets and disconnected tools with one system that runs your business. Inventory, HR, finance, payroll, reporting - all unified and automated for your team.',
    tags: ['ERP / CRM', 'Payroll Systems', 'Workflow Automation', 'Reporting', 'SQL Server'],
    color: T.cyan,
  },
  {
    num: '03',
    title: 'Cloud Hosting & DevOps',
    desc: 'Move your product to the cloud or keep it running faster and cheaper. I handle Azure setup, deployments, automated pipelines, and monitoring so you never worry about downtime.',
    tags: ['Microsoft Azure', 'Azure DevOps', 'Docker', 'CI/CD Pipelines', 'Azure Functions'],
    color: T.coral,
  },
  {
    num: '04',
    title: 'Database Design & Reporting',
    desc: 'Your data should answer questions, not create them. I design fast, reliable databases and build reports and dashboards that give you real visibility into your business.',
    tags: ['SQL Server', 'PostgreSQL', 'Redis', 'SSRS Reports', 'ETL Pipelines'],
    color: '#a78bfa',
  },
  {
    num: '05',
    title: 'WordPress Development',
    desc: 'Professional WordPress websites built properly - custom themes, fast load times, SEO-ready structure, and easy for your team to manage. No bloated page builders or cookie-cutter templates.',
    tags: ['WordPress', 'Custom Themes', 'PHP', 'SEO Optimisation', 'Performance'],
    color: '#f59e0b',
  },
  {
    num: '06',
    title: 'QA Testing & Tech Support',
    desc: 'Shipping broken software costs more than testing it first. I provide thorough QA testing, bug fixing, and ongoing technical support to keep your product stable and your users happy.',
    tags: ['Software Testing', 'QA & Bug Fixing', 'Performance Testing', 'Tech Support', 'Code Review'],
    color: '#34d399',
  },
];

const PROJECTS = [
  {
    num: '01',
    title: 'Canadian Payroll & Tax Platform',
    category: 'SaaS · FinTech · Compliance',
    impact: '80% faster processing',
    desc: 'End-to-end payroll automation serving 500+ Canadian businesses. Full CRA compliance across all provinces, automated T4/T4A/T5 generation, and a bank reconciliation engine that eliminated manual errors entirely.',
    outcomes: ['80% reduction in processing time', 'T4/T5/T4A automated generation', 'Multi-province tax compliance', 'Bank reconciliation engine', 'PDF/CSV/Excel import pipeline'],
    tech: ['C#', 'ASP.NET Core 7', 'SQL Server', 'Azure', 'React'],
    color: T.lime,
    gradient: 'linear-gradient(135deg, rgba(198,255,71,0.07) 0%, transparent 65%)',
    liveUrl: null,
  },
  {
    num: '02',
    title: 'HR & Payroll Management System',
    category: 'ERP · Retail · Logistics · Manufacturing',
    impact: '99.9% uptime SLA',
    desc: 'A fully custom HR & Payroll Management System built to replace scattered spreadsheets and disconnected tools. Inventory, HR, finance, and analytics unified into one platform - serving clients across retail, manufacturing, and logistics.',
    outcomes: ['Real-time analytics dashboard', 'Inventory & HR in one system', 'Role-based access control', '99.9% uptime maintained', 'Integrated third-party APIs'],
    tech: ['C#', '.NET', 'ASP.NET MVC', 'SQL Server', 'Azure DevOps'],
    color: T.cyan,
    gradient: 'linear-gradient(135deg, rgba(71,229,255,0.07) 0%, transparent 65%)',
    liveUrl: null,
  },
  {
    num: '03',
    title: 'Digital Media CMS - Express News',
    category: 'Media · High-Traffic · CMS',
    impact: '3M+ daily users',
    desc: "Backend publishing infrastructure for one of Pakistan's largest news networks. Sub-100ms API response times under 3M+ concurrent daily readers with real-time push via SignalR.",
    outcomes: ['3M+ daily active users', 'Sub-100ms API responses', 'Live breaking news pipeline', 'SEO-optimized delivery', 'Multi-author workflow'],
    tech: ['ASP.NET Core', 'C#', 'SQL Server', 'SignalR', 'Azure CDN', 'Redis'],
    color: T.coral,
    gradient: 'linear-gradient(135deg, rgba(255,87,87,0.07) 0%, transparent 65%)',
    liveUrl: null,
  },
  {
    num: '04',
    title: 'WordPress Built News & Media Website',
    category: 'WordPress · Media · Publishing',
    impact: 'Live & scaling',
    desc: 'Full WordPress website built for a business news and media publication - Freedom Business Daily. Custom theme architecture, fast load times, SEO-first content structure, and a smooth editorial workflow for a growing team of writers and editors.',
    outcomes: ['Custom WordPress theme build', 'SEO-optimised site architecture', 'Editorial multi-author workflow', 'Performance-tuned delivery', 'Responsive across all devices'],
    tech: ['WordPress', 'PHP', 'Custom Theme', 'SEO', 'Performance'],
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.07) 0%, transparent 65%)',
    liveUrl: 'https://freedombusinessdaily.com/',
  },
  {
    num: '05',
    title: 'Completely Customised Next.JS Website',
    category: 'Custom Dev · Agency · Lead Generation',
    impact: 'Live production site',
    desc: 'A fully hand-coded corporate website for 110 Solutions, an Australian software agency. No WordPress, no page builders - every line custom written for speed, brand credibility, and converting visitors into leads.',
    outcomes: ['Fully custom design and build', 'No CMS or page-builder dependencies', 'Optimised for lead conversion', 'Cross-browser and device tested', 'Production-ready and maintained'],
    tech: ['ASP.NET', 'C#', 'HTML/CSS', 'JavaScript', 'Custom UI'],
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.07) 0%, transparent 65%)',
    liveUrl: 'https://110solutions.com.au/index.aspx#',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Discovery',
    desc: 'Deep-dive into your business goals, technical constraints, and user needs. I ask the questions most developers skip - so nothing surprises us at launch.',
  },
  {
    step: '02',
    title: 'Architecture',
    desc: 'System design, tech stack decisions, and a clear roadmap before a single line of production code is written. Scalability and maintainability by design.',
  },
  {
    step: '03',
    title: 'Build & Iterate',
    desc: 'Agile delivery with regular demos and feedback loops. You see progress weekly - no black boxes, no surprises.',
  },
  {
    step: '04',
    title: 'Deploy & Support',
    desc: 'Production launch with CI/CD pipelines, monitoring, and documentation. I stay engaged after go-live so you are never left stranded.',
  },
];

const EXPERIENCE = [
  {
    role: 'Senior .NET Developer',
    company: 'Waterworks Agency LLC',
    location: 'Texas, USA · Remote',
    period: 'Oct 2023 to Present',
    badge: 'Now',
    desc: 'Leading architecture and development of enterprise-grade web applications. Mentoring 4 developers, defining coding standards, and driving modern .NET adoption across the stack.',
    color: T.lime,
  },
  {
    role: '.NET Full Stack Developer',
    company: '110 Solutions',
    location: 'Karachi, Pakistan',
    period: 'Dec 2021 to Present',
    badge: 'Now',
    desc: 'Building mission-critical applications for Australian and international clients. Delivered 20+ custom solutions spanning ERP, payroll, and e-commerce verticals.',
    color: T.cyan,
  },
  {
    role: '.NET Full Stack Developer',
    company: 'Express News',
    location: 'Karachi, Pakistan',
    period: 'Nov 2019 to Dec 2021',
    badge: 'Past',
    desc: "Engineered scalable backend systems for Pakistan's top-rated news network. Managed full SDLC from stakeholder requirements through deployment and monitoring.",
    color: T.coral,
  },
];

const TESTIMONIALS = [
  {
    quote: 'Syed delivered our payroll platform on time, on budget, and exceeded every technical requirement. The system has been running flawlessly for over a year - exactly what we needed.',
    name: 'James R.',
    title: 'CTO, FinTech Startup · Canada',
    initials: 'JR',
    color: T.lime,
  },
  {
    quote: 'Finding a developer who understands both the technical and business side is rare. Syed built our ERP from scratch and still supports us today. He is our go-to engineer.',
    name: 'Michael T.',
    title: 'Operations Director · Australia',
    initials: 'MT',
    color: T.cyan,
  },
  {
    quote: 'The API performance improvements Syed delivered were remarkable. Our platform went from struggling at load to comfortably serving millions of daily users without breaking a sweat.',
    name: 'Ahmed K.',
    title: 'Head of Engineering · Express News',
    initials: 'AK',
    color: T.coral,
  },
];

/* ═══════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════ */
function useCounter(target, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger) { started.current = false; return; }
    if (started.current) return;
    started.current = true;
    let startTime = null;
    const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(ease(p) * target));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration, trigger]);

  return count;
}

function useCursor() {
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);
  const dotX  = useSpring(rawX, { stiffness: 600, damping: 40 });
  const dotY  = useSpring(rawY, { stiffness: 600, damping: 40 });
  const ringX = useSpring(rawX, { stiffness: 120, damping: 26 });
  const ringY = useSpring(rawY, { stiffness: 120, damping: 26 });
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const [onLight, setOnLight] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setOnLight(!!el?.closest('[data-light-bg]'));
    };
    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [rawX, rawY]);

  return { dotX, dotY, ringX, ringY, hovered, setHovered, clicking, onLight };
}

function useActiveSection() {
  const [active, setActive] = useState('');
  useEffect(() => {
    const ids = ['home', 'services', 'work', 'process', 'experience', 'contact'];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);
  return active;
}

function useFocusTrap(active, containerRef) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const focusables = containerRef.current.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    const handler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
      if (e.key === 'Escape') { (containerRef.current?.querySelector('button'))?.click(); }
    };
    document.addEventListener('keydown', handler);
    first?.focus();
    return () => document.removeEventListener('keydown', handler);
  }, [active, containerRef]);
}

/* ═══════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════ */
function Tag({ children, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '5px 12px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 700,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: '0.04em',
      background: color + '14',
      border: `1px solid ${color}28`,
      color,
    }}>
      {children}
    </span>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ width: 32, height: 2, background: T.lime, borderRadius: 2 }} />
      <span style={{
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: T.lime,
      }}>
        {children}
      </span>
    </div>
  );
}

function StatItem({ num, suffix, label, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });
  const count  = useCounter(num, 2200, inView);
  const lines  = label.split('\n');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7 }}
      style={{ padding: 'clamp(20px,3vw,36px) clamp(12px,2vw,28px)', textAlign: 'center' }}
      className={`stat-item stat-item-${index}`}
    >
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 'clamp(36px, 4.5vw, 64px)',
        fontWeight: 400,
        color: T.text,
        lineHeight: 1,
        marginBottom: 8,
        fontStyle: 'italic',
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontSize: 11,
        color: T.muted,
        fontWeight: 500,
        letterSpacing: '0.05em',
        lineHeight: 1.5,
        fontFamily: "'Bricolage Grotesque', sans-serif",
      }}>
        {lines.map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}
      </div>
    </motion.div>
  );
}

function Marquee() {
  return (
    <div style={{
      overflow: 'hidden',
      borderTop:    `1px solid ${T.border}`,
      borderBottom: `1px solid ${T.border}`,
      background: T.surface,
      padding: '16px 0',
    }}>
      <div className="marquee-track" style={{ willChange: 'transform' }}>
        {[...TECH_MARQUEE, ...TECH_MARQUEE, ...TECH_MARQUEE].map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 20,
            marginRight: 48,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            color: T.muted,
            whiteSpace: 'nowrap',
            letterSpacing: '0.08em',
          }}>
            <span style={{ color: T.lime, fontSize: 14 }}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function Page() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', budget: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');
  const [isDesktop, setIsDesktop] = useState(null);

  const { dotX, dotY, ringX, ringY, hovered, setHovered, clicking, onLight } = useCursor();
  const activeSection = useActiveSection();

  const mobileMenuRef = useRef(null);
  useFocusTrap(mobileOpen, mobileMenuRef);

  useEffect(() => {
    const handler = () => setMobileOpen(false);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth > 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:     form.name,
          email:    form.email,
          budget:   form.budget,
          message:  form.message,
          _replyto: form.email,
          _subject: `New project inquiry from ${form.name}`,
        }),
      });
      if (res.ok) {
        setFormStatus('sent');
        setForm({ name: '', email: '', budget: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 6000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 4000);
      }
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 4000);
    }
  };

  const onEnter = useCallback(() => setHovered(true),  [setHovered]);
  const onLeave = useCallback(() => setHovered(false), [setHovered]);

  const btnLabel = {
    idle:    'Send Message ↗',
    loading: 'Sending...',
    sent:    "Sent - I'll reply soon!",
    error:   'Failed - please email directly',
  }[formStatus];

  const cursorDotBg   = onLight ? '#04040a' : T.text;
  const cursorRingBdr = onLight ? '#04040a' : T.text;

  return (
    <main
      id="top"
      style={{
        background: T.bg,
        color: T.text,
        overflowX: 'hidden',
        cursor: isDesktop ? 'none' : 'auto',
      }}
    >
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-family: 'Bricolage Grotesque', sans-serif; }
        body { -webkit-font-smoothing: antialiased; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.lime}44; border-radius: 2px; }
        ::selection { background: ${T.lime}28; color: ${T.lime}; }

        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }
        .marquee-track { display: flex; width: max-content; animation: marquee 40s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        @keyframes glow-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }

        .nav-link {
          color: ${T.muted};
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: color 0.25s;
          font-family: 'Bricolage Grotesque', sans-serif;
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 2px;
          background: ${T.lime};
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        .nav-link:hover { color: ${T.text}; }
        .nav-link:hover::after { width: 100%; }
        .nav-link.active { color: ${T.lime}; }
        .nav-link.active::after { width: 100%; }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: ${T.lime};
          color: #04040a;
          font-weight: 800;
          font-family: 'Bricolage Grotesque', sans-serif;
          border: none;
          cursor: pointer;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #fff;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover::before { opacity: 0.12; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 50px ${T.lime}2e; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: ${T.text};
          font-weight: 700;
          font-family: 'Bricolage Grotesque', sans-serif;
          border: 1px solid ${T.border};
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s;
        }
        .btn-outline:hover { border-color: ${T.lime}55; color: ${T.lime}; }

        .btn-cv {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 10px;
          background: ${T.lime}15;
          border: 1px solid ${T.lime}35;
          color: ${T.lime};
          font-size: 13px;
          font-weight: 700;
          font-family: 'Bricolage Grotesque', sans-serif;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: all 0.3s;
          cursor: pointer;
        }
        .btn-cv:hover { background: ${T.lime}25; transform: translateY(-2px); }

        .btn-email-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid ${T.border};
          color: ${T.muted};
          font-size: 13px;
          font-weight: 600;
          font-family: 'Bricolage Grotesque', sans-serif;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: all 0.3s;
          cursor: pointer;
        }
        .btn-email-ghost:hover { border-color: ${T.lime}40; color: ${T.text}; transform: translateY(-2px); }

        .service-card { transition: background 0.4s, transform 0.4s, border-color 0.4s; }
        .service-card:hover { background: ${T.card} !important; transform: translateY(-4px); }
        .project-card { transition: all 0.5s cubic-bezier(0.16,1,0.3,1); cursor: pointer; }
        .exp-card { transition: border-color 0.4s; }

        input, textarea, select {
          background: rgba(255,255,255,0.03) !important;
          border: 1px solid ${T.border} !important;
          color: ${T.text} !important;
          outline: none;
          transition: border-color 0.3s, background 0.3s;
          font-family: 'Bricolage Grotesque', sans-serif !important;
          font-size: 15px !important;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        input:focus, textarea:focus, select:focus {
          border-color: ${T.lime}55 !important;
          background: rgba(255,255,255,0.05) !important;
        }
        input::placeholder, textarea::placeholder { color: ${T.muted} !important; }
        select option { background: ${T.card}; color: ${T.text}; }

        .stat-item { border-right: 1px solid ${T.border}; }
        .stat-item-3 { border-right: none; }

        @media (max-width: 900px) {
          .stat-item   { border-right: 1px solid ${T.border}; border-bottom: none; }
          .stat-item-1 { border-right: none; border-bottom: 1px solid ${T.border} !important; }
          .stat-item-0 { border-bottom: 1px solid ${T.border} !important; }
          .stat-item-2 { border-bottom: none !important; border-right: 1px solid ${T.border} !important; }
          .stat-item-3 { border-right: none !important; border-bottom: none !important; }
        }
        @media (max-width: 600px) {
          .stat-item   { border-right: 1px solid ${T.border}; }
          .stat-item-1 { border-right: none !important; }
          .stat-item-3 { border-right: none !important; }
        }

        .hero-photo-col   { display: flex; }
        .hero-mobile-pill { display: none; }

        @media (max-width: 900px) {
          .desktop-only    { display: none !important; }
          .mobile-toggle   { display: flex !important; }
          .hero-photo-col  { display: none !important; }
          .hero-mobile-pill { display: flex !important; }
          .hero-left-col   { width: 100% !important; padding: clamp(36px,6vh,64px) clamp(20px,5vw,48px) 28px !important; }
          .hero-top-row    { flex-direction: column !important; }
          .stats-grid      { grid-template-columns: repeat(2, 1fr) !important; }
          .services-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .services-grid > * { border-radius: 16px !important; }
          .process-grid    { grid-template-columns: 1fr 1fr !important; }
          .process-grid > * { border-right: none !important; border-bottom: 1px solid ${T.border} !important; }
          .exp-grid        { grid-template-columns: 1fr !important; }
          .test-grid       { grid-template-columns: 1fr 1fr !important; }
          .form-name-email { grid-template-columns: 1fr !important; }
          .footer-grid     { grid-template-columns: 1fr !important; }
          .footer-brand-col { grid-column: span 1 !important; }
          .footer-links-row { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr !important; }
          .stats-grid    { grid-template-columns: 1fr 1fr !important; }
          .process-grid  { grid-template-columns: 1fr !important; }
          .test-grid     { grid-template-columns: 1fr !important; }
          .cta-email     { display: none !important; }
          .footer-links-row { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .form-name-email { grid-template-columns: 1fr !important; }
          .trust-grid      { grid-template-columns: 1fr !important; }
          .footer-links-row { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NOISE TEXTURE ── */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 9990, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.022,
      }} />

      {/* ── CUSTOM CURSOR (desktop only) ── */}
      {isDesktop && (
        <>
          <motion.div aria-hidden style={{
            position: 'fixed', top: 0, left: 0, zIndex: 9999,
            x: dotX, y: dotY, translateX: '-50%', translateY: '-50%',
            pointerEvents: 'none',
          }}>
            <motion.div
              animate={{ scale: clicking ? 0.6 : hovered ? 3 : 1, background: hovered ? T.lime : cursorDotBg }}
              transition={{ duration: 0.2 }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: cursorDotBg, mixBlendMode: 'difference' }}
            />
          </motion.div>
          <motion.div aria-hidden style={{
            position: 'fixed', top: 0, left: 0, zIndex: 9998,
            x: ringX, y: ringY, translateX: '-50%', translateY: '-50%',
            pointerEvents: 'none',
          }}>
            <motion.div
              animate={{ scale: hovered ? 1.6 : 1, opacity: hovered ? 0 : 0.35 }}
              transition={{ duration: 0.3 }}
              style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${cursorRingBdr}`, mixBlendMode: 'difference' }}
            />
          </motion.div>
        </>
      )}

      {/* ── AMBIENT BACKGROUND ── */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%',  width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${T.lime}07 0%, transparent 65%)` }} />
        <div style={{ position: 'absolute', top: '45%',  left: '-15%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${T.cyan}05 0%, transparent 65%)` }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '15%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${T.coral}04 0%, transparent 65%)` }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.018,
          backgroundImage: `linear-gradient(${T.text}80 1px, transparent 1px), linear-gradient(90deg, ${T.text}80 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }} />
      </div>

      {/* ════════════════════════════════
          NAV
      ════════════════════════════════ */}
      <motion.header
        ref={mobileMenuRef}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
          background: `${T.bg}cc`,
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          borderBottom: `1px solid ${T.border}`,
        }}
        onMouseEnter={onEnter} onMouseLeave={onLeave}
      >
        <div style={{
          maxWidth: 1320, margin: '0 auto',
          padding: '0 clamp(20px,4vw,48px)',
          height: 68,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <a href="#top" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: '-0.03em' }}>
              Syed<span style={{ color: T.lime }}>.</span>
            </span>
          </a>

          <nav className="desktop-only" aria-label="Primary navigation" style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {NAV_LINKS.map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                className={`nav-link${activeSection === n.toLowerCase() ? ' active' : ''}`}
                aria-current={activeSection === n.toLowerCase() ? 'page' : undefined}
              >
                {n}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="btn-primary desktop-only"
            style={{ padding: '11px 24px', borderRadius: 10, fontSize: 13, letterSpacing: '0.02em' }}
            onMouseEnter={onEnter} onMouseLeave={onLeave}
          >
            Hire Me <span style={{ fontSize: 15 }}>↗</span>
          </a>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="mobile-toggle"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}
          >
            <div style={{ width: 24, height: 2, background: T.text, transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(5px,7px)' : 'none' }} />
            <div style={{ width: 16, height: 2, background: T.lime, transition: 'all 0.3s', opacity: mobileOpen ? 0 : 1 }} />
            <div style={{ width: 24, height: 2, background: T.text, transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(5px,-7px)' : 'none' }} />
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-label="Mobile navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden', background: T.surface, borderTop: `1px solid ${T.border}` }}
            >
              <div style={{ padding: '28px clamp(20px,4vw,48px)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {NAV_LINKS.map((n, i) => (
                  <motion.a
                    key={n}
                    href={`#${n.toLowerCase()}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      color: activeSection === n.toLowerCase() ? T.lime : T.muted,
                      textDecoration: 'none',
                      fontSize: 18, fontWeight: 700,
                      padding: '12px 0',
                      borderBottom: `1px solid ${T.border}`,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      transition: 'color 0.2s',
                    }}
                  >
                    {n}
                  </motion.a>
                ))}
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary"
                  style={{ padding: '14px 24px', borderRadius: 12, fontSize: 15, marginTop: 20 }}
                >
                  Hire Me ↗
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section
        id="home"
        style={{
          position: 'relative', zIndex: 1,
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'stretch',
          paddingTop: 68,
          overflow: 'hidden',
        }}
      >
        <div className="hero-top-row" style={{ display: 'flex', alignItems: 'stretch', flex: '1 1 auto' }}>

          {/* ── LEFT COLUMN ── */}
          <div
            className="hero-left-col"
            style={{
              flex: '1 1 0',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: 'clamp(48px,7vh,96px) clamp(24px,5vw,80px) clamp(48px,7vh,96px) clamp(24px,5vw,80px)',
              position: 'relative', zIndex: 2,
            }}
          >
            {/* Available badge — desktop only */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6 }}
              className="desktop-only"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 36,
                padding: '8px 16px', borderRadius: 100, width: 'fit-content',
                background: `${T.lime}10`, border: `1px solid ${T.lime}30`,
              }}
            >
              <div style={{
                width: 7, height: 7, borderRadius: '50%',
                background: T.lime, boxShadow: `0 0 10px ${T.lime}`,
                animation: 'glow-pulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', color: T.lime }}>
                Available · Remote Worldwide
              </span>
            </motion.div>

            {/* Mobile identity pill */}
            <motion.div
              className="hero-mobile-pill"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6 }}
              style={{
                alignItems: 'center',
                gap: 14,
                marginBottom: 28,
                padding: '10px 14px 10px 10px',
                borderRadius: 100,
                width: 'fit-content',
                background: T.surface,
                border: `1px solid ${T.border}`,
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                overflow: 'hidden',
                border: `2px solid ${T.lime}40`,
                position: 'relative',
                background: T.card,
              }}>
                <Image
                  src="/profile.jpg"
                  alt="Syed Dilawar Hussain"
                  fill
                  sizes="52px"
                  style={{ objectFit: 'cover', objectPosition: 'center 8%' }}
                  priority
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.01em', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  Syed Dilawar Hussain
                </div>
                <div style={{ fontSize: 10, color: T.lime, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3, whiteSpace: 'nowrap' }}>
                  Senior .NET Developer
                </div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 40, flexShrink: 0,
                background: `${T.lime}12`, border: `1px solid ${T.lime}30`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.lime, boxShadow: `0 0 8px ${T.lime}`, animation: 'glow-pulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', color: T.lime }}>
                  Available
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <div style={{ marginBottom: 28 }}>
              {[
                { text: 'Senior .NET',  extraStyle: { color: T.text } },
                { text: 'Full Stack',   extraStyle: { fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontWeight: 400, background: `linear-gradient(120deg, ${T.text} 0%, ${T.lime} 50%, ${T.cyan} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } },
                { text: 'Developer.',   extraStyle: { color: T.text } },
              ].map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <motion.h1
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontSize: 'clamp(42px, 6.5vw, 100px)',
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      lineHeight: 0.94,
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      margin: 0,
                      wordBreak: 'break-word',
                      ...line.extraStyle,
                    }}
                  >
                    {line.text}
                  </motion.h1>
                </div>
              ))}
            </div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.7 }}
              style={{ fontSize: 17, color: T.muted, lineHeight: 1.8, marginBottom: 36, fontFamily: "'Bricolage Grotesque', sans-serif", maxWidth: 520, letterSpacing: '0.01em' }}
            >
              I&apos;m{' '}
              <strong style={{ color: T.text, fontWeight: 700 }}>Syed Dilawar Hussain</strong>
              {', '}a senior developer who turns complex enterprise requirements into elegant, high-performance systems.
              C#, ASP.NET Core, Azure, React. 8+ years. 50+ delivered projects.
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.68, duration: 0.6 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}
            >
              <a
                href="#contact"
                className="btn-primary"
                style={{ padding: '15px 32px', borderRadius: 12, fontSize: 15, letterSpacing: '0.01em' }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                Start a Project ↗
              </a>
              <a
                href="#work"
                className="btn-outline"
                style={{ padding: '14px 28px', borderRadius: 12, fontSize: 15 }}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                View Work
              </a>
            </motion.div>

            {/* Secondary CTAs — Download CV + Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.6 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}
            >
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cv"
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                Download CV ↓
              </a>
              <a
                href="mailto:zaidi.dilawar110@gmail.com"
                className="btn-email-ghost"
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                Email Me
              </a>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN - portrait card (desktop only) ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="hero-photo-col"
            style={{
              flex: '0 0 clamp(280px, 33vw, 420px)',
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '40px 0 80px 0',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400, height: 400, borderRadius: '50%',
              background: `radial-gradient(circle, ${T.lime}0b 0%, transparent 65%)`,
              pointerEvents: 'none', zIndex: 0,
            }} />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'relative', zIndex: 2,
                width: '100%', maxWidth: 340,
                borderRadius: 28,
                overflow: 'hidden',
                border: `1px solid ${T.lime}22`,
                boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${T.border}`,
                background: T.card,
                aspectRatio: '3 / 4',
              }}
            >
              <Image
                src="/profile.jpg"
                alt="Syed Dilawar Hussain"
                fill
                sizes="(max-width: 900px) 0px, 340px"
                style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
                priority
              />
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2,
                background: `linear-gradient(to top, rgba(4,4,10,0.92) 0%, rgba(4,4,10,0.3) 45%, transparent 70%)`,
              }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, padding: '24px 24px 20px' }}>
                <div style={{ fontSize: 10, color: T.lime, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Senior .NET Developer
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Syed Dilawar<br />Hussain
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                  {['.NET 8', 'ASP.NET', 'Azure', 'React'].map((s, i) => (
                    <span key={i} style={{
                      fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: '0.08em', padding: '4px 9px', borderRadius: 20,
                      background: `${T.lime}15`, border: `1px solid ${T.lime}30`, color: T.lime,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{
                position: 'absolute', top: 16, right: 16, zIndex: 3,
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 40,
                background: 'rgba(4,4,10,0.75)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${T.lime}35`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.lime, boxShadow: `0 0 8px ${T.lime}`, animation: 'glow-pulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', color: T.lime }}>
                  Available
                </span>
              </div>
            </motion.div>

            {/* Floating skill badges */}
            {[
              { label: 'ASP.NET Core', icon: '◈', color: T.lime,      top: '15%', left: '-5%', right: undefined },
              { label: 'Azure DevOps', icon: '☁', color: T.coral,     top: '33%', left: undefined, right: '-1%' },
              { label: 'SignalR',      icon: '⚡', color: T.cyan,     top: '57%', left: undefined, right: '-1%' },
              { label: 'SQL Server',   icon: '⊞', color: '#a78bfa',  top: '72%', left: '-5%', right: undefined },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, x: b.left !== undefined ? -10 : 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  top: b.top,
                  ...(b.left !== undefined ? { left: b.left } : { right: b.right }),
                  zIndex: 5,
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 13px', borderRadius: 40,
                  background: `${T.bg}f0`,
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  border: `1px solid ${b.color}35`,
                  boxShadow: `0 6px 20px rgba(0,0,0,0.5), 0 0 12px ${b.color}0f`,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 13, color: b.color, lineHeight: 1 }}>{b.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: T.text, letterSpacing: '0.04em' }}>{b.label}</span>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              style={{
                position: 'absolute', bottom: '12%', left: '-4%', zIndex: 5,
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', borderRadius: 14,
                background: `${T.bg}f0`,
                backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                border: `1px solid ${T.border}`,
                boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: `${T.lime}14`, border: `1px solid ${T.lime}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 17, color: T.lime,
              }}>8+</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1 }}>Years Experience</div>
                <div style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>50+ projects delivered</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.82, duration: 0.7 }}
          className="stats-grid"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            borderTop: `1px solid ${T.border}`, background: T.surface,
            width: '100%',
          }}
        >
          {STATS.map((s, i) => <StatItem key={i} {...s} index={i} />)}
        </motion.div>
      </section>

      {/* ── TECH MARQUEE ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Marquee />
      </div>

      {/* ════════════════════════════════
          SERVICES
      ════════════════════════════════ */}
      <section
        id="services"
        style={{ position: 'relative', zIndex: 1, padding: 'clamp(80px,10vh,140px) clamp(20px,5vw,80px)' }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 64 }}
          >
            <SectionEyebrow>What I Do</SectionEyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                My Services
              </h2>
              <p style={{ fontSize: 16, color: T.muted, maxWidth: 400, lineHeight: 1.75, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.01em' }}>
                Eight years delivering across the full spectrum - custom software, business systems, cloud, databases, WordPress, and QA.
              </p>
            </div>
          </motion.div>

          <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {SERVICES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                className="service-card"
                onMouseEnter={onEnter} onMouseLeave={onLeave}
                style={{
                  padding: '40px 28px',
                  background: T.surface,
                  border: `1px solid ${T.border}`,
                  borderRadius: 20,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: s.color, opacity: 0.55 }} />
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: s.color, fontWeight: 700, letterSpacing: '0.1em' }}>{s.num}</span>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: T.text, marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.25, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, marginBottom: 24, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.01em' }}>
                  {s.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {s.tags.map((t, j) => <Tag key={j} color={s.color}>{t}</Tag>)}
                </div>
                <div style={{
                  position: 'absolute', bottom: -12, right: -8,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 88, fontWeight: 900,
                  color: s.color, opacity: 0.04, userSelect: 'none', lineHeight: 1,
                }}>
                  {s.num}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          PROJECTS
      ════════════════════════════════ */}
      <section
        id="work"
        style={{ position: 'relative', zIndex: 1, padding: 'clamp(80px,10vh,140px) clamp(20px,5vw,80px)', background: T.surface }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 64 }}
          >
            <SectionEyebrow>Selected Work</SectionEyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
              <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Signature Projects
              </h2>
              <p style={{ fontSize: 16, color: T.muted, maxWidth: 420, lineHeight: 1.75, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.01em' }}>
                Complex problems solved with precision engineering and measurable business impact.
              </p>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PROJECTS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                className="project-card"
                role="button"
                tabIndex={0}
                aria-expanded={activeProject === i}
                aria-label={`${p.title} - click to ${activeProject === i ? 'collapse' : 'expand'} details`}
                onClick={() => setActiveProject(activeProject === i ? null : i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveProject(activeProject === i ? null : i); } }}
                onMouseEnter={onEnter} onMouseLeave={onLeave}
                style={{
                  borderRadius: 20,
                  border: `1px solid ${activeProject === i ? p.color + '45' : T.border}`,
                  background: activeProject === i ? p.gradient : T.bg,
                  overflow: 'hidden',
                  transition: 'border-color 0.4s, background 0.4s',
                }}
              >
                <div style={{
                  padding: 'clamp(24px,3.5vw,44px)',
                  display: 'flex', flexWrap: 'wrap', gap: 16,
                  alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p.color, fontWeight: 700, letterSpacing: '0.12em', opacity: 0.6 }}>
                      {p.num}
                    </span>
                    <div>
                      <div style={{ fontSize: 11, color: T.muted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 6 }}>
                        {p.category}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 'clamp(17px, 2.4vw, 24px)', fontWeight: 800, color: T.text, letterSpacing: '-0.02em', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                          {p.title}
                        </h3>
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 10px', borderRadius: 20,
                              background: p.color + '14', border: `1px solid ${p.color}35`,
                              color: p.color,
                              fontSize: 10, fontWeight: 700,
                              fontFamily: "'JetBrains Mono', monospace",
                              letterSpacing: '0.1em', textDecoration: 'none',
                              textTransform: 'uppercase',
                              transition: 'background 0.2s',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <span style={{ fontSize: 8 }}>●</span> Live Site ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                        Key Impact
                      </div>
                      <div style={{ fontSize: 'clamp(13px,1.4vw,16px)', fontWeight: 800, color: p.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                        {p.impact}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: activeProject === i ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      aria-hidden
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        border: `1px solid ${p.color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: p.color, fontSize: 20, flexShrink: 0,
                        background: activeProject === i ? p.color + '1a' : 'transparent',
                        transition: 'background 0.3s',
                      }}
                    >
                      +
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {activeProject === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        padding: 'clamp(20px,3vw,40px)', paddingTop: 0,
                        borderTop: `1px solid ${T.border}`,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))',
                        gap: 36,
                      }}>
                        <div style={{ paddingTop: 32 }}>
                          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.85, marginBottom: 24, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.01em' }}>
                            {p.desc}
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {p.tech.map((t, j) => <Tag key={j} color={p.color}>{t}</Tag>)}
                          </div>
                          {p.liveUrl && (
                            <a
                              href={p.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                marginTop: 20, padding: '10px 18px', borderRadius: 10,
                                background: p.color + '12', border: `1px solid ${p.color}30`,
                                color: p.color, fontSize: 13, fontWeight: 700,
                                fontFamily: "'Bricolage Grotesque', sans-serif",
                                textDecoration: 'none', transition: 'background 0.2s',
                              }}
                            >
                              View Live Site ↗
                            </a>
                          )}
                        </div>
                        <div style={{ paddingTop: 32 }}>
                          <div style={{ fontSize: 11, color: p.color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', marginBottom: 16, textTransform: 'uppercase' }}>
                            Outcomes
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                            {p.outcomes.map((o, j) => (
                              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                                  background: p.color + '14', border: `1px solid ${p.color}28`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                  <div style={{ width: 5, height: 5, borderRadius: 1, background: p.color }} />
                                </div>
                                <span style={{ fontSize: 14, color: T.muted, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{o}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          PROCESS
      ════════════════════════════════ */}
      <section
        id="process"
        style={{ position: 'relative', zIndex: 1, padding: 'clamp(80px,10vh,140px) clamp(20px,5vw,80px)' }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 64 }}
          >
            <SectionEyebrow>How I Work</SectionEyebrow>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              My Process
            </h2>
          </motion.div>

          <div
            className="process-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              border: `1px solid ${T.border}`, borderRadius: 20, overflow: 'hidden', background: T.surface,
            }}
          >
            {PROCESS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
                onMouseEnter={onEnter} onMouseLeave={onLeave}
                style={{ padding: '40px 28px', borderRight: i < 3 ? `1px solid ${T.border}` : 'none', position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 52, color: T.lime, fontStyle: 'italic', lineHeight: 1, fontWeight: 400, opacity: 0.55 }}>
                    {p.step}
                  </span>
                  <span className="desktop-only" style={{ fontSize: 18, color: T.border, marginTop: 16 }}>
                    {i < 3 ? '→' : ''}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 10, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.01em' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.01em' }}>
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          EXPERIENCE
      ════════════════════════════════ */}
      <section
        id="experience"
        style={{ position: 'relative', zIndex: 1, padding: 'clamp(80px,10vh,140px) clamp(20px,5vw,80px)', background: T.surface }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 64 }}
          >
            <SectionEyebrow>Career Path</SectionEyebrow>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Professional Journey
            </h2>
          </motion.div>

          <div className="exp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="exp-card"
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = exp.color + '40'; onEnter(); }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; onLeave(); }}
                style={{
                  padding: '40px 32px', background: T.bg,
                  border: `1px solid ${T.border}`, borderRadius: 20,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${exp.color}, transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 6, fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    fontFamily: "'JetBrains Mono', monospace",
                    background: exp.color + '14', border: `1px solid ${exp.color}28`, color: exp.color,
                  }}>
                    {exp.badge}
                  </span>
                  <span style={{ fontSize: 12, color: T.muted, fontFamily: "'JetBrains Mono', monospace" }}>{exp.period}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, marginBottom: 6, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                  {exp.role}
                </h3>
                <p style={{ color: exp.color, fontWeight: 700, fontSize: 14, marginBottom: 6, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {exp.company}
                </p>
                <p style={{ color: T.muted, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", marginBottom: 18 }}>
                  {exp.location}
                </p>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '0.01em' }}>
                  {exp.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(80px,10vh,140px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 64 }}
          >
            <SectionEyebrow>Client Voice</SectionEyebrow>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              What Clients Say
            </h2>
          </motion.div>

          <div className="test-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                style={{
                  padding: '40px 32px', background: T.surface,
                  border: `1px solid ${T.border}`, borderRadius: 20,
                  display: 'flex', flexDirection: 'column', gap: 24,
                }}
              >
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 76, lineHeight: 0.7, color: t.color, opacity: 0.35, fontStyle: 'italic' }}>
                  &ldquo;
                </div>
                <p style={{ fontSize: 15, color: T.text, lineHeight: 1.85, fontFamily: "'Bricolage Grotesque', sans-serif", flex: 1, letterSpacing: '0.01em' }}>
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: t.color + '14', border: `1px solid ${t.color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: t.color,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                  }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: T.muted, fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          CTA BANNER
      ════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 1, padding: 'clamp(40px,5vh,60px) clamp(20px,5vw,80px)', background: T.surface }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          data-light-bg="true"
          style={{
            maxWidth: 1320, margin: '0 auto',
            borderRadius: 28, background: T.lime,
            padding: 'clamp(44px,5vw,72px)',
            position: 'relative', overflow: 'hidden',
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between', gap: 36,
          }}
        >
          <div style={{ position: 'absolute', right: -60,  top: -60,  width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(4,4,10,0.1)' }} />
          <div style={{ position: 'absolute', right: -120, top: -120, width: 500, height: 500, borderRadius: '50%', border: '1px solid rgba(4,4,10,0.06)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 800, color: '#04040a', letterSpacing: '-0.03em', lineHeight: 1.1, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 12 }}>
              Ready to build something remarkable?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(4,4,10,0.55)', fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.6 }}>
              Let&apos;s discuss your project. I typically respond within 4 hours.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a
              href="#contact"
              onMouseEnter={onEnter} onMouseLeave={onLeave}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#04040a', color: T.lime,
                padding: '15px 30px', borderRadius: 12,
                fontSize: 15, fontWeight: 800, textDecoration: 'none',
                fontFamily: "'Bricolage Grotesque', sans-serif",
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
              }}
            >
              Let&apos;s Talk ↗
            </a>
            <a
              href="mailto:zaidi.dilawar110@gmail.com"
              onMouseEnter={onEnter} onMouseLeave={onLeave}
              className="cta-email"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(4,4,10,0.1)', color: '#04040a',
                padding: '15px 24px', borderRadius: 12,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                fontFamily: "'Bricolage Grotesque', sans-serif",
                border: '1px solid rgba(4,4,10,0.12)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              ✉ zaidi.dilawar110@gmail.com
            </a>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════
          CONTACT
      ════════════════════════════════ */}
      <section
        id="contact"
        style={{ position: 'relative', zIndex: 1, padding: 'clamp(80px,10vh,140px) clamp(20px,5vw,80px)' }}
      >
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 64 }}
          >
            <SectionEyebrow>Get In Touch</SectionEyebrow>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Start a Conversation
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))', gap: 64, alignItems: 'start' }}>
            <div>
              <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.85, marginBottom: 44, fontFamily: "'Bricolage Grotesque', sans-serif", maxWidth: 440, letterSpacing: '0.01em' }}>
                Whether you need a full-stack enterprise application, cloud migration, technical consultation, or a long-term engineering partner - I&apos;d love to hear about your challenge.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 44 }}>
                {[
                  { icon: '✉', label: 'Email',           value: 'zaidi.dilawar110@gmail.com',       href: 'mailto:zaidi.dilawar110@gmail.com' },
                  { icon: '📱', label: 'WhatsApp · Call', value: '+92 314-2103746',                   href: 'https://wa.me/923142103746' },
                  { icon: '🔗', label: 'LinkedIn',        value: 'linkedin.com/in/dilawardeveloper', href: 'https://www.linkedin.com/in/dilawardeveloper/' },
                ].map((c, i) => (
                  <motion.a
                    key={i}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.lime + '40'; e.currentTarget.style.transform = 'translateX(6px)'; onEnter(); }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'none'; onLeave(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      textDecoration: 'none', padding: '14px 18px',
                      borderRadius: 12, border: `1px solid ${T.border}`,
                      background: T.surface, transition: 'all 0.3s',
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: T.faint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {c.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>
                        {c.label}
                      </div>
                      <div style={{ fontSize: 14, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500 }}>
                        {c.value}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { icon: '⚡', text: 'Responds in < 4 hours' },
                  { icon: '🌍', text: 'Works across all timezones' },
                  { icon: '🔒', text: 'NDA-ready' },
                  { icon: '✓',  text: 'Fixed-price projects available' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px', borderRadius: 10,
                    background: T.surface, border: `1px solid ${T.border}`,
                  }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, color: T.muted, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, lineHeight: 1.5 }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: 'clamp(28px,4vw,48px)' }}>
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", letterSpacing: '-0.02em', marginBottom: 8 }}>
                    Send a Message
                  </h3>
                  <p style={{ fontSize: 14, color: T.muted, fontFamily: "'Bricolage Grotesque', sans-serif", lineHeight: 1.6 }}>
                    I&apos;ll get back to you within one business day.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
                  <div className="form-name-email" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { id: 'name',  label: 'Your Name', type: 'text',  placeholder: 'John Smith',       autocomplete: 'name' },
                      { id: 'email', label: 'Email',     type: 'email', placeholder: 'john@company.com', autocomplete: 'email' },
                    ].map((f) => (
                      <div key={f.id}>
                        <label htmlFor={`field-${f.id}`} style={{
                          display: 'block', fontSize: 10, color: T.muted,
                          textTransform: 'uppercase', letterSpacing: '0.18em',
                          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: 8,
                        }}>
                          {f.label}
                        </label>
                        <input
                          id={`field-${f.id}`}
                          type={f.type}
                          required
                          aria-required="true"
                          autoComplete={f.autocomplete}
                          placeholder={f.placeholder}
                          value={form[f.id]}
                          onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: 10 }}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label htmlFor="field-budget" style={{
                      display: 'block', fontSize: 10, color: T.muted,
                      textTransform: 'uppercase', letterSpacing: '0.18em',
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: 8,
                    }}>
                      Project Budget
                    </label>
                    <select
                      id="field-budget"
                      required
                      aria-required="true"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 10 }}
                    >
                      <option value="">Select a range...</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-15k">$5,000 - $15,000</option>
                      <option value="15k-50k">$15,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                      <option value="retainer">Ongoing / Retainer</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="field-message" style={{
                      display: 'block', fontSize: 10, color: T.muted,
                      textTransform: 'uppercase', letterSpacing: '0.18em',
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginBottom: 8,
                    }}>
                      Project Details
                    </label>
                    <textarea
                      id="field-message"
                      required
                      aria-required="true"
                      rows={5}
                      placeholder="Tell me about your project, current stack, timeline, and what success looks like..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 10, resize: 'vertical', minHeight: 120 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formStatus === 'loading'}
                    className="btn-primary"
                    onMouseEnter={onEnter} onMouseLeave={onLeave}
                    style={{
                      padding: '16px 24px', borderRadius: 12, fontSize: 15,
                      marginTop: 4, width: '100%', letterSpacing: '0.01em',
                      background: formStatus === 'error' ? T.coral : formStatus === 'sent' ? '#22c55e' : T.lime,
                    }}
                  >
                    {btnLabel}
                  </button>

                  <p style={{ fontSize: 12, color: T.muted, textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>
                    Or email directly:{' '}
                    <a href="mailto:zaidi.dilawar110@gmail.com" style={{ color: T.lime, textDecoration: 'none' }}>
                      zaidi.dilawar110@gmail.com
                    </a>
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ position: 'relative', zIndex: 1, background: T.bg, borderTop: `1px solid ${T.border}` }}>
        <div style={{ borderBottom: `1px solid ${T.border}`, padding: 'clamp(40px,5vw,64px) clamp(20px,5vw,80px)' }}>
          <div
            className="footer-grid"
            style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 40 }}
          >
            <div className="footer-brand-col" style={{ minWidth: 0 }}>
              <a href="#top" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: '-0.04em' }}>
                  Syed<span style={{ color: T.lime }}>.</span>
                </span>
              </a>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, maxWidth: 320, fontFamily: "'Bricolage Grotesque', sans-serif", marginBottom: 24 }}>
                Senior .NET Full Stack Developer building enterprise-grade systems for clients across North America, Australia, and beyond.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: 'in', href: 'https://www.linkedin.com/in/dilawardeveloper/', title: 'LinkedIn' },
                  { label: '✉', href: 'mailto:zaidi.dilawar110@gmail.com',             title: 'Email' },
                  { label: 'wa', href: 'https://wa.me/923142103746',                   title: 'WhatsApp' },
                ].map((s, i) => (
                  <a
                    key={i} href={s.href} title={s.title}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.lime + '55'; e.currentTarget.style.color = T.lime; onEnter(); }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; onLeave(); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 38, height: 38, borderRadius: 10,
                      border: `1px solid ${T.border}`, background: T.surface,
                      fontSize: 11, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace",
                      color: T.muted, textDecoration: 'none', textTransform: 'uppercase',
                      letterSpacing: '0.04em', transition: 'all 0.25s',
                    }}
                  >{s.label}</a>
                ))}
              </div>
            </div>

            <div className="footer-links-row" style={{ display: 'contents' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: T.lime, marginBottom: 20 }}>
                  Navigation
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {NAV_LINKS.map((n) => (
                    <a
                      key={n} href={`#${n.toLowerCase()}`}
                      onMouseEnter={(e) => { e.currentTarget.style.color = T.text; e.currentTarget.style.paddingLeft = '6px'; onEnter(); }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; e.currentTarget.style.paddingLeft = '0px'; onLeave(); }}
                      style={{ fontSize: 14, color: T.muted, textDecoration: 'none', fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 600, transition: 'all 0.2s' }}
                    >{n}</a>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.2em', textTransform: 'uppercase', color: T.lime, marginBottom: 20 }}>
                  Contact
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Email',    value: 'zaidi.dilawar110@gmail.com', href: 'mailto:zaidi.dilawar110@gmail.com' },
                    { label: 'Phone',    value: '+92 314-2103746',             href: 'https://wa.me/923142103746' },
                    { label: 'Location', value: 'Karachi, Pakistan',           href: null },
                  ].map((c, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 10, color: T.faint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>{c.label}</div>
                      {c.href ? (
                        <a
                          href={c.href}
                          target={c.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          onMouseEnter={(e) => { e.currentTarget.style.color = T.lime; onEnter(); }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = T.text; onLeave(); }}
                          style={{ fontSize: 13, color: T.text, textDecoration: 'none', fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, transition: 'color 0.2s', display: 'block' }}
                        >{c.value}</a>
                      ) : (
                        <span style={{ fontSize: 13, color: T.text, fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500 }}>{c.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px clamp(20px,5vw,80px)' }}>
          <div style={{ maxWidth: 1320, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: 12, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>
              © 2025 Syed Dilawar Hussain. All rights reserved.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.lime, boxShadow: `0 0 8px ${T.lime}`, animation: 'glow-pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.muted, letterSpacing: '0.1em' }}>Available for new projects</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}