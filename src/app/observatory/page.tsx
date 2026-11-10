'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SpaceCanvas } from '@/components/canvas/SpaceCanvas';
import { NavigationHUD } from '@/components/hud/NavigationHUD';
import { TelemetryPanel } from '@/components/hud/TelemetryPanel';
import { FlightControls } from '@/components/hud/FlightControls';
import { MissionLogModal } from '@/components/hud/MissionLogModal';
import { NasaDiscoveriesModal } from '@/components/hud/NasaDiscoveriesModal';
import { CelestialBodyData, SpacecraftState } from '@/types/simulation';
import { CELESTIAL_BODIES } from '@/lib/constants';
import { spaceAudio } from '@/lib/audio';
import { ArrowLeft, Radio, Sparkles, Orbit } from 'lucide-react';

export default function ObservatoryPage() {
  const [elapsedDays, setElapsedDays] = useState<number>(0);
  const [timeScale, setTimeScale] = useState<number>(1);
  const [selectedBody, setSelectedBody] = useState<CelestialBodyData | null>(
    CELESTIAL_BODIES.find((b) => b.id === 'earth') || CELESTIAL_BODIES[0]
  );
  const [cameraMode, setCameraMode] = useState<'free' | 'orbit' | 'flight' | 'cockpit'>('orbit');
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isNasaOpen, setIsNasaOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Spacecraft physics state
  const [spacecraftState, setSpacecraftState] = useState<SpacecraftState>({
    position: [0, 5, 25],
    velocity: [0, 0, 0],
    rotation: [0, 0, 0],
    throttle: 0,
    isBoosting: false,
    speedKms: 0,
    fuelPercent: 100,
    targetId: null,
    mode: 'orbit',
  });

  // Timekeeper animation frame loop
  const lastTimeRef = useRef<number>(performance.now());
  useEffect(() => {
    let animId: number;
    const loop = (time: number) => {
      const dtSeconds = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (timeScale > 0) {
        // 1 real second = 0.5 * timeScale simulated days
        setElapsedDays((prev) => prev + dtSeconds * 0.5 * timeScale);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [timeScale]);

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    spaceAudio.setMuted(next);
    if (!next) {
      spaceAudio.playTelemetryBeep(1000);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#02040a] text-white">
      {/* 3D Celestial WebGL Canvas */}
      <SpaceCanvas
        elapsedDays={elapsedDays}
        selectedBody={selectedBody}
        onSelectBody={(body) => {
          setSelectedBody(body);
          if (cameraMode === 'flight' || cameraMode === 'cockpit') {
            setCameraMode('orbit');
          }
        }}
        cameraMode={cameraMode}
        onSpacecraftUpdate={setSpacecraftState}
        spacecraftState={spacecraftState}
      />

      {/* Top Navigation HUD */}
      <NavigationHUD
        elapsedDays={elapsedDays}
        timeScale={timeScale}
        onSetTimeScale={setTimeScale}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
        cameraMode={cameraMode}
        onSetCameraMode={setCameraMode}
        onOpenDossier={() => setIsDossierOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Persistent Left Exit/Return Link & NASA Trigger */}
      <div className="absolute top-16 left-4 z-20 flex flex-col gap-2 font-mono">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 bg-space-900/90 hover:bg-hud-cyan hover:text-space-950 text-gray-200 border border-cyan-800/60 rounded-lg backdrop-blur-md text-xs transition-all shadow-lg group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>PORTFOLIO HOME</span>
        </Link>

        <button
          onClick={() => {
            spaceAudio.playTelemetryBeep(1100);
            setIsNasaOpen(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-950/90 to-blue-950/90 hover:from-hud-cyan hover:to-cyan-400 hover:text-space-950 text-hud-cyan border border-cyan-500/50 rounded-lg backdrop-blur-md text-xs transition-all shadow-[0_0_15px_rgba(0,243,255,0.2)] animate-pulse"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>NASA LIVE DISCOVERIES</span>
        </button>
      </div>

      {/* Right Telemetry Panel */}
      <TelemetryPanel
        body={selectedBody}
        onClose={() => setSelectedBody(null)}
      />

      {/* Bottom Flight Controls HUD (shown in flight & cockpit modes) */}
      {(cameraMode === 'flight' || cameraMode === 'cockpit') && (
        <FlightControls
          state={spacecraftState}
          cameraMode={cameraMode}
          onSetCameraMode={setCameraMode}
        />
      )}

      {/* Modals */}
      <MissionLogModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      <NasaDiscoveriesModal
        isOpen={isNasaOpen}
        onClose={() => setIsNasaOpen(false)}
        onTargetAsteroid={(astName) => {
          // Switch camera to Earth/Sun and inform user
          const earth = CELESTIAL_BODIES.find((b) => b.id === 'earth');
          if (earth) setSelectedBody(earth);
          setCameraMode('orbit');
        }}
      />
    </main>
  );
}
