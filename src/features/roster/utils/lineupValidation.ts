function hasDuplicates(ids: string[]): boolean {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) return true;
    seen.add(id);
  }
  return false;
}

export function validateLineupDraft(
  rosterPlayerIds: string[],
  starterPlayerIds: string[],
): boolean {
  if (starterPlayerIds.length > 5) {
    return false;
  }
  if (hasDuplicates(rosterPlayerIds) || hasDuplicates(starterPlayerIds)) {
    return false;
  }

  const rosterSet = new Set(rosterPlayerIds);
  const areAllStartersInRoster = starterPlayerIds.every((id) => rosterSet.has(id));

  return areAllStartersInRoster;
}



export function validateLineupSubmission(
  rosterPlayerIds: string[],
  starterPlayerIds: string[],
): boolean {
  return validateLineupDraft(rosterPlayerIds, starterPlayerIds) && starterPlayerIds.length === 5;
}
