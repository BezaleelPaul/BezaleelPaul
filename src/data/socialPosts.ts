export interface SocialPost {
  id: string;
  platform: 'linkedin' | 'x';
  author: string;
  handle: string;
  profileUrl: string;
  date: string;
  content: string;
  tags: string[];
  metrics: {
    likes: number;
    reposts: number;
    comments: number;
  };
  postUrl: string;
  pinned?: boolean;
}

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'linkedin-post-double-degree',
    platform: 'linkedin',
    author: 'Bezaleel Paul N',
    handle: 'in/bezaleel-pauln',
    profileUrl: 'https://www.linkedin.com/in/bezaleel-pauln/',
    date: 'Recent Broadcast',
    pinned: true,
    content: `Excited to be pursuing a rigorous dual-degree path: B.Tech in Computer Science & Engineering at CMR University alongside a Bachelor of Science (BS) in Data Science and Applications at IIT Madras! 🎓

Bridging first-principles systems engineering, distributed computing, and high-performance algorithms with mathematical statistics, computational linear algebra, and machine learning architectures. Grateful for the guidance of mentors and faculty across both institutions as I build scalable software solutions.`,
    tags: ['#IITMadras', '#CMRUniversity', '#ComputerScience', '#DataScience', '#SoftwareEngineering', '#Algorithms'],
    metrics: {
      likes: 184,
      reposts: 26,
      comments: 31,
    },
    postUrl: 'https://www.linkedin.com/in/bezaleel-pauln/',
  },
  {
    id: 'x-post-celestial-engine',
    platform: 'x',
    author: 'Bezaleel Paul N',
    handle: '@BezaleelPaul1',
    profileUrl: 'https://x.com/BezaleelPaul1',
    date: 'Recent Broadcast',
    pinned: true,
    content: `Just rolled out the major release of the 3D Keplerian Celestial Engine & Procedural Exoplanet Synthesizer! 🌍✨

Simulating authentic planetary physics, Rayleigh atmospheric scattering, and infinite Minecraft-style procedural solar systems rendered at 60 FPS in Three.js and WebGL.

Live portfolio & simulator: https://bezaleelpaul.github.io`,
    tags: ['#buildinpublic', '#threejs', '#webgl', '#creativecoding', '#flutter', '#astronomy'],
    metrics: {
      likes: 92,
      reposts: 34,
      comments: 18,
    },
    postUrl: 'https://x.com/BezaleelPaul1',
  },
  {
    id: 'linkedin-post-ieee-excom',
    platform: 'linkedin',
    author: 'Bezaleel Paul N',
    handle: 'in/bezaleel-pauln',
    profileUrl: 'https://www.linkedin.com/in/bezaleel-pauln/',
    date: 'Recent Broadcast',
    content: `Honored to serve as IEEE EXCOM Member and Webmaster! ⚡🌐

Architecting and maintaining student branch web infrastructure, streamlining developer workshops, and organizing technical symposia focused on algorithmic thinking, distributed web platforms, and collaborative engineering.

Fostering peer-to-peer technical mentorship and practical coding excellence within our community.`,
    tags: ['#IEEE', '#Webmaster', '#Leadership', '#EngineeringExcellence', '#TechCommunity'],
    metrics: {
      likes: 142,
      reposts: 19,
      comments: 24,
    },
    postUrl: 'https://www.linkedin.com/in/bezaleel-pauln/',
  },
  {
    id: 'x-post-leetcode-milestone',
    platform: 'x',
    author: 'Bezaleel Paul N',
    handle: '@BezaleelPaul1',
    profileUrl: 'https://x.com/BezaleelPaul1',
    date: 'Recent Broadcast',
    content: `Hit 270+ LeetCode problems solved! 🧠 Daily commitment to asymptotic time/space optimization across DP, Graph theory, and balanced trees.

Consistency compounds faster than intensity. Aiming for 350+ and continuing rated Codeforces contests! 🚀💻`,
    tags: ['#LeetCode', '#Codeforces', '#DSA', '#CompetitiveProgramming', '#Cplusplus'],
    metrics: {
      likes: 78,
      reposts: 15,
      comments: 12,
    },
    postUrl: 'https://x.com/BezaleelPaul1',
  },
  {
    id: 'linkedin-post-file-organizer',
    platform: 'linkedin',
    author: 'Bezaleel Paul N',
    handle: 'in/bezaleel-pauln',
    profileUrl: 'https://www.linkedin.com/in/bezaleel-pauln/',
    date: 'Recent Broadcast',
    content: `Open-sourcing the Flutter File Organizer Ecosystem! 📁⚡

Engineered an ultra-fast desktop utility using Dart and Flutter capable of indexing, parsing, and categorizing thousands of cluttered files into structured directory trees in sub-second execution windows.

Features custom rule filters, cross-platform filesystem hooks, and responsive dark-mode UI. Check out the open-source repo on GitHub!`,
    tags: ['#FlutterDev', '#DartLang', '#OpenSource', '#SoftwareArchitecture', '#DesktopApps'],
    metrics: {
      likes: 119,
      reposts: 22,
      comments: 17,
    },
    postUrl: 'https://www.linkedin.com/in/bezaleel-pauln/',
  },
  {
    id: 'x-post-nadicare-ai',
    platform: 'x',
    author: 'Bezaleel Paul N',
    handle: '@BezaleelPaul1',
    profileUrl: 'https://x.com/BezaleelPaul1',
    date: 'Recent Broadcast',
    content: `Deep dive into physiological digital twin modeling with NADICARE: combining XGBoost regression pipelines with Streamlit and Plotly to forecast cardiovascular strain recovery windows in real time. 🫀📊

Applied machine learning tailored for physiological metrics. Full code on GitHub!`,
    tags: ['#MachineLearning', '#Python', '#XGBoost', '#HealthTech', '#AI', '#DataScience'],
    metrics: {
      likes: 85,
      reposts: 28,
      comments: 14,
    },
    postUrl: 'https://x.com/BezaleelPaul1',
  },
];
