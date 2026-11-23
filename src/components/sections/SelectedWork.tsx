'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Github } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INITIAL_PROJECTS } from '@/data/profileData';

const featured = INITIAL_PROJECTS.filter((project) => project.featured).sort((a, b) => {
  const priority = ['drishti-ai', 'celestial-observatory-3d', 'nadicare-twin-engine', 'file-organizer-ecosystem'];
  return priority.indexOf(a.id) - priority.indexOf(b.id);
}).slice(0, 4);
const visualClasses = ['work-visual-drishti', 'work-visual-observatory', 'work-visual-nadicare', 'work-visual-mise'];
const visualLabels = ['EXPLAINABLE AI / 01', 'ORBITAL MECHANICS / 02', 'PHYSIOLOGICAL MODEL / 03', 'LOCAL-FIRST SYSTEM / 04'];

export function SelectedWork() {
  const [activeProject, setActiveProject] = useState<(typeof featured)[number] | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeProject) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeProject]);

  useLayoutEffect(() => {
    if (!sectionRef.current || !stageRef.current || !trackRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const stage = stageRef.current;
      const track = trackRef.current;
      if (!stage || !track) return;
      const distance = () => Math.max(0, track.scrollWidth - stage.clientWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top+=82',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="selected-work" aria-labelledby="selected-work-title">
      <div className="site-shell">
        <header className="selected-work-heading">
          <div>
            <p className="orbital-eyebrow"><span>02</span> / SELECTED WORK</p>
            <h2 id="selected-work-title" className="selected-work-title">
              BUILT TO <span>MOVE</span><br />IDEAS FORWARD.
            </h2>
          </div>
          <div className="selected-work-intro">
            <p>Four projects. Four different problem spaces. A shared focus on making useful systems work well.</p>
            <span className="selected-work-hint"><ArrowDownRight size={15} /> SCROLL TO EXPLORE</span>
          </div>
        </header>
      </div>

      <div ref={stageRef} className="selected-work-stage">
        <div ref={trackRef} className="selected-work-track">
          {featured.map((project, index) => (
            <article className={`selected-work-card orbital-project-card orbital-project-card-${index + 1}`} key={project.id}>
              <div className={`selected-work-visual orbital-project-art ${visualClasses[index]}`} aria-hidden="true">
                <img
                  className="project-art-image"
                  src={project.imageUrl || `https://opengraph.githubassets.com/1/BezaleelPaul/${project.repoUrl.split('/').pop()}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    const image = event.currentTarget;
                    const fallback = `https://opengraph.githubassets.com/1/BezaleelPaul/${project.repoUrl.split('/').pop()}`;
                    if (image.src !== fallback) image.src = fallback;
                    else image.style.display = 'none';
                  }}
                />
                <div className="project-art-image-shade" />
                <div className="project-art-topline">
                  <span>FIELD NOTE / 0{index + 1}</span>
                  <span className="project-art-live"><i /> {project.status.toUpperCase()}</span>
                </div>
                <span className="work-visual-index">0{index + 1} / 04</span>
                <span className="work-visual-label">{visualLabels[index]}</span>
                {index === 1 && <div className="work-planet-system"><i /><i /><i /><b /></div>}
                {index === 2 && <div className="work-vitals"><span>HR</span><strong>↗</strong><svg viewBox="0 0 520 150" role="presentation"><path d="M0 92 H82 L105 92 L128 34 L154 127 L180 70 L203 92 H286 L309 92 L330 51 L351 110 L372 78 L395 92 H520" /></svg><small>MODEL / RECOVERY RESPONSE</small></div>}
                {index === 3 && <div className="work-mise-mark"><span>MISE</span><i /><i /><i /><small>LOCAL-FIRST · CROSS-PLATFORM</small></div>}
                <span className="work-visual-caption">SYSTEM STUDY · PROJECT VISUAL</span>
                <div className="project-art-coordinate">BP / ORBITAL ARCHIVE</div>
              </div>

              <div className="selected-work-detail orbital-project-detail">
                <div className="selected-work-meta">
                  <span>MISSION 0{index + 1}</span>
                  <span>{project.category}</span>
                  <span className="work-status"><i /> {project.status}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="selected-work-tagline">{project.tagline}</p>
                <div className="selected-work-outcome">
                  <span className="orbital-eyebrow">ENGINEERING FOCUS</span>
                  <p>{project.metrics || project.description}</p>
                </div>
                <div className="selected-work-stack">
                  {project.stack.slice(0, 7).map((tech) => <span key={tech}>{tech}</span>)}
                </div>
                <div className="selected-work-links">
                  <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"><Github size={15} /> SOURCE CODE <ArrowUpRight size={13} /></a>
                  {project.demoUrl && <Link href={project.demoUrl}>LIVE EXPERIENCE <ArrowUpRight size={13} /></Link>}
                  <button type="button" onClick={() => setActiveProject(project)} aria-label={'Open ' + project.title + ' case study'}>EXPAND CASE STUDY <ArrowUpRight size={13} /></button>
                </div>
              </div>
              <span className="project-card-corner project-card-corner-one" aria-hidden="true" />
              <span className="project-card-corner project-card-corner-two" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
      <div className="site-shell selected-work-footer">
        <span>SCROLL / DRAG THROUGH THE PROJECTS</span>
        <Link href="/projects">EXPLORE THE PROJECT ARCHIVE <ArrowUpRight size={14} /></Link>
      </div>
      {activeProject && (
        <div className="case-study-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActiveProject(null);
        }}>
          <section className="case-study-expanded" role="dialog" aria-modal="true" aria-labelledby="case-study-title">
            <div className="case-study-expanded-top">
              <span>PROJECT CASE STUDY / {activeProject.category.toUpperCase()}</span>
              <button type="button" onClick={() => setActiveProject(null)} aria-label="Close case study">CLOSE <span aria-hidden="true">×</span></button>
            </div>
            <div className="case-study-expanded-body">
              <p className="orbital-eyebrow">THE ENGINEERING / {activeProject.status.toUpperCase()}</p>
              <h2 id="case-study-title">{activeProject.title}</h2>
              <p className="case-study-expanded-tagline">{activeProject.tagline}</p>
              <div className="case-study-columns">
                <div><span>THE PROBLEM</span><p>{activeProject.problem}</p></div>
                <div><span>THE APPROACH</span><p>{activeProject.solution}</p></div>
              </div>
              <div className="case-study-highlights">
                <span>IMPLEMENTATION NOTES</span>
                <ul>{activeProject.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="case-study-tech">{activeProject.stack.map((item) => <span key={item}>{item}</span>)}</div>
              <div className="case-study-actions">
                <a href={activeProject.repoUrl} target="_blank" rel="noopener noreferrer"><Github size={15} /> VIEW SOURCE <ArrowUpRight size={13} /></a>
                {activeProject.demoUrl && <Link href={activeProject.demoUrl}>OPEN LIVE PROJECT <ArrowUpRight size={13} /></Link>}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
