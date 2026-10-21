export type ScoringWeekStatus = 'upcoming' | 'active' | 'completed';

export interface ScoringWeek {
  id: string;
  leagueId: string;
  weekNumber: number;
  startsAt: string;
  endsAt: string;
  status: ScoringWeekStatus;
}
