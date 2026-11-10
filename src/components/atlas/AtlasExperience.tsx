'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Pause,
  Play,
  RotateCcw,
  X,
} from 'lucide-react';
import {
  ATLAS_CONSTELLATIONS,
  ATLAS_END,
  ATLAS_GENERATED_AT,
  ATLAS_START,
  ATLAS_TOTAL_COMMITS,
  AtlasConstellation,
} from '@/data/workAtlas';
import { AtlasFallbackMap } from './AtlasFallbackMap';
import { AnimatedWords } from '@/components/motion/AnimatedWords';

const AtlasCanvas = dynamic(
  () => import('./AtlasCanvas').then((module) => module.AtlasCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35">
        Mapping orbits
      </div>
    ),
  }
);

const formatMonth = (value: number) => new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(value)).toUpperCase();

const formatDay = (value: number) => new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
}).format(new Date(value)).toUpperCase();

const visibleStarsFor = (constellation: AtlasConstellation, reveal: number) => {
  const originVisible = new Date(constellation.createdAt).getTime() <= reveal;
  const commitsVisible = constellation.commits.filter(
    (commit) => new Date(commit.date).getTime() <= reveal
  ).length;
  return (originVisible ? 1 : 0) + commitsVisible;
};

const ProjectPanel: React.FC<{ constellation: AtlasConstellation; onClose: () => void }> = ({
  constellation,
  onClose,
}) => {
  const { project } = constellation;
  const recentCommits = constellation.commits.slice(-3).reverse();

  return (
    <div className="border border-ink/15 bg-paper p-5 text-ink shadow-2xl sm:p-6 lg:max-h-[calc(100svh_-_9rem)] lg:overflow-y-auto">
      <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-4">
        <div>
          <p className="eyebrow text-ink/40">{project.category}</p>
          <h2 className="mt-3 font-display text-3xl leading-[0.98] tracking-tight text-ink sm:text-4xl">
            {project.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-paper"
          aria-label="Close project details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink/65">{project.tagline}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-y border-ink/12 py-4">
        <div>
          <span className="font-mono text-lg font-medium text-ink">{constellation.totalCommits}</span>
          <span className="eyebrow mt-1 block text-[8px] text-ink/40">Public commits</span>
        </div>
        <div>
          <span className="font-mono text-lg font-medium text-ink">
            {new Date(constellation.createdAt).getUTCFullYear()}
          </span>
          <span className="eyebrow mt-1 block text-[8px] text-ink/40">Repository opened</span>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <h3 className="eyebrow text-ink/35">The problem</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">{project.problem}</p>
        </div>
        <div>
          <h3 className="eyebrow text-ink/35">The approach</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">{project.solution}</p>
        </div>
        <div>
          <h3 className="eyebrow text-ink/35">What shipped</h3>
          <ul className="mt-2 space-y-2">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-ink/65">
                <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-signal-soft" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow text-ink/35">Recent trace</h3>
          <ol className="mt-3 space-y-3">
            {recentCommits.map((commit) => (
              <li key={commit.sha} className="grid grid-cols-[3.1rem_1fr] gap-3">
                <span className="pt-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-ink/35">
                  {formatDay(new Date(commit.date).getTime())}
                </span>
                <a
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-2 font-mono text-[10px] leading-relaxed text-ink/55 transition-colors hover:text-ink"
                >
                  {commit.message}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-ink/15 pt-5">
        <a
          href={constellation.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-paper"
        >
          <Github className="h-3.5 w-3.5" />
          Repository
        </a>
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target={project.demoUrl.startsWith('http') ? '_blank' : undefined}
            rel={project.demoUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Open project
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export const AtlasExperience: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reveal, setReveal] = useState(ATLAS_END);
  const [isPlaying, setIsPlaying] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const animationFrame = useRef<number | null>(null);

  const selected = ATLAS_CONSTELLATIONS.find(
    (constellation) => constellation.project.id === selectedId
  ) || null;

  const visibleStars = useMemo(
    () => ATLAS_CONSTELLATIONS.reduce(
      (total, constellation) => total + visibleStarsFor(constellation, reveal),
      0
    ),
    [reveal]
  );

  const selectProject = useCallback((id: string | null) => {
    setSelectedId(id);

    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (id) {
      url.searchParams.set('project', id);
    } else {
      url.searchParams.delete('project');
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setMotionEnabled(!media.matches);
      if (media.matches) setIsPlaying(false);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const projectId = new URLSearchParams(window.location.search).get('project');
    if (projectId && ATLAS_CONSTELLATIONS.some((constellation) => constellation.project.id === projectId)) {
      setSelectedId(projectId);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') selectProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectProject]);

  useEffect(() => {
    if (!selected) return;

    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => {
      document.body.style.overflow = media.matches ? 'hidden' : '';
    };
    update();
    media.addEventListener('change', update);

    return () => {
      document.body.style.overflow = '';
      media.removeEventListener('change', update);
    };
  }, [selected]);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
      return;
    }

    const startedAt = performance.now();
    const duration = 4800;
    let lastUpdate = 0;
    setReveal(ATLAS_START);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      if (progress === 1 || now - lastUpdate >= 32) {
        setReveal(ATLAS_START + (ATLAS_END - ATLAS_START) * eased);
        lastUpdate = now;
      }

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
      }
    };

    animationFrame.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [isPlaying]);

  const traceBuild = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
  };

  const resetView = () => {
    selectProject(null);
    setReveal(ATLAS_END);
    setIsPlaying(false);
  };

  return (
    <div className="dark-surface min-h-screen bg-ink text-paper">
      <a
        href="#atlas-content"
        className="absolute left-4 top-3 -translate-y-20 rounded-full bg-signal px-4 py-2 text-xs font-bold text-ink focus:translate-y-0"
      >
        Skip to atlas controls
      </a>

      <header className="relative z-30 flex h-20 items-center justify-between gap-4 border-b border-paper/12 px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-paper/55 transition-colors hover:text-paper"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>
          <span className="hidden h-4 w-px bg-paper/20 sm:block" />
          <span className="font-display text-xl tracking-tight text-paper no-underline">Work Atlas</span>
        </div>

        <div className="flex items-center gap-5">
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-paper/35 md:block">
            Public GitHub history / 2025—2026
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-signal">
            {ATLAS_TOTAL_COMMITS} commits
          </span>
        </div>
      </header>

      <main
        id="atlas-content"
        className="relative lg:h-[calc(100svh-5rem)] lg:min-h-[42rem]"
      >
        <div className="relative h-[38svh] min-h-[18rem] overflow-hidden border-b border-paper/10 bg-[radial-gradient(circle_at_48%_42%,rgba(217,255,99,0.08),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(241,239,231,0.05),transparent_30%),linear-gradient(150deg,#0d110c_0%,#080b08_55%,#10150d_100%)] lg:absolute lg:inset-0 lg:h-full lg:border-0">
          <div className="absolute inset-0" aria-hidden="true">
            {motionEnabled ? (
              <AtlasCanvas
                selectedId={selectedId}
                reveal={reveal}
                onSelect={selectProject}
              />
            ) : (
              <div className="h-full px-7 py-8">
                <AtlasFallbackMap
                  constellations={ATLAS_CONSTELLATIONS}
                  selectedId={selectedId}
                  reveal={reveal}
                />
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 hidden items-center justify-end px-5 py-4 font-mono text-[8px] uppercase tracking-[0.16em] text-paper/35 sm:px-8 lg:flex">
            <span>{motionEnabled ? 'Interactive map' : 'Static map'}</span>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-5 hidden font-mono text-[8px] uppercase tracking-[0.12em] text-paper/25 sm:block">
            Drag to orbit / scroll to zoom / click to focus
          </div>

          <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-2 lg:flex">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-paper/25">
              {String(ATLAS_CONSTELLATIONS.length).padStart(2, '0')} systems
            </span>
            <span className="h-px w-8 bg-paper/20" />
          </div>
        </div>

        <div className="relative z-10 grid gap-6 px-5 py-7 sm:px-8 lg:pointer-events-none lg:h-full lg:grid-cols-[20rem_minmax(0,1fr)_22rem] lg:gap-4 lg:p-6">
          <section className="lg:pointer-events-auto lg:self-start">
            <div className="border border-paper/12 bg-ink/75 p-5 backdrop-blur-md sm:p-6">
              <p className="eyebrow text-signal">01 / Constellation map</p>
              <h1 className="serif-display mt-4 text-5xl text-paper sm:text-6xl" data-word-group>
                <AnimatedWords text="The Work Atlas." accentWords={['Atlas.']} />
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/60">
                Five systems plotted from their actual repository timelines. Select a
                constellation, then move through the months as it forms.
              </p>

              <div className="mt-6 space-y-1.5 border-t border-paper/12 pt-4">
                {ATLAS_CONSTELLATIONS.map((constellation, index) => {
                  const isSelected = constellation.project.id === selectedId;
                  return (
                    <button
                      key={constellation.project.id}
                      type="button"
                      onClick={() => selectProject(isSelected ? null : constellation.project.id)}
                      aria-pressed={isSelected}
                      className={`group grid w-full grid-cols-[1.7rem_1fr_auto] items-center gap-2 border px-3 py-3 text-left transition-colors ${
                        isSelected
                          ? 'border-signal/60 bg-signal/10 text-paper'
                          : 'border-transparent text-paper/60 hover:border-paper/15 hover:bg-paper/5 hover:text-paper'
                      }`}
                    >
                      <span className={`font-mono text-[8px] tracking-[0.12em] ${isSelected ? 'text-signal' : 'text-paper/25'}`}>
                        0{index + 1}
                      </span>
                      <span>
                        <span className="block font-display text-xl leading-none tracking-tight">
                          {constellation.shortTitle}
                        </span>
                        <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.08em] text-paper/28">
                          {constellation.project.category}
                        </span>
                      </span>
                      <span className="font-mono text-[8px] uppercase tracking-[0.08em] text-paper/28">
                        {constellation.totalCommits} commits
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-paper/28">
                Source: public GitHub history, sampled {formatDay(new Date(ATLAS_GENERATED_AT).getTime())}.
                Automated sync commits are omitted.
              </p>
            </div>
          </section>

          <div className="hidden lg:block" />

          {selected && (
            <button
              type="button"
              onClick={() => selectProject(null)}
              className="fixed inset-0 z-40 bg-ink/75 backdrop-blur-sm lg:hidden"
              aria-label="Close project overlay"
            />
          )}

          <aside
            className={`lg:pointer-events-auto ${
              selected
                ? 'fixed inset-x-0 bottom-0 z-50 max-h-[82svh] overflow-y-auto border-t border-paper/15 bg-paper p-3 lg:static lg:z-auto lg:max-h-none lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:self-start'
                : 'lg:self-end'
            }`}
          >
            {selected ? (
              <ProjectPanel constellation={selected} onClose={() => selectProject(null)} />
            ) : (
              <div className="hidden border border-paper/12 bg-ink/65 p-6 backdrop-blur-md lg:block">
                <p className="eyebrow text-paper/35">Reading the map</p>
                <p className="mt-4 font-display text-3xl leading-[1.05] tracking-tight text-paper">
                  Choose a constellation to open its case notes.
                </p>
                <div className="mt-6 space-y-3 border-t border-paper/12 pt-5">
                  {[
                    ['01', 'A star is a sampled commit or the repository origin.'],
                    ['02', 'A line is the shape of the system, not a dependency graph.'],
                    ['03', 'The timeline reveals the work in the order it was built.'],
                  ].map(([number, copy]) => (
                    <div key={number} className="grid grid-cols-[1.5rem_1fr] gap-3">
                      <span className="font-mono text-[8px] text-signal">{number}</span>
                      <p className="text-xs leading-relaxed text-paper/50">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="relative z-20 px-5 pb-7 sm:px-8 lg:absolute lg:bottom-5 lg:left-[22rem] lg:right-[24rem] lg:px-0 lg:pb-0">
          <div className="border border-paper/12 bg-ink/80 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={traceBuild}
                disabled={!motionEnabled}
                className="inline-flex shrink-0 items-center gap-2 font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-paper/60 transition-colors hover:text-signal disabled:cursor-not-allowed disabled:opacity-30"
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {isPlaying ? 'Pause trace' : 'Trace the build'}
              </button>

              <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-paper/35">
                {formatMonth(reveal)} / {visibleStars} stars
              </span>

              <button
                type="button"
                onClick={resetView}
                className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-paper/35 transition-colors hover:text-paper"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            <label className="mt-2 block">
              <span className="sr-only">Reveal commits through time</span>
              <input
                type="range"
                min={ATLAS_START}
                max={ATLAS_END}
                step={86400000}
                value={reveal}
                onChange={(event) => {
                  setIsPlaying(false);
                  setReveal(Number(event.target.value));
                }}
                aria-valuetext={formatMonth(reveal)}
                className="atlas-range w-full"
              />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
};
