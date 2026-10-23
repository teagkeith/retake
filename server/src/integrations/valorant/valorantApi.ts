
const API_URL = 'https://api.balldontlie.io/valorant/v1';

export async function getValorantTeams(
  perPage = 10,
  cursor?: number,
): Promise<unknown> {
  const apiKey = process.env.BALLDONTLIE_API_KEY;

  if (!apiKey) {
    throw new Error('BALLDONTLIE_API_KEY is missing');
  }

  const url = new URL(`${API_URL}/teams`);

  url.searchParams.set('per_page', String(perPage));

  if (cursor !== undefined) {
    url.searchParams.set('cursor', String(cursor));
  }

  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`BALLDONTLIE request failed: ${response.status}`);
  }

  return response.json();
}


export async function getValorantPlayers(
  perPage = 1,
  cursor?: number,
): Promise<unknown> {
  const apiKey = process.env.BALLDONTLIE_API_KEY;

  if (!apiKey) {
    throw new Error('BALLDONTLIE_API_KEY is missing');
  }

  const url = new URL(`${API_URL}/players`);

  url.searchParams.set('per_page', String(perPage));

  if (cursor !== undefined) {
    url.searchParams.set('cursor', String(cursor));
  }

  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`BALLDONTLIE players request failed: ${response.status}`);
  }

  return response.json();
}
