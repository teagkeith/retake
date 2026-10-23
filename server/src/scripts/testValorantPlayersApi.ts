import 'dotenv/config';
import { getValorantPlayers } from '../integrations/valorant/valorantApi.js';

async function main() {
  const response = await getValorantPlayers(100);

  if (
    typeof response !== 'object' ||
    response === null ||
    !('data' in response) ||
    !Array.isArray(response.data) ||
    !('meta' in response)
  ) {
    throw new Error('Unexpected API response');
  }

  console.log('Players returned:', response.data.length);
  console.log('Pagination metadata:', response.meta);
}

main().catch((error) => {
  console.error('Player API request failed:', error);
  process.exitCode = 1;
});
