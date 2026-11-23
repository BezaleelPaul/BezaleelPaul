'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createAtmosphereMaterial } from './AtmosphereShader';

export interface ProceduralPlanetProps {
  seed: string;
  roughness?: number; // 0.5 to 2.0
  radius?: number; // 3 to 6
  palette?: string; // 'auto' | 'terrestrial' | 'volcanic' | 'ocean' | 'gas_giant' | 'glacius'
  rotationSpeed?: number;
  showRings?: boolean;
}

// Deterministic PRNG (Mulberry32)
function createPrng(seedStr: string) {
  let h = 0xefc8249d;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 0x5bd1e995);
    h ^= h >>> 15;
  }
  let a = h >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 2D/3D smooth pseudo harmonic noise
function harmonicNoise(x: number, y: number, s: number) {
  return (
    Math.sin(x * 3.1 + s * 1.7) * Math.cos(y * 3.1 + s * 2.3) +
    0.5 * Math.sin(x * 6.3 + s * 3.1) * Math.cos(y * 6.3 + s * 4.1) +
    0.25 * Math.sin(x * 12.5 + s * 5.7) * Math.cos(y * 12.5 + s * 7.9)
  ) / 1.75;
}

export interface BiomeConfig {
  type: string;
  name: string;
  description: string;
  hasWater: boolean;
  deepWater: string;
  shallowWater: string;
  lowLand: string;
  midLand: string;
  highLand: string;
  peaks: string;
  atmosphereColor: string;
  cloudColor: string;
  hasRings: boolean;
  ringColor: string;
  ringOpacity: number;
}

const BIOME_PRESETS: Record<string, BiomeConfig> = {
  terrestrial: {
    type: 'terrestrial',
    name: 'Class-M Terrestrial Garden',
    description: 'Temperate biosphere with nitrogen-oxygen atmosphere, liquid oceans, verdant continents, and polar ice caps.',
    hasWater: true,
    deepWater: '#0c2444',
    shallowWater: '#1d5a8c',
    lowLand: '#2d6a3f',
    midLand: '#52796f',
    highLand: '#8d775f',
    peaks: '#ffffff',
    atmosphereColor: '#60a5fa',
    cloudColor: '#ffffff',
    hasRings: false,
    ringColor: '#cbd5e1',
    ringOpacity: 0.3,
  },
  ocean: {
    type: 'ocean',
    name: 'Bioluminescent Aquaworld',
    description: 'Deep global saltwater hydrosphere with glowing coral archipelagos, cyan mist, and cyan auroras.',
    hasWater: true,
    deepWater: '#02182b',
    shallowWater: '#006494',
    lowLand: '#00a6fb',
    midLand: '#0582ca',
    highLand: '#00f0ff',
    peaks: '#bbf7d0',
    atmosphereColor: '#38bdf8',
    cloudColor: '#e0f2fe',
    hasRings: true,
    ringColor: '#38bdf8',
    ringOpacity: 0.45,
  },
  volcanic: {
    type: 'volcanic',
    name: 'Pyroclastic Magma Core',
    description: 'Superheated basaltic crust crisscrossed by active lava fissures, incandescent silicate rivers, and sulfur smog.',
    hasWater: true, // used for lava
    deepWater: '#7f1d1d',
    shallowWater: '#dc2626',
    lowLand: '#1c1917',
    midLand: '#292524',
    highLand: '#ea580c',
    peaks: '#facc15',
    atmosphereColor: '#f97316',
    cloudColor: '#451a03',
    hasRings: true,
    ringColor: '#fb923c',
    ringOpacity: 0.6,
  },
  gas_giant: {
    type: 'gas_giant',
    name: 'Jovian Banded Gas Giant',
    description: 'Massive atmospheric envelope with alternating zonal jet streams, anticyclonic storms, and vast planetary rings.',
    hasWater: false,
    deepWater: '#b45309',
    shallowWater: '#d97706',
    lowLand: '#f59e0b',
    midLand: '#fbbf24',
    highLand: '#fed7aa',
    peaks: '#ffffff',
    atmosphereColor: '#fde047',
    cloudColor: '#fef3c7',
    hasRings: true,
    ringColor: '#fde68a',
    ringOpacity: 0.75,
  },
  glacius: {
    type: 'glacius',
    name: 'Crystalline Glacius Realm',
    description: 'Sub-zero permafrost world with methane ice shelves, sapphire glaciers, and high-albedo frost crevasses.',
    hasWater: true,
    deepWater: '#0f172a',
    shallowWater: '#0284c7',
    lowLand: '#38bdf8',
    midLand: '#bae6fd',
    highLand: '#e0f2fe',
    peaks: '#ffffff',
    atmosphereColor: '#a5f3fc',
    cloudColor: '#ffffff',
    hasRings: true,
    ringColor: '#93c5fd',
    ringOpacity: 0.5,
  },
};

/**
 * Procedurally paints high-resolution spherical textures in memory using seeded math
 */
function generatePlanetMaps(biome: BiomeConfig, seedStr: string, roughness: number) {
  if (typeof window === 'undefined') {
    return { surfaceMap: null, bumpMap: null, cloudsMap: null };
  }

  const prng = createPrng(seedStr);
  const seedOffset = prng() * 100;

  const width = 1024;
  const height = 512;

  // 1. Surface Texture Canvas
  const surfCanvas = document.createElement('canvas');
  surfCanvas.width = width;
  surfCanvas.height = height;
  const surfCtx = surfCanvas.getContext('2d')!;

  // 2. Bump Map Canvas
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d')!;

  // 3. Clouds Texture Canvas
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = width;
  cloudCanvas.height = height;
  const cloudCtx = cloudCanvas.getContext('2d')!;

  const surfImgData = surfCtx.createImageData(width, height);
  const bumpImgData = bumpCtx.createImageData(width, height);
  const cloudImgData = cloudCtx.createImageData(width, height);

  const surfPixels = surfImgData.data;
  const bumpPixels = bumpImgData.data;
  const cloudPixels = cloudImgData.data;

  // Pre-parse hex colors to RGB
  const cDeep = new THREE.Color(biome.deepWater);
  const cShallow = new THREE.Color(biome.shallowWater);
  const cLow = new THREE.Color(biome.lowLand);
  const cMid = new THREE.Color(biome.midLand);
  const cHigh = new THREE.Color(biome.highLand);
  const cPeaks = new THREE.Color(biome.peaks);
  const cCloud = new THREE.Color(biome.cloudColor);

  const lerpColor = (c1: THREE.Color, c2: THREE.Color, alpha: number) => {
    return new THREE.Color().lerpColors(c1, c2, Math.max(0, Math.min(1, alpha)));
  };

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const lat = (v - 0.5) * Math.PI; // -PI/2 to PI/2

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const lon = u * Math.PI * 2; // 0 to 2PI

      // Spherical coordinates
      const cx = Math.cos(lat) * Math.cos(lon);
      const cy = Math.sin(lat);
      const cz = Math.cos(lat) * Math.sin(lon);

      // Multi-octave harmonic elevation noise
      let elevation = harmonicNoise(cx, cy + cz, seedOffset) * roughness;
      elevation += 0.5 * harmonicNoise(cx * 2.1, cy * 2.1 + cz * 2.1, seedOffset + 21);
      elevation += 0.25 * harmonicNoise(cx * 4.3, cy * 4.3 + cz * 4.3, seedOffset + 43);
      // Normalize approximately to 0 .. 1
      elevation = (elevation + 1.2) / 2.4;
      elevation = Math.max(0, Math.min(1, elevation));

      // Polar ice cap blending
      const polarWeight = Math.pow(Math.abs(Math.sin(lat)), 3.5);
      if (polarWeight > 0.4 && biome.type !== 'volcanic') {
        elevation = THREE.MathUtils.lerp(elevation, 1.0, (polarWeight - 0.4) * 1.6);
      }

      // Biome color assignment based on elevation
      let col = new THREE.Color();
      let bump = 0;

      if (biome.type === 'gas_giant') {
        // Banded horizontal jet streams with periodic turbulence
        const bandNoise = Math.sin(lat * 18 + harmonicNoise(cx * 1.5, cy * 1.5, seedOffset) * 2.5);
        const bandAlpha = (bandNoise + 1) / 2;
        col = lerpColor(cDeep, cHigh, bandAlpha);
        bump = Math.floor(bandAlpha * 180);
      } else if (elevation < 0.42 && biome.hasWater) {
        // Deep to shallow water/ocean
        const tWater = elevation / 0.42;
        col = lerpColor(cDeep, cShallow, tWater);
        bump = Math.floor(tWater * 40);
      } else if (elevation < 0.55) {
        // Low land / coast
        const tCoast = (elevation - 0.42) / (0.55 - 0.42);
        col = lerpColor(cShallow, cLow, tCoast);
        bump = Math.floor(40 + tCoast * 70);
      } else if (elevation < 0.75) {
        // Mid land / forests / plateaus
        const tMid = (elevation - 0.55) / (0.75 - 0.55);
        col = lerpColor(cLow, cMid, tMid);
        bump = Math.floor(110 + tMid * 65);
      } else if (elevation < 0.88) {
        // High mountains
        const tHigh = (elevation - 0.75) / (0.88 - 0.75);
        col = lerpColor(cMid, cHigh, tHigh);
        bump = Math.floor(175 + tHigh * 50);
      } else {
        // Snow peaks / volcanic summits
        const tPeak = (elevation - 0.88) / (1.0 - 0.88);
        col = lerpColor(cHigh, cPeaks, tPeak);
        bump = Math.floor(225 + tPeak * 30);
      }

      const idx = (y * width + x) * 4;

      // Surface Pixel
      surfPixels[idx] = Math.floor(col.r * 255);
      surfPixels[idx + 1] = Math.floor(col.g * 255);
      surfPixels[idx + 2] = Math.floor(col.b * 255);
      surfPixels[idx + 3] = 255;

      // Bump Pixel
      bumpPixels[idx] = bump;
      bumpPixels[idx + 1] = bump;
      bumpPixels[idx + 2] = bump;
      bumpPixels[idx + 3] = 255;

      // Clouds Pixel (turbulent swirling storm patterns)
      let cloudNoise = harmonicNoise(cx * 1.8 + seedOffset, cy * 1.8, cz * 1.8 + seedOffset);
      cloudNoise += 0.5 * harmonicNoise(cx * 3.6, cy * 3.6, cz * 3.6);
      const cloudAlpha = Math.max(0, Math.min(1, (cloudNoise - 0.05) * 2.2));

      cloudPixels[idx] = Math.floor(cCloud.r * 255);
      cloudPixels[idx + 1] = Math.floor(cCloud.g * 255);
      cloudPixels[idx + 2] = Math.floor(cCloud.b * 255);
      cloudPixels[idx + 3] = Math.floor(cloudAlpha * 190);
    }
  }

  surfCtx.putImageData(surfImgData, 0, 0);
  bumpCtx.putImageData(bumpImgData, 0, 0);
  cloudCtx.putImageData(cloudImgData, 0, 0);

  const surfaceTexture = new THREE.CanvasTexture(surfCanvas);
  surfaceTexture.wrapS = THREE.RepeatWrapping;
  surfaceTexture.wrapT = THREE.ClampToEdgeWrapping;

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;

  const cloudTexture = new THREE.CanvasTexture(cloudCanvas);
  cloudTexture.wrapS = THREE.RepeatWrapping;
  cloudTexture.wrapT = THREE.ClampToEdgeWrapping;

  return { surfaceTexture, bumpTexture, cloudTexture };
}

export function GenerativeProceduralPlanet({
  seed,
  roughness = 1.0,
  radius = 4.5,
  palette = 'auto',
  rotationSpeed = 0.003,
  showRings = true,
}: ProceduralPlanetProps) {
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const cloudMeshRef = useRef<THREE.Mesh>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const moonGroupRef = useRef<THREE.Group>(null);

  // Active Biome derived deterministically from seed or palette override
  const activeBiome = useMemo(() => {
    if (palette !== 'auto' && BIOME_PRESETS[palette]) {
      return BIOME_PRESETS[palette];
    }
    const prng = createPrng(seed);
    const keys = Object.keys(BIOME_PRESETS);
    const index = Math.floor(prng() * keys.length);
    return BIOME_PRESETS[keys[index]];
  }, [seed, palette]);

  // Generate procedural textures in memory
  const { surfaceTexture, bumpTexture, cloudTexture } = useMemo(() => {
    return generatePlanetMaps(activeBiome, seed, roughness);
  }, [activeBiome, seed, roughness]);

  // Atmosphere shader material
  const atmosphereMaterial = useMemo(() => {
    return createAtmosphereMaterial(activeBiome.atmosphereColor, 0.55, 3.2);
  }, [activeBiome.atmosphereColor]);

  // Continuous orbital & cloud rotation
  useFrame((_, delta) => {
    const dt = delta * 60;
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += rotationSpeed * dt;
    }
    if (cloudMeshRef.current) {
      // Clouds drift slightly faster than planet surface for realistic weather dynamics
      cloudMeshRef.current.rotation.y += rotationSpeed * 1.35 * dt;
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z += rotationSpeed * 0.2 * dt;
    }
    if (moonGroupRef.current) {
      // Natural satellite orbits gently around planet
      moonGroupRef.current.rotation.y += rotationSpeed * 0.8 * dt;
    }
  });

  const displayRings = showRings && activeBiome.hasRings;

  return (
    <group>
      {/* 1. Core Planetary Spherical Mesh */}
      <mesh ref={planetMeshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={surfaceTexture || undefined}
          bumpMap={bumpTexture || undefined}
          bumpScale={activeBiome.type === 'gas_giant' ? 0.01 : 0.08 * roughness}
          roughness={activeBiome.type === 'gas_giant' ? 0.85 : 0.65}
          metalness={activeBiome.type === 'volcanic' ? 0.25 : 0.1}
        />
      </mesh>

      {/* 2. Swirling Atmospheric Cloud Layer (Independent rotation) */}
      {cloudTexture && activeBiome.type !== 'gas_giant' && (
        <mesh ref={cloudMeshRef} scale={[1.025, 1.025, 1.025]}>
          <sphereGeometry args={[radius, 48, 48]} />
          <meshStandardMaterial
            map={cloudTexture}
            transparent
            opacity={0.85}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. Rayleigh Atmospheric Optical Scattering Shell */}
      {atmosphereMaterial && (
        <mesh material={atmosphereMaterial}>
          <sphereGeometry args={[radius * 1.15, 32, 32]} />
        </mesh>
      )}

      {/* 4. Planetary Ring System */}
      {displayRings && (
        <group ref={ringGroupRef} rotation={[Math.PI / 2.3, 0.2, 0]}>
          {/* Main Ring Disk */}
          <mesh>
            <ringGeometry args={[radius * 1.45, radius * 2.35, 64]} />
            <meshStandardMaterial
              color={activeBiome.ringColor}
              side={THREE.DoubleSide}
              transparent
              opacity={activeBiome.ringOpacity}
              roughness={0.7}
            />
          </mesh>
          {/* Outer Ring Ribbon */}
          <mesh>
            <ringGeometry args={[radius * 2.45, radius * 2.8, 64]} />
            <meshStandardMaterial
              color={activeBiome.ringColor}
              side={THREE.DoubleSide}
              transparent
              opacity={activeBiome.ringOpacity * 0.4}
              roughness={0.8}
            />
          </mesh>
        </group>
      )}

      {/* 5. Orbiting Natural Moon Satellite */}
      <group ref={moonGroupRef}>
        <mesh position={[radius * 2.8, 0.4, 0]}>
          <sphereGeometry args={[radius * 0.2, 24, 24]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.85} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
