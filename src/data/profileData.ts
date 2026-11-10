import { 
  PilotProfile, 
  ProjectItem, 
  ExperienceItem, 
  SkillCategoryGroup, 
  AchievementItem, 
  GitHubAnalyticsData,
  AdminSettings
} from '@/types/portfolio';

export const INITIAL_PROFILE: PilotProfile = {
  name: "Bezaleel Paul N",
  callsign: "BezForge",
  headline: "Applied AI & Software Engineering",
  subheadline: "B.Tech Computer Science at CMR University · BS in Data Science at IIT Madras · Building practical software and applied-AI systems.",
  location: "Bangalore, India",
  status: "Open to SWE Internships & Collaborations",
  bio: [
    "I am Bezaleel Paul N, a software developer and computer science undergraduate based in Bengaluru, India. I am pursuing a B.Tech in Computer Science and Engineering at CMR University alongside the BS in Data Science programme at IIT Madras.",
    "My primary interests are applied AI and software engineering: turning real requirements into usable systems, evaluating models carefully, and building dependable applications. I also work with Flutter and modern web technologies when they fit the problem.",
    "I also contribute to the developer community through open-source work and technical events. I previously served as a Webmaster and EXCOM volunteer with the IEEE CMR University Student Branch. I am particularly interested in engineering fundamentals, thoughtful product design, and continuous learning."
  ],
  education: [
    {
      institution: "CMR University",
      degree: "Bachelor of Technology (B.Tech)",
      field: "Computer Science and Engineering",
      period: "2025 — 2029",
      details: "Core focus on Data Structures & Algorithms, Distributed Systems, Object-Oriented Software Design, and Operating Systems.",
      badge: "In Progress"
    },
    {
      institution: "Indian Institute of Technology (IIT) Madras",
      degree: "Bachelor of Science (BS)",
      field: "Data Science and Applications",
      period: "2026 — Present",
      details: "Rigorous foundation in Mathematical Statistics, Machine Learning, Computational Linear Algebra, and Large-Scale Data Systems.",
      badge: "Premier Program"
    }
  ],
  approach: [
    "Build tools that solve real problems, not just resume fillers",
    "Keep it snappy — 60 FPS interfaces and zero unnecessary bloat",
    "Daily problem solving — keeping sharp on data structures & algorithms",
    "Learn in public, share open-source code, and document the journey"
  ],
  resumeUrl: "/resume/",
  socials: [
    { name: "GitHub", handle: "@BezaleelPaul", url: "https://github.com/BezaleelPaul", icon: "github", primary: true },
    { name: "LinkedIn", handle: "in/bezaleel-pauln", url: "https://www.linkedin.com/in/bezaleel-pauln/", icon: "linkedin", primary: true },
    { name: "X (Twitter)", handle: "@BezaleelPaul1", url: "https://x.com/BezaleelPaul1", icon: "twitter", primary: true },
    { name: "LeetCode", handle: "BezaleelPaulN", url: "https://leetcode.com/u/BezaleelPaulN/", icon: "code", primary: true },
    { name: "Codeforces", handle: "BezaleelPaulN", url: "https://codeforces.com/profile/BezaleelPaulN", icon: "terminal" },
    { name: "Kaggle", handle: "bezaleelpaul", url: "https://www.kaggle.com/bezaleelpaul", icon: "database" },
    { name: "Email", handle: "bezaleel321@gmail.com", url: "mailto:bezaleel321@gmail.com", icon: "mail", primary: true }
  ]
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "celestial-observatory-3d",
    title: "Orbital Observatory: 3D Keplerian Engine",
    tagline: "Interactive solar-system model with Keplerian orbital mechanics, procedural worlds, and optional NASA Open API context.",
    category: "Full-Stack",
    problem: "Accurate astronomical modeling requires implementing Keplerian orbital equations and eccentric-anomaly corrections while keeping WebGL rendering responsive.",
    solution: "Built a React Three Fiber celestial canvas around a custom Keplerian solver, with a lightweight background mode and a separate observational view for NASA APOD and near-Earth object data.",
    description: "An interactive digital planetarium simulating planetary orbits, orbital inclination, axial tilt, and near-Earth object context with procedurally generated planetary data.",
    stack: ["Three.js", "React Three Fiber", "NASA Open API", "Keplerian Physics", "GLSL Shaders", "Next.js", "TypeScript"],
    featured: true,
    repoUrl: "https://github.com/BezaleelPaul/Orbital-Observatory",
    imageUrl: "https://opengraph.githubassets.com/1/BezaleelPaul/Orbital-Observatory",
    demoUrl: "/observatory",
    status: "Production",
    metrics: "Custom Keplerian solver, interactive orbital modes, and optional NASA data context.",
    highlights: [
      "Custom Keplerian orbital solver computing true anomaly via Newton-Raphson approximation",
      "NASA Open API context for daily astronomy imagery and near-Earth asteroid data",
      "Multi-camera orbital rig with free-flight, chase, cockpit, and planetary orbit modes"
    ]
  },
  {
    id: "nadicare-twin-engine",
    title: "NADICARE Twin Engine",
    tagline: "AI-driven physiological digital twin modeling real-time cardiac performance and recovery.",
    category: "AI / ML",
    problem: "Real-time cardiovascular stress modeling often lacks proactive recovery forecasting, relying instead on static retrospective metrics.",
    solution: "Engineered a predictive digital twin combining machine learning algorithms with interactive telemetry to forecast heart rate response windows and recovery dynamics.",
    description: "An advanced biomedical engineering concept integrating XGBoost regression models with Streamlit and Plotly visualization pipelines to simulate real-time physiological response to exertion.",
    stack: ["Python", "Streamlit", "XGBoost", "Plotly", "NumPy", "Scikit-Learn"],
    featured: true,
    repoUrl: "https://github.com/BezaleelPaul/bnmit-nadicare-health",
    imageUrl: "https://raw.githubusercontent.com/BezaleelPaul/bnmit-nadicare-health/main/screenshots/screencapture-localhost-8501-2026-03-16-19_31_57.png",
    demoUrl: null,
    status: "Active",
    metrics: "Simulates continuous physiological load curves with dynamic recovery prediction.",
    highlights: [
      "Dynamic cardiac load response simulation based on user strain inputs",
      "XGBoost-powered recovery window forecasting algorithms",
      "Multi-metric telemetry dashboards with real-time visual variance tracking"
    ]
  },
  {
    id: "file-organizer-ecosystem",
    title: "Mise: File Organizer & Disk Intelligence",
    tagline: "Local-first, safety-guaranteed file organizer & disk workstation with selective undo and duplicate treemap for Windows, macOS, Linux, and Android.",
    category: "Flutter & Mobile",
    problem: "Manual filesystem triage is inefficient, risky without transactional undo guarantees, and difficult across heterogeneous operating systems.",
    solution: "Engineered Mise: a cross-platform Flutter and Python workstation featuring selective undo, duplicate detection treemaps, and CLI capabilities.",
    description: "Available as a cross-platform Flutter application and Python utility providing automated filesystem classification, duplicate space analysis, and batch file organization.",
    stack: ["Flutter", "Dart", "Python", "CLI", "Cross-Platform", "Desktop & Mobile"],
    featured: true,
    repoUrl: "https://github.com/BezaleelPaul/file_organizer_flutter",
    imageUrl: "https://raw.githubusercontent.com/BezaleelPaul/file_organizer_flutter/main/assets/banner.png",
    demoUrl: null,
    status: "Production",
    metrics: "Sub-second filesystem classification with transactional safety undo logs.",
    highlights: [
      "Selective undo architecture preserving file safety and transaction history",
      "Disk intelligence duplicate treemap visualization",
      "Native desktop support across Windows, macOS, Linux, and Android"
    ]
  },
  {
    id: "bescom-calculator",
    title: "BESCOM Energy Tariff Calculator",
    tagline: "Interactive civic electricity consumption calculator built with accurate BESCOM slab structures.",
    category: "Web Development",
    problem: "Utility consumers face complex tiered billing slabs with non-linear fixed charges, making estimation difficult.",
    solution: "Built a responsive, zero-dependency civic web application calculating exact domestic power billing according to active official tariff slabs.",
    description: "A deployed, production-ready civic utility featuring interactive mathematical models for power tariffs, fixed kilowatt charges, and seasonal fuel adjustment adjustments.",
    stack: ["HTML5", "CSS3", "JavaScript (ES6+)", "Responsive UI"],
    featured: false,
    repoUrl: "https://github.com/BezaleelPaul/BESCOM-Calculator",
    demoUrl: "https://bezaleelpaul.github.io/BESCOM-Calculator/",
    status: "Production",
    metrics: "Client-side calculation against published domestic tariff slabs.",
    highlights: [
      "Accurate multi-tier domestic and commercial slab computation",
      "Live hosted on GitHub Pages with instant client-side calculation",
      "Accessible keyboard-friendly numerical interface"
    ]
  },
  {
    id: "maclaurin-visualizer",
    title: "Maclaurin Series Convergence Visualizer",
    tagline: "Mathematical visualization engine demonstrating infinite polynomial Taylor & Maclaurin convergence.",
    category: "Web Development",
    problem: "Calculus students struggle to develop intuition for polynomial approximation of transcendental functions.",
    solution: "Constructed a high-frame-rate HTML5 Canvas visualizer plotting partial sum approximations in real time as polynomial degree increases.",
    description: "An educational mathematics software tool designed to visualize series convergence, error bounds, and function behavior across arbitrary degrees.",
    stack: ["JavaScript", "HTML5 Canvas", "Calculus Algorithms", "LaTeX Math"],
    featured: false,
    repoUrl: "https://github.com/BezaleelPaul",
    demoUrl: null,
    status: "Active",
    metrics: "60 FPS dynamic polynomial curve evaluation.",
    highlights: [
      "Interactive degree slider from n=1 to high-order polynomials",
      "Support for sin(x), cos(x), e^x, and ln(1+x) expansions",
      "Color-coded visual convergence comparison vs true function curve"
    ]
  },
  {
    id: "drishti-ai",
    title: "Drishti-AI: Explainable Retinal Screening",
    tagline: "A Smart India Hackathon software prototype exploring explainable AI for diabetic-retinopathy screening in resource-constrained settings.",
    category: "AI / ML",
    problem: "Retinal image screening workflows need clear image-quality checks, interpretable model evidence, and a clinician review path—especially where connectivity and specialist access are limited.",
    solution: "Leading a multidisciplinary prototype that explores fundus-image quality assessment, DR grading, explainability outputs, and a clinician-in-the-loop review workflow.",
    description: "An ongoing applied-AI project focused on responsible model evaluation and a practical screening workflow. Offline operation and deployment performance remain validation goals, not claimed production results.",
    stack: ["Python", "TensorFlow", "Flutter", "Computer Vision", "Explainable AI", "MATLAB"],
    featured: true,
    repoUrl: "https://github.com/BezaleelPaul/Drishti-AI",
    imageUrl: "https://raw.githubusercontent.com/BezaleelPaul/Drishti-AI/master/presentation/screenshots/01_phc_dashboard_online.png",
    demoUrl: null,
    status: "Prototype",
    highlights: [
      "Modular image preprocessing and bounding box evaluation",
      "Clean API separation for vision inference engines"
    ]
  },
  {
    id: "youtube-thumbnail-grabber",
    title: "Playlist Thumbnail Grabber",
    tagline: "Open-source media extraction utility for batch playlist metadata and thumbnail retrieval.",
    category: "Open Source",
    problem: "Content creators and researchers require batch visual assets from long playlist feeds without manual downloads.",
    solution: "Engineered automated batch retrieval scripts extracting high-resolution metadata and image streams.",
    description: "An active open-source contribution repository with branches, pull requests, and automated asset scraping capabilities.",
    stack: ["Python", "REST APIs", "Automation", "Git Workflow"],
    featured: false,
    repoUrl: "https://github.com/BezaleelPaul/YouTubePlaylistThumbnailGrabber",
    demoUrl: null,
    status: "Open Source",
    highlights: [
      "Automated extraction of maximum-resolution thumbnails",
      "Forked and enhanced with active PRs and branching architecture"
    ]
  }
];

export const INITIAL_EXPERIENCE: ExperienceItem[] = [
  {
    id: "software-dev-intern",
    role: "Software Engineering & ML Contributor",
    organization: "Independent & Open Source Projects",
    period: "2025 — Present",
    location: "Bangalore, India",
    type: "Work",
    summary: "Architecting end-to-end full-stack applications, AI predictive pipelines, and automated developer tooling.",
    responsibilities: [
      "Engineered the NADICARE Twin Engine for physiological stress forecasting using XGBoost and dynamic Plotly dashboards.",
      "Developed cross-platform mobile and desktop utilities using Flutter, Dart, and Python.",
      "Worked across personal and collaborative repositories using Git-based development workflows."
    ],
    skills: ["Python", "Flutter", "Machine Learning", "Full-Stack Web", "Git CI/CD"]
  },
  {
    id: "ieee-technical-member",
    role: "IEEE EXCOM Member & Webmaster",
    organization: "IEEE Student Branch",
    period: "2025 — 2026",
    location: "Bangalore, India",
    type: "IEEE",
    summary: "Led digital web operations, technical workshops, and developer initiatives as an Executive Committee member.",
    responsibilities: [
      "Architected and maintained official student branch web portals and event registration infrastructure.",
      "Spearheaded technical workshops and peer coding sessions in foundational programming and algorithmic thinking.",
      "Collaborated with executive leadership to organize regional technical symposiums and collegiate developer exchanges."
    ],
    skills: ["Web Architecture", "Technical Leadership", "Event Coordination", "Community Outreach"]
  },
  {
    id: "competitive-programming",
    role: "Competitive Programmer & Algorithmic Specialist",
    organization: "LeetCode & Codeforces",
    period: "2025 — Present",
    location: "Online",
    type: "Leadership",
    summary: "Rigorous daily practice in computational complexity, dynamic programming, and data structure design.",
    responsibilities: [
      "Practised algorithmic problem solving across data structures, trees, graphs, and dynamic programming on LeetCode and Codeforces.",
      "Maintained an active rated profile on Codeforces with continuous performance evaluation.",
      "Consistently achieved structured solutions with optimal asymptotic time and space bounds."
    ],
    skills: ["Algorithms", "Data Structures", "Dynamic Programming", "C++", "Python"]
  }
];

export const INITIAL_SKILLS: SkillCategoryGroup[] = [
  {
    id: "languages",
    name: "Programming Languages",
    icon: "code",
    description: "Core languages for systems, algorithms, scripting, and application engineering.",
    skills: [
      { name: "Python", category: "Core", highlight: true },
      { name: "JavaScript (ES6+)", category: "Web", highlight: true },
      { name: "TypeScript", category: "Web", highlight: true },
      { name: "Dart", category: "Mobile", highlight: true },
      { name: "C / C++", category: "Systems" },
      { name: "SQL", category: "Data" },
      { name: "HTML5 / CSS3", category: "Frontend" }
    ]
  },
  {
    id: "mobile-frontend",
    name: "Mobile & Frontend Development",
    icon: "smartphone",
    description: "Modern frameworks for high-performance responsive interfaces and native mobile apps.",
    skills: [
      { name: "Flutter", category: "Mobile", highlight: true },
      { name: "React.js", category: "Web", highlight: true },
      { name: "Next.js", category: "Full-Stack", highlight: true },
      { name: "Tailwind CSS", category: "Styling", highlight: true },
      { name: "Three.js / WebGL", category: "3D Graphics" },
      { name: "Tkinter", category: "Desktop" }
    ]
  },
  {
    id: "ai-ml",
    name: "Artificial Intelligence & Data Science",
    icon: "brain",
    description: "Machine learning algorithms, deep learning models, and analytical tools.",
    skills: [
      { name: "TensorFlow", category: "Deep Learning", highlight: true },
      { name: "XGBoost", category: "Gradient Boosting", highlight: true },
      { name: "Scikit-Learn", category: "ML", highlight: true },
      { name: "OpenCV", category: "Vision" },
      { name: "Plotly & Streamlit", category: "Data Visualization" },
      { name: "Pandas & NumPy", category: "Scientific Computing" }
    ]
  },
  {
    id: "backend-cloud",
    name: "Backend, Tools & DevOps",
    icon: "server",
    description: "Server architecture, version control, CI/CD pipelines, and cloud services.",
    skills: [
      { name: "FastAPI", category: "Backend", highlight: true },
      { name: "Node.js", category: "Backend" },
      { name: "Git & GitHub", category: "Version Control", highlight: true },
      { name: "GitHub Actions", category: "CI/CD", highlight: true },
      { name: "Firebase", category: "BaaS" },
      { name: "Docker (Basics)", category: "Containerization" },
      { name: "Linux CLI", category: "Environments" }
    ]
  }
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "leetcode-135",
    title: "Competitive Programming Practice",
    issuer: "LeetCode",
    date: "2025 — Present",
    category: "Competitive Programming",
    summary: "Ongoing practice across data structures, dynamic programming, graphs, trees, and timed contests.",
    metrics: "LeetCode handle: BezaleelPaulN",
    link: "https://leetcode.com/u/BezaleelPaulN/"
  },
  {
    id: "codeforces-rating",
    title: "Codeforces Problem-Solving Profile",
    issuer: "Codeforces",
    date: "2025 — Present",
    category: "Competitive Programming",
    summary: "Active participant in timed algorithmic contests testing rapid implementation and asymptotic optimization.",
    metrics: "Handle: BezaleelPaulN",
    link: "https://codeforces.com/profile/BezaleelPaulN"
  },
  {
    id: "iit-madras-admit",
    title: "Admitted to IIT Madras BS in Data Science",
    issuer: "Indian Institute of Technology Madras",
    date: "2026",
    category: "Academic",
    summary: "Selected for the rigorous degree program in Data Science and Applications offered by India's premier engineering institute.",
    metrics: "Double degree pursuit alongside B.Tech Computer Science."
  },
  {
    id: "open-source-repos",
    title: "Open-Source Development",
    issuer: "GitHub",
    date: "2025 — Present",
    category: "Hackathon",
    summary: "Public work spanning developer utilities, AI experiments, mathematical visualizations, and Flutter applications.",
    metrics: "GitHub: BezaleelPaul"
  },
  {
    id: "campus-voting-2000",
    title: "Campus Voting System — 2,000+ Student Voters",
    issuer: "AC School, Jalahalli, Bengaluru",
    date: "2026",
    category: "Technical Operations",
    summary: "Supported the execution of a campus voting system at AC School, Jalahalli, Bengaluru, used by approximately 2,000 students in a single day across 10 laptops, with no reported operational disruptions.",
    metrics: "≈2,000 student voters · 10 laptops · 1 day",
    link: "https://youtu.be/iDmTlF8fJuQ?t=78",
    evidenceLinks: [
      { label: "YouTube video (1:18)", url: "https://youtu.be/iDmTlF8fJuQ?t=78" },
      { label: "Instagram reel 1", url: "https://www.instagram.com/reel/C75p8xvp1qS/?igsh=cXJyZDdidThrZDM0" },
      { label: "Instagram reel 2", url: "https://www.instagram.com/reel/C75noSOpJ2F/?igsh=eHhmdXJleW1zeXR5" }
    ]
  }
];

export const INITIAL_GITHUB_DATA: GitHubAnalyticsData = {
  generatedAt: "2026-11-01T12:00:00Z",
  stats: {
    repos: 34,
    stars: 4,
    followers: 3,
    following: 10,
    streak: 3,
    total30d: 30
  },
  cp: {
    leetcode: {
      username: "BezaleelPaulN",
      solved: 135,
      easy: 116,
      medium: 17,
      hard: 2,
      ranking: "1,312,296"
    },
    codeforces: {
      handle: "BezaleelPaulN",
      rating: 959,
      maxRating: 959,
      rank: "NEWBIE",
      maxRank: "NEWBIE"
    }
  },
  series: [
    { date: "2026-10-03", count: 0 },
    { date: "2026-10-04", count: 0 },
    { date: "2026-10-05", count: 1 },
    { date: "2026-10-06", count: 5 },
    { date: "2026-10-07", count: 6 },
    { date: "2026-10-08", count: 0 },
    { date: "2026-10-09", count: 10 },
    { date: "2026-10-10", count: 2 },
    { date: "2026-10-11", count: 0 },
    { date: "2026-10-12", count: 0 },
    { date: "2026-10-13", count: 1 },
    { date: "2026-10-14", count: 0 },
    { date: "2026-10-15", count: 0 },
    { date: "2026-10-16", count: 0 },
    { date: "2026-10-17", count: 0 },
    { date: "2026-10-18", count: 0 },
    { date: "2026-10-19", count: 0 },
    { date: "2026-10-20", count: 4 },
    { date: "2026-10-21", count: 0 },
    { date: "2026-10-22", count: 0 },
    { date: "2026-10-23", count: 0 },
    { date: "2026-10-24", count: 0 },
    { date: "2026-10-25", count: 1 },
    { date: "2026-10-26", count: 0 },
    { date: "2026-10-27", count: 0 },
    { date: "2026-10-28", count: 0 },
    { date: "2026-10-29", count: 0 },
    { date: "2026-10-30", count: 0 },
    { date: "2026-10-31", count: 0 },
    { date: "2026-11-01", count: 0 }
  ],
  recentActivity: [
    { emoji: "📦", action: "Pushed updates to", repo: "file_organizer_flutter", time: "6d ago" },
    { emoji: "🌿", action: "Created branch in", repo: "YouTubePlaylistThumbnailGrabber", time: "11d ago" },
    { emoji: "🔀", action: "Opened Pull Request in", repo: "YouTubePlaylistThumbnailGrabber", time: "11d ago" },
    { emoji: "🍴", action: "Forked repository", repo: "YouTubePlaylistThumbnailGrabber", time: "11d ago" },
    { emoji: "📦", action: "Pushed commits to", repo: "Drishti-AI", time: "11d ago" },
    { emoji: "📦", action: "Pushed commits to", repo: "Drishti-AI", time: "18d ago" },
    { emoji: "📦", action: "Pushed commits to", repo: "file_organizer_flutter", time: "22d ago" }
  ],
  topRepos: [
    { name: "bnmit-nadicare-health", stars: 1, description: "AI Digital Twin for real-time cardiac performance modeling", language: "Python" },
    { name: "file_organizer_flutter", stars: 1, description: "Cross-platform Flutter companion for automated filesystem categorization", language: "Dart" },
    { name: "File-Organizer", stars: 1, description: "Smart Python & Tkinter GUI for rule-based file organization", language: "Python" },
    { name: "BESCOM-Calculator", stars: 1, description: "Karnataka electricity tariff slab calculator live on GitHub Pages", language: "JavaScript" }
  ]
};

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  publishedAt: "2026-11-01T12:00:00Z",
  resumeDownloadUrl: "/resume/",
  showAiAssistant: true,
  hiddenProjectIds: [],
  featuredProjectIds: ["celestial-observatory-3d", "file-organizer-ecosystem", "drishti-ai"]
};
