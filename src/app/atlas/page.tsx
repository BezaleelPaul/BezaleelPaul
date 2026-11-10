import type { Metadata } from 'next';
import { AtlasExperience } from '@/components/atlas/AtlasExperience';

export const metadata: Metadata = {
  title: 'The Work Atlas — Bezaleel Paul N',
  description: 'An interactive map of five software systems, plotted from real public GitHub commit history.',
};

export default function AtlasPage() {
  return <AtlasExperience />;
}
