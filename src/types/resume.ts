export interface ResumeData {
  name: string;
  nameAccent: string;
  title: string;
  tagline: string;
  photo: string;
  terminal: string[];
  contact: [string, string][];
  skills: [string, string[]][];
  education: [string, string, string][];
  certifications: string[];
  languages: [string, string][];
  coursework: string[];
  summary: string;
  experience: {
    role: string;
    org: string;
    place: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    tech: string;
    links: string[];
    bullets: string[];
  }[];
  projectsQR: {
    url: string;
    label: string;
    display: string;
    note?: string;
  };
  footer: string;
  extra?: {
    title: string;
    items: {
      title: string;
      meta?: string;
      bullets?: string[];
    }[];
  }[];
}
