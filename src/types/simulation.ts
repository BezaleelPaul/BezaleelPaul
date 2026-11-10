export interface CelestialBodyData {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon' | 'dwarf' | 'spacecraft' | 'station' | 'telescope';
  radius: number; // rendering scale radius
  actualRadiusKm: number;
  color: string;
  glowColor: string;
  emissive?: boolean;
  atmosphere?: boolean;
  atmosphereColor?: string;
  hasRings?: boolean;
  parentBodyId?: string; // e.g. Earth for Moon
  
  // Keplerian Orbital Elements
  semiMajorAxis: number; // rendering units
  actualSemiMajorAxisAU: number;
  eccentricity: number;
  orbitalPeriodDays: number;
  inclinationDeg: number;
  argumentOfPeriapsisDeg: number;
  longitudeOfAscendingNodeDeg: number;
  meanAnomalyEpochDeg: number;
  
  // Physical properties (NASA/JPL verified)
  rotationPeriodHours: number;
  axialTiltDeg: number;
  massKg: string;
  gravityMps2: number;
  surfaceTempC: number;
  orbitalVelocityKms: number;
  atmosphericComposition: string[];
  description: string;
  jplHorizonsId?: string;
}

export interface SpacecraftState {
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: [number, number, number];
  throttle: number; // 0 to 1
  isBoosting: boolean;
  speedKms: number;
  fuelPercent: number;
  targetId: string | null;
  mode: 'free' | 'orbit' | 'flight' | 'cockpit';
}

export interface TelemetryLog {
  timestamp: string;
  type: 'info' | 'warn' | 'success' | 'alert';
  message: string;
}
