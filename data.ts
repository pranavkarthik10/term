// Personal data for the TUI, sourced from pranavkarthik.com (~/personalv8)

export const PROFILE = {
  name: "Pranav Karthik",
  tagline: "Building agentic experiences for web, mobile & spatial",
  since: "Building since 2019",
  bio: "Fourth-year Computer Science student at UBC, passionate about building agentic experiences on the web, mobile, and spatial interfaces.",
  site: "pranavkarthik.com",
  github: "github.com/pranavkarthik10",
  x: "x.com/pranavkarthik__",
  linkedin: "linkedin.com/in/pranav-karthik",
  email: "me@pranavkarthik.com",
} as const;

export type Ship = {
  name: string;
  type: string;
  year: number;
  description: string;
  url?: string;
  github?: string;
  stack: string[];
  awards?: string[];
};

// Ordered most-recent first, mirroring "RECENT SHIPS"
export const SHIPS: Ship[] = [
  {
    name: "sim-grab",
    type: "Devtool",
    year: 2026,
    description:
      "Select context for coding agents from native iOS apps through a live simulator inspector.",
    url: "https://github.com/pranavkarthik10/sim-grab",
    github: "https://github.com/pranavkarthik10/sim-grab",
    stack: ["TypeScript", "Swift", "JavaScript"],
  },
  {
    name: "pdfp",
    type: "CLI",
    year: 2026,
    description:
      "Fast PDF compression CLI with an interactive terminal UI, quality presets, and batch processing.",
    github: "https://github.com/pranavkarthik10/pdfp",
    stack: ["TypeScript", "Node.js", "Ghostscript"],
  },
  {
    name: "LazyCal",
    type: "TUI",
    year: 2026,
    description:
      "Terminal Google Calendar client with day/week/month views, keyboard-first nav, and live sync.",
    url: "https://www.npmjs.com/package/lazycal",
    github: "https://github.com/pranavkarthik10/lazycal",
    stack: ["TypeScript", "OpenTUI", "Google Calendar API"],
  },
  {
    name: "vercel.ts",
    type: "Devtool",
    year: 2025,
    description:
      "Programmatic project configuration for Vercel projects through a typed TypeScript file.",
    url: "https://vercel.com/changelog/vercel-ts",
    stack: ["TypeScript", "Vercel"],
  },
  {
    name: "GrokHunt",
    type: "Platform",
    year: 2025,
    description:
      "AI-powered recruiting platform that autonomously discovers and evaluates developers with Grok.",
    url: "https://devpost.com/software/grokhunt",
    stack: ["Next.js", "Python", "Grok API"],
    awards: ["xAI Hackathon · Featured by xAI"],
  },
  {
    name: "Google Workspace Marketplace",
    type: "Product",
    year: 2024,
    description:
      "Featured partner apps experience for the Google Workspace Marketplace homepage.",
    url: "https://workspace.google.com/marketplace",
    stack: ["Java", "HTML", "Concurrency"],
  },
  {
    name: "Interconnected",
    type: "App",
    year: 2024,
    description:
      "Interactive graph-theory playground with a custom physics simulation and drag-and-drop graphs.",
    stack: ["SwiftUI", "CoreGraphics", "Combine"],
    awards: ["Distinguished Winner · Apple Swift Student Challenge"],
  },
  {
    name: "TravoAI",
    type: "Web App",
    year: 2023,
    description:
      "Full-stack app for AI-generated travel plans with streaming responses and a modern React UI.",
    url: "https://travoai.com",
    github: "https://github.com/pranavkarthik10/travoai",
    stack: ["React.js", "Node.js", "OpenAI API"],
    awards: ["StormHacks"],
  },
  {
    name: "DiscordSwiftUI",
    type: "Experiment",
    year: 2020,
    description:
      "A native SwiftUI Discord client experiment recreating chat, servers, channels, and platform UI.",
    github: "https://github.com/pranavkarthik10/DiscordSwiftUI",
    stack: ["SwiftUI", "Swift", "iOS", "macOS"],
  },
  {
    name: "Trackr",
    type: "iOS App",
    year: 2019,
    description:
      "Assignment-management iOS app with tens of thousands of App Store downloads and Siri integration.",
    url: "https://apps.apple.com/app/trackr/id1481234567",
    github: "https://github.com/pranavkarthik10/trackr",
    stack: ["UIKit", "CoreData", "SiriKit"],
  },
];

export const EXPERIENCE = [
  { company: "Vercel", role: "Software Engineering Intern", when: "Sep–Dec 2025", where: "San Francisco, CA" },
  { company: "Google", role: "Software Engineering Intern", when: "May–Aug 2025", where: "Seattle, WA" },
  { company: "Google", role: "STEP Intern", when: "May–Aug 2024", where: "Waterloo, ON" },
  { company: "Apple", role: "Swift Student Challenge Winner", when: "2022–2024", where: "Remote" },
  { company: "DYNE", role: "App Development Intern", when: "May–Aug 2023", where: "Vancouver, BC" },
];

export const EDUCATION = {
  institution: "University of British Columbia",
  degree: "B.Sc. Computer Science",
  when: "2022 – 2026",
  where: "Vancouver, BC",
};
