'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

const createDustGeometry = () => {
  const count = 140;
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const radius = 3.1 + ((index * 37) % 100) / 100 * 1.7;
    const y = 1 - (index / (count - 1)) * 2;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * index;

    positions[index * 3] = Math.cos(theta) * radial * radius;
    positions[index * 3 + 1] = y * radius;
    positions[index * 3 + 2] = Math.sin(theta) * radial * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
};

const createGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');

  if (!context) return null;

  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(217, 255, 99, 0.58)');
  gradient.addColorStop(0.24, 'rgba(217, 255, 99, 0.16)');
  gradient.addColorStop(0.58, 'rgba(217, 255, 99, 0.035)');
  gradient.addColorStop(1, 'rgba(217, 255, 99, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  return new THREE.CanvasTexture(canvas);
};

const SignalRing: React.FC<{
  radius: number;
  rotation: [number, number, number];
  color: string;
  opacity: number;
  speed: number;
  satelliteColor?: string;
}> = ({ radius, rotation, color, opacity, speed, satelliteColor }) => {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (!groupRef.current) return;
    groupRef.current.rotation.z += delta * speed;
    groupRef.current.rotation.y = Math.sin(elapsedRef.current * 0.18 + radius) * 0.04;
  });

  return (
    <group rotation={rotation}>
      <group ref={groupRef}>
        <mesh>
          <torusGeometry args={[radius, 0.0045, 2, 196]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
        </mesh>
        {satelliteColor && (
          <mesh position={[radius, 0, 0]}>
            <sphereGeometry args={[0.026, 12, 12]} />
            <meshBasicMaterial color={satelliteColor} toneMapped={false} />
          </mesh>
        )}
      </group>
    </group>
  );
};

const SignalObject: React.FC = () => {
  const parallaxRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);
  const dustGeometry = useMemo(createDustGeometry, []);
  const glowTexture = useMemo(createGlowTexture, []);
  const elapsedRef = useRef(0);

  useEffect(() => () => {
    dustGeometry.dispose();
    glowTexture?.dispose();
  }, [dustGeometry, glowTexture]);

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    const time = elapsedRef.current;

    if (parallaxRef.current) {
      parallaxRef.current.rotation.x = THREE.MathUtils.lerp(
        parallaxRef.current.rotation.x,
        -0.13 + state.pointer.y * 0.14,
        0.028
      );
      parallaxRef.current.rotation.y = THREE.MathUtils.lerp(
        parallaxRef.current.rotation.y,
        state.pointer.x * 0.2,
        0.028
      );
    }

    if (bodyRef.current) {
      bodyRef.current.rotation.y += delta * 0.14;
      bodyRef.current.rotation.x = Math.sin(time * 0.24) * 0.06;
      bodyRef.current.position.y = Math.sin(time * 0.42) * 0.07;
    }

    if (dustRef.current) {
      dustRef.current.rotation.y -= delta * 0.018;
      dustRef.current.rotation.z = Math.sin(time * 0.1) * 0.04;
    }
  });

  return (
    <group ref={parallaxRef}>
      {glowTexture && (
        <sprite scale={[5.4, 5.4, 1]}>
          <spriteMaterial
            map={glowTexture}
            transparent
            opacity={0.24}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      )}

      <group ref={bodyRef}>
        <mesh>
          <icosahedronGeometry args={[1.22, 1]} />
          <meshBasicMaterial color="#d9ff63" wireframe transparent opacity={0.32} toneMapped={false} />
        </mesh>
        <mesh scale={1.075}>
          <icosahedronGeometry args={[1.22, 0]} />
          <meshBasicMaterial color="#f1efe7" wireframe transparent opacity={0.1} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.19, 40, 40]} />
          <meshBasicMaterial color="#d9ff63" transparent opacity={0.022} depthWrite={false} />
        </mesh>
        <mesh position={[1.1, 0.52, 0.34]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#d9ff63" toneMapped={false} />
        </mesh>
      </group>

      <SignalRing
        radius={1.92}
        rotation={[Math.PI / 2.4, 0.12, 0.3]}
        color="#f1efe7"
        opacity={0.2}
        speed={0.11}
        satelliteColor="#f1efe7"
      />
      <SignalRing
        radius={2.44}
        rotation={[Math.PI / 1.72, -0.35, 0.1]}
        color="#d9ff63"
        opacity={0.2}
        speed={-0.075}
        satelliteColor="#d9ff63"
      />
      <SignalRing
        radius={3.02}
        rotation={[Math.PI / 3.2, 0.52, -0.2]}
        color="#f1efe7"
        opacity={0.11}
        speed={0.045}
      />

      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          color="#f1efe7"
          size={0.017}
          sizeAttenuation
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export default function HeroSignalCore() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 42, near: 0.1, far: 40 }}
      dpr={[1, 1.2]}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      }}
      style={{ pointerEvents: 'auto' }}
    >
      <SignalObject />
    </Canvas>
  );
}
