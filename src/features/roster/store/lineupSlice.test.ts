import { describe, expect, it } from 'vitest';
import lineupReducer, {
  loadFantasyTeam,
  lockCurrentLineup,
  saveDraft,
  selectScoringWeek,
  submitCurrentLineup,
  toggleStarter,
} from './lineupSlice';

const timing = {
  scoringWeekStartsAt: '2026-11-01T18:00:00Z',
  currentTime: '2026-11-01T17:00:00Z',
};

const teamOne = {
  fantasyTeamId: 'fantasy-team-1',
  rosterPlayerIds: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
};

const teamTwo = {
  fantasyTeamId: 'fantasy-team-2',
  rosterPlayerIds: ['player-6', 'player-7', 'player-8'],
};

const selectPlayer = (playerId: string) =>
  toggleStarter({
    playerId,
    ...timing,
  });

function createTeamState() {
  let state = lineupReducer(undefined, loadFantasyTeam(teamOne));
  state = lineupReducer(state, selectScoringWeek('week-1'));
  return state;
}

function createSubmittedState() {
  let state = createTeamState();

  for (const playerId of teamOne.rosterPlayerIds) {
    state = lineupReducer(state, selectPlayer(playerId));
  }

  state = lineupReducer(state, submitCurrentLineup(timing));

  return state;
}

describe('Lineup ownership validation', () => {
  it('loads a fantasy team and its owned players', () => {
    const state = lineupReducer(undefined, loadFantasyTeam(teamOne));

    expect(state.fantasyTeamId).toBe('fantasy-team-1');
    expect(state.rosterPlayerIds).toEqual(teamOne.rosterPlayerIds);
    expect(state.starterIds).toEqual([]);
  });

  it('rejects players not owned by the fantasy team', () => {
    const state = createTeamState();
    const result = lineupReducer(state, selectPlayer('player-8'));

    expect(result.starterIds).toEqual([]);
    expect(result.err).toBe('This player is not on your fantasy roster.');
  });

  it('allows owned players to become starters', () => {
    const state = createTeamState();
    const result = lineupReducer(state, selectPlayer('player-5'));

    expect(result.starterIds).toEqual(['player-5']);
    expect(result.err).toBe('');
  });

  it('rejects selecting more than five starters', () => {
    let state = createTeamState();

    for (const playerId of teamOne.rosterPlayerIds) {
      state = lineupReducer(state, selectPlayer(playerId));
    }

    // Add a sixth owned player.
    state = lineupReducer(
      state,
      loadFantasyTeam({
        ...teamOne,
        rosterPlayerIds: [...teamOne.rosterPlayerIds, 'player-6'],
      }),
    );

    // Team loading restores the existing saved lineup, not unsaved edits.
    for (const playerId of teamOne.rosterPlayerIds) {
      state = lineupReducer(state, selectPlayer(playerId));
    }

    state = lineupReducer(state, selectPlayer('player-6'));

    expect(state.starterIds).toHaveLength(5);
    expect(state.err).toBe('You can only have 5 starters at once.');
  });

  it('rejects starter changes after the scoring week begins', () => {
    const state = createTeamState();

    const result = lineupReducer(
      state,
      toggleStarter({
        playerId: 'player-1',
        scoringWeekStartsAt: timing.scoringWeekStartsAt,
        currentTime: timing.scoringWeekStartsAt,
      }),
    );

    expect(result.starterIds).toEqual([]);
    expect(result.err).toContain('locked');
  });
});

describe('Scoring week selection', () => {
  it('selects a scoring week with no existing lineup', () => {
    const state = createTeamState();

    expect(state.scoringWeekId).toBe('week-1');
    expect(state.starterIds).toEqual([]);
    expect(state.savedStarterIds).toEqual([]);
  });

  it('clears working selections when switching to an empty week', () => {
    let state = createTeamState();

    state = lineupReducer(state, selectPlayer('player-1'));
    state = lineupReducer(state, selectScoringWeek('week-2'));

    expect(state.scoringWeekId).toBe('week-2');
    expect(state.starterIds).toEqual([]);
    expect(state.savedStarterIds).toEqual([]);
  });
});

describe('Draft saving', () => {
  it('saves a draft for the selected scoring week', () => {
    let state = createTeamState();

    state = lineupReducer(state, selectPlayer('player-1'));
    state = lineupReducer(state, saveDraft(timing));

    const lineup = state.lineups['fantasy-team-1:week-1'];

    expect(lineup.status).toBe('draft');
    expect(lineup.starterPlayerIds).toEqual(['player-1']);
    expect(state.err).toBe('');
  });

  it('restores a saved draft when returning to its scoring week', () => {
    let state = createTeamState();

    state = lineupReducer(state, selectPlayer('player-1'));
    state = lineupReducer(state, saveDraft(timing));

    state = lineupReducer(state, selectScoringWeek('week-2'));
    state = lineupReducer(state, selectScoringWeek('week-1'));

    expect(state.starterIds).toEqual(['player-1']);
    expect(state.savedStarterIds).toEqual([]);
  });

  it('rejects saving drafts after the deadline', () => {
    let state = createTeamState();

    state = lineupReducer(state, selectPlayer('player-1'));

    state = lineupReducer(
      state,
      saveDraft({
        ...timing,
        currentTime: timing.scoringWeekStartsAt,
      }),
    );

    expect(state.lineups['fantasy-team-1:week-1']).toBeUndefined();
    expect(state.err).toContain('can no longer be edited');
  });
});

describe('Lineup submission', () => {
  it('submits five starters for the selected scoring week', () => {
    const state = createSubmittedState();

    const lineup = state.lineups['fantasy-team-1:week-1'];

    expect(lineup.status).toBe('submitted');
    expect(lineup.starterPlayerIds).toEqual(teamOne.rosterPlayerIds);
    expect(state.savedStarterIds).toEqual(teamOne.rosterPlayerIds);
    expect(state.err).toBe('');
  });

  it('rejects submitting an incomplete lineup', () => {
    let state = createTeamState();

    state = lineupReducer(state, selectPlayer('player-1'));
    state = lineupReducer(state, submitCurrentLineup(timing));

    expect(state.lineups['fantasy-team-1:week-1']).toBeUndefined();
    expect(state.savedStarterIds).toEqual([]);
    expect(state.err).toContain('Invalid lineup submission');
  });

  it('preserves an official submission when new edits are invalid', () => {
    let state = createSubmittedState();

    state = lineupReducer(state, selectPlayer('player-5'));
    state = lineupReducer(state, submitCurrentLineup(timing));

    expect(state.starterIds).toHaveLength(4);
    expect(state.savedStarterIds).toHaveLength(5);
    expect(state.lineups['fantasy-team-1:week-1'].starterPlayerIds).toEqual(
      teamOne.rosterPlayerIds,
    );

    expect(state.err).toContain('Invalid lineup submission');
  });

  it('rejects submissions after the scoring week begins', () => {
    let state = createSubmittedState();

    state = lineupReducer(
      state,
      submitCurrentLineup({
        ...timing,
        currentTime: timing.scoringWeekStartsAt,
      }),
    );

    expect(state.lineups['fantasy-team-1:week-1'].status).toBe('submitted');
    expect(state.err).toContain('can no longer be submitted');
  });
});

describe('Fantasy team switching', () => {
  it('clears active selections when switching to a team without a lineup', () => {
    let state = createSubmittedState();

    state = lineupReducer(state, loadFantasyTeam(teamTwo));

    expect(state.fantasyTeamId).toBe('fantasy-team-2');
    expect(state.rosterPlayerIds).toEqual(teamTwo.rosterPlayerIds);
    expect(state.starterIds).toEqual([]);
    expect(state.savedStarterIds).toEqual([]);
  });

  it('restores a submitted lineup when switching back to a fantasy team', () => {
    let state = createSubmittedState();

    expect(state.lineups['fantasy-team-1:week-1'].status).toBe('submitted');

    state = lineupReducer(state, loadFantasyTeam(teamTwo));

    expect(state.starterIds).toEqual([]);
    expect(state.savedStarterIds).toEqual([]);

    state = lineupReducer(state, loadFantasyTeam(teamOne));

    expect(state.starterIds).toEqual(teamOne.rosterPlayerIds);
    expect(state.savedStarterIds).toEqual(teamOne.rosterPlayerIds);
    expect(state.lineups['fantasy-team-1:week-1'].status).toBe('submitted');
  });

  it('preserves the official submission when saving new draft edits', () => {
    let state = createSubmittedState();

    const key = 'fantasy-team-1:week-1';

    // Remove one starter from the working selection.
    state = lineupReducer(state, selectPlayer('player-5'));

    // Save the incomplete working draft.
    state = lineupReducer(state, saveDraft(timing));

    expect(state.workingDrafts[key]).toEqual(['player-1', 'player-2', 'player-3', 'player-4']);

    // The official submission is unchanged.
    expect(state.lineups[key].status).toBe('submitted');
    expect(state.lineups[key].starterPlayerIds).toEqual(teamOne.rosterPlayerIds);
    expect(state.savedStarterIds).toEqual(teamOne.rosterPlayerIds);

    // Switch away and back.
    state = lineupReducer(state, selectScoringWeek('week-2'));
    state = lineupReducer(state, selectScoringWeek('week-1'));

    // Restore the working edits, not the official five.
    expect(state.starterIds).toHaveLength(4);
    expect(state.savedStarterIds).toHaveLength(5);
  });
  it('restores working drafts when switching fantasy teams', () => {
    let state = createSubmittedState();

    const key = 'fantasy-team-1:week-1';

    state = lineupReducer(state, selectPlayer('player-5'));
    state = lineupReducer(state, saveDraft(timing));

    state = lineupReducer(state, loadFantasyTeam(teamTwo));

    expect(state.starterIds).toEqual([]);

    state = lineupReducer(state, loadFantasyTeam(teamOne));

    expect(state.starterIds).toEqual(['player-1', 'player-2', 'player-3', 'player-4']);

    expect(state.savedStarterIds).toEqual(teamOne.rosterPlayerIds);
    expect(state.workingDrafts[key]).toHaveLength(4);
  });
  it('clears the working draft after a successful submission', () => {
    let state = createSubmittedState();

    const key = 'fantasy-team-1:week-1';

    state = lineupReducer(state, selectPlayer('player-5'));
    state = lineupReducer(state, saveDraft(timing));

    expect(state.workingDrafts[key]).toHaveLength(4);

    // Restore the fifth starter and resubmit.
    state = lineupReducer(state, selectPlayer('player-5'));
    state = lineupReducer(state, submitCurrentLineup(timing));

    expect(state.workingDrafts[key]).toBeUndefined();
    expect(state.lineups[key].status).toBe('submitted');
    expect(state.lineups[key].starterPlayerIds).toEqual(teamOne.rosterPlayerIds);
    expect(state.err).toBe('');
  });
  it('locks a submitted lineup at the deadline', () => {
    let state = createSubmittedState();

    state = lineupReducer(
      state,
      lockCurrentLineup({
        ...timing,
        currentTime: timing.scoringWeekStartsAt,
      }),
    );

    expect(state.lineups['fantasy-team-1:week-1'].status).toBe('locked');
    expect(state.lineups['fantasy-team-1:week-1'].lockedAt).toBe(timing.scoringWeekStartsAt);
  });

  it('does not lock an unsubmitted draft', () => {
    let state = createTeamState();

    state = lineupReducer(state, selectPlayer('player-1'));
    state = lineupReducer(state, saveDraft(timing));

    state = lineupReducer(
      state,
      lockCurrentLineup({
        ...timing,
        currentTime: timing.scoringWeekStartsAt,
      }),
    );

    expect(state.lineups['fantasy-team-1:week-1'].status).toBe('draft');
  });
});
