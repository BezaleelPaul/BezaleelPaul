'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface AsteroidBeltProps {
  count?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export const AsteroidBelt: React.FC<AsteroidBeltProps> = ({
  count = 1200,
  innerRadius = 40,
  outerRadius = 48,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate Keplerian orbital parameters for each asteroid
  const asteroids = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.015 / Math.sqrt(radius)) * (0.8 + Math.random() * 0.4);
      const yOffset = (Math.random() - 0.5) * 3.5;
      const scale = 0.08 + Math.random() * 0.22;
      const rotSpeedX = (Math.random() - 0.5) * 2;
      const rotSpeedY = (Math.random() - 0.5) * 2;

      items.push({
        radius,
        angle,
        speed,
        yOffset,
        scale,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotSpeedX,
        rotSpeedY,
      });
    }
    return items;
  }, [count, innerRadius, outerRadius]);

  // Low-poly irregular asteroid rock geometry
  const geometry = useMemo(() => {
    return new THREE.DodecahedronGeometry(1, 1);
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#64748b',
      roughness: 0.9,
      metalness: 0.1,
    });
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const ast = asteroids[i];
      const x = Math.cos(ast.angle) * ast.radius;
      const z = Math.sin(ast.angle) * ast.radius;
      dummy.position.set(x, ast.yOffset, z);
      dummy.scale.set(ast.scale, ast.scale, ast.scale);
      dummy.rotation.set(ast.rotX, ast.rotY, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [asteroids, count, dummy]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const ast = asteroids[i];
      ast.angle += ast.speed * delta * 5;
      ast.rotX += ast.rotSpeedX * delta;
      ast.rotY += ast.rotSpeedY * delta;

      const x = Math.cos(ast.angle) * ast.radius;
      const z = Math.sin(ast.angle) * ast.radius;

      dummy.position.set(x, ast.yOffset, z);
      dummy.scale.set(ast.scale, ast.scale, ast.scale);
      dummy.rotation.set(ast.rotX, ast.rotY, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
    />
  );
};
