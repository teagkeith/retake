import { prisma } from '../lib/prisma.js';

async function main() {
  const lineup = await prisma.fantasyLineup.upsert({
    where: {
      fantasyTeamId_scoringWeekId: {
        fantasyTeamId: 'test-team-1',
        scoringWeekId: 'test-week-1',
      },
    },
    update: {},
    create: {
      fantasyTeamId: 'test-team-1',
      scoringWeekId: 'test-week-1',
      starterPlayerIds: [],
      status: 'draft',
    },
  });

  console.log('Database write successful!');
  console.log({
    id: lineup.id,
    status: lineup.status,
    fantasyTeamId: lineup.fantasyTeamId,
  });
}

main()
  .catch((error) => {
    console.error('Database test failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
