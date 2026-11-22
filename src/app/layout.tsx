import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./extras.css";

const title = "Somesh Thakur's sketchbook";
const description =
  "Somesh Thakur makes free browser games and the apps around them. First-year CSE (Gaming Tech) student at SRM KTR.";

export const metadata: Metadata = {
  metadataBase: new URL("https://someshthakur.tech"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "https://someshthakur.tech",
    siteName: "Somesh Thakur",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Somesh Thakur's sketchbook: I make free browser games and the apps around them" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#f3eee2" };

// Add `draw-ready` before first paint so lines start hidden and ink in.
// Without JS, or with reduced motion, the sketchbook is already fully drawn.
const boot = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('draw-ready')}catch(e){}`;

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Somesh Sanjay Thakur",
  alternateName: "Mark60a2",
  email: "mailto:someshrthakur@gmail.com",
  url: "https://someshthakur.tech",
  image: "https://someshthakur.tech/pfp.webp",
  jobTitle: "Full-stack developer and game maker",
  affiliation: { "@type": "CollegeOrUniversity", name: "SRM Institute of Science and Technology, Kattankulathur" },
  sameAs: [
    "https://github.com/Somesh-Thakur",
    "https://www.linkedin.com/in/somesh-thakur-30r07/",
    "https://mark60a2.itch.io",
    "https://instagram.com/mark60a2",
    "https://instagram.com/itz__somesh_thakur",
    "https://www.youtube.com/@Mark60a2",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link rel="preload" href="/fonts/shantell-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/nanum-pen-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
