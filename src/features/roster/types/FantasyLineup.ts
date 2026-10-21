export type LineupStatus = 'draft' | 'submitted' | 'locked';

export interface FantasyLineup {
  id: string;
  fantasyTeamId: string;
  scoringWeekId: string;
  starterPlayerIds: string[];
  lockedAt: string | null;
  status: LineupStatus;
}
