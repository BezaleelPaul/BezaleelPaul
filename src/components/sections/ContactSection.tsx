import { ArrowDownRight, ArrowUpRight, Mail, Radio } from 'lucide-react';
import type { PilotProfile } from '@/types/portfolio';

interface ContactSectionProps {
  profile: PilotProfile;
}

export function ContactSection({ profile }: ContactSectionProps) {
  const email = profile.socials.find((social) => social.name === 'Email');
  const publicLinks = profile.socials.filter((social) => social.primary && social.name !== 'Email');

  return (
    <>
      <section id="contact" className="contact-section" aria-labelledby="contact-title">
        <div className="site-shell">
          <div className="contact-topline">
            <p className="orbital-eyebrow"><span>08</span> / OPEN CHANNEL</p>
            <span className="contact-status"><i /> {profile.status}</span>
          </div>

          <div className="contact-main">
            <div className="contact-copy" data-reveal>
              <p className="contact-kicker">HAVE A GOOD PROBLEM?</p>
              <h2 id="contact-title">LET'S MAKE<br /><span>IT REAL.</span></h2>
              <p className="contact-description">
                I’m interested in thoughtful engineering, useful products, and working with people
                who enjoy solving difficult problems. If something is worth building, let’s talk.
              </p>
              {email && (
                <a className="contact-email" href={email.url}>
                  <Mail size={17} /> {email.handle} <ArrowUpRight size={17} />
                </a>
              )}
            </div>

            <div className="contact-orbit" aria-hidden="true" data-reveal>
              <div className="contact-orbit-ring contact-orbit-ring-one" />
              <div className="contact-orbit-ring contact-orbit-ring-two" />
              <div className="contact-orbit-core"><Radio size={26} strokeWidth={1.2} /></div>
              <span className="contact-orbit-label contact-orbit-label-top">SIGNAL / 001</span>
              <span className="contact-orbit-label contact-orbit-label-bottom">BENGALURU · INDIA</span>
            </div>
          </div>

          <div className="contact-links">
            <span className="contact-links-label">FIND ME ELSEWHERE</span>
            <div>
              {publicLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
                  {social.name} <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </div>

          <div className="contact-transmission">
            <span>FINAL TRANSMISSION</span>
            <p>STILL CURIOUS. STILL BUILDING. STILL EXPLORING.</p>
            <ArrowDownRight size={19} />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-shell site-footer-inner">
          <a href="#top" className="footer-mark" aria-label="Back to top">BP<span>.</span></a>
          <span>© {new Date().getFullYear()} BEZALEEL PAUL N.</span>
          <a href="#top" className="footer-top-link">BACK TO ORBIT <ArrowUpRight size={12} /></a>
        </div>
      </footer>
    </>
  );
}
