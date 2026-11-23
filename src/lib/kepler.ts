import * as THREE from 'three';
import { CelestialBodyData } from '@/types/simulation';

// Gravitational constant parameter scaled for visual simulation
const G_MU = 4000;

/**
 * Solve Kepler's equation M = E - e*sin(E) using Newton-Raphson iteration
 * @param M Mean anomaly in radians
 * @param e Eccentricity (0 <= e < 1)
 */
export function solveKepler(M: number, e: number): number {
  let E = e > 0.8 ? Math.PI : M;
  const tol = 1e-6;
  const maxIter = 30;
  
  for (let i = 0; i < maxIter; i++) {
    const f = E - e * Math.sin(E) - M;
    if (Math.abs(f) < tol) break;
    const fPrime = 1 - e * Math.cos(E);
    E = E - f / fPrime;
  }
  return E;
}

/**
 * Calculate 3D Heliocentric Position for a celestial body at elapsed simulated days
 */
export function calculateOrbitPosition(
  body: CelestialBodyData,
  elapsedDays: number
): THREE.Vector3 {
  if (body.semiMajorAxis === 0) {
    return new THREE.Vector3(0, 0, 0);
  }

  const n = (2 * Math.PI) / body.orbitalPeriodDays; // Mean motion
  const M0 = (body.meanAnomalyEpochDeg * Math.PI) / 180;
  const M = (M0 + n * elapsedDays) % (2 * Math.PI); // Current mean anomaly
  
  const E = solveKepler(M, body.eccentricity);
  
  // Orbital plane coordinates (perifocal coordinate system)
  const a = body.semiMajorAxis;
  const e = body.eccentricity;
  const xOrb = a * (Math.cos(E) - e);
  const zOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  // Rotate to 3D inclination, argument of periapsis, and ascending node
  const i = (body.inclinationDeg * Math.PI) / 180;
  const omega = (body.argumentOfPeriapsisDeg * Math.PI) / 180;
  const Omega = (body.longitudeOfAscendingNodeDeg * Math.PI) / 180;

  // Rotation matrix transformation
  const cosOmega = Math.cos(Omega);
  const sinOmega = Math.sin(Omega);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  const cosw = Math.cos(omega);
  const sinw = Math.sin(omega);

  // Transform coordinates
  const Px = cosOmega * cosw - sinOmega * sinw * cosi;
  const Py = sinw * sini;
  const Pz = sinOmega * cosw + cosOmega * sinw * cosi;

  const Qx = -cosOmega * sinw - sinOmega * cosw * cosi;
  const Qy = cosw * sini;
  const Qz = -sinOmega * sinw + cosOmega * cosw * cosi;

  const x = xOrb * Px + zOrb * Qx;
  const y = xOrb * Py + zOrb * Qy;
  const z = xOrb * Pz + zOrb * Qz;

  return new THREE.Vector3(x, y, z);
}

/**
 * Generate 3D vertices for an orbital path line
 */
export function generateOrbitPath(body: CelestialBodyData, segments = 180): THREE.Vector3[] {
  if (body.semiMajorAxis === 0) return [];
  
  const points: THREE.Vector3[] = [];
  const a = body.semiMajorAxis;
  const e = body.eccentricity;
  const i = (body.inclinationDeg * Math.PI) / 180;
  const omega = (body.argumentOfPeriapsisDeg * Math.PI) / 180;
  const Omega = (body.longitudeOfAscendingNodeDeg * Math.PI) / 180;

  const cosOmega = Math.cos(Omega);
  const sinOmega = Math.sin(Omega);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  const cosw = Math.cos(omega);
  const sinw = Math.sin(omega);

  const Px = cosOmega * cosw - sinOmega * sinw * cosi;
  const Py = sinw * sini;
  const Pz = sinOmega * cosw + cosOmega * sinw * cosi;

  const Qx = -cosOmega * sinw - sinOmega * cosw * cosi;
  const Qy = cosw * sini;
  const Qz = -sinOmega * sinw + cosOmega * cosw * cosi;

  for (let s = 0; s <= segments; s++) {
    const theta = (s / segments) * 2 * Math.PI;
    const xOrb = a * (Math.cos(theta) - e);
    const zOrb = a * Math.sqrt(1 - e * e) * Math.sin(theta);

    const x = xOrb * Px + zOrb * Qx;
    const y = xOrb * Py + zOrb * Qy;
    const z = xOrb * Pz + zOrb * Qz;

    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

/**
 * Instantaneous Orbital Velocity calculation (vis-viva equation)
 */
export function calculateVisVivaVelocity(r: number, a: number, baseKmS: number): number {
  if (a <= 0 || r <= 0) return 0;
  const ratio = Math.sqrt(Math.max(0.1, 2 / r - 1 / a));
  return parseFloat((baseKmS * ratio).toFixed(2));
}
