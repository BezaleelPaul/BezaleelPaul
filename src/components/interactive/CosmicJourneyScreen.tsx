'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  X, 
  Orbit, 
  Shuffle, 
  Crosshair, 
  Sparkles, 
  Compass, 
  ChevronRight, 
  ChevronLeft,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';
import { TelemetryPanel } from '../hud/TelemetryPanel';
import { CelestialBodyData } from '@/types/simulation';
import { StarSystem } from '@/lib/proceduralUniverse';

const HeroCelestialHorizon = dynamic(
  () => import('../canvas/HeroCelestialHorizon').then((mod) => mod.HeroCelestialHorizon),
  { ssr: false }
);

interface CosmicJourneyScreenProps {
  isOpen: boolean;
  onClose: () => void;
  system: StarSystem;
  currentSeed: string;
  onWarp: (seed: string) => void;
  onNextSector: () => void;
  onPrevSector: () => void;
  onRandomSystem: () => void;
  selectedBody: CelestialBodyData | null;
  onSelectBody: (body: CelestialBodyData | null) => void;
  isWarping?: boolean;
}

export const CosmicJourneyScreen: React.FC<CosmicJourneyScreenProps> = ({
  isOpen,
  onClose,
  system,
  currentSeed,
  onWarp,
  onNextSector,
  onPrevSector,
  onRandomSystem,
  selectedBody,
  onSelectBody,
  isWarping = false,
}) => {
  const [seedInput, setSeedInput] = useState(currentSeed);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSeedInput(currentSeed);
  }, [currentSeed]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="observatory-title"
      className="fixed inset-0 z-50 flex select-none flex-col justify-between overflow-hidden bg-[#02040a] text-white animate-in fade-in duration-300"
    >
      {/* 3D Full-Screen Canvas with Full OrbitControls */}
      <div className="absolute inset-0 z-0">
        <HeroCelestialHorizon
          system={system}
          selectedBodyId={selectedBody?.id}
          onSelectBody={(body) => {
            onSelectBody(body);
            spaceAudio.playTelemetryBeep(1200);
          }}
          isWarping={isWarping}
          isFullJourney={true}
        />
      </div>

      {/* Floating Telemetry Panel */}
      <TelemetryPanel body={selectedBody} onClose={() => onSelectBody(null)} />

      {/* TOP NAVIGATION & SYSTEM STATUS BAR */}
      <header className="relative z-10 px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-[#070b14]/90 via-[#070b14]/60 to-transparent backdrop-blur-md border-b border-slate-800/60">
        {/* System & Star Telemetry */}
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <h2 id="observatory-title" className="flex items-center gap-2 font-mono text-base font-extrabold tracking-wider text-white sm:text-lg">
                <Orbit className="w-5 h-5 text-cyan-400" />
                {system.name.toUpperCase()}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-700 text-cyan-300 uppercase">
                {system.star.spectralType}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Sector [X: {system.sectorCoordinates.x}, Y: {system.sectorCoordinates.y}, Z: {system.sectorCoordinates.z}] · {system.bodies.length - 1} Worlds · Habitable Zone: {system.star.habitableZoneInnerAU}–{system.star.habitableZoneOuterAU} AU
            </p>
          </div>
        </div>

        {/* Real Star System Presets */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onWarp('sol')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              currentSeed === 'sol'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            Sol
          </button>
          <button
            onClick={() => onWarp('trappist_1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              currentSeed === 'trappist_1'
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.8)]'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            TRAPPIST-1
          </button>
          <button
            onClick={() => onWarp('alpha_centauri')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              currentSeed === 'alpha_centauri'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.8)]'
                : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            Alpha Centauri
          </button>
        </div>

        {/* Exit Journey Button */}
        <button
          ref={closeButtonRef}
          onClick={() => {
            spaceAudio.playTelemetryBeep(900);
            onClose();
          }}
          className="group flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2 font-mono text-xs font-bold tracking-wider text-white shadow-lg transition-all hover:border-red-500 hover:bg-red-950/80"
        >
          <span>Return to résumé</span>
          <X className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
          <span className="hidden sm:inline text-[10px] text-slate-500">[ESC]</span>
        </button>
      </header>

      {/* CENTER HUD HINT (Fades after interaction) */}
      <div className="relative z-10 pointer-events-none text-center self-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-sm shadow-md">
          <span>Drag to orbit</span>
          <span>·</span>
          <span>Scroll to zoom</span>
          <span>·</span>
          <span>Select a body to inspect</span>
        </span>
      </div>

      {/* BOTTOM CONSOLE: MINECRAFT SEED GENERATION & TARGET STRIP */}
      <footer className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-[#070b14]/95 via-[#070b14]/80 to-transparent backdrop-blur-md border-t border-slate-800/80 space-y-3">
        {/* Minecraft-Style Seed Exploration Input Bar */}
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[280px]">
            <label htmlFor="system-seed" className="whitespace-nowrap font-mono text-xs font-bold text-cyan-400">
              System seed
            </label>
            <input
              id="system-seed"
              type="text"
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onWarp(seedInput);
              }}
              placeholder="Type any word or number..."
              className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950/90 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 shadow-inner"
            />
            <button
              onClick={() => onWarp(seedInput)}
              className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(34,211,238,0.5)] whitespace-nowrap"
            >
              Generate
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRandomSystem}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-all"
              title="Generate random uncharted star system"
            >
              <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Random World</span>
            </button>

            <button
              onClick={onPrevSector}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 transition-all"
              title="Warp to previous sector"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Prev Sector</span>
            </button>

            <button
              onClick={onNextSector}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-600/80 text-xs font-mono text-cyan-300 font-bold transition-all shadow-md"
              title="Generate the next sector"
            >
              <span>Explore Next Sector</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Planet Targeting Selector Strip */}
        <div className="max-w-4xl mx-auto flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-cyan-400" /> Lock Target:
          </span>
          {system.bodies.map((body) => {
            const isTargeted = selectedBody?.id === body.id;
            return (
              <button
                key={`btn-journey-${body.id}`}
                onClick={() => {
                  onSelectBody(body);
                  spaceAudio.playTelemetryBeep(1150);
                }}
                className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isTargeted
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.7)]'
                    : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: body.color }}
                />
                <span>{body.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
