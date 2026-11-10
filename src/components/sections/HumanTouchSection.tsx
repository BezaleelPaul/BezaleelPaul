'use client';

import React from 'react';
import { 
  Coffee, 
  Laptop, 
  Compass, 
  Sparkles, 
  Clock, 
  MapPin, 
  Heart, 
  Music, 
  Terminal, 
  Smile, 
  BookOpen, 
  Send,
  Zap,
  CheckCircle2,
  FolderHeart,
  Globe2
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

export const HumanTouchSection: React.FC = () => {
  return (
    <section id="human-side" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050811] border-t border-slate-800 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-14 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/70 border border-cyan-800/80 px-3 py-1 rounded-full">
            👋 BEHIND THE CODE
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            THE HUMAN SIDE
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            What I&apos;m focused on right now, the real stories behind what I build, my everyday setup, and life outside the terminal.
          </p>
          <div className="w-16 h-1 bg-cyan-400 rounded-full mt-1" />
        </div>

        {/* 2x2 Bento Grid of Human Touchpoints */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Bento 1: What I'm Doing Right Now (/now block) - 7 cols */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0b101d] border-2 border-slate-700/80 p-7 sm:p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-300 font-bold">
                    What I&apos;m Doing Right Now (/now)
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Focus
                </span>
              </div>

              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                Inspired by Derek Sivers&apos; &quot;Now Page&quot; movement. Here is an honest snapshot of where my time and energy are going this semester:
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#070c17] border border-slate-800">
                  <span className="text-lg">🎓</span>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white">Dual-Degree Undergrad</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Balancing B.Tech Computer Science classes at CMR University with BS in Data Science coursework at IIT Madras.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#070c17] border border-slate-800">
                  <span className="text-lg">📱</span>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white">Building &quot;Mise&quot; File Organizer</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Polishing our cross-platform Flutter utility for Windows, macOS, and Linux — focused on transactional undo so users never fear losing files.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#070c17] border border-slate-800">
                  <span className="text-lg">🧩</span>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white">Daily Algorithm Habit</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Solving 1–2 LeetCode problems every morning before classes. Currently at <strong>270+ solved</strong>, digging into graphs and dynamic programming.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#070c17] border border-slate-800">
                  <span className="text-lg">☕</span>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white">Living in Bengaluru</h4>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      Exploring local South Indian filter coffee spots, attending campus hackathons, and organizing tech sessions with IEEE peers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>📍 Bengaluru, India (UTC +5:30)</span>
              <span className="text-cyan-400">Status: Open to SWE Internships</span>
            </div>
          </div>

          {/* Bento 2: Everyday Workspace & Dev Setup - 5 cols */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0b101d] border-2 border-slate-700/80 p-7 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  My Everyday Workspace & Setup
                </h3>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                The tools, environment, and daily stack I rely on to stay productive and enjoy writing code:
              </p>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#070c17] border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Code Editor:</span>
                  <span className="text-white font-bold">VS Code (Catppuccin Mocha)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070c17] border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Editor Font:</span>
                  <span className="text-cyan-300 font-bold">JetBrains Mono (Ligatures on)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070c17] border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Operating System:</span>
                  <span className="text-white font-bold">Windows 11 + Linux (Ubuntu)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070c17] border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Terminal Prompt:</span>
                  <span className="text-cyan-300 font-bold">PowerShell + Starship</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070c17] border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Favorite Language:</span>
                  <span className="text-emerald-400 font-bold">Dart (Flutter) & Python</span>
                </div>

                <div className="p-3 rounded-xl bg-[#070c17] border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Soundtrack:</span>
                  <span className="text-amber-300 font-bold">Lo-Fi Beats & Synthwave</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>&quot;Code runs best on curiosity and freshly brewed coffee.&quot;</span>
            </div>
          </div>

          {/* Bento 3: Why I Build Things (Real Stories Behind Projects) - 7 cols */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0b101d] border-2 border-slate-700/80 p-7 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-300 font-bold">
                Why I Build Things (Real Stories)
              </h3>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              I believe software is most meaningful when it solves a real annoyance or helps someone you care about:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#070c17] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <b className="text-xs font-mono text-white font-bold">⚡ The BESCOM Calculator Story</b>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">Civic Utility</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Bangalore&apos;s tiered electricity slabs and fluctuating fuel charges once gave my family a confusing bill jump. Rather than guessing, I spent an evening coding a zero-dependency calculator with the exact official slab math so neighbors and family could paste their meter reading and understand every rupee.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070c17] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <b className="text-xs font-mono text-white font-bold">🗂️ The Mise File Organizer Story</b>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded">Flutter & Python</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  My Downloads folder was an unmanageable mess of 500+ random invoices, APKs, and datasets. Most file sorters don&apos;t have an &quot;undo&quot; button, which makes them terrifying to use. I built Mise in Flutter with transactional undo so you can organize in one click with zero fear.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070c17] border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <b className="text-xs font-mono text-white font-bold">🌌 The Orbital Observatory Story</b>
                  <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded">3D & Astrophysics</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  I&apos;ve loved astronomy since childhood. Instead of just reading Wikipedia about orbits, I wanted to mathematically solve Kepler&apos;s equations and render the solar system at 60 FPS in WebGL using live NASA telemetry. That fascination is what powers the background of this website!
                </p>
              </div>
            </div>
          </div>

          {/* Bento 4: Life Outside of Code - 5 cols */}
          <div className="lg:col-span-5 rounded-3xl bg-[#0b101d] border-2 border-slate-700/80 p-7 sm:p-8 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Life Beyond The Code
                </h3>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                When the monitor is turned off, here is what keeps me curious and grounded:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs font-sans text-slate-200">
                  <span className="text-base">🔭</span>
                  <div>
                    <b className="text-white block font-mono text-xs">Stargazing & Space Exploration</b>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Tracking ISS passes, astronomical events, and reading about propulsion systems and planetary science.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs font-sans text-slate-200">
                  <span className="text-base">🤝</span>
                  <div>
                    <b className="text-white block font-mono text-xs">Student Community & Mentorship</b>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Serving as Webmaster and EXCOM member for IEEE Student Branch, organizing workshops, and helping junior devs get started with Git and Flutter.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs font-sans text-slate-200">
                  <span className="text-base">☕</span>
                  <div>
                    <b className="text-white block font-mono text-xs">Bengaluru Filter Coffee Walk</b>
                    <p className="text-slate-400 text-xs mt-0.5">
                      Walking around the city, finding quiet corners to read, and chatting about tech with friends over hot coffee.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warm personal call-out */}
            <div className="pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-cyan-950/50 border border-cyan-800/60 text-center space-y-2">
                <p className="text-xs font-sans text-slate-200">
                  Want to chat about mobile development, algorithms, space, or opportunities?
                </p>
                <a
                  href="#contact"
                  onClick={() => spaceAudio.playTelemetryBeep(950)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 hover:text-white underline underline-offset-4"
                >
                  <span>Say hello — I&apos;d love to connect</span>
                  <Send className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
