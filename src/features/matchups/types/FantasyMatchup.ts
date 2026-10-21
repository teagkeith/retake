export type MatchupStatus = 'upcoming' | 'live' | 'final';

export interface FantasyMatchup {
  id: string;
  leagueId: string;
  scoringWeekId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchupStatus;
}
