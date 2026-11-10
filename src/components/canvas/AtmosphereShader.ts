import * as THREE from 'three';

export const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float coefficient;
    uniform float power;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewCameraDir = normalize(-vPosition);
      float intensity = pow(coefficient - dot(vNormal, viewCameraDir), power);
      gl_FragColor = vec4(color, clamp(intensity, 0.0, 1.0) * 0.85);
    }
  `
};

export function createAtmosphereMaterial(colorHex: string, coefficient = 0.65, power = 3.2): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: AtmosphereShader.vertexShader,
    fragmentShader: AtmosphereShader.fragmentShader,
    uniforms: {
      color: { value: new THREE.Color(colorHex) },
      coefficient: { value: coefficient },
      power: { value: power },
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });
}
