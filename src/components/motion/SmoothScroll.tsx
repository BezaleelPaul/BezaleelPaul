'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      anchors: true,
      autoRaf: false,
    });

    const update = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);
    const start = () => lenis.start();

    lenis.stop();
    window.addEventListener('portfolio:intro-complete', start);
    lenis.on('scroll', update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const hero = document.querySelector<HTMLElement>('.hero');
    const title = hero?.querySelector<HTMLElement>('.hero-title');
    const portrait = hero?.querySelector<HTMLElement>('.hero-portrait-wrap');

    const context = gsap.context(() => {
      if (hero && title) {
        gsap.to(title, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }
      if (hero && portrait) {
        gsap.to(portrait, {
          yPercent: -9,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        });
      }

      // Scroll progress bar
      const progressBar = document.getElementById('scroll-progress');
      if (progressBar) {
        gsap.to(progressBar, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }

      // Nav scroll state
      const nav = document.querySelector('.site-nav');
      if (nav) {
        ScrollTrigger.create({
          start: 'top -80px',
          onEnter: () => nav.classList.add('is-scrolled'),
          onLeaveBack: () => nav.classList.remove('is-scrolled'),
        });
      }
    }, hero || undefined);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const frame = requestAnimationFrame(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('portfolio:intro-complete', start);
      cancelAnimationFrame(frame);
      lenis.off('scroll', update);
      gsap.ticker.remove(tick);
      lenis.destroy();
      context.revert();
    };
  }, []);

  return null;
}
