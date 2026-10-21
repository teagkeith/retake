import { describe, expect, it } from 'vitest';
import { getProTeamById } from './getProTeamById';
import { mockProTeams } from '../data/mockProTeams';

describe('Professional Team Lookup', () => {
  it('returns the correct team for a valid ID', () => {
    const result = getProTeamById(mockProTeams, 'pro-team-nova');

    expect(result?.name).toBe('Nova Esports');
  });
  it('verify that looking up a nonexistent team ID returns undefined', () => {
    const result = getProTeamById(mockProTeams, 'pro-team-test');

    expect(result?.name).toBe(undefined);
  });
});
