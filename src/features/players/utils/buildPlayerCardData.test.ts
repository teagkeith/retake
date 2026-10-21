import { describe, expect, it } from 'vitest';

import { buildPlayerCardData } from './buildPlayerCardData';

import { mockProPlayers } from '../data/mockProPlayers';
import { mockProTeams } from '../data/mockProTeams';
import { mockPlayerPerformances } from '../data/mockPlayerPerformances';

describe('Player Card Dataset Builder', () => {
  it('builds display data for all eight mock players', () => {
    const result = buildPlayerCardData(
      mockProPlayers,
      mockProTeams,
      mockPlayerPerformances,
      'week-1',
    );

    expect(result).toHaveLength(8);
    expect(result.find((player) => player.id === 'player-5')?.name).toBe('brawk');
    expect(result.find((player) => player.id === 'player-5')?.team).toBe('NRG');
  });
  it('preserves players with missing performance data', () => {
    const result = buildPlayerCardData(mockProPlayers, mockProTeams, [], 'week-1');

    expect(result).toHaveLength(8);
    expect(result[0].fantasyPoints).toBeNull();
    expect(result[0].kills).toBeNull();
  });
  it('rejects players with unknown professional teams', () => {
    const invalidPlayer = {
      ...mockProPlayers[0],
      teamId: 'pro-team-nonexistent',
    };

    expect(() =>
      buildPlayerCardData([invalidPlayer], mockProTeams, mockPlayerPerformances, 'week-1'),
    ).toThrow('could not be found');
  });
});
