import type { ProTeam } from '../types/ProTeam';

export function getProTeamById(teams: ProTeam[], teamId: string): ProTeam | undefined {
  return teams.find((team) => team.id === teamId);
}
