'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

const links = [
  { label: 'Profile', href: '#top' },
  { label: 'Work', href: '#work' },
  { label: 'Project Archive', href: '/projects/' },
  { label: 'Studio', href: '/music-studio/' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const resolveHref = (href: string) => href.startsWith('#') && pathname !== '/' ? `/${href}` : href;

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !headerRef.current) return;

    const brand = headerRef.current.querySelector('.nav-brand');
    const navLinks = headerRef.current.querySelectorAll('.nav-links .nav-link');
    const resumeBtn = headerRef.current.querySelector('.resume-button');

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    if (brand) {
      tl.fromTo(brand, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2);
    }
    if (navLinks.length) {
      tl.fromTo(
        navLinks,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        0.35
      );
    }
    if (resumeBtn) {
      tl.fromTo(resumeBtn, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.5 }, 0.55);
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <header className="site-nav" ref={headerRef}>
      <div className="site-shell nav-inner">
        <Link href="/" className="nav-brand" aria-label="Bezaleel Paul home">
          BP<span className="accent">.</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.label} href={resolveHref(link.href)} className="nav-link">{link.label}</Link>
          ))}
        </nav>
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <Link href="/resume/" className="resume-button">
          Résumé <span aria-hidden="true">↗</span>
        </Link>
        <nav
          id="mobile-navigation"
          className={`mobile-nav-panel${menuOpen ? ' is-open' : ''}`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={resolveHref(link.href)}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}<span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
