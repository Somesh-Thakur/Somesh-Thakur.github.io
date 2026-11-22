export const socials = [
  { id: "email", label: "Email", handle: "someshrthakur@gmail.com", href: "mailto:someshrthakur@gmail.com", icon: "envelope" },
  { id: "insta-games", label: "Instagram (games)", handle: "@mark60a2", href: "https://instagram.com/mark60a2", icon: "camera" },
  { id: "insta-me", label: "Instagram (me)", handle: "@itz__somesh_thakur", href: "https://instagram.com/itz__somesh_thakur", icon: "camera" },
  { id: "linkedin", label: "LinkedIn", handle: "somesh-thakur-30r07", href: "https://www.linkedin.com/in/somesh-thakur-30r07/", icon: "briefcase" },
  { id: "github", label: "GitHub", handle: "Somesh-Thakur", href: "https://github.com/Somesh-Thakur", icon: "brackets" },
  { id: "itch", label: "itch.io", handle: "mark60a2", href: "https://mark60a2.itch.io", icon: "gamepad" },
  { id: "youtube", label: "YouTube", handle: "@Mark60a2", href: "https://www.youtube.com/@Mark60a2", icon: "play" },
  { id: "discord", label: "Discord", handle: "Join the server", href: "https://discord.gg/kr4euTBVzt", icon: "bubble" },
] as const;

export const games = [
  {
    id: "blood-oath",
    title: "Blood Oath",
    line: "A brutal fighting game for game night. Everyone's phone becomes their controller.",
    tags: ["Fighting", "Local multiplayer", "Browser"],
    href: "https://mark60a2.itch.io/blood-oath",
    uploadId: 20277447,
    shots: ["/games/blood-oath-1.jpg", "/games/blood-oath-2.jpg"],
    playNote: "grab your friends' phones first, they're the controllers",
  },
  {
    id: "boomtown",
    title: "Boomtown Tycoon",
    line: "An Indian board game: buy cities from Patna to Mumbai and outplay your friends.",
    tags: ["Strategy", "Board game", "Browser"],
    href: "https://mark60a2.itch.io/boomtown-tycoon",
    uploadId: 20365245,
    shots: ["/games/boomtown-1.jpg", "/games/boomtown-2.jpg"],
    playNote: "it's multiplayer, so bring friends",
  },
] as const;

export type Project = {
  title: string;
  what: string;
  stack: string;
  code?: string;
  live?: string;
};

export const drawers: { name: string; note: string; items: Project[] }[] = [
  {
    name: "For the web",
    note: "things that live in a browser tab",
    items: [
      {
        title: "Tactical Armory",
        what: "A gaming-style store with rarity-tiered drops, 3D tilt cards and a drag-and-drop loadout cart capped at 40 kg. Checkout runs on Stripe test mode.",
        stack: "Next.js 16, Tailwind v4, Framer Motion, Zustand, Supabase, Stripe",
        code: "https://github.com/Somesh-Thakur/Ecommerse-Website-Gaming-Theme",
      },
      {
        title: "GitPulse",
        what: "Explore any GitHub profile: a real 52-week contribution heatmap, live API stats and ⌘K search. No frameworks, no dependencies.",
        stack: "HTML, CSS, JavaScript",
        code: "https://github.com/Somesh-Thakur/GitPulse",
        live: "https://somesh-thakur.github.io/GitPulse/",
      },
      {
        title: "Jumpee",
        what: "A small game website.",
        stack: "TypeScript",
        code: "https://github.com/Somesh-Thakur/Jumpee",
        live: "https://somesh-thakur.github.io/Jumpee/",
      },
      {
        title: "Velmora",
        what: "A calm space for people who think deeply and feel intensely: understand your thoughts, let go of what weighs you down.",
        stack: "JavaScript",
        code: "https://github.com/Somesh-Thakur/Velmora.Ai",
      },
      {
        title: "Kargil Realtor",
        what: "Website for a business renting out commercial spaces in East Pune.",
        stack: "HTML, CSS",
        code: "https://github.com/Somesh-Thakur/kargil-realtor",
      },
    ],
  },
  {
    name: "For the desktop",
    note: "installed, double-clicked, used daily",
    items: [
      {
        title: "TabDeck",
        what: "Turns an old Android tablet into a touch control panel for a Windows PC: live stats, app launcher, now playing, a low-latency second screen, and mic and speaker passthrough. One USB cable, no Wi-Fi.",
        stack: "Python",
        code: "https://github.com/Somesh-Thakur/TabDeck",
      },
      {
        title: "Pro Invoice Gen",
        what: "A fast offline invoice maker with an Excel-backed database, print-perfect layouts and updates that install themselves.",
        stack: "Python, HTML, JavaScript",
        code: "https://github.com/Somesh-Thakur/Pro-Invoice-Gen",
        live: "https://professional-invoice-gen.vercel.app",
      },
    ],
  },
  {
    name: "Little tools and bots",
    note: "made because I needed them",
    items: [
      {
        title: "SRM timetable extractor",
        what: "Turns an SRM class timetable into a clean page you can actually read.",
        stack: "HTML, JavaScript",
        code: "https://github.com/Somesh-Thakur/SRM-Timetable-extractor",
      },
      {
        title: "Gaming UI set",
        what: "An admin dashboard, a to-do app and a weather app, all wearing the same game HUD.",
        stack: "TypeScript, React",
        code: "https://github.com/Somesh-Thakur/Admin-Dashboard-Gaming-Theme",
      },
    ],
  },
];
