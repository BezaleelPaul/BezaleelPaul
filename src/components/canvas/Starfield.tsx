'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const Starfield: React.FC<{ count?: number }> = ({ count = 6500 }) => {
  const nebulaRef = useRef<THREE.Group>(null);

  // Stellar spectral classification colors (O, B, A, F, G, K, M)
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const starColors = [
      new THREE.Color('#9bb0ff'), // Class O/B (Blue-white)
      new THREE.Color('#bbccff'), // Class A (White)
      new THREE.Color('#f8f9fa'), // Class F (Warm white)
      new THREE.Color('#fff4e8'), // Class G (Yellow - Sol)
      new THREE.Color('#ffd2a1'), // Class K (Orange)
      new THREE.Color('#ffcc6f'), // Class M (Red dwarf)
      new THREE.Color('#cbd5e1'), // Stellar White
    ];

    for (let i = 0; i < count; i++) {
      const r = 240 + Math.random() * 500;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = starColors[Math.floor(Math.random() * starColors.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    return [pos, col];
  }, [count]);

  // Cosmic Nebula gas cloud particles
  const [nebulaPos, nebulaColors] = useMemo(() => {
    const nebulaCount = 850;
    const pos = new Float32Array(nebulaCount * 3);
    const col = new Float32Array(nebulaCount * 3);

    const nebulaPalette = [
      new THREE.Color('#0369a1'), // Deep cyan gas
      new THREE.Color('#4338ca'), // Electric indigo
      new THREE.Color('#701a75'), // Cosmic magenta
      new THREE.Color('#0f172a'), // Dark interstellar void
    ];

    for (let i = 0; i < nebulaCount; i++) {
      const r = 260 + Math.random() * 250;
      const theta = Math.PI * 0.8 * (Math.random() - 0.5);
      const phi = Math.PI * 0.6 * (Math.random() - 0.5);

      pos[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = r * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi) - 80;

      const c = nebulaPalette[Math.floor(Math.random() * nebulaPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, []);

  const starGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [positions, colors]);

  const nebulaGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));
    return geom;
  }, [nebulaPos, nebulaColors]);

  useFrame((_, delta) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <group>
      {/* 1. Deep Space Starfield Points */}
      <points geometry={starGeometry}>
        <pointsMaterial
          size={0.95}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
        />
      </points>

      {/* 2. Volumetric Cosmic Nebula Gas Cloud */}
      <group ref={nebulaRef}>
        <points geometry={nebulaGeometry}>
          <pointsMaterial
            size={20.0}
            vertexColors
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      </group>
    </group>
  );
};
