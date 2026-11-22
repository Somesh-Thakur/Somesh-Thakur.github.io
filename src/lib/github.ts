// Read at build time (and on the daily rebuild) for the "right now" sticky note.
// In GitHub Actions the built-in GITHUB_TOKEN lifts the 60-requests-an-hour limit.
// Any failure just hides the note; the build never breaks because of it.

const USER = "Somesh-Thakur";

export type Activity = {
  repo: string;
  repoUrl: string;
  message: string | null;
  when: string; // ISO date of the latest push
  pushesThisWeek: number;
  publicRepos: number | null;
};

async function gh<T>(path: string): Promise<T | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(`https://api.github.com${path}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "someshthakur-tech-build",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

type Event = { type: string; repo: { name: string }; created_at: string; payload: { head?: string } };

export async function getActivity(): Promise<Activity | null> {
  const [events, user] = await Promise.all([
    gh<Event[]>(`/users/${USER}/events/public?per_page=50`),
    gh<{ public_repos: number }>(`/users/${USER}`),
  ]);
  if (!Array.isArray(events)) return null;

  // Pushes to this site's own repo are mostly deploys, so the note skips them.
  const pushes = events.filter((e) => e.type === "PushEvent" && e.repo.name !== `${USER}/${USER}.github.io`);
  const latest = pushes[0];
  if (!latest) return null;

  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const commit = latest.payload.head
    ? await gh<{ commit: { message: string } }>(`/repos/${latest.repo.name}/commits/${latest.payload.head}`)
    : null;

  return {
    repo: latest.repo.name.split("/")[1],
    repoUrl: `https://github.com/${latest.repo.name}`,
    message: commit?.commit.message.split("\n")[0].slice(0, 90) ?? null,
    when: latest.created_at,
    pushesThisWeek: pushes.filter((e) => Date.parse(e.created_at) > weekAgo).length,
    publicRepos: user?.public_repos ?? null,
  };
}
