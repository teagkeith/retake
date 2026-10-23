import 'dotenv/config';

import { getValorantTeams } from '../integrations/valorant/valorantApi.js';
import { normalizeValorantTeam } from '../integrations/valorant/valorantTeamAdapter.js';
import { importValorantTeam } from '../integrations/valorant/valorantTeamImporter.js';
import { prisma } from '../lib/prisma.js';

async function main() {
  const maxPages = 3;
  const delayMs = 13_000;
  let cursor: number | undefined;
  let totalImported = 0;

  for (let page = 1; page <= maxPages; page++) {
    // Wait between requests to respect the free-tier limit.
    if (page > 1) {
      console.log('Waiting before the next API request...');
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    console.log(`Fetching page ${page}...`);

    const response = await getValorantTeams(10, cursor);

    if (
      typeof response !== 'object' ||
      response === null ||
      !('data' in response) ||
      !Array.isArray(response.data) ||
      !('meta' in response) ||
      typeof response.meta !== 'object' ||
      response.meta === null ||
      !('next_cursor' in response.meta)
    ) {
      throw new Error('Unexpected BALLDONTLIE response');
    }

    for (const rawTeam of response.data) {
      const team = normalizeValorantTeam(rawTeam);
      const savedTeam = await importValorantTeam(team);

      console.log(`Imported: ${savedTeam.name}`);
      totalImported++;
    }

    const nextCursor = response.meta.next_cursor;

    if (nextCursor === null) {
      console.log('Reached the last page.');
      break;
    }

    if (typeof nextCursor !== 'number') {
      throw new Error('Invalid pagination cursor');
    }

    cursor = nextCursor;
  }

  console.log(`Import complete! Processed ${totalImported} teams.`);
}

main()
  .catch((error) => {
    console.error('VALORANT team import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
