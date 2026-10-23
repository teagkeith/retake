import type { RootState } from '../../../app/store';
import { getLineupKey } from '../utils/getLineupKey';

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

export const selectIsLineupFinalized = (state: RootState) => {
  const { fantasyTeamId, scoringWeekId, lineups } = state.lineup;

  if (!fantasyTeamId || !scoringWeekId) {
    return false;
  }

  const key = `${fantasyTeamId}:${scoringWeekId}`;
  const lineup = lineups[key];

  return lineup?.status === 'locked';
};
