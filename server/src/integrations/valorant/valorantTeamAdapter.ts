import type { ImportedValorantTeam } from './valorantTeamImporter.js';

export function normalizeValorantTeam(data: unknown): ImportedValorantTeam {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid team data');
  }

  if (!('id' in data) || !('name' in data)) {
    throw new Error('Missing team ID or name');
  }

  if (
    typeof data.id !== 'number' ||
    !Number.isSafeInteger(data.id) ||
    data.id <= 0 ||
    typeof data.name !== 'string' ||
    !data.name.trim()
  ) {
    throw new Error('Invalid team ID or name');
  }

  return {
    externalId: String(data.id),
    name: data.name.trim(),
    shortName: 'acronym' in data && typeof data.acronym === 'string' ? data.acronym : null,
    region: null,
    logoUrl: null,
  };
}
