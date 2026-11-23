'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CelestialBody } from './CelestialBody';
import { OrbitLine } from './OrbitLine';
import { Starfield } from './Starfield';
import { CelestialBodyData } from '@/types/simulation';
import { calculateOrbitPosition } from '@/lib/kepler';
import { StarSystem } from '@/lib/proceduralUniverse';

interface HeroCosmosProps {
  system: StarSystem;
  selectedBodyId?: string;
  onSelectBody?: (body: CelestialBodyData) => void;
  isWarping?: boolean;
  isFullJourney?: boolean;
}

function SolarSystemRig({ system, selectedBodyId, onSelectBody, isFullJourney }: HeroCosmosProps) {
  const rigGroupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  // Split primary bodies (star and planets) vs satellites (moons)
  const primaryBodies = system.bodies.filter((b) => !b.parentBodyId);
  const moonBodies = system.bodies.filter((b) => !!b.parentBodyId);

  // Group refs for 60+ FPS zero-state transform updates
  const bodyGroups = useRef<{ [id: string]: THREE.Group | null }>({});
  const orbitLineGroups = useRef<{ [id: string]: THREE.Group | null }>({});

  useFrame((state, delta) => {
    // Serene celestial time clock
    timeRef.current += delta * 1.6;
    const t = timeRef.current;

    const parentPositions: { [id: string]: THREE.Vector3 } = {};

    // 1. Primary bodies (Star and Planets)
    primaryBodies.forEach((body) => {
      const pos = calculateOrbitPosition(body, t);
      parentPositions[body.id] = pos;
      const grp = bodyGroups.current[body.id];
      if (grp) {
        grp.position.copy(pos);
      }
    });

    // 2. Secondary moons
    moonBodies.forEach((moon) => {
      const parentPos = moon.parentBodyId ? parentPositions[moon.parentBodyId] : undefined;
      const relPos = calculateOrbitPosition(moon, t);
      const absPos = parentPos ? relPos.clone().add(parentPos) : relPos;
      const grp = bodyGroups.current[moon.id];
      if (grp) {
        grp.position.copy(absPos);
      }
      const lineGrp = orbitLineGroups.current[moon.id];
      if (lineGrp && parentPos) {
        lineGrp.position.copy(parentPos);
      }
    });

    // 3. Subtle mouse parallax drift only in background mode (when OrbitControls is not taking over)
    if (!isFullJourney && rigGroupRef.current) {
      const mouseX = state.pointer.x * 0.1;
      const mouseY = state.pointer.y * 0.06;
      rigGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.y,
        mouseX + 0.08,
        0.035
      );
      rigGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        rigGroupRef.current.rotation.x,
        -mouseY - 0.28,
        0.035
      );
    }
  });

  return (
    <group ref={rigGroupRef} position={[0, -2, 0]} rotation={isFullJourney ? [0, 0, 0] : [-0.32, 0.15, 0]}>
      {/* Central Star Light Source with Realistic Solar Spectrum */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1050 * system.star.coronaIntensity}
        color={system.star.colorHex}
        distance={2500}
        decay={1.15}
      />
      {/* Ambient starlight from the Milky Way */}
      <ambientLight intensity={0.08} color="#475569" />

      {/* Planetary Orbit Lines */}
      {primaryBodies
        .filter((b) => b.type !== 'star')
        .map((body) => (
          <OrbitLine
            key={`orbit-${system.id}-${body.id}`}
            body={body}
            isSelected={selectedBodyId === body.id}
          />
        ))}

      {/* Primary Celestial Bodies */}
      {primaryBodies.map((body) => (
        <group
          key={`${system.id}-${body.id}`}
          ref={(el) => {
            bodyGroups.current[body.id] = el;
          }}
        >
          <CelestialBody
            data={body}
            isSelected={selectedBodyId === body.id}
            onSelect={(b) => onSelectBody?.(b)}
          />
        </group>
      ))}

      {/* Moon Orbit Lines */}
      {moonBodies.map((moon) => (
        <group
          key={`moon-orbit-${system.id}-${moon.id}`}
          ref={(el) => {
            orbitLineGroups.current[moon.id] = el;
          }}
        >
          <OrbitLine body={moon} isSelected={selectedBodyId === moon.id} />
        </group>
      ))}

      {/* Moon Bodies */}
      {moonBodies.map((moon) => (
        <group
          key={`${system.id}-${moon.id}`}
          ref={(el) => {
            bodyGroups.current[moon.id] = el;
          }}
        >
          <CelestialBody
            data={moon}
            isSelected={selectedBodyId === moon.id}
            onSelect={(b) => onSelectBody?.(b)}
          />
        </group>
      ))}
    </group>
  );
}

export const HeroCelestialHorizon: React.FC<HeroCosmosProps> = ({
  system,
  selectedBodyId,
  onSelectBody,
  isWarping = false,
  isFullJourney = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-space-950/90 to-space-950"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 z-0 select-none overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Solar System simulation - drag to rotate, scroll to zoom"
    >
      <Canvas
        camera={{ position: isFullJourney ? [0, 32, 75] : [0, 26, 68], fov: 45, near: 0.1, far: 3500 }}
        dpr={[1, isFullJourney ? 1.25 : 1.1]}
        gl={{
          antialias: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
          powerPreference: 'low-power',
          alpha: true,
        }}
      >
        {/* Deep Cosmic Starfield & Interstellar Dust */}
        <Starfield count={isFullJourney ? 5200 : 3200} />

        {/* 360-degree Interactive Orbit Controls - always enabled */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={10}
          maxDistance={400}
          rotateSpeed={0.75}
          zoomSpeed={0.85}
          enableZoom={true}
          panSpeed={0.7}
          maxPolarAngle={Math.PI / 2 + 0.12}
        />

        {/* Orbiting Star System & Planetary Spheres */}
        <SolarSystemRig
          system={system}
          selectedBodyId={selectedBodyId}
          onSelectBody={onSelectBody}
          isWarping={isWarping}
          isFullJourney={isFullJourney}
        />
      </Canvas>

      {/* Subtle atmospheric vignette so foreground text remains readable without obscuring planets */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/35 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
};
