
import 'dotenv/config';
import { getValorantTeams } from '../integrations/valorant/valorantApi.js';

async function main() {
  console.log('Requesting VALORANT teams...');

  const response = await getValorantTeams();

  console.log('API response:');
  console.dir(response, { depth: null });
}

main().catch((error) => {
  console.error('VALORANT API test failed:', error);
  process.exitCode = 1;
});
