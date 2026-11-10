import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { OrbitalMarquee } from '@/components/sections/OrbitalMarquee';
import { OrbitalAbout } from '@/components/sections/OrbitalAbout';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ProofSection } from '@/components/sections/ProofSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { INITIAL_PROFILE, INITIAL_SKILLS } from '@/data/profileData';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <OrbitalMarquee />
        <OrbitalAbout />
        <SelectedWork />
        <ExperienceTimeline />
        <ProofSection />
        <SkillsSection skills={INITIAL_SKILLS} />
        <ContactSection profile={INITIAL_PROFILE} />
      </main>
    </>
  );
}
