export type LeagueStatus = 'forming' | 'drafting' | 'active' | 'completed';

export interface FantasyLeague {
  id: string;
  name: string;
  commissionerId: string;
  season: string;
  maxTeams: number;
  teamIds: string[];
  status: LeagueStatus;
}
