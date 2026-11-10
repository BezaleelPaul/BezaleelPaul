import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AchievementItem } from '@/types/portfolio';

interface AchievementsSectionProps {
  achievements: AchievementItem[];
}

export const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  return (
    <section className="dark-surface border-t border-paper/10 bg-ink py-24 text-paper sm:py-32">
      <div className="section-shell">
        <header
          className="grid gap-8 border-b border-paper/15 pb-10 lg:grid-cols-12 lg:items-end"
          data-reveal
        >
          <div className="lg:col-span-8">
            <p className="eyebrow text-signal">06 / Proof</p>
            <h2 className="serif-display mt-5 max-w-3xl text-5xl text-paper sm:text-7xl">
              Measured progress, without the inflated claims.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-paper/50 lg:col-span-4 lg:ml-auto">
            Rankings, admissions, and repositories that can be checked independently.
          </p>
        </header>

        <div className="mt-2 grid md:grid-cols-2" data-reveal-group>
          {achievements.map((item, index) => (
            <article
              key={item.id}
              data-reveal-item
              className={`py-9 ${
                index < achievements.length - 1 ? 'border-b border-paper/12' : ''
              } ${index % 2 === 0 ? 'md:border-r md:border-paper/12 md:pr-10' : 'md:pl-10'} ${
                index === achievements.length - 2 ? 'md:border-b-0' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="eyebrow text-paper/35">{item.category}</span>
                <span className="font-mono text-[9px] tracking-[0.08em] text-paper/30">
                  {item.date}
                </span>
              </div>
              <h3 className="mt-5 max-w-xl font-display text-3xl leading-none tracking-tight text-paper">
                {item.title}
              </h3>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-signal">
                {item.issuer}
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/55">
                {item.summary}
              </p>
              {item.metrics && (
                <p className="mt-3 font-mono text-[10px] leading-relaxed text-paper/35">
                  {item.metrics}
                </p>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-paper/55 transition-colors hover:text-paper"
                >
                  Verify
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
