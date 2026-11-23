'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ATLAS_CONSTELLATIONS, AtlasConstellation } from '@/data/workAtlas';
import { buildConstellationLayout } from '@/lib/workAtlasGeometry';

interface AtlasCanvasProps {
  selectedId: string | null;
  reveal: number;
  onSelect: (id: string | null) => void;
}

interface OrbitControlsLike {
  target: THREE.Vector3;
  update: () => void;
}

const CameraRig: React.FC<{ selectedId: string | null }> = ({ selectedId }) => {
  const { camera, controls, size } = useThree();
  const animating = useRef(true);
  const isCompact = size.width < 700;
  const aspect = size.width / Math.max(size.height, 1);
  const overviewDepth = Math.max(22, 21 / (2 * Math.tan(THREE.MathUtils.degToRad(23)) * aspect));

  const selected = ATLAS_CONSTELLATIONS.find(
    (constellation) => constellation.project.id === selectedId
  );

  const { desiredPosition, desiredTarget } = useMemo(() => {
    if (!selected) {
      return {
        desiredPosition: new THREE.Vector3(0, 0.4, isCompact ? overviewDepth : 23),
        desiredTarget: new THREE.Vector3(0, 0, 0),
      };
    }
    const [x, y, z] = selected.anchor;
    return {
      desiredPosition: new THREE.Vector3(x, y + 0.8, z + (isCompact ? 9.5 : 10.5)),
      desiredTarget: new THREE.Vector3(x, y, z),
    };
  }, [selected, isCompact, overviewDepth]);

  useEffect(() => {
    animating.current = true;
  }, [selectedId, isCompact, size.width, size.height]);

  useFrame((_, delta) => {
    if (!animating.current) return;

    const factor = 1 - Math.exp(-Math.min(delta, 0.05) * 3.6);
    camera.position.lerp(desiredPosition, factor);

    const orbitControls = controls as OrbitControlsLike | null;
    if (orbitControls?.target) {
      orbitControls.target.lerp(desiredTarget, factor);
      orbitControls.update();
    }

    if (camera.position.distanceTo(desiredPosition) < 0.06) {
      camera.position.copy(desiredPosition);
      animating.current = false;
    }
  });

  return null;
};

const Constellation: React.FC<{
  constellation: AtlasConstellation;
  index: number;
  selectedId: string | null;
  reveal: number;
  onSelect: (id: string | null) => void;
}> = ({ constellation, index, selectedId, reveal, onSelect }) => {
  const isSelected = selectedId === constellation.project.id;
  const isDimmed = Boolean(selectedId && !isSelected);

  const layout = useMemo(
    () => buildConstellationLayout(
      constellation.project.id,
      constellation.shape,
      constellation.commits.length + 1,
      constellation.anchor
    ),
    [constellation]
  );

  const events = useMemo(() => [
    {
      date: new Date(constellation.createdAt).getTime(),
      label: 'Repository created',
    },
    ...constellation.commits.map((commit) => ({
      date: new Date(commit.date).getTime(),
      label: commit.message,
    })),
  ], [constellation]);

  const visibility = events.map((event) => event.date <= reveal);
  const hasVisibleStars = visibility.some(Boolean);
  const color = isSelected ? '#d9ff63' : '#f1efe7';
  const lineOpacity = isDimmed ? 0.06 : isSelected ? 0.5 : hasVisibleStars ? 0.22 : 0.05;
  const labelOpacity = isDimmed ? 0.18 : isSelected ? 1 : hasVisibleStars ? 0.54 : 0.14;

  const handleSelect = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    onSelect(constellation.project.id);
  };

  return (
    <group>
      <Line
        points={layout.linePositions}
        color={color}
        lineWidth={isSelected ? 1.15 : 0.65}
        transparent
        opacity={lineOpacity}
      />

      {layout.starPositions.map((position, starIndex) => {
        if (!visibility[starIndex]) return null;
        const isOrigin = starIndex === 0;
        const size = isOrigin ? 0.082 : isSelected ? 0.06 : 0.047;
        const opacity = isDimmed ? 0.18 : 1;

        return (
          <group key={`${constellation.project.id}-${starIndex}`} position={position}>
            <mesh>
              <sphereGeometry args={[size, 10, 10]} />
              <meshBasicMaterial color={color} transparent opacity={opacity} />
            </mesh>
            {isSelected && (
              <mesh>
                <sphereGeometry args={[size * 3.4, 10, 10]} />
                <meshBasicMaterial
                  color="#d9ff63"
                  transparent
                  opacity={0.1}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            )}
          </group>
        );
      })}

      <mesh
        position={constellation.anchor}
        onClick={handleSelect}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }}
      >
        <sphereGeometry args={[2.45, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html
        center
        position={layout.labelPosition}
        zIndexRange={[15, 0]}
        style={{ pointerEvents: 'none', opacity: labelOpacity }}
      >
        <div
          className={`whitespace-nowrap border-l pl-2 font-mono text-[8px] font-semibold uppercase tracking-[0.16em] ${
            isSelected ? 'border-signal text-signal' : 'border-paper/40 text-paper/80'
          }`}
        >
          <span className="mr-1.5 text-paper/35">0{index + 1}</span>
          {constellation.shortTitle}
        </div>
      </Html>
    </group>
  );
};

const AtlasOrigin: React.FC = () => {
  const globeRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    elapsedRef.current += delta;
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.075;
      globeRef.current.rotation.x = Math.sin(elapsedRef.current * 0.16) * 0.035;
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      <group ref={globeRef}>
        <mesh>
          <sphereGeometry args={[0.88, 36, 28]} />
          <meshBasicMaterial color="#163c43" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.895, 28, 20]} />
          <meshBasicMaterial color="#a6e5d1" wireframe transparent opacity={0.2} />
        </mesh>
        <mesh rotation={[0.42, 0.1, -0.22]}>
          <torusGeometry args={[1.18, 0.009, 6, 120]} />
          <meshBasicMaterial color="#d9ff63" transparent opacity={0.55} />
        </mesh>
        <mesh rotation={[-0.68, 0.35, 0.4]}>
          <torusGeometry args={[1.34, 0.004, 4, 120]} />
          <meshBasicMaterial color="#f1efe7" transparent opacity={0.28} />
        </mesh>
      </group>
      <Html center position={[0, -1.42, 0]} zIndexRange={[10, 0]}>
        <div className="whitespace-nowrap border border-signal/25 bg-ink/75 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.18em] text-signal">
          Origin / Bezaleel
        </div>
      </Html>
    </group>
  );
};

const AtlasScene: React.FC<AtlasCanvasProps> = ({ selectedId, reveal, onSelect }) => {
  return (
    <>
      <CameraRig selectedId={selectedId} />
      <AtlasOrigin />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.075}
        rotateSpeed={0.42}
        zoomSpeed={0.65}
        minDistance={7}
        maxDistance={34}
      />
      {ATLAS_CONSTELLATIONS.map((constellation, index) => (
        <Constellation
          key={constellation.project.id}
          constellation={constellation}
          index={index}
          selectedId={selectedId}
          reveal={reveal}
          onSelect={onSelect}
        />
      ))}
    </>
  );
};

export const AtlasCanvas: React.FC<AtlasCanvasProps> = (props) => {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 23], fov: 46, near: 0.1, far: 100 }}
      dpr={[1, 1.1]}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      onPointerMissed={() => props.onSelect(null)}
      aria-hidden="true"
      style={{ background: 'transparent' }}
    >
      <AtlasScene {...props} />
    </Canvas>
  );
};
