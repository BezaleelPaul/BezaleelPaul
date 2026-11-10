'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bot, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Play, 
  Pause, 
  MapPin, 
  GraduationCap, 
  Code, 
  Cpu, 
  Award, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

interface JourneyStep {
  id: string;
  stepNumber: number;
  phase: string;
  title: string;
  period: string;
  targetSectionId: string;
  narration: string;
  highlightStats: string;
  skills: string[];
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'academics',
    stepNumber: 1,
    phase: 'PHASE 01: DUAL-TRACK FOUNDATION',
    title: 'Dual Academic Degrees in CSE & Data Science',
    period: '2025 — Present',
    targetSectionId: 'about',
    narration: 'Bezaleel is pursuing a dual-degree trajectory: B.Tech in Computer Science at CMR University (2025–2029) and BS in Data Science at IIT Madras (2026–Present), blending theoretical computational mathematics with practical software engineering.',
    highlightStats: 'CMR University (2025–2029) · IIT Madras (2026–Present)',
    skills: ['Data Structures', 'Statistics', 'Linear Algebra', 'Operating Systems']
  },
  {
    id: 'algorithms',
    stepNumber: 2,
    phase: 'PHASE 02: COMPUTATIONAL RIGOR',
    title: 'Competitive Algorithmic Specialization',
    period: '2025 — Present',
    targetSectionId: 'github',
    narration: 'To build relentless problem-solving discipline, he tackled over 270+ algorithmic challenges on LeetCode across dynamic programming, trees, and graphs, alongside rated competitive programming rounds on Codeforces.',
    highlightStats: '270+ LeetCode Solved · Peak 959 Codeforces Rating',
    skills: ['Dynamic Programming', 'Graph Theory', 'C++', 'Asymptotic Optimization']
  },
  {
    id: 'systems',
    stepNumber: 3,
    phase: 'PHASE 03: LOCAL-FIRST SYSTEMS',
    title: 'Mise: File Organizer & Cross-Platform Utilities',
    period: '2024',
    targetSectionId: 'projects',
    narration: 'He engineered Mise (File Organizer), a local-first, transactional filesystem workstation with selective undo logs and disk intelligence treemaps, deploying it across Windows, macOS, Linux, and Android via Flutter.',
    highlightStats: 'Cross-Platform Flutter & Python Architecture',
    skills: ['Flutter', 'Dart', 'Python', 'Filesystem Transactions', 'Desktop & Mobile']
  },
  {
    id: 'biomedical-ai',
    stepNumber: 4,
    phase: 'PHASE 04: AI & PREDICTIVE MODELING',
    title: 'NADICARE Twin Engine (Biomedical Digital Twin)',
    period: '2024 — 2025',
    targetSectionId: 'projects',
    narration: 'Venturing into physiological simulation, he architected the NADICARE Twin Engine: an AI-driven digital twin combining XGBoost regression models with real-time Plotly telemetry to forecast heart rate recovery curves under strain.',
    highlightStats: 'XGBoost · Streamlit Telemetry · Dynamic Plotly Dashboards',
    skills: ['Machine Learning', 'XGBoost', 'Predictive Modeling', 'Python']
  },
  {
    id: 'space-astrophysics',
    stepNumber: 5,
    phase: 'PHASE 05: 3D COSMIC ENGINE & NASA TELEMETRY',
    title: 'Orbital Observatory & Keplerian Physics Simulator',
    period: '2025 — 2026',
    targetSectionId: 'projects',
    narration: 'Bridging high-performance 3D WebGL with real astrophysics, he engineered a 3D Solar System simulator solving Keplerian conic equations and streaming live telemetry from NASA Open APIs (APOD cosmic discoveries & Near-Earth Asteroid radar feeds).',
    highlightStats: 'Three.js / R3F · NASA Deep Space Network API · Keplerian Physics',
    skills: ['WebGL', 'Three.js', 'Astrophysics Simulation', 'REST APIs', 'GLSL']
  },
  {
    id: 'procedural-planets',
    stepNumber: 6,
    phase: 'PHASE 06: PROCEDURAL PLANETARY SYNTHESIS',
    title: 'Procedural Seed Exoplanet Engine',
    period: '2026',
    targetSectionId: 'procedural-planets',
    narration: 'Inspired by deterministic seed world generation, he built a procedural exoplanet engine converting cryptographic seeds and GitHub repositories into high-fidelity 3D worlds with procedural terrain textures, cloud decks, atmospheric scattering, and rings.',
    highlightStats: 'Deterministic Harmonic Noise · 60 FPS Procedural WebGL · Exoplanet Biomes',
    skills: ['Procedural Shaders', 'Three.js Textures', 'Mulberry32 PRNG', 'Spherical Math']
  },
  {
    id: 'leadership',
    stepNumber: 7,
    phase: 'PHASE 07: TECHNICAL LEADERSHIP',
    title: 'IEEE EXCOM Member & Webmaster',
    period: '2025 — 2026',
    targetSectionId: 'experience',
    narration: 'Beyond independent engineering, he stepped into organizational leadership as an Executive Committee member and Webmaster for the IEEE Student Branch (2025–2026), directing digital portals, registration pipelines, and peer workshops.',
    highlightStats: 'Executive Committee Member · Webmaster · Peer Mentorship',
    skills: ['Web Architecture', 'Technical Mentorship', 'Community Leadership']
  },
  {
    id: 'frontiers',
    stepNumber: 8,
    phase: 'PHASE 08: ACTIVE FRONTIERS',
    title: '34 Repositories & Open to Opportunities',
    period: 'Active Horizon',
    targetSectionId: 'contact',
    narration: 'Today, with 34 active repositories, an automated CI/CD pipeline, and continuous learning in machine learning and full-stack systems, Bezaleel is actively open to engineering roles and ambitious collaborations.',
    highlightStats: '34 Public Repos · Bangalore Ground Station · Ready for Dispatch',
    skills: ['Full-Stack', 'Flutter', 'AI/ML Engineering', 'Clean Architecture']
  }
];

export const ExplorationBot: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [gestureAlert, setGestureAlert] = useState(false);

  // References for zero-cost smooth cursor following
  const botDroneRef = useRef<HTMLDivElement>(null);
  const mouseCoords = useRef({ x: -200, y: -200 });
  const botCoords = useRef({ x: -200, y: -200 });
  const pathHistory = useRef<Array<{ x: number; y: number }>>([]);
  const animFrameRef = useRef<number | null>(null);

  // Smooth bot floating animation using direct DOM transformation (0 React re-renders)
  useEffect(() => {
    if (!isActive) return;

    const smoothFollow = () => {
      const targetX = mouseCoords.current.x + 28;
      const targetY = mouseCoords.current.y - 28;

      botCoords.current.x += (targetX - botCoords.current.x) * 0.14;
      botCoords.current.y += (targetY - botCoords.current.y) * 0.14;

      if (botDroneRef.current) {
        botDroneRef.current.style.transform = `translate3d(${botCoords.current.x}px, ${botCoords.current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(smoothFollow);
    };

    animFrameRef.current = requestAnimationFrame(smoothFollow);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive]);

  // Mousemove listener with circular gesture detection
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseCoords.current.x = e.clientX;
    mouseCoords.current.y = e.clientY;

    if (isActive) return;

    // Track last 30 positions for gesture
    const pts = pathHistory.current;
    pts.push({ x: e.clientX, y: e.clientY });
    if (pts.length > 30) pts.shift();

    if (pts.length >= 22) {
      const first = pts[0];
      const last = pts[pts.length - 1];
      const distStartEnd = Math.hypot(last.x - first.x, last.y - first.y);

      // Centroid
      let avgX = 0, avgY = 0;
      pts.forEach((p) => { avgX += p.x; avgY += p.y; });
      avgX /= pts.length;
      avgY /= pts.length;

      // Average radius
      let avgRadius = 0;
      pts.forEach((p) => { avgRadius += Math.hypot(p.x - avgX, p.y - avgY); });
      avgRadius /= pts.length;

      // If loop closed with radius between 35px and 160px
      if (distStartEnd < 55 && avgRadius > 35 && avgRadius < 160) {
        setIsActive(true);
        setGestureAlert(true);
        spaceAudio.playWarpSwoosh();
        spaceAudio.playTelemetryBeep(1200);
        setTimeout(() => setGestureAlert(false), 3000);
        pathHistory.current = [];
      }
    }
  }, [isActive]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Navigate to current waypoint step & smooth scroll to target section
  const goToStep = useCallback((stepIdx: number) => {
    if (stepIdx < 0 || stepIdx >= JOURNEY_STEPS.length) return;
    setCurrentStep(stepIdx);
    spaceAudio.playTelemetryBeep(1000 + stepIdx * 80);

    const step = JOURNEY_STEPS[stepIdx];
    const targetEl = document.getElementById(step.targetSectionId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Auto-tour progression timer
  useEffect(() => {
    if (!isAutoTour || !isActive) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < JOURNEY_STEPS.length - 1) {
          const next = prev + 1;
          goToStep(next);
          return next;
        } else {
          setIsAutoTour(false);
          return prev;
        }
      });
    }, 7000);

    return () => clearInterval(timer);
  }, [isAutoTour, isActive, goToStep]);

  const step = JOURNEY_STEPS[currentStep];

  return (
    <>
      {/* Gesture Notification Pop-up */}
      {gestureAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-space-900/95 border border-hud-cyan text-white text-xs font-mono shadow-[0_0_25px_rgba(0,243,255,0.6)] backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Bot className="w-4 h-4 text-hud-cyan animate-spin" />
          <span>[ EXPLORATION BOT AWAKENED VIA MOUSE GESTURE ]</span>
        </div>
      )}

      {/* Summon Trigger in Bottom Right */}
      {!isActive && (
        <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
          <button
            onClick={() => {
              setIsActive(true);
              goToStep(0);
              spaceAudio.playWarpSwoosh();
            }}
            className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-space-900/90 border border-cyan-500/40 hover:border-hud-cyan text-xs font-mono text-slate-300 hover:text-white backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform hover:-translate-y-0.5"
            title="Click or draw a circle with your mouse to summon the Journey Bot"
          >
            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-hud-cyan group-hover:animate-ping" />
              <Bot className="w-3.5 h-3.5 text-hud-cyan absolute" />
            </div>
            <span>Summon Journey Bot</span>
            <span className="text-[10px] text-slate-500 bg-space-950 px-1.5 py-0.5 rounded border border-slate-800 hidden sm:inline">
              draw circle ◯
            </span>
          </button>
        </div>
      )}

      {/* Floating Exploration Companion Drone (Smooth DOM Transform) */}
      {isActive && (
        <div
          ref={botDroneRef}
          className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block will-change-transform"
        >
          <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            {/* Pulsing Outer Scanning Ring */}
            <div className="w-9 h-9 rounded-full border border-hud-cyan/40 animate-ping absolute" />
            <div className="w-8 h-8 rounded-full border border-cyan-400 animate-spin-slow absolute" />

            {/* Glowing Core */}
            <div className="w-5 h-5 rounded-full bg-hud-cyan shadow-[0_0_15px_#00f3ff] flex items-center justify-center">
              <Bot className="w-3 h-3 text-space-950 font-bold" />
            </div>

            {/* Scanning beam */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-hud-cyan to-transparent absolute left-4 -rotate-12" />
          </div>
        </div>
      )}

      {/* Interactive Waypoint Hologram Modal Card */}
      {isActive && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md bg-space-900/95 border-2 border-hud-cyan/60 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,243,255,0.35)] backdrop-blur-xl font-mono text-xs select-none animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-hud-cyan animate-ping" />
              <span className="font-bold text-white tracking-widest text-[11px] flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-hud-cyan" />
                <span>JOURNEY BOT // WAYPOINT {step.stepNumber}/{JOURNEY_STEPS.length}</span>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsAutoTour(!isAutoTour)}
                title={isAutoTour ? 'Pause Auto-Tour' : 'Start Auto-Tour'}
                className={`p-1 rounded border text-[10px] transition-colors ${
                  isAutoTour
                    ? 'bg-hud-cyan text-space-950 border-hud-cyan font-bold'
                    : 'bg-space-950 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {isAutoTour ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              <button
                onClick={() => {
                  spaceAudio.playTelemetryBeep(700);
                  setIsActive(false);
                }}
                className="p-1 rounded bg-space-950 hover:bg-space-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Dismiss Exploration Bot"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Waypoint Phase Tag */}
          <div className="mb-2">
            <span className="text-[10px] font-bold text-hud-amber bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
              {step.phase}
            </span>
          </div>

          {/* Title & Timeline */}
          <div className="mb-2">
            <h4 className="text-sm font-bold text-white leading-tight font-display">
              {step.title}
            </h4>
            <span className="text-[10px] text-slate-400">{step.period}</span>
          </div>

          {/* Chronological Narration */}
          <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3 bg-space-950/80 p-3 rounded-xl border border-slate-850">
            {step.narration}
          </p>

          {/* Verified Highlights */}
          <div className="mb-3 text-[11px] text-hud-cyan font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-hud-cyan shrink-0" />
            <span className="font-semibold truncate">{step.highlightStats}</span>
          </div>

          {/* Skill Constellations */}
          <div className="flex flex-wrap gap-1 mb-4">
            {step.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-[10px] bg-cyan-950/60 border border-cyan-800 text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Navigation Waypoint Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => goToStep(currentStep - 1)}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-space-950 border border-slate-700 hover:border-hud-cyan text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:border-slate-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Waypoint Progress Pips */}
            <div className="flex items-center gap-1">
              {JOURNEY_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToStep(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentStep === idx
                      ? 'w-4 bg-hud-cyan shadow-[0_0_8px_#00f3ff]'
                      : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goToStep(currentStep + 1)}
              disabled={currentStep === JOURNEY_STEPS.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-hud-cyan text-space-950 font-bold hover:bg-cyan-300 disabled:opacity-40 disabled:hover:bg-hud-cyan transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
