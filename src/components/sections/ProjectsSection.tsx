import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { ProjectItem } from '@/types/portfolio';
import { HorizontalScrollExperience } from '@/components/motion/HorizontalScrollExperience';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <section id="projects" className="border-t border-ink/10 bg-paper-bright py-24 sm:py-32">
      <div className="section-shell">
        <header
          className="grid gap-8 border-b border-ink/15 pb-10 lg:grid-cols-12 lg:items-end"
          data-reveal
        >
          <div className="lg:col-span-8">
            <p className="eyebrow text-ink/45">02 / Selected work</p>
            <h2 className="serif-display mt-5 max-w-3xl text-5xl text-ink sm:text-7xl">
              Three systems, built end to end.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="max-w-sm text-sm leading-relaxed text-ink/55 lg:ml-auto">
              Applications and tools shaped by a real problem, with the engineering decisions
              documented rather than hidden.
            </p>
            <Link
              href="/projects"
              className="link-underline mt-5 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-ink"
            >
              View the full archive
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        <HorizontalScrollExperience>
          {featuredProjects.map((project, index) => (
            <div key={project.id} className="horizontal-work-slide" data-reveal data-reveal-delay={index * 40}>
              <article
                className="project-card horizontal-work-panel grid gap-7 border-b border-ink/15 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16"
                data-tilt="2.4"
                data-spotlight
                data-cursor-label="INSPECT"
              >
              <div className="project-image-slot lg:col-span-12" aria-label={`Image placeholder for ${project.title}`}>
                <div className="project-image-placeholder-mark">IMAGE / {String(index + 1).padStart(2, '0')}</div>
                <div className="project-image-placeholder-copy">
                  <span className="eyebrow">Project visual placeholder</span>
                  <span>Add a screenshot, product render, or project photograph</span>
                </div>
                <span className="project-image-placeholder-corner">16:09</span>
              </div>
              <div className="flex items-start justify-between lg:col-span-1 lg:block">
                <span className="font-mono text-xs tabular-nums text-ink/35">{String(index + 1).padStart(2, '0')}</span>
                <span className="eyebrow text-ink/30 lg:mt-3 lg:block">Featured</span>
              </div>

              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="eyebrow text-ink/45">{project.category}</span>
                  <span className="h-1 w-1 rounded-full bg-ink/25" />
                  <span className="eyebrow text-ink/45">{project.status}</span>
                </div>
                <h3 className="mt-5 max-w-2xl font-display text-4xl leading-[0.95] tracking-tight text-ink sm:text-5xl">
                  {project.title}
                </h3>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/62 sm:text-base">
                  {project.tagline}
                </p>

                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {project.stack.map((technology) => (
                    <span
                      key={technology}
                      className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink/43"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    data-magnetic
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Source
                  </a>
                  {project.demoUrl && (
                    <a
                      data-magnetic
                      href={project.demoUrl}
                      target={project.demoUrl.startsWith('http') ? '_blank' : undefined}
                      rel={project.demoUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="link-underline inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink"
                    >
                      Live project
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-8 lg:col-span-4">
                <div className="border-l-2 border-signal bg-ink/[0.035] py-4 pl-5 pr-4">
                  <p className="eyebrow text-ink/40">Build signal / outcome</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{project.metrics || project.tagline}</p>
                </div>
                <details className="project-notes group border-t border-ink/20 pt-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:text-ink/55">
                    <span className="project-notes-open">Read the case notes</span>
                    <span className="project-notes-close">Close case notes</span>
                    <span className="relative h-3 w-3 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-3 bg-ink" />
                      <span className="absolute left-1/2 top-0 h-3 w-px bg-ink transition-transform group-open:rotate-90" />
                    </span>
                  </summary>
                  <div className="space-y-6 pt-6">
                    <div>
                      <h4 className="eyebrow text-ink/40">The problem</h4>
                      <p className="mt-2 text-sm leading-relaxed text-ink/62">{project.problem}</p>
                    </div>
                    <div>
                      <h4 className="eyebrow text-ink/40">The approach</h4>
                      <p className="mt-2 text-sm leading-relaxed text-ink/62">{project.solution}</p>
                    </div>
                    <div>
                      <h4 className="eyebrow text-ink/40">What shipped</h4>
                      <ul className="mt-2 space-y-2">
                        {project.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-ink/62">
                            <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
              </article>
            </div>
          ))}
        </HorizontalScrollExperience>

        <div
          className="flex flex-col justify-between gap-5 pt-10 sm:flex-row sm:items-center"
          data-reveal
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/40">
            {projects.length} projects in the archive
          </p>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 font-display text-2xl tracking-tight text-ink"
          >
            Explore the complete archive
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
