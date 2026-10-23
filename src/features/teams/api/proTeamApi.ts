export interface ProTeamSummary {
  id: string;
  name: string;
  shortName: string | null;
  region: string | null;
  logoUrl: string | null;
}

export interface ObservedProPlayer {
  id: string;
  displayName: string;
  verified: boolean;
  source: string;
  observedAt: string;
}

export interface ProTeamDetails extends ProTeamSummary {
  observedPlayers: ObservedProPlayer[];
}

export async function fetchProTeams(gameId: string): Promise<ProTeamSummary[]> {
  const url = new URL('http://localhost:3001/api/pro-teams');

  url.searchParams.set('gameId', gameId);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch teams: ${response.status}`);
  }

  return response.json() as Promise<ProTeamSummary[]>;
}

export async function fetchProTeamDetails(
  teamId: string,
  signal?: AbortSignal,
): Promise<ProTeamDetails> {
  const response = await fetch(
    `http://localhost:3001/api/pro-teams/${encodeURIComponent(teamId)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch team details: ${response.status}`);
  }

  return response.json() as Promise<ProTeamDetails>;
}
