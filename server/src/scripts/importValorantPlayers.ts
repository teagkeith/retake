
import 'dotenv/config';

import { getValorantPlayers } from '../integrations/valorant/valorantApi.js';
import { normalizeValorantPlayer } from '../integrations/valorant/valorantPlayerAdapter.js';
import { importValorantPlayer } from '../integrations/valorant/valorantPlayerImporter.js';
import { prisma } from '../lib/prisma.js';
import { normalizeTeamObservation } from '../integrations/valorant/valorantTeamObservationAdapter.js';
import { importValorantTeamObservation } from '../integrations/valorant/valorantTeamObservationImporter.js';

async function main() {
  console.log('Fetching VALORANT players...');

  const response = await getValorantPlayers(10);

  if (
    typeof response !== 'object' ||
    response === null ||
    !('data' in response) ||
    !Array.isArray(response.data)
  ) {
    throw new Error('Unexpected BALLDONTLIE response');
  }

  let imported = 0;
  let skipped = 0;

  for (const rawPlayer of response.data) {
    const player = normalizeValorantPlayer(rawPlayer);

    if (player === null) {
      skipped++;
      console.log('Skipping coach');
      continue;
    }

    const savedPlayer = await importValorantPlayer(player);

    console.log(`Imported: ${savedPlayer.displayName}`);
    imported++;

const observation = normalizeTeamObservation(rawPlayer);

if (observation) {
  const savedObservation = await importValorantTeamObservation(observation);

  console.log(`Team observation saved: ${savedObservation.teamId}`);
}

  }

  console.log(`Import complete! ${imported} players imported, ${skipped} coaches skipped.`);
}

main()
  .catch((error) => {
    console.error('VALORANT player import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
