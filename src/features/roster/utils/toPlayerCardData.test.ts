import { describe, it, expect } from 'vitest';
import { toPlayerCardData } from './toPlayerCardData';
import type { ProPlayer } from '../../players/types/ProPlayer';
import type { PlayerPerformance } from '../types/PlayerPerformance';
;

describe('Player Card Adapter', () => {
  const player: ProPlayer = {
    id: 'player-1',
    name: 'Phantom',
    teamId: 'team-1',
    role: 'duelist',
    region: 'Americas',
    active: true,
  };

  const performance: PlayerPerformance = {
    id: 'performance-1',
    playerId: 'player-1',
    scoringWeekId: 'week-1',
    kills: 25,
    deaths: 12,
    assists: 8,
    fantasyPoints: 65.5,
  };

  const zeroPerformance: PlayerPerformance = {
    ...performance,
    fantasyPoints: 0,
  };

  it('returns null statistics when performance data is unavailable', () => {
    const result = toPlayerCardData(player, null, 'Nova Esports');

    expect(result.name).toBe('Phantom');
    expect(result.team).toBe('Nova Esports');
    expect(result.kills).toBeNull();
    expect(result.fantasyPoints).toBeNull();
  });
  it('returns the correct player performance data', () => {
    const result = toPlayerCardData(player, performance, 'Nova Esports');

    expect(result.kills).toBe(25);
    expect(result.deaths).toBe(12);
    expect(result.assists).toBe(8);
    expect(result.fantasyPoints).toBe(65.5);
  });it('preserves zero fantasy points', () => {
    const result = toPlayerCardData(player, zeroPerformance, 'Nova Esports');

    expect(result.fantasyPoints).toBe(0);
  });
  it('rejects performance belonging to another player', () => {
    const wrongPerformance: PlayerPerformance = {
      ...performance,
      playerId: 'player-999',
    };

    const result = toPlayerCardData(player, wrongPerformance, 'Nova Esports');

    expect(result.kills).toBeNull();
    expect(result.fantasyPoints).toBeNull();
  });
});
