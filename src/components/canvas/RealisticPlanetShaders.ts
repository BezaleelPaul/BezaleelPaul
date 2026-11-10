import * as THREE from 'three';

/**
 * Physically-Inspired Planetary Rayleigh & Mie Atmospheric Scattering Shader
 * Light only scatters on the sunlit hemisphere and along the grazing limb.
 * Zero unphysical glow on the dark night side!
 */
export const RealisticAtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(mat3(modelMatrix) * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform vec3 uSunPosition;
    uniform vec3 uAtmosphereColor;
    uniform vec3 uSunsetTint;
    uniform float uAtmosphereScale;
    uniform float uIntensity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 lightDir = normalize(uSunPosition - vWorldPosition);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vNormal);

      float NdotL = dot(normal, lightDir);
      float NdotV = max(0.0, dot(normal, viewDir));

      // Rayleigh grazing limb falloff
      float limb = pow(1.0 - NdotV, 3.2);

      // Sunlit hemisphere mask with soft terminator falloff
      float sunMask = smoothstep(-0.15, 0.35, NdotL);

      // Sunset / Twilight amber tint at the terminator line (NdotL ~ 0)
      float terminator = smoothstep(-0.1, 0.15, NdotL) * smoothstep(0.4, 0.05, NdotL);
      vec3 scatterColor = mix(uAtmosphereColor, uSunsetTint, terminator * 0.7);

      float alpha = limb * sunMask * uIntensity;
      
      // Zero scattering on the night side (true physics of space)
      if (alpha <= 0.001) discard;

      gl_FragColor = vec4(scatterColor, clamp(alpha, 0.0, 0.95));
    }
  `,
};

export function createRealisticAtmosphereMaterial(
  atmosphereColorHex: string,
  sunsetTintHex = '#f97316',
  sunPosition = new THREE.Vector3(0, 0, 0),
  intensity = 1.0
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: RealisticAtmosphereShader.vertexShader,
    fragmentShader: RealisticAtmosphereShader.fragmentShader,
    uniforms: {
      uSunPosition: { value: sunPosition },
      uAtmosphereColor: { value: new THREE.Color(atmosphereColorHex) },
      uSunsetTint: { value: new THREE.Color(sunsetTintHex) },
      uAtmosphereScale: { value: 1.05 },
      uIntensity: { value: intensity },
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
}

/**
 * Realistic Solar Photosphere with Limb Darkening
 * Approximates Eddington limb darkening formula: I(theta) / I(0) = 0.4 + 0.6 * cos(theta)
 */
export const RealisticStarShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uStarColor;
    uniform vec3 uLimbColor;
    uniform float uTime;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    // Simple pseudo-random hash for solar plasma granulation
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      float cosTheta = max(0.0, dot(vNormal, viewDir));

      // Astrophysical Eddington solar limb darkening
      float limbDarkening = 0.42 + 0.58 * pow(cosTheta, 0.72);

      // Flowing solar plasma granulation noise
      vec2 uvNoise = vUv * 36.0 + vec2(uTime * 0.04, uTime * 0.02);
      float gran = noise(uvNoise) * 0.14;

      vec3 finalColor = mix(uLimbColor, uStarColor, limbDarkening + gran);
      gl_FragColor = vec4(finalColor * 1.35, 1.0);
    }
  `,
};

export function createRealisticStarMaterial(
  starColorHex: string,
  limbColorHex: string
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: RealisticStarShader.vertexShader,
    fragmentShader: RealisticStarShader.fragmentShader,
    uniforms: {
      uStarColor: { value: new THREE.Color(starColorHex) },
      uLimbColor: { value: new THREE.Color(limbColorHex) },
      uTime: { value: 0 },
    },
  });
}
