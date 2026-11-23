'use client';

import { ArrowUpRight, BrainCircuit, Code2, Server, Smartphone } from 'lucide-react';
import type { SkillCategoryGroup } from '@/types/portfolio';

interface SkillsSectionProps {
  skills: SkillCategoryGroup[];
}

const categoryIcons = {
  languages: Code2,
  'mobile-frontend': Smartphone,
  'ai-ml': BrainCircuit,
  'backend-cloud': Server,
} as const;

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="skills-section" aria-labelledby="skills-title">
      <div className="site-shell">
        <div className="skills-heading">
          <div>
            <p className="orbital-eyebrow"><span>06</span> / ENGINEERING TOOLKIT</p>
            <h2 id="skills-title">TOOLS OF<br /><span>THE TRADE.</span></h2>
          </div>
          <p className="skills-intro">
            A practical toolkit across mobile, web, backend, and applied machine learning.
            I choose tools around the problem rather than treating a stack as a checklist.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((group, index) => {
            const Icon = categoryIcons[group.id as keyof typeof categoryIcons] ?? Code2;
            return (
              <article className="skills-card" key={group.id} data-reveal>
                <div className="skills-card-top">
                  <span>{String(index + 1).padStart(2, '0')} / {String(skills.length).padStart(2, '0')}</span>
                  <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3>{group.name}</h3>
                <p className="skills-card-description">{group.description}</p>
                <ul className="skills-list">
                  {group.skills.map((skill) => (
                    <li className={skill.highlight ? 'skill-chip skill-chip-highlight' : 'skill-chip'} key={skill.name}>
                      <span>{skill.name}</span>
                      <small>{skill.category}</small>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="skills-foot">
          <span>TOOLS ARE A MEANS / ENGINEERING IS THE PRACTICE</span>
          <a href="https://github.com/BezaleelPaul" target="_blank" rel="noopener noreferrer">
            EXPLORE THE CODE <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </section>
  );
}
