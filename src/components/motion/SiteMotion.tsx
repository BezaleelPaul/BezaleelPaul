'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { animate, stagger } from 'animejs';

type TrackedElement = HTMLElement | SVGGeometryElement;

const readDelay = (element: HTMLElement) => {
  const value = Number(element.dataset.revealDelay || 0);
  return Number.isFinite(value) ? value : 0;
};

const formatCount = (value: number) => {
  const rounded = Math.round(value);
  return rounded >= 1000 ? rounded.toLocaleString('en-US') : String(rounded);
};

/**
 * One motion controller for the site. Elements opt in through data attributes;
 * the content remains visible if JavaScript, observers, or animation support fail.
 */
export const SiteMotion: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const activeAnimations: any[] = [];
    const observers: IntersectionObserver[] = [];
    let scrollFrame = 0;
    let pointerFrame = 0;
    let pointerTarget: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let surfaceTarget: HTMLElement | null = null;

    const cleanup = () => {
      observers.forEach((observer) => observer.disconnect());
      activeAnimations.forEach((animation) => { try { if (typeof animation.revert === "function") animation.revert(); else if (typeof animation.pause === "function") animation.pause(); } catch(e) {} });
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      root.classList.remove('motion-ready');
      delete root.dataset.motionBoot;
    };

    // Reduced-motion users get the complete, immediately visible content.
    if (reducedMotion.matches) {
      root.classList.remove('motion-ready');
      root.dataset.motionBoot = 'on';
      return cleanup;
    }

    const watch = (
      element: TrackedElement,
      onReveal: () => void,
      options?: IntersectionObserverInit
    ) => {
      if (!('IntersectionObserver' in window)) {
        onReveal();
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          onReveal();
        });
      }, options);

      observer.observe(element);
      observers.push(observer);
    };

    const reveal = (element: HTMLElement, delay = 0, distance = '1.4rem') => {
      const animation = animate(element, {
        opacity: [0, 1],
        translateY: [distance, '0rem'],
        duration: 880,
        delay,
        ease: 'out(3.2)',
        autoplay: false,
      });
      activeAnimations.push(animation);
      watch(element, () => animation.play(), { threshold: 0.08 });
    };

    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
      reveal(element, readDelay(element));
    });

    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal-item]'));
      if (!items.length) return;
      const animation = animate(items, {
        opacity: [0, 1],
        translateY: ['1.2rem', '0rem'],
        duration: 780,
        delay: stagger(78, { start: readDelay(group) }),
        ease: 'out(3.2)',
        autoplay: false,
      });
      activeAnimations.push(animation);
      watch(group, () => animation.play(), { threshold: 0.06 });
    });

    document.querySelectorAll<HTMLElement>('[data-word-group]').forEach((group) => {
      const words = Array.from(group.querySelectorAll<HTMLElement>('[data-word-reveal]'));
      if (!words.length) return;
      const animation = animate(words, {
        opacity: [0, 1],
        translateY: ['115%', '0%'],
        duration: 920,
        delay: stagger(76, { start: readDelay(group) }),
        ease: 'out(4)',
        autoplay: false,
      });
      activeAnimations.push(animation);
      watch(group, () => animation.play(), { threshold: 0.1 });
    });

    document.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
      const target = Number(element.dataset.count);
      if (!Number.isFinite(target)) return;
      watch(element, () => {
        const counter = { value: 0 };
        const animation = animate(counter, {
          value: target,
          duration: 1450,
          ease: 'out(3)',
          onUpdate: () => { element.textContent = formatCount(counter.value); },
        });
        activeAnimations.push(animation);
      });
    });

    document.querySelectorAll<SVGGeometryElement>('[data-draw]').forEach((element) => {
      if (typeof element.getTotalLength !== 'function') return;
      const length = element.getTotalLength();
      element.style.strokeDasharray = String(length);
      element.style.strokeDashoffset = String(length);
      watch(element, () => {
        const animation = animate(element, {
          strokeDashoffset: [length, 0],
          duration: 1500,
          ease: 'inOut(2)',
        });
        activeAnimations.push(animation);
      }, { threshold: 0.1 });
    });

    // Lightweight scroll-linked depth. Only explicitly marked decorative layers
    // are touched, so it never competes with reveal transforms.
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    const updateParallax = () => {
      const viewport = window.innerHeight || 1;
      parallaxItems.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const speed = Number(element.dataset.parallax || 0.08);
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        element.style.setProperty('--parallax-offset', `${-progress * speed * 100}px`);
      });
      scrollFrame = 0;
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateParallax);
    };
    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Pointer depth and spotlight are progressive enhancements for desktop
    // project surfaces. They never intercept input or affect touch navigation.
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;

      const element = event.target as HTMLElement | null;
      const magnetic = element?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (!magnetic) {
        if (pointerTarget) pointerTarget.style.setProperty('--magnetic-offset', '0px 0px');
        pointerTarget = null;
      } else {
        pointerTarget = magnetic;
        const magneticRect = magnetic.getBoundingClientRect();
        pointerX = (event.clientX - magneticRect.left - magneticRect.width / 2) * 0.12;
        pointerY = (event.clientY - magneticRect.top - magneticRect.height / 2) * 0.12;
      }

      const surface = element?.closest<HTMLElement>('[data-tilt], [data-spotlight]') ?? null;
      if (surfaceTarget && surfaceTarget !== surface) {
        surfaceTarget.style.setProperty('--pointer-tilt-x', '0deg');
        surfaceTarget.style.setProperty('--pointer-tilt-y', '0deg');
      }
      surfaceTarget = surface;
      if (surface) {
        const rect = surface.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        const strength = Math.min(5, Math.max(0, Number(surface.dataset.tilt || 2.4)));
        surface.style.setProperty('--spotlight-x', `${(x * 100).toFixed(1)}%`);
        surface.style.setProperty('--spotlight-y', `${(y * 100).toFixed(1)}%`);
        surface.style.setProperty('--pointer-tilt-x', `${((0.5 - y) * strength).toFixed(2)}deg`);
        surface.style.setProperty('--pointer-tilt-y', `${((x - 0.5) * strength).toFixed(2)}deg`);
      }

      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        pointerTarget?.style.setProperty('--magnetic-offset', `${pointerX}px ${pointerY}px`);
        pointerFrame = 0;
      });
    };
    const onPointerLeave = (event: PointerEvent) => {
      const leaving = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-tilt], [data-spotlight]');
      if (leaving && !leaving.contains(event.relatedTarget as Node | null)) {
        leaving.style.setProperty('--pointer-tilt-x', '0deg');
        leaving.style.setProperty('--pointer-tilt-y', '0deg');
      }
      if (pointerTarget && !pointerTarget.contains(event.relatedTarget as Node | null)) {
        pointerTarget.style.setProperty('--magnetic-offset', '0px 0px');
        pointerTarget = null;
      }
    };
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerout', onPointerLeave);

    root.dataset.motionBoot = 'on';
    root.classList.add('motion-ready');

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerout', onPointerLeave);
      cleanup();
    };
  }, [pathname]);

  return null;
};
