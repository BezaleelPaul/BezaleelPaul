'use client';

import React, { useState, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { CELESTIAL_BODIES } from '@/lib/constants';
import { CelestialBodyData, SpacecraftState } from '@/types/simulation';
import { CelestialBody } from './CelestialBody';
import { OrbitLine } from './OrbitLine';
import { AsteroidBelt } from './AsteroidBelt';
import { Starfield } from './Starfield';
import { Spacecraft } from './Spacecraft';
import { CameraController } from './CameraController';

interface SpaceCanvasProps {
  elapsedDays: number;
  selectedBody: CelestialBodyData | null;
  onSelectBody: (body: CelestialBodyData) => void;
  cameraMode: 'free' | 'orbit' | 'flight' | 'cockpit';
  onSpacecraftUpdate: (state: SpacecraftState) => void;
  spacecraftState: SpacecraftState;
}

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({
  elapsedDays,
  selectedBody,
  onSelectBody,
  cameraMode,
  onSpacecraftUpdate,
  spacecraftState,
}) => {
  const [positions, setPositions] = useState<{ [id: string]: THREE.Vector3 }>({});

  const handlePositionUpdate = useCallback((id: string, pos: THREE.Vector3) => {
    setPositions((prev) => ({
      ...prev,
      [id]: pos.clone(),
    }));
  }, []);

  // Separate parent and moon bodies
  const primaryBodies = CELESTIAL_BODIES.filter((b) => !b.parentBodyId);
  const moonBodies = CELESTIAL_BODIES.filter((b) => !!b.parentBodyId);

  return (
    <div className="relative w-full h-full bg-[#02040a] select-none">
      <Canvas
        camera={{ position: [0, 45, 80], fov: 48, near: 0.1, far: 2000 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          powerPreference: 'high-performance',
        }}
        shadows
      >
        {/* Subtle ambient light for shadowy world detail */}
        <ambientLight intensity={0.08} color="#94a3b8" />

        {/* The Sun PointLight source (illuminates all planets realistically) */}
        <pointLight
          position={[0, 0, 0]}
          intensity={850}
          color="#fff8e7"
          distance={1000}
          decay={1.2}
          castShadow
          shadow-bias={-0.0001}
        />

        {/* Infinite Starfield */}
        <Starfield count={7500} />

        {/* Orbit Trajectory Lines for primary bodies */}
        {primaryBodies.map((body) => (
          <OrbitLine
            key={`orbit-${body.id}`}
            body={body}
            isSelected={selectedBody?.id === body.id}
          />
        ))}

        {/* Primary Celestial Bodies (Sol, Mercury, Venus, Earth, Mars, Jupiter, Saturn) */}
        {primaryBodies.map((body) => (
          <CelestialBody
            key={body.id}
            data={body}
            elapsedDays={elapsedDays}
            isSelected={selectedBody?.id === body.id}
            onSelect={onSelectBody}
            onPositionUpdate={handlePositionUpdate}
          />
        ))}

        {/* Moons orbiting parent planets (Luna, Europa) */}
        {moonBodies.map((moon) => {
          const parentPos = moon.parentBodyId ? positions[moon.parentBodyId] : undefined;
          return (
            <React.Fragment key={moon.id}>
              {parentPos && (
                <OrbitLine
                  body={moon}
                  parentPosition={parentPos}
                  isSelected={selectedBody?.id === moon.id}
                />
              )}
              <CelestialBody
                data={moon}
                parentPosition={parentPos}
                elapsedDays={elapsedDays}
                isSelected={selectedBody?.id === moon.id}
                onSelect={onSelectBody}
                onPositionUpdate={handlePositionUpdate}
              />
            </React.Fragment>
          );
        })}

        {/* Main Asteroid Belt between Mars & Jupiter */}
        <AsteroidBelt innerRadius={39} outerRadius={48} count={1400} />

        {/* Interactive Spacecraft */}
        <Spacecraft
          flightMode={cameraMode}
          onStateUpdate={onSpacecraftUpdate}
        />

        {/* Dynamic Multi-Mode Camera Controller */}
        <CameraController
          selectedBody={selectedBody}
          bodyPositions={positions}
          spacecraftState={spacecraftState}
          cameraMode={cameraMode}
        />
      </Canvas>
    </div>
  );
};
