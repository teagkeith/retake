import { describe, expect, it } from 'vitest';

import { mockProPlayers } from './mockProPlayers';
import { mockPlayerPerformances } from './mockPlayerPerformances';
import { toPlayerCardData } from '../utils/toPlayerCardData';

describe('Mock Player Data Integration', () => {
  it('combines Phantom with his Week 1 performance', () => {
    const player = mockProPlayers.find((player) => player.id === 'player-5');

    const performance = mockPlayerPerformances.find(
      (performance) =>
        performance.playerId === 'player-5' && performance.scoringWeekId === 'week-1',
    );

    expect(player).toBeDefined();
    expect(performance).toBeDefined();

    if (!player || !performance) {
      throw new Error('Phantom mock data is missing');
    }

    const result = toPlayerCardData(player, performance, 'Nova Esports');

    expect(result).toEqual({
      id: 'player-5',
      name: 'Phantom',
      team: 'Nova Esports',
      role: 'duelist',
      kills: 58,
      deaths: 37,
      assists: 14,
      fantasyPoints: 108,
    });
  });
});
