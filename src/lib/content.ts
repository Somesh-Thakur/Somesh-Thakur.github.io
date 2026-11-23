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
    clip: { src: "/work/blood-oath-loop.mp4", poster: "/work/blood-oath-poster.jpg" },
    playLabel: "Insert coin: fight here",
    playNote: "grab your friends' phones first, they're the controllers",
    built:
      "Online fights use rollback netcode over WebRTC: each side predicts the other's inputs and rewinds up to 10 frames when it guesses wrong, so a match between India and the USA still feels local.",
    caseStudy: "/work/blood-oath/",
  },
  {
    id: "boomtown",
    title: "Boomtown Tycoon",
    line: "An Indian board game: buy cities from Patna to Mumbai and outplay your friends.",
    tags: ["Strategy", "Board game", "Browser"],
    href: "https://mark60a2.itch.io/boomtown-tycoon",
    uploadId: 20365245,
    shots: ["/games/boomtown-1.jpg", "/games/boomtown-2.jpg"],
    clip: null,
    playLabel: "Roll the dice: play here",
    playNote: "it's multiplayer, so bring friends",
    built: null,
    caseStudy: null,
  },
] as const;

/** Bigger games still in development. Their code is private for now, so they link to nothing. */
export const workbench = [
  {
    id: "strikepoint",
    title: "STRIKEPOINT",
    engine: "Godot 4.7, GDScript",
    what: "An online FPS (free-for-all and team deathmatch) for the web, PC and Android, with learnable recoil patterns, ADS, reloads and animated soldiers.",
    hard: "The host rewinds every player to where the shooter saw them before checking a hit (lag compensation), while clients predict their own movement and correct it when the host disagrees.",
    shot: "/work/strikepoint.webp",
    alt: "STRIKEPOINT: first-person view firing an M4 carbine at soldiers in a warehouse district",
  },
  {
    id: "triora",
    title: "Triora: The Search Begins",
    engine: "Godot 4.7, Jolt physics",
    what: "A 1 to 4 player co-op ocean survival story. Raise the anchor, trim the sail into the wind, patch leaks in a storm and sail between islands.",
    hard: "The Gerstner wave shader that draws the sea and the GDScript that floats the ship run the same maths, so the hull rides exactly the waves you see, and players can walk on a deck that is moving under them.",
    shot: "/work/triora.webp",
    alt: "Triora: a small sailing ship on a deep blue ocean with rolling waves",
  },
  {
    id: "coastline-drift",
    title: "Coastline Drift",
    engine: "Godot 4.7, 10 custom shaders",
    what: "An open-world drifting game on a 2 km island built in code, with 4,200 trees, a coastal ring road, six cars and rain and time of day.",
    hard: "Tuning drift handling that feels right on a keyboard, a gamepad and a racing wheel: each gets its own steering curve, assists and force feedback, while the Medium preset holds about 60 FPS on a laptop RTX 2050.",
    shot: "/work/coastline-drift.webp",
    alt: "Coastline Drift: a red sports car drifting across a concrete drift park with a speedometer",
  },
  {
    id: "mark-engine",
    title: "Mark Engine",
    engine: "My own engine: TypeScript, three.js",
    what: "A web game engine where a game is mostly YAML files, built so AI coding agents can make and test games. Its demo, Landfall, is a third-person shooter on a 360 m island.",
    hard: "Writing the enemy AI for Landfall: riflemen alert each other, keep their distance and fire in bursts. The engine also play-tests games in a headless browser and reports back a screenshot and the game state.",
    shot: "/work/mark-engine.webp",
    alt: "Mark Engine's Landfall demo: a soldier on a green island with enemy outposts",
  },
] as const;

/** Smaller projects, kept to one line each. Everything else is on GitHub. */
export const moreProjects = [
  {
    title: "TabDeck",
    what: "Turns an old Android tablet into a touch control panel and low-latency second screen for a Windows PC, over one USB cable.",
    href: "https://github.com/Somesh-Thakur/TabDeck",
  },
  {
    title: "GitPulse",
    what: "Explore any GitHub profile with a real 52-week contribution heatmap. Plain JavaScript, no dependencies.",
    href: "https://somesh-thakur.github.io/GitPulse/",
  },
  {
    title: "Tactical Armory",
    what: "A game-style store with rarity-tiered drops and a drag-and-drop loadout cart capped at 40 kg.",
    href: "https://github.com/Somesh-Thakur/Ecommerse-Website-Gaming-Theme",
  },
  {
    title: "Pro Invoice Gen",
    what: "An offline invoice maker with an Excel-backed database and updates that install themselves.",
    href: "https://github.com/Somesh-Thakur/Pro-Invoice-Gen",
  },
];
