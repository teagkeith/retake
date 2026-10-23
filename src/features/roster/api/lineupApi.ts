
export interface SavedLineupResponse {
  id: string;
  fantasyTeamId: string;
  scoringWeekId: string;
  status: 'draft' | 'submitted' | 'locked';
  starterPlayerIds: string[];
  lockedAt: string | null;
  createdAt: string;
  updatedAt: string;
  draftPlayerIds: string[] | null;
}

export async function fetchSavedLineup(
  fantasyTeamId: string,
  scoringWeekId: string,
): Promise<SavedLineupResponse | null> {
  const response = await fetch(
    `http://localhost:3001/api/lineups/${encodeURIComponent(fantasyTeamId)}/${encodeURIComponent(scoringWeekId)}`,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch lineup: ${response.status}`);
  }

  return response.json();
}


export interface SaveLineupRequest {
  fantasyTeamId: string;
  scoringWeekId: string;
  starterPlayerIds: string[];
  action: 'draft' | 'submit';
}

export async function saveLineup(
  request: SaveLineupRequest,
): Promise<SavedLineupResponse> {
  const response = await fetch('http://localhost:3001/api/lineups', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let message = `Failed to save lineup: ${response.status}`;

    try {
      const error = await response.json();

      if (typeof error.error === 'string') {
        message = error.error;
      }
    } catch {
      // Keep the original HTTP error if the response isn't JSON.
    }

    throw new Error(message);
  }

  const result: {
    message: string;
    lineup: SavedLineupResponse;
  } = await response.json();

  return result.lineup;
}

