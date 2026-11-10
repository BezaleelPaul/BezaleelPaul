'use client';

import { ArrowUpRight, GraduationCap, GitBranch, BrainCircuit, Code2, Play } from 'lucide-react';

const proofItems = [
  {
    number: '01',
    type: 'PROBLEM SOLVING',
    title: 'Practice measured in problems, not claims.',
    detail: 'A visible competitive-programming trail across LeetCode and Codeforces.',
    metric: '135',
    metricLabel: 'LeetCode problems solved',
    extra: '116 Easy · 17 Medium · 2 Hard',
    href: 'https://leetcode.com/u/BezaleelPaulN/',
    link: 'VIEW LEETCODE PROFILE',
    icon: Code2,
  },
  {
    number: '02',
    type: 'ACADEMIC PATH',
    title: 'Two complementary learning tracks.',
    detail: 'Pursuing computer science engineering at CMR University alongside the IIT Madras BS programme in Data Science and Applications.',
    metric: '2',
    metricLabel: 'degree programmes',
    extra: 'CMR University · IIT Madras',
    href: 'https://study.iitm.ac.in/ds/',
    link: 'IIT MADRAS PROGRAMME',
    icon: GraduationCap,
  },
  {
    number: '03',
    type: 'APPLIED AI',
    title: 'Building for a real-world screening workflow.',
    detail: 'Project lead for Drishti-AI, a Smart India Hackathon software prototype exploring explainable, offline-first diabetic-retinopathy screening.',
    metric: 'SIH',
    metricLabel: 'software prototype',
    extra: 'Project leadership · 2026',
    href: null,
    link: null,
    icon: BrainCircuit,
  },
  {
    number: '04',
    type: 'COMMUNITY',
    title: 'Technical contribution beyond coursework.',
    detail: 'Former Webmaster and Executive Committee volunteer with the IEEE CMR University Student Branch, supporting its digital presence and technical community.',
    metric: 'IEEE',
    metricLabel: 'student branch',
    extra: 'Webmaster / EXCOM · Dec 2025 — Sep 2026',
    href: 'https://www.ieee.org/',
    link: 'ABOUT IEEE',
    icon: GitBranch,
  },
  {
    number: '05',
    type: 'TECHNICAL OPERATIONS',
    title: 'Campus voting system for approximately 2,000 students.',
    detail: 'Supported a campus voting event at AC School, Jalahalli, Bengaluru, serving approximately 2,000 students in one day across 10 laptops, with no reported operational disruptions.',
    metric: '2,000+',
    metricLabel: 'student voters in one day',
    extra: '10 laptops · AC School, Jalahalli, Bengaluru',
    href: null,
    link: null,
    icon: GitBranch,
    evidence: [
      { label: 'Instagram reel 1', href: 'https://www.instagram.com/reel/C75p8xvp1qS/?igsh=cXJyZDdidThrZDM0' },
      { label: 'Instagram reel 2', href: 'https://www.instagram.com/reel/C75noSOpJ2F/?igsh=eHhmdXJleW1zeXR5' },
    ],
  },
];

export function ProofSection() {
  return (
    <section id="proof" className="proof-section" aria-labelledby="proof-title">
      <div className="site-shell">
        <div className="proof-heading">
          <div>
            <p className="orbital-eyebrow"><span>05</span> / PROOF OF WORK</p>
            <h2 id="proof-title">LESS CLAIM.<br /><span>MORE EVIDENCE.</span></h2>
          </div>
          <p className="proof-intro">A few concrete signals of how I learn, build, and contribute. No inflated rankings or invented awards — just work and commitments that can be explored.</p>
        </div>

        <div className="proof-grid">
          {proofItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="proof-card" key={item.number} data-reveal>
                <div className="proof-card-top">
                  <span>{item.number} / 05</span>
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="proof-type">{item.type}</p>
                <h3>{item.title}</h3>
                <p className="proof-detail">{item.detail}</p>
                <div className="proof-metric">
                  <strong data-count={item.metric}>{item.metric}</strong>
                  <span>{item.metricLabel}</span>
                </div>
                <p className="proof-extra">{item.extra}</p>
                {item.href && item.link && (
                  <a className="proof-link" href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.link} <ArrowUpRight size={13} />
                  </a>
                )}
                {'evidence' in item && item.evidence && (
                  <div className="mt-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Play size={14} aria-hidden="true" />
                      <p className="proof-type">EVENT FOOTAGE · YOUTUBE</p>
                    </div>
                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black">
                      <iframe
                        className="h-full w-full"
                        src="https://www.youtube-nocookie.com/embed/iDmTlF8fJuQ?start=78&rel=0"
                        title="Campus voting event footage — starting at 1 minute 18 seconds"
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/55">Video starts at 1:18, where you indicated you appear.</p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {item.evidence.map((evidence) => (
                        <a
                          className="proof-link"
                          key={evidence.href}
                          href={evidence.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {evidence.label} <ArrowUpRight size={13} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        <div className="proof-foot">
          <span>VERIFIABLE SIGNALS / NOT TROPHIES</span>
          <span>CONTINUOUSLY LEARNING ↗</span>
        </div>
      </div>
    </section>
  );
}
