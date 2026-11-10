import * as THREE from 'three';

// Map of planet IDs to their local NASA / Solar System texture paths
export const PLANET_TEXTURE_PATHS: { [id: string]: {
  map?: string;
  normalMap?: string;
  specularMap?: string;
  cloudsMap?: string;
  ringMap?: string;
}} = {
  earth: {
    map: '/textures/planets/earth_day_2k.jpg',
    normalMap: '/textures/planets/earth_normal_2k.jpg',
    specularMap: '/textures/planets/earth_specular_2k.jpg',
    cloudsMap: '/textures/planets/earth_clouds_1k.png',
  },
  moon: {
    map: '/textures/planets/moon_1k.jpg',
  },
  mars: {
    map: '/textures/planets/mars_1k.jpg',
  },
  jupiter: {
    map: '/textures/planets/jupiter_1k.jpg',
  },
  saturn: {
    map: '/textures/planets/saturn_1k.jpg',
    ringMap: '/textures/planets/saturn_ring.png',
  },
  venus: {
    map: '/textures/planets/venus_1k.jpg',
  },
  mercury: {
    map: '/textures/planets/mercury_1k.jpg',
  },
  sun: {
    map: '/textures/planets/sun_1k.jpg',
  },
  uranus: {
    map: '/textures/planets/uranus_1k.jpg',
    ringMap: '/textures/planets/uranus_ring.png',
  },
  neptune: {
    map: '/textures/planets/neptune_1k.jpg',
  },
  pluto: {
    map: '/textures/planets/pluto_1k.jpg',
  },
};

// Singleton cache so textures are only loaded into VRAM once
const textureCache = new Map<string, THREE.Texture>();
let loader: THREE.TextureLoader | null = null;

function getLoader(): THREE.TextureLoader {
  if (!loader) {
    loader = new THREE.TextureLoader();
  }
  return loader;
}

export function loadCachedTexture(url: string, isColor = true): THREE.Texture | null {
  if (typeof window === 'undefined') return null;

  if (textureCache.has(url)) {
    return textureCache.get(url)!;
  }

  const texLoader = getLoader();
  const tex = texLoader.load(
    url,
    (loadedTex) => {
      if (isColor) {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
      }
      loadedTex.anisotropy = 8;
      loadedTex.needsUpdate = true;
    },
    undefined,
    () => {
      // Graceful fallback if not found
    }
  );

  if (isColor) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  textureCache.set(url, tex);
  return tex;
}
