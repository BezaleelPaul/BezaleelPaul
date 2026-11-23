'use client';

import React from 'react';
import { SpacecraftState } from '@/types/simulation';
import { Rocket, Gauge, Zap, Crosshair } from 'lucide-react';

interface FlightControlsProps {
  state: SpacecraftState;
  cameraMode: 'free' | 'orbit' | 'flight' | 'cockpit';
  onSetCameraMode: (mode: 'free' | 'orbit' | 'flight' | 'cockpit') => void;
}

export const FlightControls: React.FC<FlightControlsProps> = ({
  state,
  cameraMode,
  onSetCameraMode,
}) => {
  const isFlightActive = cameraMode === 'flight' || cameraMode === 'cockpit';

  return (
    <div className="absolute left-4 bottom-4 z-20 pointer-events-auto font-mono text-xs select-none">
      <div className="bg-space-900/90 border border-hud-cyan/40 rounded-lg p-3.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.8)] w-72">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-900/50">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-hud-cyan animate-pulse" />
            <span className="font-bold text-hud-cyan tracking-wider">
              SPACECRAFT TELEMETRY
            </span>
          </div>
          <button
            onClick={() => onSetCameraMode(isFlightActive ? 'orbit' : 'flight')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider transition-all ${
              isFlightActive
                ? 'bg-hud-cyan text-space-900 shadow-[0_0_10px_#00f3ff]'
                : 'bg-space-800 text-gray-300 border border-slate-700 hover:text-white'
            }`}
          >
            {isFlightActive ? 'FLIGHT ACTIVE' : 'ENGAGE FLIGHT'}
          </button>
        </div>

        {/* Speed & Fuel */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-space-950/70 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-hud-cyan" /> VELOCITY
            </span>
            <span className="text-hud-cyan font-bold text-sm">
              {state.speedKms} <span className="text-[10px] font-normal text-gray-400">km/s</span>
            </span>
          </div>

          <div className="bg-space-950/70 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-gray-400 block mb-0.5 flex items-center gap-1">
              <Zap className="w-3 h-3 text-hud-amber" /> CAPACITOR
            </span>
            <span className={`font-bold text-sm ${state.fuelPercent < 20 ? 'text-hud-crimson animate-pulse' : 'text-hud-amber'}`}>
              {state.fuelPercent}%
            </span>
          </div>
        </div>

        {/* Capacitor Bar */}
        <div className="w-full bg-space-950 rounded-full h-1.5 mb-3 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-200 ${
              state.isBoosting ? 'bg-hud-cyan shadow-[0_0_8px_#00f3ff]' : 'bg-hud-amber'
            }`}
            style={{ width: `${state.fuelPercent}%` }}
          />
        </div>

        {/* Cockpit / Chase Camera Switcher */}
        {isFlightActive && (
          <div className="flex gap-1.5 mb-3">
            <button
              onClick={() => onSetCameraMode('flight')}
              className={`flex-1 py-1 rounded text-[10px] flex items-center justify-center gap-1 border ${
                cameraMode === 'flight'
                  ? 'bg-cyan-950 border-hud-cyan text-hud-cyan font-bold'
                  : 'bg-space-800/80 border-slate-700 text-gray-400'
              }`}
            >
              <Rocket className="w-3 h-3" /> CHASE CAM
            </button>
            <button
              onClick={() => onSetCameraMode('cockpit')}
              className={`flex-1 py-1 rounded text-[10px] flex items-center justify-center gap-1 border ${
                cameraMode === 'cockpit'
                  ? 'bg-cyan-950 border-hud-cyan text-hud-cyan font-bold'
                  : 'bg-space-800/80 border-slate-700 text-gray-400'
              }`}
            >
              <Crosshair className="w-3 h-3" /> COCKPIT POV
            </button>
          </div>
        )}

        {/* Flight Control Legend */}
        <div className="bg-space-950/90 p-2 rounded border border-slate-850 text-[10px] space-y-1 text-gray-400">
          <div className="flex justify-between">
            <span className="text-gray-300">[W / S]</span>
            <span>Thrust / Reverse</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">[A / D]</span>
            <span>Yaw Left / Right</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">[Q / E]</span>
            <span>Roll Stabilization</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hud-cyan font-semibold">[SPACE]</span>
            <span className="text-hud-cyan">Hyper-Boost Overdrive</span>
          </div>
        </div>
      </div>
    </div>
  );
};
