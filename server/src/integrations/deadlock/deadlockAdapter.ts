
interface DeadlockPlayer {
  account_id: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
}

interface DeadlockMatchResponse {
  match_info: {
    duration_s: number;
    players: DeadlockPlayer[];
  };
}

export function normalizeDeadlockMatch(
  matchId: number,
  data: unknown,
) {
  if (
    typeof data !== 'object' ||
    data === null ||
    !('match_info' in data)
  ) {
    throw new Error('Invalid Deadlock match response');
  }

  const matchInfo = data.match_info;

  if (
    typeof matchInfo !== 'object' ||
    matchInfo === null ||
    !('duration_s' in matchInfo) ||
    typeof matchInfo.duration_s !== 'number' ||
    !('players' in matchInfo) ||
    !Array.isArray(matchInfo.players)
  ) {
    throw new Error('Invalid Deadlock match information');
  }

  const players = matchInfo.players.map((player) => {
    if (
      typeof player !== 'object' ||
      player === null ||
      typeof player.account_id !== 'number' ||
      typeof player.hero_id !== 'number' ||
      typeof player.kills !== 'number' ||
      typeof player.deaths !== 'number' ||
      typeof player.assists !== 'number'
    ) {
      throw new Error('Invalid Deadlock player data');
    }

    return {
      accountId: player.account_id,
      heroId: player.hero_id,
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
    };
  });

  return {
    game: 'deadlock',
    matchId,
    durationSeconds: matchInfo.duration_s,
    players,
  };
}
