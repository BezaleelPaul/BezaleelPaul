import generatedData from './workAtlas.generated.json';
import { INITIAL_PROJECTS } from './profileData';
import { ProjectItem } from '@/types/portfolio';

export interface AtlasCommit {
  sha: string;
  date: string;
  message: string;
  url: string;
}

export interface AtlasGeneratedConstellation {
  projectId: string;
  repo: string;
  createdAt: string;
  pushedAt: string;
  htmlUrl: string;
  stars: AtlasCommit[];
  observedCommits: number;
  totalCommits: number;
}

export interface AtlasConstellation {
  project: ProjectItem;
  repo: string;
  htmlUrl: string;
  createdAt: string;
  pushedAt: string;
  commits: AtlasCommit[];
  observedCommits: number;
  totalCommits: number;
  shortTitle: string;
  anchor: [number, number, number];
  shape: number;
}

const metadata: Record<string, {
  shortTitle: string;
  anchor: [number, number, number];
  shape: number;
}> = {
  'celestial-observatory-3d': {
    shortTitle: 'Observatory',
    anchor: [0, 2.5, -1],
    shape: 0,
  },
  'nadicare-twin-engine': {
    shortTitle: 'NADICARE',
    anchor: [-5.5, -0.4, 1.5],
    shape: 1,
  },
  'file-organizer-ecosystem': {
    shortTitle: 'Mise',
    anchor: [6.4, 1.9, 1],
    shape: 2,
  },
  'bescom-calculator': {
    shortTitle: 'BESCOM',
    anchor: [-5.2, -5.1, 4],
    shape: 3,
  },
  'drishti-ai': {
    shortTitle: 'Drishti',
    anchor: [5.2, -4.4, 3.2],
    shape: 4,
  },
};

const source = generatedData as {
  generatedAt: string;
  constellations: AtlasGeneratedConstellation[];
};

export const ATLAS_GENERATED_AT = source.generatedAt;

export const ATLAS_CONSTELLATIONS: AtlasConstellation[] = source.constellations.flatMap((constellation) => {
  const project = INITIAL_PROJECTS.find((item) => item.id === constellation.projectId);
  const details = metadata[constellation.projectId];
  if (!project || !details) return [];
  return [{
    project,
    repo: constellation.repo,
    htmlUrl: constellation.htmlUrl,
    createdAt: constellation.createdAt,
    pushedAt: constellation.pushedAt,
    commits: constellation.stars,
    observedCommits: constellation.observedCommits,
    totalCommits: constellation.totalCommits,
    shortTitle: details.shortTitle,
    anchor: details.anchor,
    shape: details.shape,
  }];
});

export const ATLAS_TOTAL_COMMITS = ATLAS_CONSTELLATIONS.reduce(
  (total, constellation) => total + constellation.totalCommits,
  0
);

export const ATLAS_STAR_COUNT = ATLAS_CONSTELLATIONS.reduce(
  (total, constellation) => total + constellation.commits.length + 1,
  0
);

export const ATLAS_START = Math.min(
  ...ATLAS_CONSTELLATIONS.flatMap((constellation) => [
    new Date(constellation.createdAt).getTime(),
    ...constellation.commits.map((commit) => new Date(commit.date).getTime()),
  ])
);

export const ATLAS_END = Math.max(
  ...ATLAS_CONSTELLATIONS.flatMap((constellation) => [
    new Date(constellation.pushedAt).getTime(),
    ...constellation.commits.map((commit) => new Date(commit.date).getTime()),
  ])
);
