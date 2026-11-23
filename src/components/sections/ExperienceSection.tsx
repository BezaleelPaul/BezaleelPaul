import React from 'react';
import { ExperienceItem } from '@/types/portfolio';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  return (
    <section id="experience" className="dark-surface border-t border-paper/10 bg-ink py-24 text-paper sm:py-32">
      <div className="section-shell">
        <header
          className="grid gap-8 border-b border-paper/15 pb-10 lg:grid-cols-12 lg:items-end"
          data-reveal
        >
          <div className="lg:col-span-7">
            <p className="eyebrow text-signal">04 / Experience</p>
            <h2 className="serif-display mt-5 max-w-2xl text-5xl text-paper sm:text-7xl">
              Work, leadership, and deliberate practice.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-paper/50 lg:col-span-5 lg:ml-auto">
            A short record of the teams, responsibilities, and habits that shaped how I build
            software.
          </p>
        </header>

        <div>
          {experience.map((item, index) => (
            <article
              key={item.id}
              className="grid gap-7 border-b border-paper/12 py-12 lg:grid-cols-12 lg:gap-10 lg:py-14"
              data-reveal
            >
              <div className="lg:col-span-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/35">
                  0{index + 1} / {item.type}
                </span>
                <p className="mt-3 font-mono text-[10px] tracking-[0.08em] text-paper/55">
                  {item.period}
                </p>
              </div>

              <div className="lg:col-span-5">
                <h3 className="font-display text-3xl leading-none tracking-tight text-paper sm:text-4xl">
                  {item.role}
                </h3>
                <p className="mt-3 text-sm font-semibold text-signal">{item.organization}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-paper/35">
                  {item.location}
                </p>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper/58">
                  {item.summary}
                </p>
              </div>

              <div className="lg:col-span-4">
                <ul className="space-y-4" data-reveal-group>
                  {item.responsibilities.map((responsibility) => (
                    <li
                      key={responsibility}
                      className="border-l border-paper/20 pl-4 text-sm leading-relaxed text-paper/62"
                      data-reveal-item
                    >
                      {responsibility}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-[9px] uppercase tracking-[0.08em] text-paper/35"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
