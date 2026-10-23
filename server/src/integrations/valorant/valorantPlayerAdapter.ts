
import type { ImportedValorantPlayer } from './valorantPlayerImporter.js';

export function normalizeValorantPlayer(
  data: unknown,
): ImportedValorantPlayer | null {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid player data');
  }

  if (
    !('id' in data) ||
    !('nickname' in data) ||
    typeof data.id !== 'number' ||
    !Number.isSafeInteger(data.id) ||
    data.id <= 0 ||
    typeof data.nickname !== 'string' ||
    !data.nickname.trim()
  ) {
    throw new Error('Invalid player ID or nickname');
  }

  // Coaches should not enter our fantasy player pool.
  if ('is_coach' in data && data.is_coach === true) {
    return null;
  }

  return {
    externalId: String(data.id),
    displayName: data.nickname.trim(),
  };
}
