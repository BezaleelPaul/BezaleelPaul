import * as THREE from 'three';
import { createPrng } from './proceduralUniverse';

const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedurally generates high-resolution planetary diffuse maps deterministically
 * using Fractional Brownian Motion (fBm) spherical noise.
 */
export function getOrCreateProceduralPlanetTexture(
  seed: string,
  baseColorHex: string,
  glowColorHex: string,
  isGasGiant: boolean
): THREE.CanvasTexture {
  const cacheKey = `${seed}_${baseColorHex}_${isGasGiant}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  if (typeof document === 'undefined') {
    // SSR fallback dummy texture
    return new THREE.Texture() as unknown as THREE.CanvasTexture;
  }

  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const prng = createPrng(seed);
  const seedOffset = prng() * 100;

  const cBase = new THREE.Color(baseColorHex);
  const cGlow = new THREE.Color(glowColorHex);
  const cDark = cBase.clone().multiplyScalar(0.4);
  const cHighlight = cGlow.clone().lerp(new THREE.Color('#ffffff'), 0.4);

  // Simple pseudo 3D harmonic noise function
  function noise(x: number, y: number, z: number): number {
    return (
      Math.sin(x * 3.1 + seedOffset * 1.7) * Math.cos(y * 3.1 + seedOffset * 2.3) +
      0.5 * Math.sin(x * 6.2 + y * 4.1 + seedOffset * 3.1) * Math.cos(z * 6.2 + seedOffset * 4.1) +
      0.25 * Math.sin(x * 12.3 + z * 8.3 + seedOffset * 5.7) * Math.cos(y * 12.3 + seedOffset * 7.9)
    ) / 1.75;
  }

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const lat = (v - 0.5) * Math.PI; // -PI/2 to PI/2
    const sinLat = Math.sin(lat);
    const cosLat = Math.cos(lat);

    for (let x = 0; x < width; x++) {
      const u = x / width;
      const lon = u * Math.PI * 2; // 0 to 2PI

      // 3D Cartesian coordinates on sphere
      const cx = cosLat * Math.cos(lon);
      const cy = sinLat;
      const cz = cosLat * Math.sin(lon);

      let factor = 0;
      if (isGasGiant) {
        // Banded horizontal zonal jet streams with turbulent eddies
        const bandVal = Math.sin(lat * 24.0 + noise(cx * 2.0, cy * 2.0, cz * 2.0) * 3.2);
        factor = (bandVal + 1.0) / 2.0;
      } else {
        // Terrestrial continental mass elevation with fractal noise
        let n = noise(cx, cy, cz);
        n += 0.5 * noise(cx * 2.4, cy * 2.4, cz * 2.4);
        n += 0.25 * noise(cx * 5.1, cy * 5.1, cz * 5.1);
        factor = Math.max(0, Math.min(1, (n + 1.1) / 2.2));
      }

      // Smooth color interpolation
      const col = new THREE.Color();
      if (factor < 0.45) {
        col.lerpColors(cDark, cBase, factor / 0.45);
      } else {
        col.lerpColors(cBase, cHighlight, (factor - 0.45) / 0.55);
      }

      const idx = (y * width + x) * 4;
      data[idx] = Math.round(col.r * 255);
      data[idx + 1] = Math.round(col.g * 255);
      data[idx + 2] = Math.round(col.b * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;

  textureCache.set(cacheKey, texture);
  return texture;
}
