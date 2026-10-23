import 'dotenv/config';
import { getValorantPlayers } from '../integrations/valorant/valorantApi.js';

async function main() {
  const response = await getValorantPlayers(10);

  if (
    typeof response !== 'object' ||
    response === null ||
    !('data' in response) ||
    !Array.isArray(response.data)
  ) {
    throw new Error('Unexpected player API response');
  }

  for (const player of response.data) {
    if (typeof player !== 'object' || player === null) {
      continue;
    }

    console.dir(
      {
        id: 'id' in player ? player.id : null,
        nickname: 'nickname' in player ? player.nickname : null,
        isCoach: 'is_coach' in player ? player.is_coach : null,
        team: 'team' in player ? player.team : null,
        joinedTeamAt: 'joined_team_at' in player ? player.joined_team_at : null,
      },
      { depth: null },
    );
  }
}

main().catch((error) => {
  console.error('Player API request failed:', error);
  process.exitCode = 1;
});
