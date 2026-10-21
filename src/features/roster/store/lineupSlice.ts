import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FantasyLineup } from '../types/FantasyLineup';
import { getLineupKey } from '../utils/getLineupKey';
import { canEditLineup, saveLineupDraft, submitLineup } from '../utils/lineupLifecycle';

interface LineupState {
  fantasyTeamId: string | null;
  scoringWeekId: string | null;
  rosterPlayerIds: string[];

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

      state.starterIds = existingLineup ? [...existingLineup.starterPlayerIds] : [];

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

      state.starterIds = savedLineup ? [...savedLineup.starterPlayerIds] : [];

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
        state.lineups[key] = saveLineupDraft(
          lineup,
          state.rosterPlayerIds,
          state.starterIds,
          action.payload.scoringWeekStartsAt,
          action.payload.currentTime,
        );

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
        state.err = '';
      } catch (error) {
        state.err = error instanceof Error ? error.message : 'Could not submit lineup.';
      }
    },
  },
});

export const { loadFantasyTeam, toggleStarter, selectScoringWeek, saveDraft, submitCurrentLineup } =
  lineupSlice.actions;

export default lineupSlice.reducer;
