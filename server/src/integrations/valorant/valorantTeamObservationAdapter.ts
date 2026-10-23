import type { ValorantTeamObservation } from './valorantTeamObservationImporter.js';

export function normalizeTeamObservation(data: unknown): ValorantTeamObservation | null {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid player data');
  }

  // Coaches are excluded from our fantasy player pool.
  if ('is_coach' in data && data.is_coach === true) {
    return null;
  }

  // No team reported means there's no affiliation to record.
  if (!('team' in data) || data.team === null) {
    return null;
  }

  const team = data.team;

  if (typeof team !== 'object' || team === null) {
    throw new Error('Invalid team data');
  }

  if (
    !('id' in data) ||
    typeof data.id !== 'number' ||
    !Number.isSafeInteger(data.id) ||
    data.id <= 0 ||
    !('id' in team) ||
    typeof team.id !== 'number' ||
    !Number.isSafeInteger(team.id) ||
    team.id <= 0 ||
    !('name' in team) ||
    typeof team.name !== 'string' ||
    !team.name.trim()
  ) {
    throw new Error('Invalid player-team affiliation');
  }

  return {
    playerExternalId: String(data.id),
    teamExternalId: String(team.id),
    teamName: team.name.trim(),
    teamShortName:
      'acronym' in team && typeof team.acronym === 'string' ? team.acronym.trim() : null,
  };
}
