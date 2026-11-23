'use client';

import React from 'react';
import { CelestialBodyData } from '@/types/simulation';
import { Activity, Globe, Disc, Gauge, Zap } from 'lucide-react';

interface TelemetryPanelProps {
  body: CelestialBodyData | null;
  onClose: () => void;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ body, onClose }) => {
  if (!body) return null;

  return (
    <aside className="absolute right-4 top-20 z-20 w-80 max-h-[calc(100vh-100px)] overflow-y-auto bg-space-900/90 border border-hud-cyan/40 rounded-lg p-4 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)] font-mono text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-900/60 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shadow-[0_0_8px]"
            style={{ backgroundColor: body.color, boxShadow: `0 0 10px ${body.glowColor}` }}
          />
          <div>
            <h2 className="text-sm font-bold tracking-wider text-hud-cyan uppercase">
              {body.name}
            </h2>
            <p className="text-[10px] text-gray-400">JPL ID #{body.jplHorizonsId} · {body.type.toUpperCase()}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close telemetry panel"
          className="rounded border border-slate-700 bg-space-800 px-2 py-1 text-[10px] text-gray-400 hover:text-white"
        >
          Close
        </button>
      </div>

      {/* Description */}
      <p className="text-[11px] text-gray-300 leading-relaxed mb-4 italic border-l-2 border-hud-cyan pl-2">
        {body.description}
      </p>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-space-800/80 p-2 rounded border border-slate-800">
          <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-hud-cyan" /> ORBIT VELOCITY
          </span>
          <span className="text-hud-cyan font-bold text-sm">
            {body.orbitalVelocityKms} <span className="text-[10px] font-normal text-gray-400">km/s</span>
          </span>
        </div>

        <div className="bg-space-800/80 p-2 rounded border border-slate-800">
          <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1">
            <Globe className="w-3 h-3 text-hud-amber" /> MEAN RADIUS
          </span>
          <span className="text-hud-amber font-bold text-sm">
            {body.actualRadiusKm.toLocaleString()} <span className="text-[10px] font-normal text-gray-400">km</span>
          </span>
        </div>

        <div className="bg-space-800/80 p-2 rounded border border-slate-800">
          <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" /> SURFACE GRAVITY
          </span>
          <span className="text-emerald-400 font-bold text-sm">
            {body.gravityMps2} <span className="text-[10px] font-normal text-gray-400">m/s²</span>
          </span>
        </div>

        <div className="bg-space-800/80 p-2 rounded border border-slate-800">
          <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-hud-crimson" /> SURFACE TEMP
          </span>
          <span className="text-hud-crimson font-bold text-sm">
            {body.surfaceTempC} <span className="text-[10px] font-normal text-gray-400">°C</span>
          </span>
        </div>
      </div>

      {/* Orbital Mechanics Parameters */}
      <div className="mb-4 bg-space-800/50 p-2.5 rounded border border-slate-800">
        <h3 className="text-[10px] tracking-wider text-hud-cyan uppercase font-bold mb-2 flex items-center gap-1">
          <Disc className="w-3 h-3" /> KEPLERIAN ORBITAL ELEMENTS
        </h3>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-gray-400">Semi-Major Axis:</span>
            <span className="text-white font-semibold">{body.actualSemiMajorAxisAU} AU</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Eccentricity (e):</span>
            <span className="text-hud-amber font-semibold">{body.eccentricity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Orbital Period:</span>
            <span className="text-white font-semibold">{body.orbitalPeriodDays.toLocaleString()} d</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Orbital Inclination:</span>
            <span className="text-white font-semibold">{body.inclinationDeg}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Axial Tilt:</span>
            <span className="text-white font-semibold">{body.axialTiltDeg}°</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Mass:</span>
            <span className="text-white font-semibold">{body.massKg} kg</span>
          </div>
        </div>
      </div>

      {/* Atmospheric Composition */}
      <div>
        <h3 className="text-[10px] tracking-wider text-gray-400 uppercase font-bold mb-1.5">
          ATMOSPHERIC SPECTRA
        </h3>
        <div className="space-y-1">
          {body.atmosphericComposition.map((comp, idx) => (
            <div key={idx} className="flex items-center justify-between text-[10px] bg-space-950/60 px-2 py-1 rounded">
              <span className="text-gray-300">{comp}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan/80" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
