import type { FantasyLineup } from '../types/FantasyLineup';
import { validateLineupDraft, validateLineupSubmission } from './lineupValidation';

export function canEditLineup(
  lineup: FantasyLineup,
  scoringWeekStartsAt: string,
  currentTime: string,
): boolean {
  const lockDate = new Date(scoringWeekStartsAt);
  const validTime = new Date(currentTime) < lockDate;

  return lineup.status !== 'locked' && validTime;
}

export function saveLineupDraft(
  lineup: FantasyLineup,
  rosterPlayerIds: string[],
  starterPlayerIds: string[],
  scoringWeekStartsAt: string,
  currentTime: string,
): FantasyLineup {
  if (!canEditLineup(lineup, scoringWeekStartsAt, currentTime)) {
    throw new Error('Lineup can no longer be edited.');
  }

  if (lineup.status !== 'draft') {
    throw new Error('Only draft lineups can be saved.');
  }

  if (!validateLineupDraft(rosterPlayerIds, starterPlayerIds)) {
    throw new Error('Invalid lineup draft: check player count, roster inclusion, and duplicates.');
  }

  return {
    ...lineup,
    starterPlayerIds: [...starterPlayerIds],
  };
}

export function submitLineup(
  lineup: FantasyLineup,
  rosterPlayerIds: string[],
  starterPlayerIds: string[],
  scoringWeekStartsAt: string,
  currentTime: string,
): FantasyLineup {
  if (!canEditLineup(lineup, scoringWeekStartsAt, currentTime)) {
    throw new Error('Lineup can no longer be submitted.');
  }

  if (!validateLineupSubmission(rosterPlayerIds, starterPlayerIds)) {
    throw new Error('Invalid lineup submission: exactly 5 owned, unique starters are required.');
  }

  return {
    ...lineup,
    starterPlayerIds: [...starterPlayerIds],
    status: 'submitted',
  };
}

export function lockLineup(
  lineup: FantasyLineup,
  scoringWeekStartsAt: string,
  currentTime: string,
): FantasyLineup {
  const startTime = new Date(scoringWeekStartsAt).getTime();
  const now = new Date(currentTime).getTime();

  if (now < startTime) {
    throw new Error('Cannot lock a lineup before the scoring week begins.');
  }

  if (lineup.status === 'locked') {
    return lineup;
  }

  if (lineup.status !== 'submitted') {
    throw new Error('Only submitted lineups can be locked.');
  }

  return {
    ...lineup,
    status: 'locked',
    lockedAt: currentTime,
  };
}
