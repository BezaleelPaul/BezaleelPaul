'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { GenerativeProceduralPlanet } from '@/components/canvas/GenerativeProceduralPlanet';
import { 
  Globe, 
  Sparkles, 
  Shuffle, 
  Compass, 
  Sliders, 
  ZoomIn,
  ZoomOut,
  Orbit
} from 'lucide-react';

interface RepoPreset {
  name: string;
  seed: string;
  palette: 'terrestrial' | 'volcanic' | 'ocean' | 'gas_giant' | 'glacius';
  description: string;
  icon: string;
}

const REPO_PRESETS: RepoPreset[] = [
  {
    name: 'file_organizer_flutter',
    seed: 'file_organizer_flutter_v2',
    palette: 'terrestrial',
    description: 'Class-M temperate garden world with azure oceans, rich continents, and polar ice caps',
    icon: '🌍',
  },
  {
    name: 'bnmit-nadicare-health',
    seed: 'bnmit_nadicare_biomed_heart',
    palette: 'ocean',
    description: 'Bioluminescent ocean world with deep saltwater abysses and glowing coral archipelagos',
    icon: '🌊',
  },
  {
    name: 'BESCOM-Calculator',
    seed: 'BESCOM_energy_grid_matrix_2026',
    palette: 'volcanic',
    description: 'High-energy volcanic world with incandescent magma fissures and pyroclastic plains',
    icon: '🌋',
  },
  {
    name: 'NASA-Space-Flight',
    seed: 'NASA_JPL_Horizons_DeepSpace',
    palette: 'gas_giant',
    description: 'Jovian banded gas giant with atmospheric jet streams and majestic translucent rings',
    icon: '🪐',
  },
  {
    name: 'IIT-Madras-Quantum',
    seed: 'IITM_DualDegree_DataScience_BS',
    palette: 'glacius',
    description: 'Sub-zero permafrost citadel world formed by methane glaciers and sapphire ice',
    icon: '❄️',
  },
];

export function GenerativeCosmosSection() {
  const [seed, setSeed] = useState<string>('file_organizer_flutter_v2');
  const [inputVal, setInputVal] = useState<string>('file_organizer_flutter_v2');
  const [roughness, setRoughness] = useState<number>(1.0);
  const [radius, setRadius] = useState<number>(4.2);
  const [palette, setPalette] = useState<string>('auto');
  const [showRings, setShowRings] = useState<boolean>(true);
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(false);

  const handleRandomize = () => {
    const randomSeeds = [
      'Proxima_Centauri_Prime',
      'Kepler_452b_SuperEarth',
      'Quantum_Singularity_X9',
      'Flutter_Dart_Engine',
      'IEEE_Global_Network',
      'Bengaluru_Silicon_Frontier',
      'Trappist_1e_Exoplanet',
      'Andromeda_Spire_Odyssey',
    ];
    const picked = randomSeeds[Math.floor(Math.random() * randomSeeds.length)] + '_' + Math.floor(Math.random() * 9999);
    setSeed(picked);
    setInputVal(picked);
    setPalette('auto');
  };

  const handleApplyPreset = (preset: RepoPreset) => {
    setSeed(preset.seed);
    setInputVal(preset.seed);
    setPalette(preset.palette);
  };

  return (
    <section id="procedural-planets" className="relative py-24 bg-[#050811] border-t border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
            [ 03 // PROCEDURAL GENERATION ENGINE ]
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
            PROCEDURAL EXOPLANET SYNTHESIZER
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-sans">
            Inspired by deterministic seed generation. Enter any keyword, seed, or explore Bezaleel&apos;s repositories synthesized into high-fidelity 3D exoplanets featuring harmonic procedural terrain textures, cloud dynamics, Rayleigh atmospheric scattering, and planetary rings.
          </p>
          <div className="w-20 h-1 bg-cyan-400 rounded-full mx-auto mt-2" />
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: 3D Viewport Solid Card */}
          <div className="lg:col-span-8 bg-[#0b101d] border-2 border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Viewport Overlay Badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
              <span className="px-3 py-1.5 rounded-lg bg-[#070b14]/95 border border-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                <Globe className="w-4 h-4 text-cyan-400" />
                Seed: <span className="text-white font-bold">{seed.slice(0, 18)}{seed.length > 18 ? '...' : ''}</span>
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#070b14]/95 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 shadow-md">
                <Orbit className="w-4 h-4 text-cyan-400" />
                Atmospheric Glow
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#070b14]/95 border border-slate-700 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-md">
                60 FPS Smooth
              </span>
            </div>

            {/* Scroll Zoom Toggle Control */}
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setZoomEnabled(!zoomEnabled)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 border-2 transition-all shadow-md ${
                  zoomEnabled
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                    : 'bg-[#070b14] text-slate-200 border-slate-600 hover:border-cyan-400 hover:text-white'
                }`}
                title="Toggle scroll wheel zoom (off by default to permit natural page scrolling)"
              >
                {zoomEnabled ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                <span>{zoomEnabled ? 'Zoom: On' : 'Zoom: Off'}</span>
              </button>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
              <span className="text-xs font-mono text-slate-300 bg-[#070b14]/90 px-3 py-1.5 rounded-lg border border-slate-700 font-medium">
                🖱️ Left click + drag to inspect • {zoomEnabled ? 'Scroll to zoom' : 'Click Zoom: On to enable scroll zoom'}
              </span>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="h-[480px] sm:h-[560px] w-full cursor-grab active:cursor-grabbing bg-[#02050e]">
              <Canvas
                camera={{ position: [0, 2, 14], fov: 45 }}
                gl={{ antialias: true, alpha: false }}
              >
                <color attach="background" args={['#02050e']} />
                
                {/* Lighting System */}
                <ambientLight intensity={0.25} />
                <directionalLight position={[14, 8, 10]} intensity={2.4} castShadow />
                <pointLight position={[-12, -6, -10]} intensity={0.4} color="#38bdf8" />
                
                <Suspense fallback={null}>
                  <Float speed={1.0} rotationIntensity={0.15} floatIntensity={0.25}>
                    <GenerativeProceduralPlanet
                      seed={seed}
                      roughness={roughness}
                      radius={radius}
                      palette={palette}
                      showRings={showRings}
                    />
                  </Float>
                </Suspense>

                <OrbitControls
                  enableDamping
                  enableZoom={zoomEnabled}
                  dampingFactor={0.05}
                  minDistance={7}
                  maxDistance={30}
                  maxPolarAngle={Math.PI / 1.1}
                />
              </Canvas>
            </div>
          </div>

          {/* Right: Interactive Configuration Dock */}
          <div className="lg:col-span-4 space-y-6">
            {/* Seed Controller Card */}
            <div className="bg-[#0d1424] border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Seed Synthesizer
                </h3>
                <button
                  onClick={handleRandomize}
                  title="Generate Random Seed"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-200 hover:text-cyan-300 hover:border-cyan-400 transition-all flex items-center gap-1.5 text-xs font-mono font-bold"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Random</span>
                </button>
              </div>

              {/* Seed Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputVal.trim()) setSeed(inputVal.trim());
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                    Enter any word or seed:
                  </label>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="e.g. Flutter, Apollo11, Quantum, Voyager"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border-2 border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition-all font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-cyan-400 text-slate-950 font-bold text-sm hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Globe className="w-4 h-4" />
                  Synthesize World
                </button>
              </form>
            </div>

            {/* Bezaleel Repo Worlds Preset Picker */}
            <div className="bg-[#0d1424] border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2 font-bold">
                <Compass className="w-4 h-4 text-cyan-400" />
                Repository Seeds (Bezaleel Paul)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Click any of Bezaleel&apos;s verified repositories to synthesize its procedural planetary manifestation:
              </p>

              <div className="space-y-2.5 pt-1">
                {REPO_PRESETS.map((preset) => {
                  const isActive = seed === preset.seed;
                  return (
                    <button
                      key={preset.seed}
                      onClick={() => handleApplyPreset(preset)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 ${
                        isActive
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md'
                          : 'bg-[#070b14] border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white'
                      }`}
                    >
                      <span className="text-xl p-1 bg-slate-800 rounded-lg">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-mono font-bold truncate text-white">
                            {preset.name}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-bold ${
                            preset.palette === 'terrestrial' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                            preset.palette === 'volcanic' ? 'bg-red-950 text-red-300 border border-red-700' :
                            preset.palette === 'ocean' ? 'bg-cyan-950 text-cyan-300 border border-cyan-700' :
                            preset.palette === 'gas_giant' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                            'bg-blue-950 text-blue-300 border border-blue-700'
                          }`}>
                            {preset.palette}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-sans">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Geological Modifiers & Sliders */}
            <div className="bg-[#0d1424] border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2 font-bold">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Planetary Modifiers
              </h3>

              {/* Roughness Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-200 mb-1 font-semibold">
                  <span>Terrain Relief:</span>
                  <span className="text-cyan-400 font-bold">{roughness.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.1"
                  value={roughness}
                  onChange={(e) => setRoughness(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Radius Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-200 mb-1 font-semibold">
                  <span>Planetary Radius:</span>
                  <span className="text-cyan-400 font-bold">{radius.toFixed(1)} units</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="5.5"
                  step="0.2"
                  value={radius}
                  onChange={(e) => setRadius(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Ring Toggle */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-200 font-semibold">Planetary Ring System:</span>
                <button
                  type="button"
                  onClick={() => setShowRings(!showRings)}
                  className={`px-3.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                    showRings
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800 border-slate-600 text-slate-400'
                  }`}
                >
                  {showRings ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Biome Palette Override */}
              <div className="pt-2">
                <span className="block text-xs font-mono text-slate-300 mb-2 font-semibold">Climate Classification:</span>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono font-bold">
                  {['auto', 'terrestrial', 'ocean', 'volcanic', 'gas_giant', 'glacius'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPalette(p)}
                      className={`py-2 px-2 rounded-lg border text-center capitalize transition-all ${
                        palette === p
                          ? 'bg-cyan-400 border-cyan-300 text-slate-950 font-bold shadow-md'
                          : 'bg-[#070b14] border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {p.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
