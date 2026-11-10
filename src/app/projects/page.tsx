'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Github, Search } from 'lucide-react';
import { INITIAL_PROJECTS } from '@/data/profileData';
import { ProjectCategory } from '@/types/portfolio';
import { Navbar } from '@/components/layout/Navbar';

const categories: ProjectCategory[] = [
  'All',
  'Flutter & Mobile',
  'AI / ML',
  'Full-Stack',
  'Web Development',
  'Open Source',
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return INITIAL_PROJECTS.filter((project) => {
      const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
      const matchesSearch =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.stack.some((technology) => technology.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const resetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F7F8F2]">
      <Navbar />

      <main className="pb-24 pt-32 sm:pt-36">
        <div className="section-shell">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45 transition-colors hover:text-[#D7FF00]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>

          <header
            className="mt-12 grid gap-8 border-b border-white/15 pb-12 lg:grid-cols-12 lg:items-end"
            data-reveal
          >
            <div className="lg:col-span-8">
              <p className="eyebrow text-[#D7FF00]">Archive</p>
              <h1 className="font-display mt-5 max-w-3xl text-6xl leading-[0.92] tracking-tight text-[#F7F8F2] sm:text-8xl">
                Every project, in one place.
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/55 lg:col-span-4 lg:ml-auto">
              Mobile apps, machine-learning experiments, civic tools, and open-source utilities.
              Filter by discipline or search the stack.
            </p>
          </header>

          <div className="border-b border-white/15 py-7" data-reveal data-reveal-delay="80">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={activeCategory === category}
                    className={`rounded-full border px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.06em] transition-colors ${
                      activeCategory === category
                        ? 'border-[#D7FF00] bg-[#D7FF00] text-[#0A0A0F]'
                        : 'border-white/15 text-white/55 hover:border-[#D7FF00] hover:text-[#D7FF00]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-80">
                <Search className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="Search projects by name, description, or technology"
                  placeholder="Search projects or stack"
                  className="w-full rounded-full border border-white/15 bg-[#14141D] py-2.5 pl-10 pr-4 font-mono text-[10px] text-ink placeholder:text-white/35 focus:border-ink focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40" aria-live="polite">
                Showing {filteredProjects.length} of {INITIAL_PROJECTS.length} projects
              </p>
              {filteredProjects.length > 0 && (activeCategory !== 'All' || searchQuery.length > 0) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="link-underline font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-white/55 hover:text-[#D7FF00]"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid gap-x-8 md:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <article
                  key={project.id}
                  className="flex flex-col border-b border-white/15 py-9 md:py-11"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow text-white/40">{project.category}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-white/30">
                      {project.status} / {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="relative mt-5 aspect-[16/9] overflow-hidden border border-white/10 bg-[#14141D]">
                    <img
                      src={project.imageUrl || `https://opengraph.githubassets.com/1/BezaleelPaul/${project.repoUrl.split('/').pop()}`}
                      alt={`${project.title} project preview`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h2 className="mt-5 font-display text-3xl leading-[0.98] tracking-tight text-[#F7F8F2] sm:text-4xl">
                    {project.title}
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
                    {project.tagline}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5">
                    {project.stack.map((technology) => (
                      <span
                        key={technology}
                        className="font-mono text-[9px] uppercase tracking-[0.06em] text-white/45"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex-1 border-t border-white/10 pt-5">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                        Engineering notes
                        <span className="relative h-3 w-3 shrink-0">
                          <span className="absolute left-0 top-1/2 h-px w-3 bg-white/70" />
                          <span className="absolute left-1/2 top-0 h-3 w-px bg-ink transition-transform group-open:rotate-90" />
                        </span>
                      </summary>
                      <div className="space-y-5 pt-5">
                        <div>
                          <h3 className="eyebrow text-white/35">The problem</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-white/60">{project.problem}</p>
                        </div>
                        <div>
                          <h3 className="eyebrow text-white/35">The approach</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-white/60">{project.solution}</p>
                        </div>
                        {project.highlights.length > 0 && (
                          <ul className="space-y-1.5">
                            {project.highlights.map((highlight) => (
                              <li key={highlight} className="flex gap-2 text-xs leading-relaxed text-white/50">
                                <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-[#D7FF00]/55" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </details>
                  </div>

                  <div className="mt-6 flex items-center gap-5">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-white/55 hover:text-[#D7FF00]"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Source
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target={project.demoUrl.startsWith('http') ? '_blank' : undefined}
                        rel={project.demoUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-white/55 hover:text-[#D7FF00]"
                      >
                        Live project
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="eyebrow text-white/35">No results</p>
              <h2 className="serif-display mt-4 text-5xl text-white">No matching projects.</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50">
                Try a broader category or a different keyword.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-7 rounded-full bg-[#D7FF00] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0A0A0F]"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
