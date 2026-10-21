import type { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { mockProPlayers } from '../../players/data/mockProPlayers';
import { mockProTeams } from '../../players/data/mockProTeams';
import { mockPlayerPerformances } from '../../players/data/mockPlayerPerformances';
import { buildPlayerCardData } from '../../players/utils/buildPlayerCardData';
import { getLineupKey } from '../utils/getLineupKey';

export const selectStarterIds = (state: RootState) => state.lineup.starterIds;

export const selectSavedStarterIds = (state: RootState) => state.lineup.savedStarterIds;

export const selectLineupError = (state: RootState) => state.lineup.err;

const playerCardData = buildPlayerCardData(
  mockProPlayers,
  mockProTeams,
  mockPlayerPerformances,
  'week-1',
);

export const selectLineupMatch = (state: RootState) => {
  const { starterIds, savedStarterIds } = state.lineup;

  return (
    starterIds.length === savedStarterIds.length &&
    starterIds.every((id) => savedStarterIds.includes(id))
  );
};

export const selectSavedPlayers = createSelector([selectSavedStarterIds], (savedStarterIds) =>
  savedStarterIds
    .map((id) => playerCardData.find((player) => player.id === id))
    .filter((player) => player !== undefined),
);

export const selectRosterPlayerIds = (state: RootState) => state.lineup.rosterPlayerIds;

export const selectDraftSaved = (state: RootState): boolean => {
  const { fantasyTeamId, scoringWeekId, starterIds, workingDrafts } = state.lineup;

  if (!fantasyTeamId || !scoringWeekId) {
    return false;
  }

  const key = getLineupKey(fantasyTeamId, scoringWeekId);
  const savedDraft = workingDrafts[key];

  if (!savedDraft) {
    return false;
  }

  return (
    starterIds.length === savedDraft.length && starterIds.every((id) => savedDraft.includes(id))
  );
};