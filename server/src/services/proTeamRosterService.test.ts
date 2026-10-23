import { describe, expect, it } from 'vitest';
import { filterLatestTeamObservations } from './proTeamRosterService.js';

describe('filterLatestTeamObservations', () => {
  it('removes a player from their old team after a transfer', () => {
    const observations = [
      {
        id: 'observation-1',
        playerId: 'mada',
        teamId: 'nrg',
        observedAt: new Date('2026-10-01'),
      },
      {
        id: 'observation-2',
        playerId: 'mada',
        teamId: 'team-b',
        observedAt: new Date('2026-10-20'),
      },
    ];

    const nrgRoster = filterLatestTeamObservations(observations, 'nrg');
    const newRoster = filterLatestTeamObservations(observations, 'team-b');

    expect(nrgRoster).toHaveLength(0);
    expect(newRoster).toHaveLength(1);
    expect(newRoster[0].playerId).toBe('mada');
  });

  it('does not duplicate players when their team stays the same', () => {
    const observations = [
      {
        id: 'observation-1',
        playerId: 'mada',
        teamId: 'nrg',
        observedAt: new Date('2026-10-01'),
      },
      {
        id: 'observation-2',
        playerId: 'mada',
        teamId: 'nrg',
        observedAt: new Date('2026-10-20'),
      },
    ];

    const roster = filterLatestTeamObservations(observations, 'nrg');

    expect(roster).toHaveLength(1);
    expect(roster[0].id).toBe('observation-2');
  });

  it('handles multiple players independently', () => {
    const observations = [
      {
        id: 'observation-1',
        playerId: 'mada',
        teamId: 'nrg',
        observedAt: new Date('2026-10-01'),
      },
      {
        id: 'observation-2',
        playerId: 'mada',
        teamId: 'team-b',
        observedAt: new Date('2026-10-20'),
      },
      {
        id: 'observation-3',
        playerId: 'player-2',
        teamId: 'nrg',
        observedAt: new Date('2026-10-21'),
      },
    ];

    const roster = filterLatestTeamObservations(observations, 'nrg');

    expect(roster).toHaveLength(1);
    expect(roster[0].playerId).toBe('player-2');
  });
});
