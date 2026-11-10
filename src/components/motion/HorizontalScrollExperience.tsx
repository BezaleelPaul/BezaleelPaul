'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollExperienceProps {
  children: React.ReactNode;
}

/**
 * Desktop: vertical scroll pins the chapter while the work panels travel
 * horizontally. Mobile and reduced-motion users retain native vertical flow.
 */
export function HorizontalScrollExperience({ children }: HorizontalScrollExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
              section.dataset.progress = self.progress.toFixed(3);
            },
            onRefresh: (self) => {
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });
      }, section);

      requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => {
        context.revert();
        delete section.dataset.progress;
      };
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-work-section" aria-label="Selected projects">
      <div className="horizontal-work-pin">
        <div ref={trackRef} className="horizontal-work-track">
          {children}
        </div>
        <div className="horizontal-work-footer" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <span className="horizontal-work-progress"><span ref={progressRef} /></span>
          <span>SELECTED WORK / 01—03</span>
        </div>
      </div>
    </section>
  );
}
