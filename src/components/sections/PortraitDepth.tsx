'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uPortrait;
  uniform vec2 uPointer;          // Smoothed pointer (-1.0 to 1.0)
  uniform float uAspect;           // Canvas Width / Height
  uniform float uTime;
  uniform vec2 uPressPos;         // Click center in UV (0.0 to 1.0)
  uniform float uPressRadius;      // Expanding shockwave radius
  uniform float uPressStrength;    // Shockwave opacity/strength (0.0 to 1.0)
  uniform float uPressHold;        // Charge-up level while held (0.0 to 1.0)
  uniform float uHoverStrength;    // Hover fade (0.0 to 1.0)

  void main() {
    vec2 uv = vUv;

    // 1. Base Luminance for Depth Map Estimation
    vec4 baseColor = texture2D(uPortrait, uv);
    float lum = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Natural depth: facial highlights & bridge of nose pop forward, dark hair & backdrop recede
    float depth = smoothstep(0.08, 0.88, lum);

    // 2. Continuous Pointer Parallax Displacement (Lando Norris 3D effect)
    vec2 parallax = uPointer * (0.026 * (depth - 0.45)) * uHoverStrength;
    vec2 displacedUv = uv + parallax;

    // 3. Radius-Based Press Shockwave & Gravitational Lensing
    float waveRing = 0.0;
    float innerGlow = 0.0;

    if (uPressStrength > 0.001 || uPressHold > 0.001) {
      vec2 diff = (displacedUv - uPressPos) * vec2(uAspect, 1.0);
      float dist = length(diff);
      vec2 pressDir = (dist > 0.0001) ? normalize(diff / vec2(uAspect, 1.0)) : vec2(0.0);

      // Distance from expanding wavefront
      float waveDist = dist - uPressRadius;
      
      // Primary shockwave ring crest (steep front)
      float ringWidth = 0.055 + 0.025 * uPressRadius;
      float crest = exp(-pow(waveDist / ringWidth, 2.0));
      
      // Secondary harmonic ripples trailing the shockwave
      float ripple = sin(waveDist * 52.0) * exp(-max(0.0, waveDist) * 16.0) * smoothstep(0.0, -0.18, waveDist);
      
      // Combined displacement force
      float totalWave = (crest * 1.1 + ripple * 0.42) * uPressStrength;
      displacedUv += pressDir * (totalWave * 0.065);
      waveRing = crest * uPressStrength;

      // Gravitational lens magnification inside the radius while held
      if (dist < uPressRadius && uPressHold > 0.01) {
        float lensMag = smoothstep(uPressRadius, 0.0, dist) * uPressHold * 0.042;
        displacedUv -= pressDir * lensMag;
        innerGlow = smoothstep(uPressRadius, 0.0, dist) * uPressHold * 0.14;
      }
    }

    // Clamp UVs to avoid edge artifacts
    displacedUv = clamp(displacedUv, vec2(0.002), vec2(0.998));

    // 4. Dynamic Chromatic Aberration along wavefront and pointer movement
    float chromaMag = 0.0035 * uHoverStrength + waveRing * 0.022 + uPressHold * 0.009;
    vec2 chromaDir = (waveRing > 0.01) ? normalize(displacedUv - uPressPos + vec2(0.0001)) : (uPointer * 0.6);
    vec2 chromaOffset = chromaDir * chromaMag;

    float r = texture2D(uPortrait, clamp(displacedUv + chromaOffset, vec2(0.002), vec2(0.998))).r;
    float g = texture2D(uPortrait, displacedUv).g;
    float b = texture2D(uPortrait, clamp(displacedUv - chromaOffset, vec2(0.002), vec2(0.998))).b;
    vec3 color = vec3(r, g, b);

    // 5. Editorial Studio Lighting & Color Grading
    color = pow(color, vec3(1.08));

    // Interactive Cursor Spotlight
    vec2 lightUv = uPointer * 0.5 + vec2(0.5);
    float lightDist = distance(uv * vec2(uAspect, 1.0), lightUv * vec2(uAspect, 1.0));
    float cursorGlow = smoothstep(0.95, 0.0, lightDist) * 0.095 * uHoverStrength;
    
    // Orbital brand accent (#D7FF00)
    vec3 accent = vec3(0.843, 1.0, 0.0);
    color += accent * cursorGlow * (lum * 1.35);

    // 6. Shockwave Ring Neon Edge & Inner Lens Sheen
    if (waveRing > 0.001) {
      color = mix(color, accent, waveRing * 0.72);
      color += accent * waveRing * 0.52;
    }
    if (innerGlow > 0.001) {
      color += accent * innerGlow;
    }

    gl_FragColor = vec4(color, baseColor.a);
  }
`;

interface PortraitDepthProps {
  className?: string;
}

export function PortraitDepth({ className = '' }: PortraitDepthProps) {
  const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH || '';
  const portraitSrc = `${basePath}/assets/portrait-processed.webp`;

  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [glReady, setGlReady] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [hudRadiusPx, setHudRadiusPx] = useState(0);
  const [hudPressPoint, setHudPressPoint] = useState<{ x: number; y: number } | null>(null);
  const [hudCharge, setHudCharge] = useState(0);
  const [cardTransform, setCardTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');

  // Animation & Physics State
  const stateRef = useRef({
    pointerX: 0,
    pointerY: 0,
    targetPointerX: 0,
    targetPointerY: 0,
    hoverStrength: 0,
    targetHoverStrength: 0,
    pressX: 0.5,
    pressY: 0.5,
    pressRadius: 0,
    pressStrength: 0,
    pressHold: 0,
    isPressing: false,
    pressPixelX: 0,
    pressPixelY: 0,
    width: 0,
    height: 0,
    gl: null as WebGLRenderingContext | null,
    program: null as WebGLProgram | null,
    quadBuffer: null as WebGLBuffer | null,
    texture: null as WebGLTexture | null,
    locations: {} as Record<string, WebGLUniformLocation | number>,
  });

  // Handle pointer down (Mouse Click or Mobile Touch)
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    const u = pixelX / rect.width;
    const v = 1.0 - (pixelY / rect.height); // WebGL UV is inverted Y

    stateRef.current.pressX = Math.max(0, Math.min(1, u));
    stateRef.current.pressY = Math.max(0, Math.min(1, v));
    stateRef.current.pressPixelX = pixelX;
    stateRef.current.pressPixelY = pixelY;
    stateRef.current.pressRadius = 0.02;
    stateRef.current.pressStrength = 1.0;
    stateRef.current.pressHold = 0.05;
    stateRef.current.isPressing = true;

    setIsPressing(true);
    setHudPressPoint({ x: pixelX, y: pixelY });
    setHudRadiusPx(Math.round(0.02 * rect.width));
    setHudCharge(5);

    // Capture pointer to track drags outside frame
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if unsupported
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!stateRef.current.isPressing) return;
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    // Follow dragging finger/mouse
    stateRef.current.pressX = Math.max(0, Math.min(1, pixelX / rect.width));
    stateRef.current.pressY = Math.max(0, Math.min(1, 1.0 - (pixelY / rect.height)));
    stateRef.current.pressPixelX = pixelX;
    stateRef.current.pressPixelY = pixelY;
    setHudPressPoint({ x: pixelX, y: pixelY });
  }, []);

  const handlePointerUp = useCallback(() => {
    stateRef.current.isPressing = false;
    setIsPressing(false);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!frame || !canvas || !img) return;

    // Check prefers-reduced-motion
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      return;
    }

    const state = stateRef.current;

    // Initialize WebGL
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      }) || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    } catch {
      return;
    }

    if (!gl) return;
    state.gl = gl;

    const compile = (type: number, src: string) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    state.program = program;
    gl.useProgram(program);

    // Fullscreen Quad Buffer
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    state.quadBuffer = quadBuffer;

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Texture setup
    const texture = gl.createTexture();
    if (!texture) return;
    state.texture = texture;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Cache uniform locations
    state.locations = {
      position: posLoc,
      uPortrait: gl.getUniformLocation(program, 'uPortrait')!,
      uPointer: gl.getUniformLocation(program, 'uPointer')!,
      uAspect: gl.getUniformLocation(program, 'uAspect')!,
      uTime: gl.getUniformLocation(program, 'uTime')!,
      uPressPos: gl.getUniformLocation(program, 'uPressPos')!,
      uPressRadius: gl.getUniformLocation(program, 'uPressRadius')!,
      uPressStrength: gl.getUniformLocation(program, 'uPressStrength')!,
      uPressHold: gl.getUniformLocation(program, 'uPressHold')!,
      uHoverStrength: gl.getUniformLocation(program, 'uHoverStrength')!,
    };

    gl.uniform1i(state.locations.uPortrait as WebGLUniformLocation, 0);

    // Load texture image
    const textureImg = new Image();
    textureImg.src = portraitSrc;

    const uploadTexture = () => {
      if (!state.gl || !state.texture) return;
      state.gl.bindTexture(state.gl.TEXTURE_2D, state.texture);
      state.gl.texImage2D(
        state.gl.TEXTURE_2D,
        0,
        state.gl.RGBA,
        state.gl.RGBA,
        state.gl.UNSIGNED_BYTE,
        textureImg
      );
      setGlReady(true);
    };

    if (textureImg.complete && textureImg.naturalWidth) {
      uploadTexture();
    } else {
      textureImg.onload = uploadTexture;
    }

    // Canvas size sync with device pixel ratio
    const syncCanvasSize = () => {
      if (!canvas || !gl) return;
      const rect = frame.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        gl.viewport(0, 0, targetW, targetH);

        // Rebind quad buffer after canvas resize to restore WebGL state
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      }

      state.width = rect.width;
      state.height = rect.height;
    };

    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize);

    // Pointer move listener on hero section
    const heroEl = frame.closest('.hero') || window;
    const onWindowPointerMove = (e: Event) => {
      const pe = e as PointerEvent;
      const rect = frame.getBoundingClientRect();
      const heroRect = (heroEl instanceof HTMLElement ? heroEl : frame).getBoundingClientRect();

      // Normalized coordinates relative to frame center
      const normX = ((pe.clientX - (rect.left + rect.width * 0.5)) / (window.innerWidth * 0.5));
      const normY = (((rect.top + rect.height * 0.5) - pe.clientY) / (window.innerHeight * 0.5));

      state.targetPointerX = Math.max(-1.0, Math.min(1.0, normX));
      state.targetPointerY = Math.max(-1.0, Math.min(1.0, normY));

      const inHero =
        pe.clientX >= heroRect.left &&
        pe.clientX <= heroRect.right &&
        pe.clientY >= heroRect.top &&
        pe.clientY <= heroRect.bottom;

      state.targetHoverStrength = inHero ? 1.0 : 0.0;
    };

    const onPointerLeave = () => {
      state.targetPointerX = 0;
      state.targetPointerY = 0;
      state.targetHoverStrength = 0;
      state.isPressing = false;
      setIsPressing(false);
    };

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);

    // Visibility observer to pause RAF offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) {
        rafId = requestAnimationFrame(render);
      }
    });
    observer.observe(frame);

    // Render loop
    let rafId = 0;
    const startTime = performance.now();

    const render = (now: number) => {
      rafId = 0;
      if (!isVisible || !gl || !program) return;

      // Spring LERP for pointer movement
      state.pointerX += (state.targetPointerX - state.pointerX) * 0.085;
      state.pointerY += (state.targetPointerY - state.pointerY) * 0.085;
      state.hoverStrength += (state.targetHoverStrength - state.hoverStrength) * 0.06;

      // Click / Press shockwave physics
      if (state.isPressing) {
        // Expands continuous radius while held
        state.pressRadius += 0.022;
        state.pressHold = Math.min(1.0, state.pressHold + 0.035);
        state.pressStrength = 1.0;
      } else {
        state.pressHold = Math.max(0, state.pressHold - 0.04);
        if (state.pressStrength > 0.001) {
          state.pressRadius += 0.034;
          state.pressStrength = Math.max(0, state.pressStrength - 0.032);
        }
      }

      // Update HUD state during press
      if (state.isPressing || state.pressStrength > 0.05) {
        const livePx = Math.round(state.pressRadius * state.width);
        setHudRadiusPx(livePx);
        setHudCharge(Math.round(state.pressHold * 100));
      }

      // 3D perspective tilt on the card frame
      const tiltX = -state.pointerY * 8.5 * state.hoverStrength;
      const tiltY = state.pointerX * 8.5 * state.hoverStrength;
      const scale = state.isPressing ? 0.985 : 1.0 + state.hoverStrength * 0.015;
      setCardTransform(
        `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(${scale},${scale},1)`
      );

      // WebGL uniforms
      gl.useProgram(program);
      gl.uniform2f(state.locations.uPointer as WebGLUniformLocation, state.pointerX, state.pointerY);
      gl.uniform1f(state.locations.uAspect as WebGLUniformLocation, state.width / Math.max(1, state.height));
      gl.uniform1f(state.locations.uTime as WebGLUniformLocation, (now - startTime) * 0.001);
      gl.uniform2f(state.locations.uPressPos as WebGLUniformLocation, state.pressX, state.pressY);
      gl.uniform1f(state.locations.uPressRadius as WebGLUniformLocation, state.pressRadius);
      gl.uniform1f(state.locations.uPressStrength as WebGLUniformLocation, state.pressStrength);
      gl.uniform1f(state.locations.uPressHold as WebGLUniformLocation, state.pressHold);
      gl.uniform1f(state.locations.uHoverStrength as WebGLUniformLocation, state.hoverStrength);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncCanvasSize);
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('pointerup', handlePointerUp);
      if (rafId) cancelAnimationFrame(rafId);
      if (gl) {
        if (texture) gl.deleteTexture(texture);
        if (quadBuffer) gl.deleteBuffer(quadBuffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [portraitSrc, handlePointerUp]);

  return (
    <div
      ref={frameRef}
      className={`hero-portrait-frame ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transform: cardTransform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)',
        userSelect: 'none',
        cursor: isPressing ? 'grabbing' : 'crosshair',
        touchAction: 'none', // Allows fluid touch gestures and radar pulse without unwanted scrolling
      }}
      aria-label="Interactive pilot portrait: move to tilt, press and hold to expand orbital signal shockwave"
    >
      {/* 
        High-Res Static Portrait Base:
        Always loaded with fetchPriority="high".
        Guarantees instant LCP and provides 100% sharp fallback if WebGL is unavailable.
      */}
      <img
        ref={imgRef}
        className="hero-portrait"
        src={portraitSrc}
        alt="Bezaleel Paul"
        fetchPriority="high"
        loading="eager"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          filter: 'contrast(1.06) brightness(1.02)',
          opacity: 1,
          pointerEvents: 'none',
        }}
      />

      {/* 
        Interactive WebGL Canvas:
        Displays dynamic parallax, depth displacement, and expanding radius shockwave.
        Matches exact aspect ratio and Retina DPR.
      */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          opacity: glReady ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* 
        Interactive HUD Press Radar Ring ("press like a size of radius"):
        Visualizes the exact radius expanding from the user's click/touch center!
      */}
      {hudPressPoint && (isPressing || hudRadiusPx > 10) && (
        <div
          className="hud-press-radar"
          style={{
            left: `${hudPressPoint.x}px`,
            top: `${hudPressPoint.y}px`,
            width: `${hudRadiusPx * 2}px`,
            height: `${hudRadiusPx * 2}px`,
            opacity: isPressing ? 1 : Math.max(0, 1 - (hudRadiusPx / (stateRef.current.width * 1.5 || 300))),
          }}
          aria-hidden="true"
        >
          <span className="hud-press-label">
            RAD: {hudRadiusPx}PX {hudCharge > 0 ? `// FLUX: ${hudCharge}%` : ''}
          </span>
        </div>
      )}

      {/* 
        Orbital HUD Telemetry Overlays (Lando Norris Editorial Style):
        Floating technical markers and interactive prompts.
      */}
      <div className="hero-portrait-hud" aria-hidden="true">
        {/* Corner Targeting Crosshairs */}
        <span className="hud-corner hud-tl">+</span>
        <span className="hud-corner hud-tr">+</span>
        <span className="hud-corner hud-bl">+</span>
        <span className="hud-corner hud-br">+</span>

        {/* Technical Callout Badges */}
        <div className="hud-meta-top">
          <span className="hud-tag">ORBITAL SECTOR // 01</span>
          <span className="hud-badge">SYS ACTIVE</span>
        </div>

        <div className="hud-meta-bottom">
          <span className="hud-coords">12°58&apos; N / 77°36&apos; E</span>
          <span className={`hud-action-hint ${isPressing ? 'is-engaged' : ''}`}>
            {isPressing
              ? `SIGNAL RADIUS: ${hudRadiusPx}PX [FLUX ${hudCharge}%]`
              : 'CLICK / HOLD TO RADIATE SIGNAL'}
          </span>
        </div>
      </div>
    </div>
  );
}
