export function getLineupKey(fantasyTeamId: string, scoringWeekId: string): string {
  return `${fantasyTeamId}:${scoringWeekId}`;
}
