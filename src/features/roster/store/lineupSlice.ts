import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LineupState {
  starterIds: number[];
  savedStarterIds: number[];
  err: string;
}

const initialState: LineupState = {
  starterIds: [],
  savedStarterIds: [],
  err: '',
};

export const lineupSlice = createSlice({
  name: 'lineup',
  initialState,
  reducers: {
    toggleStarter: (state, action: PayloadAction<number>) => {
      const playerId = action.payload;

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
    }
  },
});

export const { toggleStarter, saveLineup } = lineupSlice.actions;

export default lineupSlice.reducer;
