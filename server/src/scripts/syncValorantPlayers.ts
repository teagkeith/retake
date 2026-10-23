
import 'dotenv/config';

import { getValorantPlayers } from '../integrations/valorant/valorantApi.js';
import { normalizeValorantPlayer } from '../integrations/valorant/valorantPlayerAdapter.js';
import { importValorantPlayer } from '../integrations/valorant/valorantPlayerImporter.js';
import { normalizeTeamObservation } from '../integrations/valorant/valorantTeamObservationAdapter.js';
import { importValorantTeamObservation } from '../integrations/valorant/valorantTeamObservationImporter.js';
import { withValorantRetry } from '../integrations/valorant/valorantRetry.js';
import { prisma } from '../lib/prisma.js';
import {
  loadCheckpoint,
  saveCheckpoint,
} from './valorantSyncCheckpoint.js';

const PAGE_SIZE = 100;
const REQUEST_DELAY_MS = 13_000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

async function main() {
  const checkpoint = await loadCheckpoint();

  if (checkpoint.completed) {
    console.log('Player sync already completed.');
    return;
  }

  let cursor = checkpoint.nextCursor ?? undefined;
  let pagesThisRun = 0;

  console.log('Starting VALORANT player sync...');
  console.log(`Previously completed pages: ${checkpoint.pagesCompleted}`);
  console.log(`Resuming from cursor: ${cursor ?? 'start'}`);

  while (!checkpoint.completed) {
    if (pagesThisRun > 0) {
      console.log('Waiting for API rate limit...');
      await wait(REQUEST_DELAY_MS);
    }

    console.log(`Fetching cursor: ${cursor ?? 'start'}`);

    const response = await withValorantRetry(() =>
      getValorantPlayers(PAGE_SIZE, cursor),
    );

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
      throw new Error('Unexpected player API response');
    }

    const nextCursor = response.meta.next_cursor;

    if (
      nextCursor !== null &&
      (typeof nextCursor !== 'number' ||
        !Number.isSafeInteger(nextCursor) ||
        nextCursor <= 0 ||
        (cursor !== undefined && nextCursor <= cursor))
    ) {
      throw new Error('Invalid or repeated pagination cursor');
    }

    for (const rawPlayer of response.data) {
      let player;
        if (
  typeof rawPlayer === 'object' &&
  rawPlayer !== null &&
  'nickname' in rawPlayer &&
  (typeof rawPlayer.nickname !== 'string' ||
    rawPlayer.nickname.trim() === '')
) {
  console.warn('Skipping player with missing nickname:', rawPlayer);
  continue;
}

        try {
        player = normalizeValorantPlayer(rawPlayer);
        } catch (error) {
        console.error('Invalid VALORANT player record:', rawPlayer);
        throw error;
        }

      if (player === null) {
        checkpoint.coachesSkipped++;
        continue;
      }

      await importValorantPlayer(player);
      checkpoint.playersImported++;

      const observation = normalizeTeamObservation(rawPlayer);

      if (observation) {
        await importValorantTeamObservation(observation);
        checkpoint.observationsProcessed++;
      }
    }

    checkpoint.pagesCompleted++;
    checkpoint.nextCursor = nextCursor;
    checkpoint.completed = nextCursor === null;

    await saveCheckpoint(checkpoint);

    pagesThisRun++;

    console.log(
      `Pages: ${checkpoint.pagesCompleted} | ` +
        `Players: ${checkpoint.playersImported} | ` +
        `Coaches skipped: ${checkpoint.coachesSkipped} | ` +
        `Observations processed: ${checkpoint.observationsProcessed}`,
    );

    if (checkpoint.completed) {
      console.log('Reached the end of the VALORANT player dataset!');
      break;
    }

    cursor = nextCursor ?? undefined;
  }

  console.log(
    `Sync finished. Total pages completed: ${checkpoint.pagesCompleted}`,
  );
}

main()
  .catch((error) => {
    console.error('VALORANT sync failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
