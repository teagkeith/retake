import type { ProTeam } from '../types/ProTeam';

export type CompetitiveRegion = 'Americas' | 'EMEA' | 'Pacific' | 'China';

export const mockProTeams: ProTeam[] = [
  {
    id: 'pro-team-nova',
    name: 'Nova Esports',
    region: 'Americas',
    active: true,
  },
  {
    id: 'pro-team-vitality',
    name: 'Team Vitality',
    region: 'Europe',
    active: true,
  },
  {
    id: 'pro-team-100thieves',
    name: '100Thieves',
    region: 'Americas',
    active: true,
  },
  {
    id: 'pro-team-fire-flux',
    name: 'Fire Flux Esports',
    region: 'Americas',
    active: true,
  },
  {
    id: 'pro-team-nrg',
    name: 'NRG',
    region: 'Americas',
    active: true,
  },
  {
    id: 'pro-team-leviatan',
    name: 'LEVIATAN',
    region: 'Americas',
    active: true,
  },
  {
    id: 'pro-team-g2',
    name: 'G2 Esports',
    region: 'Americas',
    active: true,
  },
  {
    id: 'pro-team-karmine-corp',
    name: 'Karmine Corp',
    region: 'Americas',
    active: true,
  },
];
