'use client';

import { useEffect, type FC } from 'react';

/** Desktop-only pointer layer. Touch and reduced-motion users keep native interactions. */
export const PointerExperience: FC = () => {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return;

    const cursor = document.createElement('div');
    const dot = document.createElement('div');
    cursor.className = 'experience-cursor';
    dot.className = 'experience-cursor-dot';
    cursor.setAttribute('aria-hidden', 'true');
    dot.setAttribute('aria-hidden', 'true');
    document.body.append(cursor, dot);
    document.body.classList.add('pointer-enhanced');

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let activeTilt: HTMLElement | null = null;

    const paint = () => {
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      frame = 0;
    };

    const resetTilt = () => {
      if (!activeTilt) return;
      activeTilt.style.setProperty('--pointer-tilt-x', '0deg');
      activeTilt.style.setProperty('--pointer-tilt-y', '0deg');
      activeTilt.style.setProperty('--pointer-glow-x', '50%');
      activeTilt.style.setProperty('--pointer-glow-y', '50%');
      activeTilt = null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);

      const target = event.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [role="button"], summary, [data-cursor-label]');
      cursor.classList.toggle('is-active', Boolean(interactive));
      cursor.classList.toggle('has-label', Boolean(interactive?.hasAttribute('data-cursor-label')));
      cursor.dataset.label = interactive?.getAttribute('data-cursor-label') || '';

      const tilt = target?.closest<HTMLElement>('[data-tilt]');
      if (activeTilt !== tilt) resetTilt();
      if (tilt) {
        activeTilt = tilt;
        const rect = tilt.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        const strength = Number(tilt.dataset.tilt || 4);
        tilt.style.setProperty('--pointer-tilt-x', `${(0.5 - py) * strength}deg`);
        tilt.style.setProperty('--pointer-tilt-y', `${(px - 0.5) * strength}deg`);
        tilt.style.setProperty('--pointer-glow-x', `${px * 100}%`);
        tilt.style.setProperty('--pointer-glow-y', `${py * 100}%`);
      }

      const spotlight = target?.closest<HTMLElement>('[data-spotlight]');
      if (spotlight) {
        const rect = spotlight.getBoundingClientRect();
        spotlight.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
        spotlight.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
      }
    };

    const onLeave = () => {
      cursor.classList.remove('is-active', 'has-label');
      resetTilt();
    };
    const onPointerOut = (event: PointerEvent) => {
      if (!(event.relatedTarget instanceof Node)) onLeave();
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onPointerOut);
    window.addEventListener('blur', onLeave);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('blur', onLeave);
      if (frame) window.cancelAnimationFrame(frame);
      resetTilt();
      document.body.classList.remove('pointer-enhanced');
      cursor.remove();
      dot.remove();
    };
  }, []);

  return null;
};
