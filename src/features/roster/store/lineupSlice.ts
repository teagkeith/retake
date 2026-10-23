import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FantasyLineup } from '../types/FantasyLineup';
import { getLineupKey } from '../utils/getLineupKey';
import { canEditLineup, saveLineupDraft, submitLineup, lockLineup } from '../utils/lineupLifecycle';
import { validateLineupDraft } from '../utils/lineupValidation';

interface LineupState {
  fantasyTeamId: string | null;
  scoringWeekId: string | null;
  rosterPlayerIds: string[];
  workingDrafts: Record<string, string[]>;
  starterIds: string[];
  savedStarterIds: string[];

  lineups: Record<string, FantasyLineup>;

  err: string;
}

const initialState: LineupState = {
  fantasyTeamId: null,
  scoringWeekId: null,
  rosterPlayerIds: [],

  starterIds: [],
  savedStarterIds: [],

  lineups: {},
  workingDrafts: {},

  err: '',
};

export const lineupSlice = createSlice({
  name: 'lineup',
  initialState,
  reducers: {
    toggleStarter: (
      state,
      action: PayloadAction<{
        playerId: string;
        scoringWeekStartsAt: string;
        currentTime: string;
      }>,
    ) => {
      const { playerId, scoringWeekStartsAt, currentTime } = action.payload;

      if (!state.fantasyTeamId || !state.scoringWeekId) {
        state.err = 'Select a fantasy team and scoring week first.';
        return;
      }

      const key = getLineupKey(state.fantasyTeamId, state.scoringWeekId);

      const lineup: FantasyLineup = state.lineups[key] ?? {
        id: key,
        fantasyTeamId: state.fantasyTeamId,
        scoringWeekId: state.scoringWeekId,
        starterPlayerIds: [],
        status: 'draft',
        lockedAt: null,
      };

      if (!canEditLineup(lineup, scoringWeekStartsAt, currentTime)) {
        state.err = 'This scoring week is locked. Your lineup cannot be changed.';
        return;
      }

      if (!state.rosterPlayerIds.includes(playerId)) {
        state.err = 'This player is not on your fantasy roster.';
        return;
      }

      if (state.starterIds.includes(playerId)) {
        state.starterIds = state.starterIds.filter((id) => id !== playerId);
        state.err = '';
      } else if (state.starterIds.length < 5) {
        state.starterIds.push(playerId);
        state.err = '';
      } else {
        state.err = 'You can only have 5 starters at once.';
      }
    },
    loadFantasyTeam: (
      state,
      action: PayloadAction<{
        fantasyTeamId: string;
        rosterPlayerIds: string[];
      }>,
    ) => {
      const { fantasyTeamId, rosterPlayerIds } = action.payload;

      state.fantasyTeamId = fantasyTeamId;
      state.rosterPlayerIds = [...rosterPlayerIds];

      if (!state.scoringWeekId) {
        state.starterIds = [];
        state.savedStarterIds = [];
        state.err = '';
        return;
      }

      const key = getLineupKey(fantasyTeamId, state.scoringWeekId);
      const existingLineup = state.lineups[key];

      const workingDraft = state.workingDrafts[key];

      state.starterIds = [...(workingDraft ?? existingLineup?.starterPlayerIds ?? [])];

      state.savedStarterIds =
        existingLineup?.status === 'submitted' || existingLineup?.status === 'locked'
          ? [...existingLineup.starterPlayerIds]
          : [];

      state.err = '';
    },
    selectScoringWeek: (state, action: PayloadAction<string>) => {
      const scoringWeekId = action.payload;

      state.scoringWeekId = scoringWeekId;

      if (!state.fantasyTeamId) {
        state.starterIds = [];
        state.savedStarterIds = [];
        state.err = '';
        return;
      }

      const key = getLineupKey(state.fantasyTeamId, scoringWeekId);
      const savedLineup = state.lineups[key];

      const workingDraft = state.workingDrafts[key];

      state.starterIds = [...(workingDraft ?? savedLineup?.starterPlayerIds ?? [])];
      state.savedStarterIds =
        savedLineup?.status === 'submitted' || savedLineup?.status === 'locked'
          ? [...savedLineup.starterPlayerIds]
          : [];

      state.err = '';
    },

    saveDraft: (
      state,
      action: PayloadAction<{
        scoringWeekStartsAt: string;
        currentTime: string;
      }>,
    ) => {
      if (!state.fantasyTeamId || !state.scoringWeekId) {
        state.err = 'Select a fantasy team and scoring week first.';
        return;
      }

      const key = getLineupKey(state.fantasyTeamId, state.scoringWeekId);

      const existingLineup = state.lineups[key];

      const lineup: FantasyLineup = existingLineup ?? {
        id: key,
        fantasyTeamId: state.fantasyTeamId,
        scoringWeekId: state.scoringWeekId,
        starterPlayerIds: [],
        status: 'draft',
        lockedAt: null,
      };

      try {
        if (
          !canEditLineup(lineup, action.payload.scoringWeekStartsAt, action.payload.currentTime)
        ) {
          throw new Error('Lineup can no longer be edited.');
        }

        if (!validateLineupDraft(state.rosterPlayerIds, state.starterIds)) {
          throw new Error(
            'Invalid lineup draft: check player count, roster inclusion, and duplicates.',
          );
        }

        // Save the working selection independently.
        state.workingDrafts[key] = [...state.starterIds];

        // Create a draft record only if no official lineup exists yet.
        if (!existingLineup) {
          state.lineups[key] = saveLineupDraft(
            lineup,
            state.rosterPlayerIds,
            state.starterIds,
            action.payload.scoringWeekStartsAt,
            action.payload.currentTime,
          );
        }

        state.err = '';
      } catch (error) {
        state.err = error instanceof Error ? error.message : 'Could not save lineup draft.';
      }
    },
    submitCurrentLineup: (
      state,
      action: PayloadAction<{
        scoringWeekStartsAt: string;
        currentTime: string;
      }>,
    ) => {
      if (!state.fantasyTeamId || !state.scoringWeekId) {
        state.err = 'Select a fantasy team and scoring week first.';
        return;
      }

      const key = getLineupKey(state.fantasyTeamId, state.scoringWeekId);

      const existingLineup = state.lineups[key];

      const lineup: FantasyLineup = existingLineup ?? {
        id: key,
        fantasyTeamId: state.fantasyTeamId,
        scoringWeekId: state.scoringWeekId,
        starterPlayerIds: [],
        status: 'draft',
        lockedAt: null,
      };

      try {
        const submittedLineup = submitLineup(
          lineup,
          state.rosterPlayerIds,
          state.starterIds,
          action.payload.scoringWeekStartsAt,
          action.payload.currentTime,
        );

        state.lineups[key] = submittedLineup;
        state.savedStarterIds = [...submittedLineup.starterPlayerIds];
        delete state.workingDrafts[key];
        state.err = '';
      } catch (error) {
        state.err = error instanceof Error ? error.message : 'Could not submit lineup.';
      }
    },
    lockCurrentLineup: (
      state,
      action: PayloadAction<{
        scoringWeekStartsAt: string;
        currentTime: string;
      }>,
    ) => {
      if (!state.fantasyTeamId || !state.scoringWeekId) {
        return;
      }

      const key = getLineupKey(state.fantasyTeamId, state.scoringWeekId);
      const lineup = state.lineups[key];

      // Unsubmitted drafts must not become locked submissions.
      if (!lineup || lineup.status !== 'submitted') {
        return;
      }

      try {
        state.lineups[key] = lockLineup(
          lineup,
          action.payload.scoringWeekStartsAt,
          action.payload.currentTime,
        );

        // Any unfinished edits are no longer actionable.
        delete state.workingDrafts[key];
        state.starterIds = [...state.lineups[key].starterPlayerIds];
        state.savedStarterIds = [...state.lineups[key].starterPlayerIds];
        state.err = '';
      } catch (error) {
        state.err = error instanceof Error ? error.message : 'Could not lock lineup.';
      }
    },
      

hydrateSavedLineup: (
  state,
  action: PayloadAction<{
    id: string;
    fantasyTeamId: string;
    scoringWeekId: string;
    starterPlayerIds: string[];
    draftPlayerIds: string[] | null;
    status: 'draft' | 'submitted' | 'locked';
    lockedAt: string | null;
  }>,
) => {
  const {
    id,
    fantasyTeamId,
    scoringWeekId,
    starterPlayerIds,
    draftPlayerIds,
    status,
    lockedAt,
  } = action.payload;

  const key = getLineupKey(fantasyTeamId, scoringWeekId);

  // Store the official lineup returned by MySQL.
  state.fantasyTeamId = fantasyTeamId;
  state.scoringWeekId = scoringWeekId;

  state.lineups[key] = {
    id,
    fantasyTeamId,
    scoringWeekId,
    starterPlayerIds: [...starterPlayerIds],
    status,
    lockedAt,
  };

  // Only submitted or locked lineups have official starters.
  state.savedStarterIds =
    status === 'submitted' || status === 'locked'
      ? [...starterPlayerIds]
      : [];

  // Restore unfinished edits when they exist.
  const workingPlayers = draftPlayerIds ?? starterPlayerIds;

  state.starterIds = [...workingPlayers];

  if (draftPlayerIds !== null) {
    state.workingDrafts[key] = [...draftPlayerIds];
  } else {
    delete state.workingDrafts[key];
  }

  state.err = '';
},



  },
});

export const {
  loadFantasyTeam,
  toggleStarter,
  selectScoringWeek,
  saveDraft,
  submitCurrentLineup,
  lockCurrentLineup,
  hydrateSavedLineup,
} = lineupSlice.actions;

export default lineupSlice.reducer;
