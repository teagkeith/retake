import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LineupState {
  fantasyTeamId: string | null;
  rosterPlayerIds: string[];
  starterIds: string[];
  savedStarterIds: string[];
  err: string;
}

const initialState: LineupState = {
  fantasyTeamId: null,
  rosterPlayerIds: [],
  starterIds: [],
  savedStarterIds: [],
  err: '',
};

export const lineupSlice = createSlice({
  name: 'lineup',
  initialState,
  reducers: {
    toggleStarter: (state, action: PayloadAction<string>) => {
      const playerId = action.payload;

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
    saveLineup: (state) => {
      if (state.starterIds.length !== 5) {
        state.err = `You have ${state.starterIds.length}/5 starters selected.`;
        return;
      }
      state.savedStarterIds = [...state.starterIds];
      state.err = '';
    },
    loadFantasyTeam: (
      state,
      action: PayloadAction<{
        fantasyTeamId: string;
        rosterPlayerIds: string[];
      }>,
    ) => {
      state.fantasyTeamId = action.payload.fantasyTeamId;
      state.rosterPlayerIds = [...action.payload.rosterPlayerIds];

      // A new team should not inherit the previous team's lineup.
      state.starterIds = [];
      state.savedStarterIds = [];
      state.err = '';
    },
  },
});

export const { loadFantasyTeam, toggleStarter, saveLineup } = lineupSlice.actions;

export default lineupSlice.reducer;
