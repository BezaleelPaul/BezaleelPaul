'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowUpRight, Github, Orbit } from 'lucide-react';
import {
  ATLAS_CONSTELLATIONS,
  ATLAS_END,
  ATLAS_TOTAL_COMMITS,
} from '@/data/workAtlas';
import { AtlasFallbackMap } from '@/components/atlas/AtlasFallbackMap';

const AtlasCanvas = dynamic(
  () => import('@/components/atlas/AtlasCanvas').then((module) => module.AtlasCanvas),
  { ssr: false, loading: () => null }
);

export const WorkAtlasSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = ATLAS_CONSTELLATIONS.find((item) => item.project.id === selectedId);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionEnabled(!reduced.matches);
    sync();
    reduced.addEventListener('change', sync);
    return () => {
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work-atlas"
      className="work-atlas-section dark-surface relative isolate overflow-hidden bg-ink py-24 text-paper sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(217,255,99,0.09),transparent_48%)]" />
      <div className="section-shell relative z-10">
        <div className="flex flex-col gap-8 border-b border-paper/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-signal">02 / Work in orbit · live repository traces</p>
            <h2 className="serif-display mt-5 text-6xl leading-[0.9] sm:text-8xl" data-reveal>
              The work <span className="italic text-signal">has gravity.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-paper/55 sm:text-base">
              Projects are no longer a disconnected gallery. Each system is plotted from its
              public GitHub history and connected to the decisions, experiments and engineering
              behind it.
            </p>
          </div>
          <div className="flex items-end gap-6">
            <div>
              <span className="block font-mono text-3xl text-paper">{ATLAS_CONSTELLATIONS.length.toString().padStart(2, '0')}</span>
              <span className="eyebrow text-[8px] text-paper/35">Project systems</span>
            </div>
            <div>
              <span className="block font-mono text-3xl text-signal">{ATLAS_TOTAL_COMMITS.toLocaleString('en-US')}</span>
              <span className="eyebrow text-[8px] text-paper/35">Public commits</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid overflow-hidden border border-paper/12 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)]">
          <div className="relative min-h-[23rem] bg-[#090d09] sm:min-h-[34rem]">
            <div className="absolute inset-0" aria-hidden="true">
              {isNearViewport && motionEnabled ? (
                <AtlasCanvas selectedId={selectedId} reveal={ATLAS_END} onSelect={setSelectedId} />
              ) : (
                <div className="h-full w-full p-5 sm:p-8">
                  <AtlasFallbackMap
                    constellations={ATLAS_CONSTELLATIONS}
                    selectedId={selectedId}
                    reveal={ATLAS_END}
                  />
                </div>
              )}
            </div>
            <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-paper/35 sm:left-7 sm:top-7">
              <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_12px_#d9ff63]" />
              {motionEnabled ? 'Interactive constellation map' : 'Constellation map'}
            </div>
            <div className="pointer-events-none absolute bottom-5 left-5 font-mono text-[8px] uppercase tracking-[0.12em] text-paper/30 sm:bottom-7 sm:left-7">
              {motionEnabled ? 'Drag to orbit · select a system' : 'Select a system to inspect'}
            </div>
          </div>

          <div className="flex flex-col border-t border-paper/12 bg-paper/[0.025] lg:border-l lg:border-t-0">
            <div className="border-b border-paper/12 p-5 sm:p-7">
              <p className="eyebrow text-paper/35">Choose a system</p>
              <div className="mt-4 space-y-1">
                {ATLAS_CONSTELLATIONS.map((item, index) => {
                  const active = item.project.id === selectedId;
                  return (
                    <button
                      key={item.project.id}
                      type="button"
                      onClick={() => setSelectedId(active ? null : item.project.id)}
                      aria-pressed={active}
                      className={`grid w-full grid-cols-[2rem_1fr_auto] items-center gap-3 border px-3 py-3 text-left transition-colors ${active ? 'border-signal/50 bg-signal/[0.08] text-paper' : 'border-transparent text-paper/55 hover:border-paper/15 hover:bg-paper/[0.04] hover:text-paper'}`}
                    >
                      <span className="font-mono text-[9px] text-signal/65">0{index + 1}</span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-xl leading-none">{item.shortTitle}</span>
                        <span className="mt-1 block truncate font-mono text-[8px] uppercase tracking-[0.1em] text-paper/30">{item.project.category}</span>
                      </span>
                      <span className="font-mono text-[8px] text-paper/30">{item.totalCommits}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
              {selected ? (
                <>
                  <div>
                    <p className="eyebrow text-signal">Selected / {selected.shortTitle}</p>
                    <h3 className="serif-display mt-4 text-4xl leading-none text-paper">{selected.project.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-paper/55">{selected.project.tagline}</p>
                    <div className="mt-6 grid grid-cols-2 gap-4 border-y border-paper/12 py-4">
                      <div><span className="block font-mono text-2xl text-paper">{selected.totalCommits}</span><span className="eyebrow text-[8px] text-paper/30">Public commits</span></div>
                      <div><span className="block font-mono text-2xl text-paper">{new Date(selected.createdAt).getUTCFullYear()}</span><span className="eyebrow text-[8px] text-paper/30">Started</span></div>
                    </div>
                    <p className="mt-5 text-xs leading-relaxed text-paper/45">{selected.project.problem}</p>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={selected.htmlUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-ink">
                      <Github className="h-3.5 w-3.5" /> Source code
                    </a>
                    <Link href="/atlas" className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-paper">
                      Full timeline <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="eyebrow text-signal">Origin / Engineering log</p>
                    <h3 className="serif-display mt-4 text-4xl leading-none text-paper">Every star is a trace of work.</h3>
                    <p className="mt-4 text-sm leading-relaxed text-paper/50">
                      Select a constellation to reveal its repository, build history and case notes.
                      The map is a visual index—not decoration.
                    </p>
                  </div>
                  <Link href="/atlas" className="mt-8 inline-flex items-center gap-2 self-start font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-signal transition-colors hover:text-paper">
                    Enter the full Work Atlas <Orbit className="h-3.5 w-3.5" /><ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[8px] uppercase tracking-[0.12em] text-paper/25">
          <span>Source: public GitHub repository history · automated sync commits excluded</span>
          <span>Timeline snapshot · {new Date(ATLAS_END).getUTCFullYear()}</span>
        </p>
      </div>
    </section>
  );
};
