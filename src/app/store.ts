import { configureStore } from '@reduxjs/toolkit';
// Reducer Imports
import lineupReducer from '../features/roster/store/lineupSlice';

export const store = configureStore({
  reducer: {
    lineup: lineupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
