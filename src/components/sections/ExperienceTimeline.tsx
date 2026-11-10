'use client';

import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const entries = [
  {
    number: '01',
    period: 'SEP 2026 — PRESENT',
    type: 'INTERNSHIP',
    role: 'Software Development Intern',
    organization: 'Eazy Walkers Digital',
    location: 'Bengaluru, India',
    summary: 'Contributing to software development in a professional team environment, applying cross-platform application development and practical engineering workflows.',
    focus: ['Software development', 'Flutter', 'Application engineering'],
    accent: 'lime',
  },
  {
    number: '02',
    period: 'DEC 2025 — SEP 2026',
    type: 'STUDENT LEADERSHIP',
    role: 'Webmaster · Executive Committee',
    organization: 'IEEE CMR University Student Branch',
    location: 'Bengaluru, India',
    summary: 'Former student branch Webmaster and EXCOM volunteer, supporting the branch’s digital presence and technical community activities.',
    focus: ['Web development', 'Digital operations', 'Technical community'],
    accent: 'white',
  },
  {
    number: '03',
    period: '2026',
    type: 'PROJECT LEADERSHIP',
    role: 'Project Lead · Drishti-AI',
    organization: 'Explainable AI for Diabetic Retinopathy Screening',
    location: 'Smart India Hackathon · Software Prototype',
    summary: 'Leading a multidisciplinary team building an offline-first screening prototype, with image-quality checks, clinician review, and explainability as core design requirements.',
    focus: ['Team coordination', 'Flutter', 'Computer vision', 'Explainable AI'],
    accent: 'white',
  },
];

export function ExperienceTimeline() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const root = rootRef.current;
      if (!root) return;
      const rail = root.querySelector<HTMLElement>('.experience-rail');
      if (!rail) return;
      const tween = gsap.fromTo(rail, { y: 26 }, {
        y: -26,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top+=76',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      });
      return () => tween.scrollTrigger?.kill();
    });
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.experience-entry');
      const animations = cards.map((card) => gsap.fromTo(card,
        { opacity: 0.35, y: 24 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 82%', once: true } }
      ));
      return () => animations.forEach((animation) => {
        animation.scrollTrigger?.kill();
        animation.kill();
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="experience" className="experience-section" aria-labelledby="experience-title">
      <div className="site-shell experience-layout">
        <aside className="experience-rail">
          <p className="orbital-eyebrow"><span>04</span> / EXPERIENCE</p>
          <h2 id="experience-title">WHERE<br />I’VE <span>BUILT</span><br />MOMENTUM.</h2>
          <p className="experience-rail-copy">A record of the teams, communities, and projects that have shaped the way I approach engineering.</p>
          <div className="experience-rail-bottom">
            <span>CAREER LOG / 2025—26</span>
            <span className="experience-live"><i /> OPEN TO WHAT’S NEXT</span>
          </div>
        </aside>

        <div className="experience-list">
          {entries.map((entry) => (
            <article className="experience-entry" key={entry.number}>
              <div className="experience-entry-top">
                <span className="experience-number">{entry.number} / 03</span>
                <span className="experience-period">{entry.period}</span>
              </div>
              <div className="experience-entry-body">
                <p className="experience-type">{entry.type}</p>
                <h3>{entry.role}</h3>
                <p className="experience-organization">{entry.organization}</p>
                <p className="experience-location">{entry.location}</p>
                <p className="experience-summary">{entry.summary}</p>
                <div className="experience-focus">
                  {entry.focus.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <div className="experience-entry-bottom">
                <span>FIELD NOTES / {entry.number}</span>
                {entry.number === '03' && <a href="https://github.com/BezaleelPaul/Drishti-AI" target="_blank" rel="noopener noreferrer">PROJECT REPOSITORY <ArrowUpRight size={13} /></a>}
                {entry.number === '02' && <a href="https://www.ieee.org/" target="_blank" rel="noopener noreferrer">IEEE <ArrowUpRight size={13} /></a>}
                {entry.number === '01' && <span>PROFESSIONAL EXPERIENCE</span>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
