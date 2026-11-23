import React from 'react';
import { PilotProfile } from '@/types/portfolio';

interface AboutSectionProps {
  profile: PilotProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  return (
    <section id="about" className="paper-grid border-t border-ink/10 bg-paper py-24 sm:py-32">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-4" data-reveal>
            <p className="eyebrow text-ink/45">01 / Profile</p>
            <h2 className="serif-display mt-6 max-w-md text-5xl text-ink sm:text-6xl">
              I build software that earns its place.
            </h2>
            <div className="mt-10 space-y-2 border-t border-ink/15 pt-5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.11em] text-ink/50">
              <p>{profile.status}</p>
              <p>{profile.location}</p>
            </div>
          </header>

          <div className="lg:col-span-8">
            <div
              className="max-w-3xl space-y-6 text-base leading-relaxed text-ink/78 sm:text-lg"
              data-reveal-group
              data-reveal-delay="80"
            >
              {profile.bio.map((paragraph) => (
                <p key={paragraph} data-reveal-item>{paragraph}</p>
              ))}
            </div>

            <div
              className="mt-14 grid gap-8 border-t border-ink/15 pt-9 md:grid-cols-2"
              data-reveal-group
            >
              {profile.education.map((education, index) => (
                <article key={education.institution} data-reveal-item>
                  <div className="flex items-center justify-between gap-4">
                    <span className="eyebrow text-ink/40">Education 0{index + 1}</span>
                    <span className="font-mono text-[10px] tracking-[0.08em] text-ink/45">
                      {education.period}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl leading-none tracking-tight text-ink">
                    {education.institution}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-ink/75">
                    {education.degree} · {education.field}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink/55">
                    {education.details}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-14 border-t border-ink/15 pt-9">
              <p className="eyebrow text-ink/40">How I work</p>
              <div className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2" data-reveal-group>
                {profile.approach.map((point, index) => (
                  <div
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed text-ink/70"
                    data-reveal-item
                  >
                    <span className="mt-0.5 font-mono text-[10px] text-ink/35">0{index + 1}</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
