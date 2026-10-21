import type { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { players } from '../data/players';

export const selectStarterIds = (state: RootState) => state.lineup.starterIds;

export const selectSavedStarterIds = (state: RootState) => state.lineup.savedStarterIds;

export const selectLineupError = (state: RootState) => state.lineup.err;


export const selectLineupMatch = (state: RootState) => {
  const { starterIds, savedStarterIds } = state.lineup;

  return (
    starterIds.length === savedStarterIds.length &&
    starterIds.every((id) => savedStarterIds.includes(id))
  );
};

export const selectSavedPlayers = createSelector([selectSavedStarterIds], (savedStarterIds) =>
  savedStarterIds
    .map((id) => players.find((player) => player.id === id))
    .filter((player) => player !== undefined),
);