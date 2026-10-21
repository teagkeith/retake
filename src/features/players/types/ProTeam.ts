export type CompetitiveRegion = 'Americas' | 'EMEA' | 'Pacific' | 'China';

export interface ProTeam {
  id: string;
  name: string;
  region: CompetitiveRegion;
  active: boolean;
}
