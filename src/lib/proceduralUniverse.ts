import * as THREE from 'three';
import { CelestialBodyData } from '@/types/simulation';

// Deterministic Pseudo-Random Number Generator (Mulberry32)
export function createPrng(seedStr: string): () => number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 0x01000193);
    h ^= h >>> 13;
  }
  let a = h >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type StarSpectralClass = 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M' | 'Pulsar';

export interface StarProperties {
  name: string;
  spectralClass: StarSpectralClass;
  spectralType: string; // e.g. G2V, M3V
  temperatureK: number;
  massSolar: number;
  radiusSolar: number;
  luminositySolar: number;
  habitableZoneInnerAU: number;
  habitableZoneOuterAU: number;
  frostLineAU: number;
  colorHex: string;
  glowColorHex: string;
  coronaIntensity: number;
}

export interface StarSystem {
  id: string;
  seed: string;
  name: string;
  sectorCoordinates: { x: number; y: number; z: number };
  star: StarProperties;
  bodies: CelestialBodyData[];
  description: string;
  isRealSolarSystem?: boolean;
}

// -------------------------------------------------------------
// Real NASA / Sol System Definition with Mathematical Proportions
// -------------------------------------------------------------
export const SOL_SYSTEM: StarSystem = {
  id: 'sol',
  seed: 'sol',
  name: 'Sol System (Our Solar System)',
  sectorCoordinates: { x: 0, y: 0, z: 0 },
  isRealSolarSystem: true,
  description: 'Our home planetary system centered on Sol, an authentic G2V yellow dwarf host to 8 major worlds and Luna.',
  star: {
    name: 'Sol (Sun)',
    spectralClass: 'G',
    spectralType: 'G2V Yellow Dwarf',
    temperatureK: 5778,
    massSolar: 1.0,
    radiusSolar: 1.0,
    luminositySolar: 1.0,
    habitableZoneInnerAU: 0.95,
    habitableZoneOuterAU: 1.37,
    frostLineAU: 2.7,
    colorHex: '#fff2db',
    glowColorHex: '#ffaa00',
    coronaIntensity: 1.2,
  },
  bodies: [
    {
      id: 'sun',
      name: 'Sol (Sun)',
      type: 'star',
      radius: 6.8,
      actualRadiusKm: 696340,
      color: '#ffbb33',
      glowColor: '#ff8800',
      emissive: true,
      semiMajorAxis: 0,
      actualSemiMajorAxisAU: 0,
      eccentricity: 0,
      orbitalPeriodDays: 1,
      inclinationDeg: 0,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 0,
      rotationPeriodHours: 609.12,
      axialTiltDeg: 7.25,
      massKg: '1.989 × 10^30',
      gravityMps2: 274.0,
      surfaceTempC: 5505,
      orbitalVelocityKms: 0,
      atmosphericComposition: ['Hydrogen (73.4%)', 'Helium (25.0%)', 'Oxygen (0.8%)'],
      description: 'Yellow dwarf star comprising 99.86% of the solar system mass. Primary source of light and life.',
    },
    {
      id: 'mercury',
      name: 'Mercury',
      type: 'planet',
      radius: 0.85,
      actualRadiusKm: 2439.7,
      color: '#a3a3a3',
      glowColor: '#737373',
      semiMajorAxis: 13.5,
      actualSemiMajorAxisAU: 0.387,
      eccentricity: 0.2056,
      orbitalPeriodDays: 87.97,
      inclinationDeg: 7.0,
      argumentOfPeriapsisDeg: 29.12,
      longitudeOfAscendingNodeDeg: 48.33,
      meanAnomalyEpochDeg: 174.79,
      rotationPeriodHours: 1407.6,
      axialTiltDeg: 0.034,
      massKg: '3.301 × 10^23',
      gravityMps2: 3.7,
      surfaceTempC: 167,
      orbitalVelocityKms: 47.36,
      atmosphericComposition: ['Trace Sodium', 'Potassium', 'Helium'],
      description: 'Innermost rocky world with extreme temperature swings from -180°C at night to 430°C by day.',
    },
    {
      id: 'venus',
      name: 'Venus',
      type: 'planet',
      radius: 1.42,
      actualRadiusKm: 6051.8,
      color: '#e2a968',
      glowColor: '#fbbf24',
      atmosphere: true,
      atmosphereColor: '#fcd34d',
      semiMajorAxis: 19.5,
      actualSemiMajorAxisAU: 0.723,
      eccentricity: 0.0067,
      orbitalPeriodDays: 224.7,
      inclinationDeg: 3.39,
      argumentOfPeriapsisDeg: 54.88,
      longitudeOfAscendingNodeDeg: 76.68,
      meanAnomalyEpochDeg: 50.11,
      rotationPeriodHours: -5832.5,
      axialTiltDeg: 177.36,
      massKg: '4.867 × 10^24',
      gravityMps2: 8.87,
      surfaceTempC: 464,
      orbitalVelocityKms: 35.02,
      atmosphericComposition: ['Carbon Dioxide (96.5%)', 'Nitrogen (3.5%)'],
      description: 'Runaway greenhouse world with superheated sulfuric clouds and crushing 92-bar surface pressure.',
    },
    {
      id: 'earth',
      name: 'Earth',
      type: 'planet',
      radius: 1.5,
      actualRadiusKm: 6371.0,
      color: '#2563eb',
      glowColor: '#38bdf8',
      atmosphere: true,
      atmosphereColor: '#60a5fa',
      semiMajorAxis: 26.5,
      actualSemiMajorAxisAU: 1.0,
      eccentricity: 0.0167,
      orbitalPeriodDays: 365.256,
      inclinationDeg: 0.0,
      argumentOfPeriapsisDeg: 102.94,
      longitudeOfAscendingNodeDeg: 0.0,
      meanAnomalyEpochDeg: 100.46,
      rotationPeriodHours: 23.934,
      axialTiltDeg: 23.44,
      massKg: '5.972 × 10^24',
      gravityMps2: 9.807,
      surfaceTempC: 15,
      orbitalVelocityKms: 29.78,
      atmosphericComposition: ['Nitrogen (78.08%)', 'Oxygen (20.95%)', 'Argon (0.93%)'],
      description: 'The cradle of civilization. Active plate tectonics, abundant liquid water, and thriving biosphere.',
    },
    {
      id: 'moon',
      name: 'Luna (The Moon)',
      type: 'moon',
      parentBodyId: 'earth',
      radius: 0.44,
      actualRadiusKm: 1737.4,
      color: '#d4d4d8',
      glowColor: '#a1a1aa',
      semiMajorAxis: 3.6,
      actualSemiMajorAxisAU: 0.00257,
      eccentricity: 0.0549,
      orbitalPeriodDays: 27.32,
      inclinationDeg: 5.14,
      argumentOfPeriapsisDeg: 318.15,
      longitudeOfAscendingNodeDeg: 125.08,
      meanAnomalyEpochDeg: 135.0,
      rotationPeriodHours: 655.7,
      axialTiltDeg: 6.68,
      massKg: '7.342 × 10^22',
      gravityMps2: 1.62,
      surfaceTempC: -20,
      orbitalVelocityKms: 1.022,
      atmosphericComposition: ['Ultra-tenuous Exosphere'],
      description: 'Earth’s only permanent natural satellite, stabilizing planetary axial tilt and tides.',
    },
    {
      id: 'mars',
      name: 'Mars',
      type: 'planet',
      radius: 1.05,
      actualRadiusKm: 3389.5,
      color: '#c2410c',
      glowColor: '#ea580c',
      atmosphere: true,
      atmosphereColor: '#fdba74',
      semiMajorAxis: 36.0,
      actualSemiMajorAxisAU: 1.524,
      eccentricity: 0.0934,
      orbitalPeriodDays: 686.98,
      inclinationDeg: 1.85,
      argumentOfPeriapsisDeg: 286.5,
      longitudeOfAscendingNodeDeg: 49.56,
      meanAnomalyEpochDeg: 19.37,
      rotationPeriodHours: 24.62,
      axialTiltDeg: 25.19,
      massKg: '6.417 × 10^23',
      gravityMps2: 3.72,
      surfaceTempC: -63,
      orbitalVelocityKms: 24.07,
      atmosphericComposition: ['Carbon Dioxide (95.3%)', 'Nitrogen (2.6%)', 'Argon (1.9%)'],
      description: 'The Red Planet. Iron-rich dusty desert crust, colossal Olympus Mons volcano, and ancient dry river valleys.',
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      type: 'planet',
      radius: 3.8,
      actualRadiusKm: 69911,
      color: '#d97706',
      glowColor: '#f59e0b',
      atmosphere: true,
      atmosphereColor: '#fed7aa',
      semiMajorAxis: 53.0,
      actualSemiMajorAxisAU: 5.204,
      eccentricity: 0.0485,
      orbitalPeriodDays: 4332.59,
      inclinationDeg: 1.30,
      argumentOfPeriapsisDeg: 273.87,
      longitudeOfAscendingNodeDeg: 100.46,
      meanAnomalyEpochDeg: 20.02,
      rotationPeriodHours: 9.93,
      axialTiltDeg: 3.13,
      massKg: '1.898 × 10^27',
      gravityMps2: 24.79,
      surfaceTempC: -110,
      orbitalVelocityKms: 13.07,
      atmosphericComposition: ['Hydrogen (89.8%)', 'Helium (10.2%)'],
      description: 'The King of Planets. Colossal gas giant with the iconic 350-year-old Great Red Spot anticyclone.',
    },
    {
      id: 'europa',
      name: 'Europa (Ocean Moon)',
      type: 'moon',
      parentBodyId: 'jupiter',
      radius: 0.42,
      actualRadiusKm: 1560.8,
      color: '#e2e8f0',
      glowColor: '#38bdf8',
      semiMajorAxis: 5.6,
      actualSemiMajorAxisAU: 0.00448,
      eccentricity: 0.009,
      orbitalPeriodDays: 3.55,
      inclinationDeg: 0.47,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 171.0,
      rotationPeriodHours: 85.2,
      axialTiltDeg: 0.1,
      massKg: '4.80 × 10^22',
      gravityMps2: 1.315,
      surfaceTempC: -160,
      orbitalVelocityKms: 13.74,
      atmosphericComposition: ['Thin Molecular Oxygen (O2)'],
      description: 'Jovian ice world concealing a subterranean global saltwater ocean with twice the volume of Earth’s oceans. Prime astrobiology target.',
    },
    {
      id: 'saturn',
      name: 'Saturn',
      type: 'planet',
      radius: 3.2,
      actualRadiusKm: 58232,
      color: '#ca8a04',
      glowColor: '#eab308',
      hasRings: true,
      atmosphere: true,
      atmosphereColor: '#fef08a',
      semiMajorAxis: 72.0,
      actualSemiMajorAxisAU: 9.582,
      eccentricity: 0.0555,
      orbitalPeriodDays: 10759.22,
      inclinationDeg: 2.49,
      argumentOfPeriapsisDeg: 339.39,
      longitudeOfAscendingNodeDeg: 113.67,
      meanAnomalyEpochDeg: 317.02,
      rotationPeriodHours: 10.7,
      axialTiltDeg: 26.73,
      massKg: '5.683 × 10^26',
      gravityMps2: 10.44,
      surfaceTempC: -140,
      orbitalVelocityKms: 9.68,
      atmosphericComposition: ['Hydrogen (96.3%)', 'Helium (3.25%)'],
      description: 'The ringed jewel of the solar system with extensive reflective ice particle rings spanning 280,000 km.',
    },
    {
      id: 'titan',
      name: 'Titan (Hydrocarbon Moon)',
      type: 'moon',
      parentBodyId: 'saturn',
      radius: 0.58,
      actualRadiusKm: 2574.7,
      color: '#f59e0b',
      glowColor: '#d97706',
      atmosphere: true,
      atmosphereColor: '#fed7aa',
      semiMajorAxis: 6.8,
      actualSemiMajorAxisAU: 0.00817,
      eccentricity: 0.0288,
      orbitalPeriodDays: 15.95,
      inclinationDeg: 0.35,
      argumentOfPeriapsisDeg: 180,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 60,
      rotationPeriodHours: 382.8,
      axialTiltDeg: 0,
      massKg: '1.345 × 10^23',
      gravityMps2: 1.352,
      surfaceTempC: -179,
      orbitalVelocityKms: 5.57,
      atmosphericComposition: ['Nitrogen (98.4%)', 'Methane (1.4%)'],
      description: 'Saturn’s giant moon, larger than Mercury, possessing a dense atmosphere and permanent surface lakes of liquid methane and ethane.',
    },
    {
      id: 'uranus',
      name: 'Uranus',
      type: 'planet',
      radius: 2.35,
      actualRadiusKm: 25362,
      color: '#38bdf8',
      glowColor: '#0284c7',
      hasRings: true,
      atmosphere: true,
      atmosphereColor: '#7dd3fc',
      semiMajorAxis: 94.0,
      actualSemiMajorAxisAU: 19.191,
      eccentricity: 0.0463,
      orbitalPeriodDays: 30685.4,
      inclinationDeg: 0.77,
      argumentOfPeriapsisDeg: 96.99,
      longitudeOfAscendingNodeDeg: 74.01,
      meanAnomalyEpochDeg: 142.24,
      rotationPeriodHours: -17.24,
      axialTiltDeg: 97.77,
      massKg: '8.681 × 10^25',
      gravityMps2: 8.69,
      surfaceTempC: -197,
      orbitalVelocityKms: 6.80,
      atmosphericComposition: ['Hydrogen (83%)', 'Helium (15%)', 'Methane (2.3%)'],
      description: 'The sideways ice giant tipped 97.8° on its rotational axis, surrounded by thin vertical ring arcs and pale aquamarine clouds.',
    },
    {
      id: 'neptune',
      name: 'Neptune',
      type: 'planet',
      radius: 2.25,
      actualRadiusKm: 24622,
      color: '#1d4ed8',
      glowColor: '#3b82f6',
      hasRings: true,
      atmosphere: true,
      atmosphereColor: '#60a5fa',
      semiMajorAxis: 116.0,
      actualSemiMajorAxisAU: 30.07,
      eccentricity: 0.0095,
      orbitalPeriodDays: 60189.0,
      inclinationDeg: 1.77,
      argumentOfPeriapsisDeg: 273.19,
      longitudeOfAscendingNodeDeg: 131.78,
      meanAnomalyEpochDeg: 256.23,
      rotationPeriodHours: 16.11,
      axialTiltDeg: 28.32,
      massKg: '1.024 × 10^26',
      gravityMps2: 11.15,
      surfaceTempC: -201,
      orbitalVelocityKms: 5.43,
      atmosphericComposition: ['Hydrogen (80%)', 'Helium (19%)', 'Methane (1.5%)'],
      description: 'Outermost major ice giant of our solar system, shrouded in deep azure methane storms with supersonic winds surpassing 2,100 km/h.',
    },
    {
      id: 'pluto',
      name: 'Pluto (Kuiper Dwarf)',
      type: 'planet',
      radius: 0.52,
      actualRadiusKm: 1188.3,
      color: '#d97706',
      glowColor: '#b45309',
      semiMajorAxis: 138.0,
      actualSemiMajorAxisAU: 39.482,
      eccentricity: 0.2488,
      orbitalPeriodDays: 90560.0,
      inclinationDeg: 17.16,
      argumentOfPeriapsisDeg: 113.83,
      longitudeOfAscendingNodeDeg: 110.30,
      meanAnomalyEpochDeg: 14.88,
      rotationPeriodHours: -153.3,
      axialTiltDeg: 122.53,
      massKg: '1.303 × 10^22',
      gravityMps2: 0.62,
      surfaceTempC: -230,
      orbitalVelocityKms: 4.74,
      atmosphericComposition: ['Nitrogen (99%)', 'Methane (0.5%)', 'Carbon Monoxide'],
      description: 'Beloved Kuiper Belt dwarf world with a highly inclined eccentric orbit and the vast heart-shaped nitrogen ice glacier Tombaugh Regio.',
    },
  ],
};

// -------------------------------------------------------------
// TRAPPIST-1 System (Real Red Dwarf with 7 Rocky Worlds)
// -------------------------------------------------------------
export const TRAPPIST1_SYSTEM: StarSystem = {
  id: 'trappist_1',
  seed: 'trappist_1',
  name: 'TRAPPIST-1 System',
  sectorCoordinates: { x: 39.46, y: -12.18, z: 8.44 },
  description: 'Ultra-cool red dwarf star located 39.5 light-years away in Aquarius, hosting seven Earth-sized rocky exoplanets in resonant harmony.',
  star: {
    name: 'TRAPPIST-1',
    spectralClass: 'M',
    spectralType: 'M8V Ultra-Cool Red Dwarf',
    temperatureK: 2566,
    massSolar: 0.089,
    radiusSolar: 0.121,
    luminositySolar: 0.00055,
    habitableZoneInnerAU: 0.022,
    habitableZoneOuterAU: 0.038,
    frostLineAU: 0.065,
    colorHex: '#ff4d2e',
    glowColorHex: '#ef4444',
    coronaIntensity: 0.8,
  },
  bodies: [
    {
      id: 'trappist_star',
      name: 'TRAPPIST-1',
      type: 'star',
      radius: 4.8,
      actualRadiusKm: 84200,
      color: '#ef4444',
      glowColor: '#dc2626',
      emissive: true,
      semiMajorAxis: 0,
      actualSemiMajorAxisAU: 0,
      eccentricity: 0,
      orbitalPeriodDays: 1,
      inclinationDeg: 0,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 0,
      rotationPeriodHours: 79.2,
      axialTiltDeg: 0,
      massKg: '1.77 × 10^29',
      gravityMps2: 167.0,
      surfaceTempC: 2293,
      orbitalVelocityKms: 0,
      atmosphericComposition: ['Hydrogen', 'Helium', 'Titanium Oxide'],
      description: 'Low-mass ultra-cool dwarf star radiating primarily in the infrared spectrum.',
    },
    {
      id: 'trappist_b',
      name: 'TRAPPIST-1b',
      type: 'planet',
      radius: 1.55,
      actualRadiusKm: 7110,
      color: '#7f1d1d',
      glowColor: '#b91c1c',
      atmosphere: true,
      atmosphereColor: '#f87171',
      semiMajorAxis: 11.0,
      actualSemiMajorAxisAU: 0.0115,
      eccentricity: 0.006,
      orbitalPeriodDays: 1.51,
      inclinationDeg: 89.7,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 45,
      rotationPeriodHours: 36.2,
      axialTiltDeg: 0,
      massKg: '6.09 × 10^24',
      gravityMps2: 7.9,
      surfaceTempC: 127,
      orbitalVelocityKms: 82.0,
      atmosphericComposition: ['Dense Carbon Dioxide (Superheated)'],
      description: 'Innermost rocky planet, tidally locked with a scorching permanent substellar point.',
    },
    {
      id: 'trappist_c',
      name: 'TRAPPIST-1c',
      type: 'planet',
      radius: 1.52,
      actualRadiusKm: 6990,
      color: '#c2410c',
      glowColor: '#ea580c',
      semiMajorAxis: 16.0,
      actualSemiMajorAxisAU: 0.0158,
      eccentricity: 0.006,
      orbitalPeriodDays: 2.42,
      inclinationDeg: 89.8,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 90,
      rotationPeriodHours: 58.1,
      axialTiltDeg: 0,
      massKg: '6.90 × 10^24',
      gravityMps2: 9.3,
      surfaceTempC: 69,
      orbitalVelocityKms: 70.0,
      atmosphericComposition: ['Sulfur Dioxide', 'Nitrogen'],
      description: 'Warm rocky world with volcanic surface features and high albedo mineral plains.',
    },
    {
      id: 'trappist_d',
      name: 'TRAPPIST-1d',
      type: 'planet',
      radius: 1.25,
      actualRadiusKm: 4990,
      color: '#0891b2',
      glowColor: '#06b6d4',
      atmosphere: true,
      atmosphereColor: '#38bdf8',
      semiMajorAxis: 22.0,
      actualSemiMajorAxisAU: 0.0223,
      eccentricity: 0.008,
      orbitalPeriodDays: 4.05,
      inclinationDeg: 89.9,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 180,
      rotationPeriodHours: 97.2,
      axialTiltDeg: 0,
      massKg: '2.32 × 10^24',
      gravityMps2: 6.1,
      surfaceTempC: 15,
      orbitalVelocityKms: 59.0,
      atmosphericComposition: ['Nitrogen', 'Water Vapor', 'Oxygen trace'],
      description: 'Edge of habitable zone. Potential for liquid water on the twilight terminator band.',
    },
    {
      id: 'trappist_e',
      name: 'TRAPPIST-1e (Prime Habitable)',
      type: 'planet',
      radius: 1.45,
      actualRadiusKm: 5860,
      color: '#0284c7',
      glowColor: '#38bdf8',
      atmosphere: true,
      atmosphereColor: '#7dd3fc',
      semiMajorAxis: 29.0,
      actualSemiMajorAxisAU: 0.0293,
      eccentricity: 0.005,
      orbitalPeriodDays: 6.10,
      inclinationDeg: 89.9,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 270,
      rotationPeriodHours: 146.4,
      axialTiltDeg: 0,
      massKg: '4.13 × 10^24',
      gravityMps2: 8.8,
      surfaceTempC: -22,
      orbitalVelocityKms: 51.0,
      atmosphericComposition: ['Nitrogen', 'Oxygen', 'Carbon Dioxide'],
      description: 'Most Earth-like exoplanet in the system. Robust iron core and high likelihood of temperate surface oceans.',
    },
    {
      id: 'trappist_f',
      name: 'TRAPPIST-1f',
      type: 'planet',
      radius: 1.54,
      actualRadiusKm: 6660,
      color: '#0369a1',
      glowColor: '#0ea5e9',
      atmosphere: true,
      atmosphereColor: '#bae6fd',
      semiMajorAxis: 38.0,
      actualSemiMajorAxisAU: 0.0385,
      eccentricity: 0.010,
      orbitalPeriodDays: 9.21,
      inclinationDeg: 89.7,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 310,
      rotationPeriodHours: 221.0,
      axialTiltDeg: 0,
      massKg: '6.15 × 10^24',
      gravityMps2: 9.1,
      surfaceTempC: -54,
      orbitalVelocityKms: 45.0,
      atmosphericComposition: ['Volatile-rich Hydrosphere', 'Methane'],
      description: 'Cool water-world containing up to 20% volatile water by mass, encrusted in thick ice sheets.',
    },
    {
      id: 'trappist_g',
      name: 'TRAPPIST-1g',
      type: 'planet',
      radius: 1.62,
      actualRadiusKm: 7320,
      color: '#1e3a8a',
      glowColor: '#3b82f6',
      semiMajorAxis: 48.0,
      actualSemiMajorAxisAU: 0.0469,
      eccentricity: 0.002,
      orbitalPeriodDays: 12.35,
      inclinationDeg: 89.7,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 120,
      rotationPeriodHours: 296.4,
      axialTiltDeg: 0,
      massKg: '7.82 × 10^24',
      gravityMps2: 9.6,
      surfaceTempC: -75,
      orbitalVelocityKms: 41.0,
      atmosphericComposition: ['Dense Carbon Dioxide', 'Nitrogen', 'Methane'],
      description: 'Sub-zero frozen super-Earth with an extensive ice mantle and deep planetary ocean beneath.',
    },
  ],
};

// -------------------------------------------------------------
// Alpha Centauri (Trinary Star System)
// -------------------------------------------------------------
export const ALPHA_CENTAURI_SYSTEM: StarSystem = {
  id: 'alpha_centauri',
  seed: 'alpha_centauri',
  name: 'Alpha Centauri System',
  sectorCoordinates: { x: 4.37, y: 1.25, z: -0.89 },
  description: 'Our closest interstellar neighbor: a gravitationally bound triple star system composed of Alpha Centauri A (Rigil Kentaurus), B (Toliman), and Proxima Centauri.',
  star: {
    name: 'Rigil Kentaurus (Alpha Centauri A)',
    spectralClass: 'G',
    spectralType: 'G2V Solar Twin',
    temperatureK: 5790,
    massSolar: 1.1,
    radiusSolar: 1.22,
    luminositySolar: 1.52,
    habitableZoneInnerAU: 1.15,
    habitableZoneOuterAU: 1.68,
    frostLineAU: 3.3,
    colorHex: '#fff7ed',
    glowColorHex: '#f59e0b',
    coronaIntensity: 1.3,
  },
  bodies: [
    {
      id: 'alpha_cen_a',
      name: 'Alpha Centauri A',
      type: 'star',
      radius: 7.2,
      actualRadiusKm: 852000,
      color: '#fffbeb',
      glowColor: '#f59e0b',
      emissive: true,
      semiMajorAxis: 0,
      actualSemiMajorAxisAU: 0,
      eccentricity: 0,
      orbitalPeriodDays: 1,
      inclinationDeg: 0,
      argumentOfPeriapsisDeg: 0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 0,
      rotationPeriodHours: 528.0,
      axialTiltDeg: 0,
      massKg: '2.19 × 10^30',
      gravityMps2: 279.0,
      surfaceTempC: 5517,
      orbitalVelocityKms: 0,
      atmosphericComposition: ['Hydrogen (73%)', 'Helium (25%)'],
      description: 'Primary star of the Alpha Centauri trinary system. Almost identical to our Sun in mass and temperature.',
    },
    {
      id: 'alpha_cen_b',
      name: 'Alpha Centauri B (Companion Star)',
      type: 'star',
      radius: 4.5,
      actualRadiusKm: 602000,
      color: '#f97316',
      glowColor: '#ea580c',
      emissive: true,
      semiMajorAxis: 65.0,
      actualSemiMajorAxisAU: 23.4,
      eccentricity: 0.52,
      orbitalPeriodDays: 29160,
      inclinationDeg: 79.2,
      argumentOfPeriapsisDeg: 231.6,
      longitudeOfAscendingNodeDeg: 204.8,
      meanAnomalyEpochDeg: 45,
      rotationPeriodHours: 888.0,
      axialTiltDeg: 0,
      massKg: '1.80 × 10^30',
      gravityMps2: 322.0,
      surfaceTempC: 4987,
      orbitalVelocityKms: 11.2,
      atmosphericComposition: ['Hydrogen (74%)', 'Helium (24%)'],
      description: 'K1V orange dwarf companion orbiting in an eccentric 79.9-year mutual barycentric trajectory.',
    },
    {
      id: 'proxima_b',
      name: 'Proxima Centauri b (Exoplanet)',
      type: 'planet',
      radius: 1.48,
      actualRadiusKm: 6600,
      color: '#0d9488',
      glowColor: '#14b8a6',
      atmosphere: true,
      atmosphereColor: '#5eead4',
      semiMajorAxis: 24.0,
      actualSemiMajorAxisAU: 0.0485,
      eccentricity: 0.11,
      orbitalPeriodDays: 11.18,
      inclinationDeg: 45.0,
      argumentOfPeriapsisDeg: 130.0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 160,
      rotationPeriodHours: 268.0,
      axialTiltDeg: 0,
      massKg: '7.0 × 10^24',
      gravityMps2: 9.8,
      surfaceTempC: -39,
      orbitalVelocityKms: 45.0,
      atmosphericComposition: ['Nitrogen', 'Oxygen', 'Ozone Screen'],
      description: 'The closest known exoplanet to Earth, located in the habitable zone of our nearest neighbor star.',
    },
    {
      id: 'proxima_c',
      name: 'Proxima Centauri c (Super-Earth)',
      type: 'planet',
      radius: 2.1,
      actualRadiusKm: 12500,
      color: '#0284c7',
      glowColor: '#38bdf8',
      atmosphere: true,
      atmosphereColor: '#bae6fd',
      semiMajorAxis: 42.0,
      actualSemiMajorAxisAU: 1.489,
      eccentricity: 0.04,
      orbitalPeriodDays: 1928,
      inclinationDeg: 133.0,
      argumentOfPeriapsisDeg: 60.0,
      longitudeOfAscendingNodeDeg: 0,
      meanAnomalyEpochDeg: 80,
      rotationPeriodHours: 35.0,
      axialTiltDeg: 12.0,
      massKg: '4.2 × 10^25',
      gravityMps2: 12.5,
      surfaceTempC: -234,
      orbitalVelocityKms: 14.0,
      atmosphericComposition: ['Hydrogen', 'Helium', 'Methane'],
      description: 'Deep freeze super-Earth or mini-Neptune circling outside the frost line with potential faint dust rings.',
    },
  ],
};

// -------------------------------------------------------------------------------------
// Infinite Minecraft-Style Procedural Star System Generator (Seed & Mathematical Physics)
// -------------------------------------------------------------------------------------
export function generateProceduralStarSystem(seedInput: string): StarSystem {
  const cleanSeed = (seedInput || 'sol').trim().toLowerCase();

  // Return curated real astronomy systems for known presets
  if (cleanSeed === 'sol' || cleanSeed === 'sol_system' || cleanSeed === 'earth') {
    return SOL_SYSTEM;
  }
  if (cleanSeed === 'trappist_1' || cleanSeed === 'trappist' || cleanSeed === 'trappist-1') {
    return TRAPPIST1_SYSTEM;
  }
  if (cleanSeed === 'alpha_centauri' || cleanSeed === 'proxima') {
    return ALPHA_CENTAURI_SYSTEM;
  }

  const prng = createPrng(cleanSeed);

  // 1. Procedural Sector Coordinates
  const sectorX = Math.round((prng() * 1600 - 800) * 10) / 10;
  const sectorY = Math.round((prng() * 400 - 200) * 10) / 10;
  const sectorZ = Math.round((prng() * 1600 - 800) * 10) / 10;

  // 2. Stellar Spectral Class Distribution (Hertzsprung-Russell astrophysics)
  const starRoll = prng();
  let spectralClass: StarSpectralClass = 'G';
  let tempK = 5700;
  let massSolar = 1.0;
  let radiusSolar = 1.0;
  let colorHex = '#fff4e6';
  let glowColor = '#f59e0b';
  let typeName = 'G-Type Yellow Dwarf';

  if (starRoll < 0.05) {
    spectralClass = 'O';
    tempK = 32000 + prng() * 8000;
    massSolar = 16.0 + prng() * 10.0;
    radiusSolar = 6.5 + prng() * 3.0;
    colorHex = '#93c5fd';
    glowColor = '#3b82f6';
    typeName = 'O-Type Blue Hypergiant';
  } else if (starRoll < 0.15) {
    spectralClass = 'B';
    tempK = 18000 + prng() * 6000;
    massSolar = 5.0 + prng() * 4.0;
    radiusSolar = 3.2 + prng() * 1.5;
    colorHex = '#bfdbfe';
    glowColor = '#60a5fa';
    typeName = 'B-Type Blue-White Giant';
  } else if (starRoll < 0.3) {
    spectralClass = 'A';
    tempK = 8500 + prng() * 1500;
    massSolar = 2.1 + prng() * 0.8;
    radiusSolar = 1.8 + prng() * 0.5;
    colorHex = '#ffffff';
    glowColor = '#93c5fd';
    typeName = 'A-Type White Star';
  } else if (starRoll < 0.5) {
    spectralClass = 'F';
    tempK = 6500 + prng() * 800;
    massSolar = 1.3 + prng() * 0.4;
    radiusSolar = 1.25 + prng() * 0.3;
    colorHex = '#fef08a';
    glowColor = '#eab308';
    typeName = 'F-Type Yellow-White Dwarf';
  } else if (starRoll < 0.72) {
    spectralClass = 'G';
    tempK = 5400 + prng() * 800;
    massSolar = 0.9 + prng() * 0.3;
    radiusSolar = 0.95 + prng() * 0.2;
    colorHex = '#fffbeb';
    glowColor = '#f59e0b';
    typeName = 'G-Type Solar Twin';
  } else if (starRoll < 0.88) {
    spectralClass = 'K';
    tempK = 4200 + prng() * 800;
    massSolar = 0.65 + prng() * 0.2;
    radiusSolar = 0.75 + prng() * 0.15;
    colorHex = '#fdba74';
    glowColor = '#ea580c';
    typeName = 'K-Type Orange Dwarf';
  } else {
    spectralClass = 'M';
    tempK = 2800 + prng() * 900;
    massSolar = 0.15 + prng() * 0.3;
    radiusSolar = 0.3 + prng() * 0.25;
    colorHex = '#f87171';
    glowColor = '#dc2626';
    typeName = 'M-Type Red Dwarf';
  }

  // Stellar luminosity via mass-luminosity relation L ~ M^3.5
  const luminositySolar = Math.pow(massSolar, 3.5);
  // Habitable zone boundaries via Kopparapu et al. formula
  const habInnerAU = Math.sqrt(luminositySolar / 1.1);
  const habOuterAU = Math.sqrt(luminositySolar / 0.53);
  const frostLineAU = 2.7 * Math.sqrt(luminositySolar);

  // System designation derived deterministically
  const greekLetters = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Sigma', 'Omega', 'Kepler', 'Gliese'];
  const starName = `${greekLetters[Math.floor(prng() * greekLetters.length)]} ${cleanSeed.toUpperCase().slice(0, 5)}-${Math.floor(prng() * 900 + 100)}`;

  const starRadiusRender = Math.min(8.5, Math.max(5.0, 5.0 + Math.log10(radiusSolar + 0.1) * 2.5));

  const hostStar: StarProperties = {
    name: starName,
    spectralClass,
    spectralType: typeName,
    temperatureK: Math.round(tempK),
    massSolar: Math.round(massSolar * 100) / 100,
    radiusSolar: Math.round(radiusSolar * 100) / 100,
    luminositySolar: Math.round(luminositySolar * 100) / 100,
    habitableZoneInnerAU: Math.round(habInnerAU * 100) / 100,
    habitableZoneOuterAU: Math.round(habOuterAU * 100) / 100,
    frostLineAU: Math.round(frostLineAU * 100) / 100,
    colorHex,
    glowColorHex: glowColor,
    coronaIntensity: 1.0 + prng() * 0.5,
  };

  const starBody: CelestialBodyData = {
    id: `${cleanSeed}-star`,
    name: starName,
    type: 'star',
    radius: starRadiusRender,
    actualRadiusKm: Math.round(radiusSolar * 696340),
    color: colorHex,
    glowColor,
    emissive: true,
    semiMajorAxis: 0,
    actualSemiMajorAxisAU: 0,
    eccentricity: 0,
    orbitalPeriodDays: 1,
    inclinationDeg: 0,
    argumentOfPeriapsisDeg: 0,
    longitudeOfAscendingNodeDeg: 0,
    meanAnomalyEpochDeg: 0,
    rotationPeriodHours: Math.round(400 + prng() * 400),
    axialTiltDeg: Math.round(prng() * 15 * 10) / 10,
    massKg: `${(massSolar * 1.989).toFixed(2)} × 10^30`,
    gravityMps2: Math.round(274 * (massSolar / (radiusSolar * radiusSolar))),
    surfaceTempC: Math.round(tempK - 273.15),
    orbitalVelocityKms: 0,
    atmosphericComposition: ['Hydrogen (75%)', 'Helium (23%)', 'Trace Metals (2%)'],
    description: `Primary stellar anchor of the ${cleanSeed} sector. Emitting ${(luminositySolar).toFixed(2)}x solar luminosity.`,
  };

  // 3. Generate 4 to 8 procedural planets spaced via Titius-Bode harmonic formula
  const planetCount = 4 + Math.floor(prng() * 4);
  const bodies: CelestialBodyData[] = [starBody];

  let currentDistAU = Math.max(0.2, habInnerAU * 0.35 * (0.8 + prng() * 0.4));
  let currentVisualDist = 14.0;

  for (let i = 0; i < planetCount; i++) {
    // Step distance via geometric growth
    const distMultiplier = 1.35 + prng() * 0.45;
    currentDistAU *= distMultiplier;
    currentVisualDist += 9.0 + prng() * 5.0;

    // Equilibrium temperature: Teq = Tstar * sqrt(Rstar / (2 * dist)) * (1 - A)^0.25
    const distMeters = currentDistAU * 1.496e11;
    const rStarMeters = radiusSolar * 6.9634e8;
    const tEqK = Math.round(tempK * Math.sqrt(rStarMeters / (2 * distMeters)) * 0.85);
    const tEqC = tEqK - 273;

    // Kepler's Third Law: T = sqrt(a^3 / Mstar) * 365.25 days
    const orbitalDays = Math.round(Math.sqrt(Math.pow(currentDistAU, 3) / massSolar) * 365.25 * 10) / 10;
    // Orbital velocity: v = sqrt(GM / r)
    const velKms = Math.round(29.78 * Math.sqrt(massSolar / currentDistAU) * 10) / 10;

    // Determine Planet Class based on temperature & distance
    const isHabitable = currentDistAU >= habInnerAU && currentDistAU <= habOuterAU;
    const isBeyondFrost = currentDistAU > frostLineAU;

    let pRadius = 1.4;
    let pActualKm = 6000;
    let pColor = '#38bdf8';
    let pGlow = '#0284c7';
    let pAtmosphere = false;
    let pAtmColor = '#60a5fa';
    let pHasRings = false;
    let pDesc = '';
    let pAtmoList = ['Nitrogen', 'Oxygen'];

    const romanNumeral = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'][i] || `${i + 1}`;
    const pName = `${starName} ${romanNumeral}`;

    if (currentDistAU < habInnerAU * 0.6) {
      // Scorched Vulcanian / Molten world
      pRadius = 0.9 + prng() * 0.5;
      pActualKm = Math.round(pRadius * 4200);
      pColor = prng() > 0.5 ? '#7f1d1d' : '#991b1b';
      pGlow = '#ea580c';
      pAtmosphere = prng() > 0.4;
      pAtmColor = '#f97316';
      pDesc = `Scorched volcanic world experiencing extreme tidal friction and incandescent surface magma lakes. Equilibrium temp: ${tEqC}°C.`;
      pAtmoList = ['Sulfur Dioxide (68%)', 'Carbon Dioxide (25%)', 'Silicate Vapor (7%)'];
    } else if (isHabitable) {
      // Garden / Ocean / Terrestrial world
      pRadius = 1.35 + prng() * 0.4;
      pActualKm = Math.round(pRadius * 4600);
      pColor = prng() > 0.4 ? '#0284c7' : '#059669';
      pGlow = '#38bdf8';
      pAtmosphere = true;
      pAtmColor = '#60a5fa';
      pDesc = `Prime candidate for extraterrestrial biology. Equilibrium temp of ${tEqC}°C supports surface liquid water reservoirs.`;
      pAtmoList = ['Nitrogen (77%)', 'Oxygen (21%)', 'Water Vapor (1.5%)', 'Carbon Dioxide (0.5%)'];
    } else if (!isBeyondFrost) {
      // Arid iron desert / Glaciated world
      pRadius = 1.1 + prng() * 0.5;
      pActualKm = Math.round(pRadius * 4400);
      pColor = prng() > 0.5 ? '#c2410c' : '#475569';
      pGlow = '#94a3b8';
      pAtmosphere = prng() > 0.5;
      pAtmColor = '#fdba74';
      pDesc = `Barren cold desert plateau world with oxidised mineral dunes and subsurface permafrost. Equilibrium temp: ${tEqC}°C.`;
      pAtmoList = ['Carbon Dioxide (95%)', 'Nitrogen (3%)', 'Argon (2%)'];
    } else {
      // Gas Giant or Ringed Colossus beyond the Frost Line
      const isGiant = prng() > 0.3;
      if (isGiant) {
        pRadius = 2.8 + prng() * 1.2;
        pActualKm = Math.round(pRadius * 16000);
        pColor = prng() > 0.5 ? '#d97706' : '#2563eb';
        pGlow = '#f59e0b';
        pAtmosphere = true;
        pAtmColor = '#fed7aa';
        pHasRings = prng() > 0.35;
        pDesc = `Massive Jovian gas giant containing thick atmospheric vortex belts and cryogenic cloud decks. Equilibrium temp: ${tEqC}°C.`;
        pAtmoList = ['Hydrogen (86%)', 'Helium (13%)', 'Methane (1%)'];
      } else {
        // Ice giant (Neptune-like)
        pRadius = 2.0 + prng() * 0.6;
        pActualKm = Math.round(pRadius * 12000);
        pColor = '#0284c7';
        pGlow = '#38bdf8';
        pAtmosphere = true;
        pAtmColor = '#a5f3fc';
        pHasRings = prng() > 0.6;
        pDesc = `Deep cryogenic ice giant shrouded in deep blue supercritical methane and ammonia mantle. Equilibrium temp: ${tEqC}°C.`;
        pAtmoList = ['Hydrogen (80%)', 'Helium (18%)', 'Methane (2%)'];
      }
    }

    const planetBody: CelestialBodyData = {
      id: `${cleanSeed}-p${i + 1}`,
      name: pName,
      type: 'planet',
      radius: Math.round(pRadius * 100) / 100,
      actualRadiusKm: pActualKm,
      color: pColor,
      glowColor: pGlow,
      atmosphere: pAtmosphere,
      atmosphereColor: pAtmColor,
      hasRings: pHasRings,
      semiMajorAxis: Math.round(currentVisualDist * 10) / 10,
      actualSemiMajorAxisAU: Math.round(currentDistAU * 1000) / 1000,
      eccentricity: Math.round(prng() * 0.08 * 1000) / 1000,
      orbitalPeriodDays: orbitalDays,
      inclinationDeg: Math.round((prng() * 4 - 2) * 10) / 10,
      argumentOfPeriapsisDeg: Math.round(prng() * 360),
      longitudeOfAscendingNodeDeg: Math.round(prng() * 360),
      meanAnomalyEpochDeg: Math.round(prng() * 360),
      rotationPeriodHours: Math.round((10 + prng() * 40) * 10) / 10,
      axialTiltDeg: Math.round(prng() * 30 * 10) / 10,
      massKg: `${(Math.pow(pRadius / 1.5, 3) * 5.97).toFixed(2)} × 10^24`,
      gravityMps2: Math.round(9.8 * (pRadius / 1.5) * 10) / 10,
      surfaceTempC: tEqC,
      orbitalVelocityKms: velKms,
      atmosphericComposition: pAtmoList,
      description: pDesc,
    };

    bodies.push(planetBody);
  }

  return {
    id: cleanSeed,
    seed: cleanSeed,
    name: starName,
    sectorCoordinates: { x: sectorX, y: sectorY, z: sectorZ },
    star: hostStar,
    bodies,
    description: `Procedural solar system synthesized from seed '${cleanSeed}'. Sector coordinates: [${sectorX}, ${sectorY}, ${sectorZ}]. Host star is a ${typeName} possessing ${planetCount} orbiting worlds.`,
  };
}
