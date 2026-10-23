
import { prisma } from '../lib/prisma.js';
import { importValorantTeam } from '../integrations/valorant/valorantTeamImporter.js';

async function main() {
  const testTeam = {
    externalId: 'rotate-test-team',
    name: 'Rotate Test Team',
    shortName: 'RTT',
    region: 'NA',
    logoUrl: null,
  };

  // Import the same team twice.
  const firstImport = await importValorantTeam(testTeam);
  const secondImport = await importValorantTeam(testTeam);

  console.log('First import ID:', firstImport.id);
  console.log('Second import ID:', secondImport.id);

  const matchingTeams = await prisma.proTeam.findMany({
    where: {
      gameId: 'valorant',
      externalSource: 'vlrgg',
      externalId: testTeam.externalId,
    },
  });

  console.log('Matching team count:', matchingTeams.length);
}

main()
  .catch((error) => {
    console.error('Import test failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
