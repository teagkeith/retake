
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const checkpointDirectory = resolve(process.cwd(), '.sync');
const checkpointFile = resolve(checkpointDirectory, 'valorant-players.json');
const temporaryFile = resolve(
  checkpointDirectory,
  'valorant-players.tmp.json',
);

export interface ValorantSyncCheckpoint {
  nextCursor: number | null;
  pagesCompleted: number;
  playersImported: number;
  coachesSkipped: number;
  observationsProcessed: number;
  completed: boolean;
}

function createDefaultCheckpoint(): ValorantSyncCheckpoint {
  return {
    nextCursor: null,
    pagesCompleted: 0,
    playersImported: 0,
    coachesSkipped: 0,
    observationsProcessed: 0,
    completed: false,
  };
}

export async function loadCheckpoint(): Promise<ValorantSyncCheckpoint> {
  try {
    const contents = await readFile(checkpointFile, 'utf8');
    return JSON.parse(contents) as ValorantSyncCheckpoint;
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return createDefaultCheckpoint();
    }

    throw error;
  }
}

export async function saveCheckpoint(
  checkpoint: ValorantSyncCheckpoint,
): Promise<void> {
  await mkdir(checkpointDirectory, { recursive: true });

  const contents = JSON.stringify(checkpoint, null, 2);

  await writeFile(temporaryFile, contents, 'utf8');

  await rename(temporaryFile, checkpointFile);
}
