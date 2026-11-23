'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { CelestialBodyData, SpacecraftState } from '@/types/simulation';

interface CameraControllerProps {
  selectedBody: CelestialBodyData | null;
  bodyPositions: { [id: string]: THREE.Vector3 };
  spacecraftState: SpacecraftState;
  cameraMode: 'free' | 'orbit' | 'flight' | 'cockpit';
}

export const CameraController: React.FC<CameraControllerProps> = ({
  selectedBody,
  bodyPositions,
  spacecraftState,
  cameraMode,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Reset controls target when target body changes in orbit mode
  useEffect(() => {
    if (cameraMode === 'orbit' && selectedBody && bodyPositions[selectedBody.id]) {
      const bPos = bodyPositions[selectedBody.id];
      if (controlsRef.current) {
        controlsRef.current.target.copy(bPos);
      }
    }
  }, [selectedBody, cameraMode, bodyPositions]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1);
    const shipPos = new THREE.Vector3(...spacecraftState.position);
    const shipRot = new THREE.Euler(...spacecraftState.rotation, 'YXZ');

    if (cameraMode === 'cockpit') {
      // Position camera inside cockpit
      const cockpitOffset = new THREE.Vector3(0, 0.2, -0.2).applyEuler(shipRot);
      const forward = new THREE.Vector3(0, 0, -20).applyEuler(shipRot);

      camera.position.copy(shipPos.clone().add(cockpitOffset));
      targetLookAt.current.copy(shipPos.clone().add(forward));
      camera.lookAt(targetLookAt.current);
    } else if (cameraMode === 'flight') {
      // Third-person chase camera behind and above
      const chaseOffset = new THREE.Vector3(0, 1.2, 5.0).applyEuler(shipRot);
      const desiredPos = shipPos.clone().add(chaseOffset);

      camera.position.lerp(desiredPos, dt * 5);
      const lookAhead = shipPos.clone().add(new THREE.Vector3(0, 0, -10).applyEuler(shipRot));
      targetLookAt.current.lerp(lookAhead, dt * 8);
      camera.lookAt(targetLookAt.current);
    } else if (cameraMode === 'orbit' && selectedBody && bodyPositions[selectedBody.id]) {
      const bPos = bodyPositions[selectedBody.id];
      if (controlsRef.current) {
        controlsRef.current.target.lerp(bPos, dt * 4);
        controlsRef.current.update();
      }
    } else if (cameraMode === 'free') {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }
  });

  // Enable OrbitControls only when in free or orbit mode
  const enableOrbit = cameraMode === 'free' || cameraMode === 'orbit';

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enableOrbit}
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={400}
      makeDefault
    />
  );
};
