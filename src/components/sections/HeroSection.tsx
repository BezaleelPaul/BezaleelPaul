'use client';

import { PortraitDepth } from '@/components/sections/PortraitDepth';

const basePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? '';

export function HeroSection() {
  return (
    <section id="top" className="hero space-texture" data-hero-scroll aria-labelledby="hero-title">
      <div className="site-shell hero-topline">
        <span>01 / Applied AI &amp; software engineering</span>
        <a className="hero-contact" href="mailto:bezaleel321@gmail.com">BEZALEEL321@GMAIL.COM ↗</a>
      </div>

      <div className="site-shell hero-main">
        <div className="hero-orbit" aria-hidden="true"><span className="hero-orbit-dot" /></div>

        <div className="hero-copy" data-hero-copy>
          <p className="hero-kicker hero-reveal">APPLIED AI / SOFTWARE ENGINEERING</p>
          <h1 id="hero-title" className="display hero-title hero-reveal">
            <span>BEZALEEL</span>
            <span className="second-line outline-text">PAUL.</span>
          </h1>
          <p className="hero-subtitle hero-reveal">
            I’m a second-year Computer Science student at CMR University and an IIT Madras BS Data Science student, building practical software with a focus on applied AI.
          </p>
          <div className="hero-actions hero-reveal">
            <a className="action-button primary" href="https://github.com/BezaleelPaul" target="_blank" rel="noreferrer">
              View Work <span aria-hidden="true">↗</span>
            </a>
            <a className="action-button secondary" href={`${basePath}/resume/`}>
              View / Print Résumé <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-stats hero-reveal" aria-label="Current focus">
            <div className="hero-stat"><strong>AI</strong><span>Applied research</span></div>
            <div className="hero-stat"><strong>CS</strong><span>Engineering foundations</span></div>
            <div className="hero-stat"><strong>Build</strong><span>Projects with evidence</span></div>
          </div>
        </div>

        <div className="hero-portrait-wrap" role="region" aria-label="Interactive pilot portrait: move pointer to tilt, click to emit signal shockwave">
          <PortraitDepth />
        </div>
        <span className="hero-index">ORBITAL PROFILE / EARTH SECTOR</span>
      </div>

      <div className="site-shell hero-bottomline">
        <span>BUILD WITH INTENT</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  );
}
