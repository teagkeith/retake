interface FantasyTeamResponse {
  id: string;
  name: string;
  rosterPlayerIds: string[];
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