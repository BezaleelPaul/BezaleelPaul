'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { CelestialBodyData } from '@/types/simulation';
import { calculateOrbitPosition } from '@/lib/kepler';
import { createRealisticAtmosphereMaterial, createRealisticStarMaterial } from './RealisticPlanetShaders';
import { spaceAudio } from '@/lib/audio';
import { PLANET_TEXTURE_PATHS, loadCachedTexture } from '@/lib/planetTextures';
import { getOrCreateProceduralPlanetTexture } from '@/lib/proceduralPlanetTexture';

interface CelestialBodyProps {
  data: CelestialBodyData;
  parentPosition?: THREE.Vector3;
  elapsedDays?: number;
  isSelected: boolean;
  onSelect: (body: CelestialBodyData) => void;
  onPositionUpdate?: (id: string, pos: THREE.Vector3) => void;
}

export const CelestialBody: React.FC<CelestialBodyProps> = ({
  data,
  parentPosition,
  elapsedDays,
  isSelected,
  onSelect,
  onPositionUpdate,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const starMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const elapsedRef = useRef(0);

  // 1. Physically-accurate Atmospheric Scattering Material
  const atmosphereMaterial = useMemo(() => {
    if (data.atmosphere && data.atmosphereColor && !data.emissive) {
      const sunsetTint = data.id === 'earth' ? '#f97316' : data.glowColor || '#ea580c';
      return createRealisticAtmosphereMaterial(
        data.atmosphereColor,
        sunsetTint,
        new THREE.Vector3(0, 0, 0),
        data.id === 'earth' ? 1.15 : 0.95
      );
    }
    return null;
  }, [data.atmosphere, data.atmosphereColor, data.glowColor, data.id, data.emissive]);

  // 2. Star Plasma Material with Eddington Limb Darkening
  const starMaterial = useMemo(() => {
    if (data.emissive) {
      const mat = createRealisticStarMaterial(data.color, data.glowColor || '#ff4500');
      starMaterialRef.current = mat;
      return mat;
    }
    return null;
  }, [data.emissive, data.color, data.glowColor]);

  // 3. Authentic NASA Maps (for Sol system) or Procedural Mathematical Textures (for Exoplanets)
  const textures = useMemo(() => {
    const config = PLANET_TEXTURE_PATHS[data.id];
    if (config) {
      return {
        map: config.map ? loadCachedTexture(config.map, true) : null,
        normalMap: config.normalMap ? loadCachedTexture(config.normalMap, false) : null,
        specularMap: config.specularMap ? loadCachedTexture(config.specularMap, false) : null,
        cloudsMap: config.cloudsMap ? loadCachedTexture(config.cloudsMap, true) : null,
        ringMap: config.ringMap ? loadCachedTexture(config.ringMap, true) : null,
      };
    }

    // Procedural mathematical texture generation for infinite star systems
    if (!data.emissive) {
      const isGasGiant = data.hasRings || data.radius > 2.2;
      const proceduralMap = getOrCreateProceduralPlanetTexture(
        data.id,
        data.color,
        data.glowColor || '#38bdf8',
        isGasGiant
      );
      return {
        map: proceduralMap,
        normalMap: null,
        specularMap: null,
        cloudsMap: null,
        ringMap: null,
      };
    }

    return null;
  }, [data.id, data.color, data.glowColor, data.hasRings, data.radius, data.emissive]);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    // 1. Orbital Motion Calculation
    if (elapsedDays !== undefined) {
      const relPos = calculateOrbitPosition(data, elapsedDays);
      const absPos = parentPosition ? relPos.clone().add(parentPosition) : relPos;
      if (groupRef.current) {
        groupRef.current.position.copy(absPos);
      }
      if (onPositionUpdate) {
        onPositionUpdate(data.id, absPos);
      }
    }

    // 2. Physical Axial Rotation
    if (meshRef.current) {
      const rotSpeed =
        data.rotationPeriodHours !== 0
          ? (2 * Math.PI) / (Math.abs(data.rotationPeriodHours) * 3600)
          : 0;
      meshRef.current.rotation.y +=
        (data.rotationPeriodHours < 0 ? -1 : 1) * rotSpeed * delta * 86400 * 0.05;
    }

    // 3. Independent High-Altitude Atmospheric Cloud Drift (Earth)
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.028;
    }

    // 4. Update Solar Plasma Granulation Time
    if (starMaterialRef.current && starMaterialRef.current.uniforms.uTime) {
      starMaterialRef.current.uniforms.uTime.value = elapsedRef.current;
    }

    // 5. Update Atmospheric Scattering Light Vector
    if (atmosphereMaterial && groupRef.current) {
      atmosphereMaterial.uniforms.uSunPosition.value.set(0, 0, 0);
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    spaceAudio.playTelemetryBeep(1200);
    onSelect(data);
  };

  return (
    <group ref={groupRef}>
      {/* Planetary Axial Tilt */}
      <group rotation={[0, 0, (data.axialTiltDeg * Math.PI) / 180]}>
        {/* Stellar Photosphere or Planetary Spherical Mesh */}
        <mesh
          ref={meshRef}
          onClick={handleClick}
          castShadow={!data.emissive}
          receiveShadow={!data.emissive}
        >
          <sphereGeometry args={[data.radius, 64, 64]} />
          {data.emissive && starMaterial ? (
            <primitive object={starMaterial} attach="material" />
          ) : (
            <meshStandardMaterial
              map={textures?.map || undefined}
              color={textures?.map ? '#ffffff' : data.color}
              normalMap={textures?.normalMap || undefined}
              normalScale={textures?.normalMap ? new THREE.Vector2(0.8, 0.8) : undefined}
              roughnessMap={textures?.specularMap || undefined}
              roughness={data.id === 'earth' ? 0.5 : data.hasRings ? 0.8 : 0.72}
              metalness={data.id === 'earth' ? 0.15 : 0.05}
            />
          )}
        </mesh>

        {/* Earth Atmospheric Cloud Deck (Floats slightly above ground, rotates independently) */}
        {data.id === 'earth' && (
          <mesh ref={cloudsRef} scale={[1.022, 1.022, 1.022]}>
            <sphereGeometry args={[data.radius, 64, 64]} />
            <meshStandardMaterial
              map={textures?.cloudsMap || undefined}
              alphaMap={textures?.cloudsMap || undefined}
              transparent
              opacity={0.85}
              roughness={0.9}
              blending={THREE.NormalBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* Physically-Accurate Rayleigh Atmosphere Limb Scattering */}
        {data.atmosphere && atmosphereMaterial && !data.emissive && (
          <mesh material={atmosphereMaterial}>
            <sphereGeometry args={[data.radius * 1.06, 64, 64]} />
          </mesh>
        )}

        {/* Saturn / Gas Giant Concentric Rings with Cassini Division */}
        {data.hasRings && (
          <group ref={ringGroupRef} rotation={[Math.PI / 2, 0, 0]}>
            {/* Main Inner Rings (Ring A & B) */}
            <mesh>
              <ringGeometry args={[data.radius * 1.35, data.radius * 2.05, 64]} />
              <meshStandardMaterial
                map={textures?.ringMap || undefined}
                color={textures?.ringMap ? '#ffffff' : '#d4b76a'}
                side={THREE.DoubleSide}
                transparent
                opacity={0.88}
                roughness={0.7}
              />
            </mesh>
            {/* Cassini Division & Outer Ring C */}
            <mesh>
              <ringGeometry args={[data.radius * 2.14, data.radius * 2.55, 64]} />
              <meshStandardMaterial
                map={textures?.ringMap || undefined}
                color={textures?.ringMap ? '#ffffff' : '#bfa254'}
                side={THREE.DoubleSide}
                transparent
                opacity={0.55}
                roughness={0.8}
              />
            </mesh>
          </group>
        )}
      </group>

      {/* Sleek Minimalist Telemetry Label */}
      <Html distanceFactor={45} position={[0, data.radius * 1.45, 0]} center>
        <div
          onClick={handleClick}
          className={`cursor-pointer px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider transition-all select-none whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md shadow-md ${
            isSelected
              ? 'bg-hud-cyan text-space-950 font-bold border border-hud-cyan shadow-[0_0_15px_#00f3ff]'
              : 'bg-space-950/85 text-slate-200 border border-slate-700/80 hover:border-hud-cyan hover:text-white'
          }`}
        >
          {data.emissive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
          {data.id === 'earth' && <span className="text-[10px]">🌍</span>}
          <span>{isSelected ? `[ TARGET: ${data.name.toUpperCase()} ]` : data.name}</span>
        </div>
      </Html>
    </group>
  );
};
