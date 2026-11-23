'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── helpers ────────────────────────────────────────────────────────────────

function splitIntoWordSpans(el: HTMLElement) {
  // Don't re-split if already done
  if (el.querySelector('.word-reveal')) return;
  const originalHTML = el.innerHTML;
  // We work with the text nodes only by rebuilding the HTML
  // Simple approach: split by words, preserve <br> and <span> children
  const words = el.textContent?.split(/\s+/).filter(Boolean) ?? [];
  if (words.length === 0) return;

  // Replace text content with wrapped words, preserving child elements
  const childNodes = Array.from(el.childNodes);
  el.innerHTML = '';

  childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      const parts = text.split(/(\s+)/);
      parts.forEach((part) => {
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(' '));
        } else if (part) {
          const wrap = document.createElement('span');
          wrap.className = 'word-reveal-wrap';
          const inner = document.createElement('span');
          inner.className = 'word-reveal';
          inner.textContent = part;
          wrap.appendChild(inner);
          el.appendChild(wrap);
        }
      });
    } else {
      // For elements like <span>, <br> — wrap their text content similarly
      const clone = node.cloneNode(true) as HTMLElement;
      if (clone.nodeType === Node.ELEMENT_NODE && clone.tagName === 'BR') {
        el.appendChild(clone);
      } else if (clone.nodeType === Node.ELEMENT_NODE) {
        // Wrap the entire element in a word-reveal-wrap
        const wrap = document.createElement('span');
        wrap.className = 'word-reveal-wrap';
        const inner = document.createElement('span');
        inner.className = 'word-reveal';
        inner.appendChild(clone);
        wrap.appendChild(inner);
        el.appendChild(wrap);
      } else {
        el.appendChild(clone);
      }
    }
  });

  // Store original in case we need to revert
  el.dataset.splitOriginal = originalHTML;
}

function revertWordSplit(el: HTMLElement) {
  if (el.dataset.splitOriginal) {
    el.innerHTML = el.dataset.splitOriginal;
    delete el.dataset.splitOriginal;
  }
}

function getEndNumber(el: HTMLElement): number | null {
  const text = el.textContent?.trim() ?? '';
  const num = parseFloat(text.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? null : num;
}

// ─── Cursor follower ─────────────────────────────────────────────────────────

function initCursor(registerCleanup: (fn: () => void) => void) {
  const cursor = document.getElementById('orbital-cursor');
  const dot = document.getElementById('orbital-cursor-dot');
  if (!cursor || !dot) return;

  let curX = 0;
  let curY = 0;
  let targetX = 0;
  let targetY = 0;
  let rafId = 0;
  let active = false;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tick = () => {
    curX = lerp(curX, targetX, 0.12);
    curY = lerp(curY, targetY, 0.12);
    cursor.style.transform = `translate(${curX}px, ${curY}px)`;
    dot.style.transform = `translate(${targetX}px, ${targetY}px)`;
    rafId = requestAnimationFrame(tick);
  };

  const onMove = (e: MouseEvent) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!active) {
      active = true;
      cursor.classList.add('cursor-active');
      dot.classList.add('cursor-active');
      curX = targetX;
      curY = targetY;
      rafId = requestAnimationFrame(tick);
    }
  };

  const onMouseOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) {
      cursor.classList.add('cursor-hover');
    }
    if (target.closest('.hero-portrait-wrap, .hero-portrait-frame')) {
      cursor.classList.add('cursor-portrait');
    }
  };

  const onMouseOut = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) {
      cursor.classList.remove('cursor-hover');
    }
    if (target.closest('.hero-portrait-wrap, .hero-portrait-frame')) {
      cursor.classList.remove('cursor-portrait');
    }
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);

  registerCleanup(() => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseover', onMouseOver);
    document.removeEventListener('mouseout', onMouseOut);
    cancelAnimationFrame(rafId);
    cursor.classList.remove('cursor-active', 'cursor-hover', 'cursor-portrait');
    dot.classList.remove('cursor-active');
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ScrollAnimations() {
  useLayoutEffect(() => {
    // Cursor cleanup is managed separately since it must run after ctx is initialized
    const cursorCleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Reduced motion: skip all animations ──────────────────────────────
      mm.add('(prefers-reduced-motion: no-preference)', () => {

        // ── A. Section heading word reveals ─────────────────────────────────
        const headingSelectors = [
          'h2.orbital-about-title',
          'h2.selected-work-title',
          'h2#proof-title',
          'h2#skills-title',
          'h2#contact-title',
          'h2#about-title',
          '.orbital-eyebrow',
        ];

        headingSelectors.forEach((sel) => {
          document.querySelectorAll<HTMLElement>(sel).forEach((el) => {
            splitIntoWordSpans(el);
            const words = el.querySelectorAll<HTMLElement>('.word-reveal');
            if (!words.length) return;

            gsap.set(words, { opacity: 0, y: 60 });
            ScrollTrigger.create({
              trigger: el,
              start: 'top 85%',
              once: true,
              onEnter: () => {
                gsap.to(words, {
                  opacity: 1,
                  y: 0,
                  duration: 0.9,
                  stagger: 0.07,
                  ease: 'power3.out',
                });
              },
            });
          });
        });

        // ── B. Orbital eyebrow clip-path reveals ────────────────────────────
        document.querySelectorAll<HTMLElement>('.orbital-eyebrow span').forEach((el) => {
          gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
          ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              gsap.to(el, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.6,
                ease: 'power2.out',
              });
            },
          });
        });

        // ── C. About section paragraph text reveals ─────────────────────────
        const aboutParas = document.querySelectorAll<HTMLElement>(
          '.orbital-about-copy p, .orbital-about-lead'
        );
        if (aboutParas.length) {
          gsap.set(aboutParas, { opacity: 0, y: 30 });
          ScrollTrigger.create({
            trigger: '.orbital-about-copy',
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(aboutParas, {
                opacity: 1,
                y: 0,
                duration: 0.85,
                stagger: 0.14,
                ease: 'power2.out',
              });
            },
          });
        }

        // ── D. Education cards ──────────────────────────────────────────────
        const educationCards = document.querySelectorAll<HTMLElement>('.orbital-education-card');
        if (educationCards.length) {
          gsap.set(educationCards, { opacity: 0, x: -40 });
          ScrollTrigger.create({
            trigger: '.orbital-education',
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(educationCards, {
                opacity: 1,
                x: 0,
                duration: 0.75,
                stagger: 0.12,
                ease: 'power2.out',
              });
            },
          });
        }

        // Education index clip reveal
        document.querySelectorAll<HTMLElement>('.orbital-education-index').forEach((el) => {
          gsap.set(el, { clipPath: 'inset(0 100% 0 0)' });
          ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              gsap.to(el, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.5,
                ease: 'power2.out',
              });
            },
          });
        });

        // ── E. Principles grid ──────────────────────────────────────────────
        const principles = document.querySelectorAll<HTMLElement>('.orbital-principle');
        if (principles.length) {
          gsap.set(principles, { opacity: 0, y: 40 });
          ScrollTrigger.create({
            trigger: '.orbital-principle-grid',
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(principles, {
                opacity: 1,
                y: 0,
                duration: 0.75,
                stagger: 0.1,
                ease: 'power2.out',
              });
            },
          });
        }

        // ── H. Experience timeline rail ──────────────────────────────────────
        const rail = document.querySelector<HTMLElement>('.experience-rail');
        if (rail) {
          // Animate the vertical line/border element if present
          const railLine = rail.querySelector<HTMLElement>('.experience-rail-line') ?? null;
          const targetEl = railLine ?? rail;
          gsap.set(targetEl, { scaleY: 0, transformOrigin: 'top' });
          ScrollTrigger.create({
            trigger: rail,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 1,
            onUpdate: (self) => {
              gsap.set(targetEl, { scaleY: self.progress });
            },
          });
        }

        // ── I. Proof cards ───────────────────────────────────────────────────
        const proofCards = document.querySelectorAll<HTMLElement>('.proof-card');
        if (proofCards.length) {
          gsap.set(proofCards, { opacity: 0, y: 50, scale: 0.95 });
          ScrollTrigger.create({
            trigger: '.proof-grid',
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(proofCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
              });
            },
          });
        }

        // ── Proof metric counters ────────────────────────────────────────────
        document.querySelectorAll<HTMLElement>('.proof-metric strong').forEach((el) => {
          const endVal = getEndNumber(el);
          if (endVal === null) return;
          const original = el.textContent ?? '';
          const isNonNumeric = isNaN(Number(original.trim()));
          if (isNonNumeric) return; // e.g. "SIH", "IEEE" — skip

          el.textContent = '0';
          const counter = { val: 0 };
          ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(counter, {
                val: endVal,
                duration: 1.6,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = String(Math.round(counter.val));
                },
              });
            },
          });
        });

        // ── J. Skills cards ──────────────────────────────────────────────────
        const skillCards = document.querySelectorAll<HTMLElement>('.skills-card');
        if (skillCards.length) {
          gsap.set(skillCards, { opacity: 0, y: 40 });
          ScrollTrigger.create({
            trigger: '.skills-grid',
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(skillCards, {
                opacity: 1,
                y: 0,
                duration: 0.75,
                stagger: 0.09,
                ease: 'power2.out',
              });
            },
          });
        }

        // ── K. Contact section reveal ────────────────────────────────────────
        const contactTitle = document.querySelector<HTMLElement>('h2#contact-title');
        if (contactTitle) {
          gsap.set(contactTitle, { scale: 1.08, opacity: 0 });
          ScrollTrigger.create({
            trigger: contactTitle,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(contactTitle, {
                scale: 1,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
              });
            },
          });
        }

        const orbitRings = document.querySelectorAll<HTMLElement>('.contact-orbit-ring');
        if (orbitRings.length) {
          gsap.set(orbitRings, { scale: 0, opacity: 0 });
          ScrollTrigger.create({
            trigger: '.contact-orbit',
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(orbitRings, {
                scale: 1,
                opacity: 1,
                duration: 0.7,
                stagger: 0.15,
                ease: 'back.out(1.5)',
              });
            },
          });
        }

        const contactEmail = document.querySelector<HTMLElement>('.contact-email');
        if (contactEmail) {
          gsap.set(contactEmail, { clipPath: 'inset(0 100% 0 0)' });
          ScrollTrigger.create({
            trigger: contactEmail,
            start: 'top 88%',
            once: true,
            onEnter: () => {
              gsap.to(contactEmail, {
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.7,
                ease: 'power2.out',
              });
            },
          });
        }

        // ── N. Hero stats counter animation (fires on page load after delay) ─
        // ── N. Hero stats counter animation ─────────────────────────────────
        const heroStats = document.querySelectorAll<HTMLElement>('.hero-stat strong');
        heroStats.forEach((el) => {
          const endVal = getEndNumber(el);
          if (endVal === null) return;
          const counter = { val: 0 };
          gsap.to(counter, {
            val: endVal,
            duration: 1.6,
            delay: 0.35,
            ease: 'power2.out',
            onStart: () => {
              el.textContent = '0';
            },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.val));
            },
            onComplete: () => {
              el.textContent = String(endVal);
            },
          });
        });

        // ── M. Navbar scroll behavior ────────────────────────────────────────
        const nav = document.querySelector('.site-nav');
        if (nav) {
          ScrollTrigger.create({
            start: 'top -80px',
            onEnter: () => nav.classList.add('is-scrolled'),
            onLeaveBack: () => nav.classList.remove('is-scrolled'),
          });
        }

        // ── O. Scroll progress indicator ─────────────────────────────────────
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

      }); // end (prefers-reduced-motion: no-preference)

      // ── F. Work cards mobile stagger ─────────────────────────────────────
      mm.add('(max-width: 900px)', () => {
        const workCards = document.querySelectorAll<HTMLElement>('.selected-work-card');
        if (workCards.length) {
          gsap.set(workCards, { opacity: 0, y: 60 });
          workCards.forEach((card) => {
            ScrollTrigger.create({
              trigger: card,
              start: 'top 85%',
              once: true,
              onEnter: () => {
                gsap.to(card, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: 'power2.out',
                });
              },
            });
          });
        }
      });

    });

    // ── Desktop-only: cursor — initialized after ctx is finalized ───────────
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (finePointer) {
      initCursor((fn) => { cursorCleanups.push(fn); });
    }

    return () => {
      // Revert word splits on cleanup
      const headingSelectors = [
        'h2.orbital-about-title',
        'h2.selected-work-title',
        'h2#proof-title',
        'h2#skills-title',
        'h2#contact-title',
        'h2#about-title',
        '.orbital-eyebrow',
      ];
      headingSelectors.forEach((sel) => {
        document.querySelectorAll<HTMLElement>(sel).forEach(revertWordSplit);
      });
      cursorCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return null;
}
