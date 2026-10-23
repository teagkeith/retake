
const DEADLOCK_API_URL = 'https://api.deadlock-api.com';

export async function getDeadlockMatch(matchId: number) {
  const response = await fetch(
    `${DEADLOCK_API_URL}/v1/matches/${matchId}/metadata`,
  );

  if (!response.ok) {
    throw new Error(
      `Deadlock API returned status ${response.status}`,
    );
  }

  const data: unknown = await response.json();

  return data;
}
