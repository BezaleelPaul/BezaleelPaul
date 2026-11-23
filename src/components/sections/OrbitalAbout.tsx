export function OrbitalAbout() {
  const principles = [
    'Start with the problem and the people using the product.',
    'Prefer clear architecture over unnecessary complexity.',
    'Treat performance, accessibility, and reliability as product features.',
    'Keep learning through experiments, collaboration, and open source.',
  ];

  return (
    <section id="about" className="orbital-about space-texture" aria-labelledby="about-title">
      <div className="site-shell">
        <div className="orbital-about-heading" data-reveal>
          <p className="orbital-eyebrow"><span>01</span> / PROFILE &amp; DIRECTION</p>
          <h2 id="about-title" className="orbital-about-title">
            CURIOUS BY <span className="accent">DEFAULT.</span><br />
            BUILT TO <span className="outline-text">SHIP.</span>
          </h2>
        </div>

        <div className="orbital-about-grid">
          <div className="orbital-about-aside">
            <span className="orbital-coordinate">12°58&apos; N / 77°36&apos; E</span>
            <span className="orbital-status"><i /> BENGALURU, INDIA · OPEN TO OPPORTUNITIES</span>
          </div>
          <div className="orbital-about-copy">
            <p className="orbital-about-lead" data-reveal>
              I&apos;m Bezaleel Paul N — a computer science undergraduate and software developer interested in building useful products across mobile, web, and applied AI.
            </p>
            <p data-reveal data-reveal-delay="80">
              I study Computer Science and Engineering at CMR University while pursuing the BS in Data Science programme at IIT Madras. My work moves between Flutter applications, full-stack systems, developer tools, and machine-learning experiments.
            </p>
            <p data-reveal data-reveal-delay="160">
              I care about the engineering behind the interface: thoughtful architecture, responsive performance, dependable behaviour, and making complex ideas understandable to the people who use them.
            </p>
          </div>
        </div>

        <div className="orbital-education">
          <div className="orbital-subhead">
            <span>ACADEMIC ORBIT</span><span>01 — 02</span>
          </div>
          <article className="orbital-education-card" data-reveal>
            <div className="orbital-education-index">01</div>
            <div>
              <h3>CMR UNIVERSITY</h3>
              <p>B.Tech · Computer Science and Engineering</p>
            </div>
            <span className="orbital-education-period">2025 — 2029</span>
          </article>
          <article className="orbital-education-card" data-reveal data-reveal-delay="120">
            <div className="orbital-education-index">02</div>
            <div>
              <h3>IIT MADRAS</h3>
              <p>BS · Data Science and Applications</p>
            </div>
            <span className="orbital-education-period">2026 — PRESENT</span>
          </article>
        </div>

        <div className="orbital-principles">
          <div className="orbital-subhead">
            <span>OPERATING PRINCIPLES</span><span>HOW I WORK</span>
          </div>
          <div className="orbital-principle-grid">
            {principles.map((principle, index) => (
              <div className="orbital-principle" key={principle} data-reveal data-reveal-delay={String(index * 80)}>
                <span>0{index + 1}</span><p>{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
