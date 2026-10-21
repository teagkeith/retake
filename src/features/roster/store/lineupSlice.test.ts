import { describe, expect, it } from 'vitest';
import lineupReducer, { loadFantasyTeam, toggleStarter, saveLineup } from './lineupSlice';

describe('Lineup ownership validation', () => {
  it('loads a fantasy team and its owned players', () => {
    const state = lineupReducer(
      undefined,
      loadFantasyTeam({
        fantasyTeamId: 'fantasy-team-1',
        rosterPlayerIds: ['player-1', 'player-5'],
      }),
    );

    expect(state.fantasyTeamId).toBe('fantasy-team-1');
    expect(state.rosterPlayerIds).toEqual(['player-1', 'player-5']);
    expect(state.starterIds).toEqual([]);
  });

  it('rejects players not owned by the fantasy team', () => {
    const loadedState = lineupReducer(
      undefined,
      loadFantasyTeam({
        fantasyTeamId: 'fantasy-team-1',
        rosterPlayerIds: ['player-1', 'player-5'],
      }),
    );

    const result = lineupReducer(loadedState, toggleStarter('player-8'));

    expect(result.starterIds).toEqual([]);
    expect(result.err).toBe('This player is not on your fantasy roster.');
  });

  it('allows owned players to become starters', () => {
    const loadedState = lineupReducer(
      undefined,
      loadFantasyTeam({
        fantasyTeamId: 'fantasy-team-1',
        rosterPlayerIds: ['player-1', 'player-5'],
      }),
    );

    const result = lineupReducer(loadedState, toggleStarter('player-5'));

    expect(result.starterIds).toEqual(['player-5']);
    expect(result.err).toBe('');
  });
  it('clears the previous lineup when switching fantasy teams', () => {
    let state = lineupReducer(
      undefined,
      loadFantasyTeam({
        fantasyTeamId: 'fantasy-team-1',
        rosterPlayerIds: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
      }),
    );

    for (const playerId of state.rosterPlayerIds) {
      state = lineupReducer(state, toggleStarter(playerId));
    }

    state = lineupReducer(state, saveLineup());

    expect(state.savedStarterIds).toHaveLength(5);

    state = lineupReducer(
      state,
      loadFantasyTeam({
        fantasyTeamId: 'fantasy-team-2',
        rosterPlayerIds: ['player-6', 'player-7', 'player-8'],
      }),
    );

    expect(state.fantasyTeamId).toBe('fantasy-team-2');
    expect(state.rosterPlayerIds).toEqual(['player-6', 'player-7', 'player-8']);
    expect(state.starterIds).toEqual([]);
    expect(state.savedStarterIds).toEqual([]);
    expect(state.err).toBe('');
  });
});
