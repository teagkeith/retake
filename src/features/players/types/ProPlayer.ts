export type PlayerRole = 'duelist' | 'initiator' | 'controller' | 'sentinel' | 'flex';

export interface ProPlayer {
  id: string;
  name: string;
  teamId: string;
  role: PlayerRole;
  region: string;
  active: boolean;
}
