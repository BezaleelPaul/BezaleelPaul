'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { CelestialBodyData } from '@/types/simulation';
import { generateOrbitPath } from '@/lib/kepler';

interface OrbitLineProps {
  body: CelestialBodyData;
  parentPosition?: THREE.Vector3;
  isSelected?: boolean;
}

export const OrbitLine: React.FC<OrbitLineProps> = ({
  body,
  parentPosition = new THREE.Vector3(0, 0, 0),
  isSelected = false,
}) => {
  const points = useMemo(() => {
    return generateOrbitPath(body, 180);
  }, [body]);

  const geometry = useMemo(() => {
    if (points.length === 0) return null;
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  if (!geometry) return null;

  return (
    <group position={parentPosition}>
      {/* Native Three.js lineLoop for optimal performance */}
      <lineLoop geometry={geometry}>
        <lineBasicMaterial
          color={isSelected ? '#00f3ff' : body.color}
          opacity={isSelected ? 0.75 : 0.22}
          transparent
          linewidth={isSelected ? 2 : 1}
        />
      </lineLoop>
    </group>
  );
};
