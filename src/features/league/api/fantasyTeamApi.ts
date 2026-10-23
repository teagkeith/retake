export interface FantasyPlayer {
  id: string;
  displayName: string;
  gameId: string;
  gameName: string;
  verified: boolean;
}

export interface FantasyTeamResponse {
  id: string;
  name: string;
  rosterPlayerIds: string[];
  players: FantasyPlayer[];
}


export async function fetchFantasyTeam(
  teamId: string,
): Promise<FantasyTeamResponse> {
  const response = await fetch(
    `http://localhost:3001/api/teams/${encodeURIComponent(teamId)}`,
  );

  if (!response.ok) {
    throw new Error(`Could not load fantasy team (${response.status})`);
  }

  return (await response.json()) as FantasyTeamResponse;
}