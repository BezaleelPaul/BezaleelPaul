'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const phrases = ['BUILD WITH INTENT', 'MAKE THE COMPLEX USEFUL', 'LEARN IN PUBLIC', 'SHIP · MEASURE · IMPROVE'];

export function OrbitalMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(track, { xPercent: 0 }, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <div ref={sectionRef} className="orbital-marquee" aria-label="Build with intent. Make the complex useful. Learn in public. Ship, measure, improve.">
      <div ref={trackRef} className="orbital-marquee-track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="orbital-marquee-group" key={copy}>
            {phrases.map((phrase) => (
              <span className="orbital-marquee-item" key={phrase}>
                {phrase}<span className="orbital-marquee-star">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
