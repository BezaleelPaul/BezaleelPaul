export interface PilotProfile {
  name: string;
  callsign: string;
  headline: string;
  subheadline: string;
  location: string;
  status: string;
  bio: string[];
  education: {
    institution: string;
    degree: string;
    field: string;
    period: string;
    details: string;
    badge?: string;
  }[];
  approach: string[];
  resumeUrl: string;
  socials: {
    name: string;
    handle: string;
    url: string;
    icon: string;
    primary?: boolean;
  }[];
}

export type ProjectCategory = 
  | 'All'
  | 'Flutter & Mobile'
  | 'Full-Stack'
  | 'AI / ML'
  | 'Web Development'
  | 'Open Source';

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  problem: string;
  solution: string;
  description: string;
  stack: string[];
  featured: boolean;
  repoUrl: string;
  imageUrl?: string;
  demoUrl?: string | null;
  status: 'Production' | 'Active' | 'Prototype' | 'Open Source';
  metrics?: string;
  highlights: string[];
  discoveryDate?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  type: 'Work' | 'Internship' | 'Leadership' | 'IEEE' | 'Open Source';
  summary: string;
  responsibilities: string[];
  skills: string[];
}

export interface SkillItem {
  name: string;
  category: string;
  highlight?: boolean;
}

export interface SkillCategoryGroup {
  id: string;
  name: string;
  icon: string;
  description: string;
  skills: SkillItem[];
}

export interface AchievementItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category: 'Competitive Programming' | 'Academic' | 'Hackathon' | 'Certification' | 'Technical Operations';
  summary: string;
  metrics?: string;
  link?: string;
  evidenceLinks?: { label: string; url: string }[];
}

export interface GitHubAnalyticsData {
  generatedAt: string;
  stats: {
    repos: number;
    stars: number;
    followers: number;
    following: number;
    streak: number;
    total30d: number;
  };
  cp: {
    leetcode: {
      username: string;
      solved: number;
      easy: number;
      medium: number;
      hard: number;
      ranking: string;
    };
    codeforces: {
      handle: string;
      rating: number;
      maxRating: number;
      rank: string;
      maxRank: string;
    };
  };
  series: {
    date: string;
    count: number;
  }[];
  recentActivity: {
    emoji: string;
    action: string;
    repo: string;
    time: string;
  }[];
  topRepos: {
    name: string;
    stars: number;
    description: string;
    language: string;
  }[];
}

export interface AdminSettings {
  publishedAt: string;
  heroHeadlineOverride?: string;
  resumeDownloadUrl: string;
  showAiAssistant: boolean;
  hiddenProjectIds: string[];
  featuredProjectIds: string[];
}
