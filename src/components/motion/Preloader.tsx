'use client';

import { useEffect, useState } from 'react';

export function Preloader() {
  const [phase, setPhase] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      window.dispatchEvent(new Event('portfolio:intro-complete'));
    };

    if (reducedMotion) {
      setPhase('exit');
      finish();
      return;
    }

    // Give the BP mark a deliberate reveal, then let the starfield aperture
    // open onto the homepage. Lenis is released only when the curtain clears.
    const exitTimer = window.setTimeout(() => setPhase('exit'), 1180);
    const finishTimer = window.setTimeout(finish, 1740);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  return (
    <div className={`portfolio-preloader intro-phase-${phase}`} aria-hidden="true">
      <div className="intro-starfield" />
      <div className="intro-orbit intro-orbit-one" />
      <div className="intro-orbit intro-orbit-two" />
      <div className="preloader-content">
        <div className="preloader-mark"><span className="mark-b">B</span><span className="mark-p">P</span><span className="mark-dot">.</span></div>
        <p className="preloader-caption">A personal universe · Bezaleel Paul</p>
        <div className="preloader-line"><span /></div>
      </div>
      <div className="intro-coordinate intro-coordinate-left">SECTOR 01 / BP</div>
      <div className="intro-coordinate intro-coordinate-right">SYSTEM ONLINE</div>
    </div>
  );
}
