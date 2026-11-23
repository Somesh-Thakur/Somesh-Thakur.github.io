// Real numbers for "Counted so far", read at build time (and on the daily rebuild).
// Every source is optional: anything that can't be fetched is simply left out.
//  - GitHub: GITHUB_TOKEN (given to every GitHub Actions run) lifts the rate limit and
//    lets us read the contribution calendar.
//  - itch.io: ITCH_API_KEY (a repo secret) unlocks views and downloads for each game.
//    It is only used here, on the build machine, and never reaches the browser.

const USER = "Somesh-Thakur";

export type GameStats = { views: number; plays: number };
export type Stats = {
  contributions: number | null; // past 12 months, as on the GitHub profile
  publicRepos: number | null;
  stars: number | null;
  itch: Record<string, GameStats>; // keyed by itch.io slug, e.g. "blood-oath"
};

async function getJson<T>(url: string, init: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function ghHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "someshthakur-tech-build",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function github() {
  const [user, repos] = await Promise.all([
    getJson<{ public_repos: number }>(`https://api.github.com/users/${USER}`, { headers: ghHeaders() }),
    getJson<{ stargazers_count: number; fork: boolean }[]>(
      `https://api.github.com/users/${USER}/repos?per_page=100&type=owner`,
      { headers: ghHeaders() },
    ),
  ]);

  let contributions: number | null = null;
  if (process.env.GITHUB_TOKEN) {
    const q = `query { user(login: "${USER}") { contributionsCollection { contributionCalendar { totalContributions } } } }`;
    const data = await getJson<{ data?: { user?: { contributionsCollection: { contributionCalendar: { totalContributions: number } } } } }>(
      "https://api.github.com/graphql",
      { method: "POST", headers: { ...ghHeaders(), "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) },
    );
    contributions = data?.data?.user?.contributionsCollection.contributionCalendar.totalContributions ?? null;
  }

  return {
    contributions,
    publicRepos: user?.public_repos ?? null,
    stars: Array.isArray(repos) ? repos.filter((r) => !r.fork).reduce((n, r) => n + r.stargazers_count, 0) : null,
  };
}

type ItchGame = { url: string; views_count: number; downloads_count: number };

async function itch(): Promise<Record<string, GameStats>> {
  const key = process.env.ITCH_API_KEY;
  if (!key) return {};
  const data = await getJson<{ games?: ItchGame[] }>(`https://itch.io/api/1/${key}/my-games`);
  const out: Record<string, GameStats> = {};
  for (const g of data?.games ?? []) {
    const slug = g.url.split("/").filter(Boolean).pop();
    // For browser games itch.io counts a "download" each time someone starts the game.
    if (slug) out[slug] = { views: g.views_count, plays: g.downloads_count };
  }
  return out;
}

export async function getStats(): Promise<Stats> {
  const [gh, it] = await Promise.all([github(), itch()]);
  return { ...gh, itch: it };
}

/** 1234 -> "1,234", 12500 -> "12.5k" */
export function fmtCount(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return n.toLocaleString("en-IN");
}
