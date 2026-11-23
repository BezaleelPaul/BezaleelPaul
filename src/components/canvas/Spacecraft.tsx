'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SpacecraftState } from '@/types/simulation';
import { spaceAudio } from '@/lib/audio';

interface SpacecraftProps {
  initialPosition?: [number, number, number];
  onStateUpdate: (state: SpacecraftState) => void;
  flightMode: 'free' | 'orbit' | 'flight' | 'cockpit';
}

export const Spacecraft: React.FC<SpacecraftProps> = ({
  initialPosition = [0, 2, 28],
  onStateUpdate,
  flightMode,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const flameLeftRef = useRef<THREE.Mesh>(null);
  const flameRightRef = useRef<THREE.Mesh>(null);

  // Physics simulation state
  const stateRef = useRef<{
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    rot: THREE.Euler;
    throttle: number;
    isBoosting: boolean;
    fuel: number;
    keys: { [key: string]: boolean };
  }>({
    pos: new THREE.Vector3(...initialPosition),
    vel: new THREE.Vector3(0, 0, 0),
    rot: new THREE.Euler(0, 0, 0, 'YXZ'),
    throttle: 0,
    isBoosting: false,
    fuel: 100,
    keys: {},
  });

  // Exhaust particles trail
  const trailCount = 60;
  const trailPositions = useMemo(() => new Float32Array(trailCount * 3), [trailCount]);
  const trailGeomRef = useRef<THREE.BufferGeometry>(null);
  const trailHistory = useRef<THREE.Vector3[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key.toLowerCase()] = true;
      if (['w', 's', 'arrowup', 'arrowdown'].includes(e.key.toLowerCase())) {
        spaceAudio.setThruster(true, stateRef.current.isBoosting ? 1.5 : 1.0);
      }
      if (e.key === ' ' || e.code === 'Space') {
        stateRef.current.isBoosting = true;
        spaceAudio.playWarpSwoosh();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.key.toLowerCase()] = false;
      const keys = stateRef.current.keys;
      if (!keys['w'] && !keys['s'] && !keys['arrowup'] && !keys['arrowdown']) {
        spaceAudio.setThruster(false);
      }
      if (e.key === ' ' || e.code === 'Space') {
        stateRef.current.isBoosting = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const s = stateRef.current;
    const dt = Math.min(delta, 0.1);

    // Only process manual flight controls if in flight or cockpit mode
    if (flightMode === 'flight' || flightMode === 'cockpit') {
      const turnSpeed = 1.6 * dt;
      const rollSpeed = 2.0 * dt;

      // Pitch (W / S or Up / Down)
      if (s.keys['arrowup']) s.rot.x -= turnSpeed;
      if (s.keys['arrowdown']) s.rot.x += turnSpeed;

      // Yaw (A / D or Left / Right)
      if (s.keys['a'] || s.keys['arrowleft']) s.rot.y += turnSpeed;
      if (s.keys['d'] || s.keys['arrowright']) s.rot.y -= turnSpeed;

      // Roll (Q / E)
      if (s.keys['q']) s.rot.z += rollSpeed;
      if (s.keys['e']) s.rot.z -= rollSpeed;

      // Throttle acceleration (W / S)
      const maxThrust = s.isBoosting ? 28 : 12;
      let targetThrottle = 0;
      if (s.keys['w']) targetThrottle = 1.0;
      if (s.keys['s']) targetThrottle = -0.4;

      s.throttle = THREE.MathUtils.lerp(s.throttle, targetThrottle, dt * 4);

      // Forward vector from spacecraft orientation
      const forward = new THREE.Vector3(0, 0, -1).applyEuler(s.rot);
      const thrustForce = forward.multiplyScalar(s.throttle * maxThrust * dt);

      s.vel.add(thrustForce);

      // Inertial damping in space
      s.vel.multiplyScalar(Math.pow(0.985, dt * 60));
      s.pos.add(s.vel.clone().multiplyScalar(dt));

      // Deplete/regen fuel on boost
      if (s.isBoosting && s.throttle > 0) {
        s.fuel = Math.max(0, s.fuel - dt * 10);
      } else {
        s.fuel = Math.min(100, s.fuel + dt * 4);
      }
    } else {
      // Gentle autonomous patrol orbit when not in direct flight mode
      s.vel.set(0, 0, 0);
    }

    // Apply orientation and position to mesh
    groupRef.current.position.copy(s.pos);
    groupRef.current.rotation.copy(s.rot);

    // Dynamic thruster flame scaling
    const flameScale = Math.max(0.1, Math.abs(s.throttle) * (s.isBoosting ? 2.8 : 1.4));
    if (flameLeftRef.current && flameRightRef.current) {
      flameLeftRef.current.scale.set(1, flameScale, 1);
      flameRightRef.current.scale.set(1, flameScale, 1);
    }

    // Update exhaust trail
    if (trailGeomRef.current) {
      trailHistory.current.unshift(s.pos.clone());
      if (trailHistory.current.length > trailCount) {
        trailHistory.current.pop();
      }
      for (let i = 0; i < trailHistory.current.length; i++) {
        const p = trailHistory.current[i];
        trailPositions[i * 3] = p.x;
        trailPositions[i * 3 + 1] = p.y;
        trailPositions[i * 3 + 2] = p.z;
      }
      trailGeomRef.current.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      trailGeomRef.current.attributes.position.needsUpdate = true;
    }

    // Emit state update
    onStateUpdate({
      position: [s.pos.x, s.pos.y, s.pos.z],
      velocity: [s.vel.x, s.vel.y, s.vel.z],
      rotation: [s.rot.x, s.rot.y, s.rot.z],
      throttle: s.throttle,
      isBoosting: s.isBoosting,
      speedKms: parseFloat((s.vel.length() * 1.8).toFixed(1)),
      fuelPercent: Math.round(s.fuel),
      targetId: null,
      mode: flightMode,
    });
  });

  return (
    <>
      <group ref={groupRef}>
        {/* Main Central Hull */}
        <mesh position={[0, 0, 0]} castShadow>
          <coneGeometry args={[0.35, 1.6, 6]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Cockpit Canopy Glass */}
        <mesh position={[0, 0.15, -0.2]}>
          <boxGeometry args={[0.22, 0.16, 0.55]} />
          <meshStandardMaterial
            color="#00f3ff"
            emissive="#00f3ff"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Port Wing */}
        <mesh position={[-0.7, -0.05, 0.2]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.9, 0.04, 0.6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Starboard Wing */}
        <mesh position={[0.7, -0.05, 0.2]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.9, 0.04, 0.6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Wingtip Navigation Lights (Red Port / Green Starboard) */}
        <mesh position={[-1.15, -0.05, 0.2]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ff0055" />
        </mesh>
        <mesh position={[1.15, -0.05, 0.2]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#00ff66" />
        </mesh>

        {/* Twin Ion Thruster Bells */}
        <mesh position={[-0.22, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.2, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[0.22, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.14, 0.2, 12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>

        {/* Left Engine Plasma Flame */}
        <mesh ref={flameLeftRef} position={[-0.22, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.6, 12]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
        </mesh>

        {/* Right Engine Plasma Flame */}
        <mesh ref={flameRightRef} position={[0.22, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.12, 0.6, 12]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} />
        </mesh>

        {/* Point light emitted by ship engines */}
        <pointLight position={[0, 0, 1.2]} color="#00f3ff" intensity={1.5} distance={5} />
      </group>

      {/* Exhaust Plasma Particles */}
      <points>
        <bufferGeometry ref={trailGeomRef} />
        <pointsMaterial
          size={0.25}
          color="#38bdf8"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};
