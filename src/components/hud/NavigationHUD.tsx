'use client';

import React from 'react';
import { CelestialBodyData } from '@/types/simulation';
import { CELESTIAL_BODIES } from '@/lib/constants';
import { spaceAudio } from '@/lib/audio';
import { Volume2, VolumeX, Play, Pause, FastForward, Compass, Eye, Shield, Rocket } from 'lucide-react';

interface NavigationHUDProps {
  elapsedDays: number;
  timeScale: number;
  onSetTimeScale: (scale: number) => void;
  selectedBody: CelestialBodyData | null;
  onSelectBody: (body: CelestialBodyData) => void;
  cameraMode: 'free' | 'orbit' | 'flight' | 'cockpit';
  onSetCameraMode: (mode: 'free' | 'orbit' | 'flight' | 'cockpit') => void;
  onOpenDossier: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const NavigationHUD: React.FC<NavigationHUDProps> = ({
  elapsedDays,
  timeScale,
  onSetTimeScale,
  selectedBody,
  onSelectBody,
  cameraMode,
  onSetCameraMode,
  onOpenDossier,
  isMuted,
  onToggleSound,
}) => {
  // Convert elapsed simulated days into simulated calendar offset
  const simDate = new Date(Date.UTC(2026, 0, 1) + elapsedDays * 86400000);
  const julianDate = (2461041.5 + elapsedDays).toFixed(2);

  const timeScales = [
    { label: '0x', value: 0, icon: Pause },
    { label: '1x', value: 1, icon: Play },
    { label: '5x', value: 5, icon: FastForward },
    { label: '25x', value: 25, icon: FastForward },
    { label: '100x', value: 100, icon: FastForward },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-space-900/95 via-space-900/70 to-transparent border-b border-cyan-500/20 backdrop-blur-md">
      {/* Brand & Mission Status */}
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-hud-cyan animate-ping" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-widest text-hud-cyan font-bold">
              BEZFORGE // ORBITAL OBSERVATORY
            </span>
            <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800 font-mono">
              ONLINE
            </span>
          </div>
          <p className="text-[11px] font-mono text-gray-400">
            SIM DATE: <span className="text-gray-200">{simDate.toISOString().slice(0, 10)}</span> · JD: <span className="text-hud-amber">{julianDate}</span>
          </p>
        </div>
      </div>

      {/* Target Quick Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
          TARGET:
        </span>
        {CELESTIAL_BODIES.map((body) => {
          const isCurrent = selectedBody?.id === body.id;
          return (
            <button
              key={body.id}
              onClick={() => {
                spaceAudio.playTelemetryBeep(1100);
                onSelectBody(body);
              }}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-all whitespace-nowrap ${
                isCurrent
                  ? 'bg-hud-cyan text-space-900 font-bold shadow-[0_0_12px_rgba(0,243,255,0.6)]'
                  : 'bg-space-800/80 text-gray-300 border border-slate-700/60 hover:border-hud-cyan/60 hover:text-hud-cyan'
              }`}
            >
              {body.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Time Warp, Camera, Audio & Portfolio controls */}
      <div className="flex items-center gap-2">
        {/* Time Warp Buttons */}
        <div className="flex items-center bg-space-800/90 rounded border border-slate-700/80 p-0.5">
          {timeScales.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                spaceAudio.playTelemetryBeep(850);
                onSetTimeScale(s.value);
              }}
              className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                timeScale === s.value
                  ? 'bg-hud-cyan text-space-900 font-bold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Camera Mode Switcher */}
        <div className="flex items-center bg-space-800/90 rounded border border-slate-700/80 p-0.5">
          <button
            title="Free Solar Orbit"
            onClick={() => onSetCameraMode('free')}
            className={`p-1.5 rounded transition-colors ${
              cameraMode === 'free' ? 'bg-hud-cyan text-space-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button
            title="Planet Focus Mode"
            onClick={() => onSetCameraMode('orbit')}
            className={`p-1.5 rounded transition-colors ${
              cameraMode === 'orbit' ? 'bg-hud-cyan text-space-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            title="Ship Chase Camera"
            onClick={() => onSetCameraMode('flight')}
            className={`p-1.5 rounded transition-colors ${
              cameraMode === 'flight' ? 'bg-hud-cyan text-space-900' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={onToggleSound}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-1.5 bg-space-800/90 rounded border border-slate-700/80 text-gray-300 hover:text-hud-cyan transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-hud-cyan" />}
        </button>

        {/* Commander Dossier / Mission Archives Button */}
        <button
          onClick={() => {
            spaceAudio.playTelemetryBeep(1400);
            onOpenDossier();
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-semibold rounded shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>PILOT DOSSIER</span>
        </button>
      </div>
    </header>
  );
};
