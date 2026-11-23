// Case studies for the flagship projects. Every number and story here comes from the
// project's own code, README or build notes; nothing is estimated.

export type DiagramLane = {
  label?: string;
  nodes: { title: string; sub?: string }[];
  links: string[]; // the label on the arrow between node i and node i+1
};

export type CaseStudy = {
  slug: string;
  title: string;
  headline: string;
  summary: string;
  role: string;
  stack: string;
  facts: { n: string; label: string }[];
  itchSlug?: string; // adds a live "views on itch.io" fact when the key is set
  media:
    | { kind: "video"; src: string; poster: string; alt: string; w: number; h: number }
    | { kind: "image"; src: string; alt: string; w: number; h: number };
  problem: string[];
  diagram: DiagramLane[];
  how: string[];
  bug: { title: string; symptom: string; cause: string; fix: string };
  bug2?: { title: string; symptom: string; cause: string; fix: string };
  change: string[];
  links: { label: string; href: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "blood-oath",
    title: "Blood Oath",
    headline: "Making phones work as controllers, and online fights feel local",
    summary:
      "Blood Oath is a 2.5D weapons fighting game that runs in the browser. Anyone at a party can scan a QR code and use their phone as the controller, and two players on different continents can fight online without the lag you'd expect.",
    role: "Solo: design, code, art direction, netcode",
    stack: "TypeScript, three.js, WebRTC (PeerJS), WebSocket, Vite, Cloudflare Pages",
    itchSlug: "blood-oath",
    facts: [
      { n: "60 Hz", label: "deterministic simulation, the same on every machine" },
      { n: "10", label: "frames of rollback before the game waits for the other player" },
      { n: "10", label: "people in one party lobby: 2 fight, 8 watch live" },
      { n: "240 KB", label: "whole game, gzipped" },
    ],
    media: {
      kind: "video",
      src: "/work/blood-oath-loop.mp4",
      poster: "/work/blood-oath-poster.jpg",
      alt: "Blood Oath gameplay: two fighters trading weapon strikes in a temple",
      w: 720,
      h: 406,
    },
    problem: [
      "Fighting games are best on one couch, but most people don't own two controllers. And when they play online instead, a few frames of lag make the timing they practised useless.",
      "I wanted a game you could start at a party with nothing but the phones already in everyone's pockets, that still plays properly against a friend in another country.",
    ],
    diagram: [
      {
        label: "At a party",
        nodes: [
          { title: "Phone", sub: "touch pad page, no app" },
          { title: "Game tab", sub: "on the laptop or TV" },
        ],
        links: ["buttons, 20 times a second"],
      },
      {
        label: "Inside every game",
        nodes: [
          { title: "Inputs", sub: "keyboard, pad, phones" },
          { title: "Fight engine", sub: "integer maths, 60 Hz" },
          { title: "three.js renderer", sub: "rigs, IK, gore, camera" },
        ],
        links: ["one bitmask per frame", "state + events"],
      },
      {
        label: "Online",
        nodes: [
          { title: "Player A" },
          { title: "Player B" },
          { title: "Spectators", sub: "replay a few frames behind" },
        ],
        links: ["inputs both ways over WebRTC", "confirmed frames"],
      },
    ],
    how: [
      "The fight engine only ever sees one number per player per frame: a bitmask of the buttons held. It uses integer maths, so the same inputs give the same fight on every computer and phone.",
      "That makes online play cheap. Each side sends only its inputs, guesses the other player's (\"they're still holding what they held\"), and when the real input arrives and differs, it rewinds to that frame and re-simulates. The local player's own input is delayed by 2 frames to make wrong guesses rarer.",
      "Every 2 seconds both sides compare a checksum of the game state, so a desync is caught instead of quietly turning into two different fights.",
      "Party spectators don't need their own connection to the fight. The fighter hosting the link streams every confirmed frame of inputs to the party host, and each spectator replays the same simulation a few frames behind. Watching adds no lag for the players.",
    ],
    bug: {
      title: "Phones stuck on \"connecting\" over a laptop hotspot",
      symptom:
        "The controller page loaded on the phone, but it sat on \"connecting\" forever. The phone was on the laptop's own hotspot, so the network clearly worked.",
      cause:
        "Two problems stacked up. First, the laptop was on two networks at once (college Wi-Fi and its own hotspot), and the QR code pointed at the Wi-Fi address, which the phone couldn't reach. Fixing that got the page to load, but the direct phone-to-laptop WebRTC link still never formed: browsers hide their local IP behind a random \".local\" name for privacy, and phones on a Windows hotspot usually can't look that name up.",
      fix:
        "The QR code now prefers the hotspot address. When the game runs on a laptop, the phone sends its buttons through the same local server that served it the controller page, over a WebSocket, which works on hotspots and on Wi-Fi that blocks device-to-device traffic. The deployed site still connects directly over WebRTC.",
    },
    bug2: {
      title: "\"Connected\", but no button did anything",
      symptom: "After a phone reloaded the page, it showed \"Player 2 connected\", yet nothing it pressed moved the fighter.",
      cause:
        "Phones don't say goodbye when they reload or the screen sleeps. The game kept the Player 1 slot reserved for the old, dead connection, so the phone came back as Player 2, and single-player modes only listened to Player 1.",
      fix:
        "Phones send their buttons 20 times a second, so 1.5 seconds of silence now frees the slot, and a returning phone gets Player 1 back. Single-player modes accept input from any connected phone.",
    },
    change: [
      "Test on real phones much earlier. Both bugs above were invisible with browser tabs standing in for phones.",
      "Ship a TURN relay by default. Some strict college and office networks block direct connections, and right now players there need to set one up themselves.",
      "Swap the fighters, which are modelled in code, for rigged models with motion-captured animation. The fight engine and netcode wouldn't need to change, because they never touch the visuals.",
    ],
    links: [
      { label: "Play Blood Oath on itch.io", href: "https://mark60a2.itch.io/blood-oath" },
    ],
  },
  {
    slug: "spindle",
    title: "Spindle",
    headline: "One music library, kept in sync across a phone, a browser and a desktop app",
    summary:
      "Spindle is my own music player. It plays full songs with live lyrics (with a Hinglish switch), has a karaoke mode, and keeps your library and playlists the same on your phone, in a browser and in a Windows app.",
    role: "Solo: product, design, front end, back end, desktop app",
    stack: "React 18, TypeScript, Vite, Supabase (Postgres, Auth, Realtime), Tauri 2 (Rust), service worker",
    facts: [
      { n: "3", label: "platforms from one codebase: phone, web, Windows" },
      { n: "9", label: "Indian languages the Hinglish switch romanises" },
      { n: "10 MB", label: "memory used by the desktop app's own Rust code" },
      { n: "1", label: "JSON document per library, merged entry by entry" },
    ],
    media: { kind: "image", src: "/work/spindle.webp", alt: "Spindle logo: a turntable icon and the line \"Every record you love. On every screen.\"", w: 960, h: 504 },
    problem: [
      "Every music app I used either played previews instead of full songs, didn't show lyrics in a script I can read quickly, or kept a different library on each device.",
      "I wanted one player that opens on my phone, my PC and in any browser, where adding a song on one shows up on the others a second later.",
    ],
    diagram: [
      {
        label: "Everywhere you listen",
        nodes: [
          { title: "Phone", sub: "installed web app" },
          { title: "Browser", sub: "the same React app" },
          { title: "Windows", sub: "Tauri window around the site" },
        ],
        links: ["same code", "same code"],
      },
      {
        label: "Keeping them in sync",
        nodes: [
          { title: "Device", sub: "sends only what changed" },
          { title: "Supabase", sub: "merges per entry, newest wins" },
          { title: "Other devices", sub: "told to pull by Realtime" },
        ],
        links: ["changed entries", "\"something changed\""],
      },
    ],
    how: [
      "Each library is one JSON document of keyed entries: songs, playlists, liked tracks. A device sends only the entries it changed. The database merges them one by one, newest wins, and deletions carry over, so two devices editing different playlists never overwrite each other.",
      "Supabase Realtime then tells the other devices that something changed, and they pull the new entries. Row-level security keeps every library private to its owner.",
      "The Windows app is a small Tauri window around the live site, using the browser engine already on the PC. The installer is a few MB, and it updates whenever the site does.",
      "To play a song in full, Spindle asks several search sources at once, scores the results on title, artist and length, and remembers the best match. That match syncs too, so replays start instantly on every device.",
    ],
    bug: {
      title: "The app opened as the mini player, with no styling",
      symptom:
        "On a slow connection, opening Spindle showed the tiny mini-player page instead of the app, and as plain unstyled text.",
      cause:
        "Two bugs in the offline copy I'd added so the app opens fast on slow internet. It saved every page under the main page's name, so the last page saved (the mini player) became \"the app\". And the saved styles and scripts were stored but never found, because the server sends a Vary: Origin header that made the cached copies not match.",
      fix:
        "Each page is now saved under its own address, bad saved copies are thrown away automatically, and cached files are matched correctly again. I tested it on a local production copy with the server switched off: the main address opened the full, styled app.",
    },
    change: [
      "Design offline mode from the start. The bug above came from bolting a saved copy onto an app that wasn't built for it.",
      "Measure memory before choosing a stack. The desktop app's own Rust code uses about 10 MB, but the full app uses about 510 MB, almost all of it the web engine and the player inside it. Rewriting in more Rust wouldn't change that.",
    ],
    links: [
      { label: "Open Spindle", href: "https://someshthakur.tech/spindle/" },
      { label: "Read the code", href: "https://github.com/Somesh-Thakur/spindle" },
    ],
  },
  {
    slug: "toonreel",
    title: "ToonReel",
    headline: "Turning a written skit into a lip-synced cartoon reel, in Hinglish",
    summary:
      "ToonReel is a free, open-source skill for AI coding agents. You write a skit as a JSON file, and it produces a 1080×1920 cartoon reel with voices, lip-sync, captions and sound. I built it to make Instagram reels for a real-estate business in Pune.",
    role: "Solo: pipeline, renderer, characters, web studio",
    stack: "Remotion (React), three.js, Python, Edge neural voices / Kokoro, faster-whisper, ffmpeg",
    facts: [
      { n: "11", label: "finished reels made with it for a real business" },
      { n: "400+", label: "free voices and accents, Hindi and Hinglish included" },
      { n: "5 + 3", label: "2D and 3D sets" },
      { n: "0", label: "subscriptions or watermarks" },
    ],
    media: {
      kind: "video",
      src: "/work/toonreel-loop.mp4",
      poster: "/work/toonreel-poster.jpg",
      alt: "A reel made with ToonReel: a street chef at a food cart in the rain, with a crowd and captions",
      w: 360,
      h: 640,
    },
    problem: [
      "A real-estate business needed a steady stream of Instagram reels. Funny cartoon skits get watched far more than property walkthroughs, but hiring an animator for every reel isn't realistic, and most AI video tools cost money, add watermarks or can't do Hindi.",
      "So I wanted a pipeline where an AI agent writes the skit and the code does the rest, free and on my own computer.",
    ],
    diagram: [
      {
        label: "From script to reel",
        nodes: [
          { title: "Skit JSON", sub: "cast, lines, scenes, beats" },
          { title: "Voices", sub: "per-word timings" },
          { title: "Whisper check", sub: "transcribe every line back" },
        ],
        links: ["text to speech", "catch bad words"],
      },
      {
        nodes: [
          { title: "Remotion", sub: "2D SVG or 3D three.js" },
          { title: "ffmpeg", sub: "voices, crowd, sound effects" },
          { title: "1080×1920 MP4" },
        ],
        links: ["frames", "mixed audio"],
      },
    ],
    how: [
      "A skit is a JSON file: a cast with voices and looks, and a list of beats (who speaks, the camera shot, rain, a crowd cheering, a sticker, a quiz board). An agent writes it from a one-line request.",
      "Every line is voiced with a free neural voice, which also gives exact timings for each word. Those timings drive the word-by-word captions.",
      "Characters are drawn in React with Remotion: flat 2D characters as SVG, or blocky 3D characters in three.js. Their mouths open with the loudness of their own voice track, so the lip-sync follows the real audio.",
      "ffmpeg lines up each voice, the crowd and the sound effects at the right moment and mixes the final reel.",
    ],
    bug: {
      title: "Hinglish lines that came out wrong",
      symptom:
        "The voices read pure Hindi or pure English well, but mixed lines like the ones people actually speak in reels came out blurred or with words missing. You'd only notice after the whole reel rendered.",
      cause:
        "Text-to-speech voices are trained on one language. Hindi words written in English letters, or English words inside a Hindi sentence, get guessed at, and short words get swallowed.",
      fix:
        "A checker now voices every line before rendering and has Whisper transcribe it back twice, once in Hindi script and once in English, so you can see exactly how each word was said. In one reel it caught three bad lines: \"small si cart\" blurred together and became \"cart bahut small hai\", and \"upar se rain\" got lost and was reworded. Numbers and prices are always written in English, because that's how people say them.",
    },
    change: [
      "Drive the mouths from the sounds being made (visemes) instead of loudness alone. Loudness looks right at reel speed, but a closer shot would show it.",
      "Make the pronunciation check fix lines by itself and re-check, instead of only reporting them.",
    ],
    links: [
      { label: "Try the studio", href: "https://someshthakur.tech/toonreel/" },
      { label: "Read the code", href: "https://github.com/Somesh-Thakur/toonreel" },
    ],
  },
];
