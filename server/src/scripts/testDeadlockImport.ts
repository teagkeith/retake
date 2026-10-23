
import { prisma } from '../lib/prisma.js';
import { importDeadlockMatch } from '../services/matchImportService.js';

async function main() {
  const match = await importDeadlockMatch(122924457);

  console.log('Match imported successfully!');
  console.log({
    id: match.id,
    gameId: match.gameId,
    externalMatchId: match.externalMatchId,
    durationSeconds: match.durationSeconds,
  });
}

main()
  .catch((error) => {
    console.error('Match import failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
