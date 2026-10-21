export function validateDraft(
  rosterPlayerIds: string[],
  starterPlayerIds: string[],
): boolean {
  const uniquePlayers = new Set(starterPlayerIds);

  return (
    starterPlayerIds.length <= 5 &&
    uniquePlayers.size === starterPlayerIds.length &&
    starterPlayerIds.every((id) => rosterPlayerIds.includes(id))
  );
}

export function validateSubmission(
  rosterPlayerIds: string[],
  starterPlayerIds: string[],
): boolean {
  return (
    starterPlayerIds.length === 5 &&
    validateDraft(rosterPlayerIds, starterPlayerIds)
  );
}