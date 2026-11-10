'use client';

import { useEffect, useRef } from 'react';

type SceneObject = HTMLDivElement | null;

function reveal(progress: number, start: number, end: number) {
  const fadeIn = Math.min(1, Math.max(0, (progress - start) / 0.055));
  const fadeOut = Math.min(1, Math.max(0, (end - progress) / 0.065));
  return Math.min(fadeIn, fadeOut);
}

/**
 * A lightweight, decorative space layer that reacts to document scroll.
 * It uses a single passive scroll listener + one RAF at a time (no canvas/WebGL).
 */
export function CosmicScrollScenes() {
  const asteroidOne = useRef<SceneObject>(null);
  const asteroidTwo = useRef<SceneObject>(null);
  const satellite = useRef<SceneObject>(null);
  const planet = useRef<SceneObject>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    let frame = 0;
    let disposed = false;

    const paint = () => {
      frame = 0;
      if (disposed) return;

      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const width = window.innerWidth;
      const height = window.innerHeight;

      const move = (
        element: SceneObject,
        start: number,
        end: number,
        fromX: number,
        toX: number,
        fromY: number,
        toY: number,
        rotation: number
      ) => {
        if (!element) return;
        const local = Math.min(1, Math.max(0, (progress - start) / (end - start)));
        const visible = reveal(progress, start, end);
        const x = fromX + (toX - fromX) * local;
        const y = fromY + (toY - fromY) * local;
        element.style.opacity = String(visible * 0.78);
        element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation * local}deg)`;
      };

      move(asteroidOne.current, 0.025, 0.43, -150, width + 170, -height * 0.08, height * 0.12, 145);
      move(asteroidTwo.current, 0.32, 0.79, width + 160, -190, height * 0.16, -height * 0.12, -210);
      move(satellite.current, 0.66, 0.99, -100, width + 110, height * 0.08, -height * 0.2, 85);

      if (planet.current) {
        const visible = reveal(progress, 0.39, 0.69);
        const local = Math.min(1, Math.max(0, (progress - 0.39) / 0.3));
        planet.current.style.opacity = String(visible * 0.72);
        planet.current.style.transform = `translate3d(0, ${(local - 0.5) * -42}px, 0) scale(${0.78 + local * 0.22}) rotate(${-12 + local * 24}deg)`;
      }
    };

    const requestPaint = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('scroll', requestPaint, { passive: true });
    window.addEventListener('resize', requestPaint, { passive: true });

    return () => {
      disposed = true;
      window.removeEventListener('scroll', requestPaint);
      window.removeEventListener('resize', requestPaint);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="cosmic-scroll-scenes" aria-hidden="true">
      <div className="cosmic-dust" />
      <div className="cosmic-asteroid cosmic-asteroid-one" ref={asteroidOne}>
        <svg viewBox="0 0 120 104" role="presentation">
          <defs>
            <linearGradient id="asteroid-rock-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d8dfc5" />
              <stop offset=".48" stopColor="#687264" />
              <stop offset="1" stopColor="#202820" />
            </linearGradient>
          </defs>
          <path d="M58 5 82 13 106 37 112 61 93 88 63 99 31 91 8 69 14 39 34 13Z" fill="url(#asteroid-rock-a)" stroke="#d7ff00" strokeOpacity=".34" strokeWidth="1.4" />
          <path d="m34 29 15-7 8 9-7 11-15-2Zm38 31 13-8 10 9-5 13-16 2ZM27 63l10-8 9 7-4 12-13 1Z" fill="#182018" fillOpacity=".7" />
          <path d="m20 41 10-18 16-8M70 13l17 9 10 17M42 88l20 7 20-6" fill="none" stroke="#eff4df" strokeOpacity=".22" strokeWidth="2" />
        </svg>
      </div>
      <div className="cosmic-asteroid cosmic-asteroid-two" ref={asteroidTwo}>
        <svg viewBox="0 0 120 104" role="presentation">
          <path d="m55 4 27 9 24 24 8 25-17 27-30 10-34-9L9 68l7-32 18-24Z" fill="#777e72" stroke="#d7ff00" strokeOpacity=".3" strokeWidth="1.5" />
          <path d="m32 30 15-9 12 8-6 12-16 2Zm36 32 13-10 13 8-4 15-17 2ZM24 63l12-8 9 8-7 12-12-2Z" fill="#202820" fillOpacity=".72" />
          <path d="m19 42 12-20 17-9m25 4 18 13 9 20" fill="none" stroke="#f7f8f2" strokeOpacity=".2" strokeWidth="2" />
        </svg>
      </div>
      <div className="cosmic-satellite" ref={satellite}>
        <span className="satellite-wing satellite-wing-left" />
        <span className="satellite-core" />
        <span className="satellite-wing satellite-wing-right" />
        <span className="satellite-signal" />
      </div>
      <div className="cosmic-planet" ref={planet}>
        <span className="cosmic-planet-ring" />
        <span className="cosmic-planet-crater crater-one" />
        <span className="cosmic-planet-crater crater-two" />
      </div>
      <style jsx>{`
        .cosmic-scroll-scenes {
          position: fixed;
          z-index: 3;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          opacity: .78;
          mix-blend-mode: screen;
        }
        .cosmic-dust {
          position: absolute;
          inset: 0;
          opacity: .18;
          background-image: radial-gradient(1px 1px at 13% 23%, #f7f8f2 70%, transparent), radial-gradient(1px 1px at 79% 67%, #d7ff00 70%, transparent), radial-gradient(1px 1px at 42% 82%, #f7f8f2 70%, transparent);
          background-size: 270px 240px, 390px 330px, 510px 420px;
        }
        .cosmic-asteroid, .cosmic-satellite, .cosmic-planet {
          position: absolute;
          opacity: 0;
          will-change: transform, opacity;
        }
        .cosmic-asteroid { width: clamp(64px, 9vw, 124px); filter: drop-shadow(0 0 18px rgba(215,255,0,.12)); }
        .cosmic-asteroid svg { display: block; width: 100%; height: auto; }
        .cosmic-asteroid-one { top: 14%; left: 0; }
        .cosmic-asteroid-two { top: 66%; left: 0; width: clamp(48px, 7vw, 94px); }
        .cosmic-satellite { top: 28%; left: 0; width: 74px; height: 28px; }
        .satellite-core { position: absolute; left: 31px; top: 9px; width: 13px; height: 10px; border-radius: 3px; background: linear-gradient(135deg,#f7f8f2,#6c7b71); box-shadow: 0 0 16px rgba(215,255,0,.3); }
        .satellite-wing { position: absolute; top: 5px; width: 27px; height: 18px; border: 1px solid rgba(215,255,0,.5); background: repeating-linear-gradient(90deg,rgba(215,255,0,.2) 0 3px,rgba(215,255,0,.04) 3px 6px); }
        .satellite-wing-left { left: 0; transform: skewY(-12deg); }
        .satellite-wing-right { right: 0; transform: skewY(12deg); }
        .satellite-signal { position: absolute; left: 36px; top: -4px; width: 3px; height: 3px; border-radius: 50%; background: #d7ff00; box-shadow: 0 0 13px 4px rgba(215,255,0,.35); }
        .cosmic-planet { top: 44%; right: -130px; width: clamp(130px, 19vw, 250px); aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle at 32% 28%,#a7b8a1 0,#536657 24%,#202d29 56%,#0a0a0f 78%); box-shadow: inset -22px -16px 42px rgba(0,0,0,.65), 0 0 65px rgba(113,148,128,.13); }
        .cosmic-planet-ring { position: absolute; inset: 20% -28%; border: 1px solid rgba(215,255,0,.35); border-radius: 50%; transform: rotate(-18deg) scaleY(.32); }
        .cosmic-planet-crater { position: absolute; border-radius: 50%; background: rgba(10,10,15,.22); box-shadow: inset 2px 2px 5px rgba(0,0,0,.3); }
        .crater-one { width: 15%; height: 15%; left: 28%; top: 35%; }
        .crater-two { width: 9%; height: 9%; right: 25%; top: 58%; }
        @media (max-width: 640px) {
          .cosmic-scroll-scenes { opacity: .52; }
          .cosmic-asteroid-one { top: 12%; }
          .cosmic-asteroid-two { top: 72%; }
          .cosmic-satellite { transform: scale(.72); transform-origin: left center; }
          .cosmic-planet { right: -150px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cosmic-scroll-scenes { display: none; }
        }
      `}</style>
    </div>
  );
}
