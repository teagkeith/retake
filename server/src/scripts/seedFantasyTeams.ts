import { prisma } from '../lib/prisma.js';

const fantasyTeam = {
  id: 'fantasy-team-1',
  name: 'Blitz Brigade',
  rosterPlayerIds: [
    'player-1',
    'player-2',
    'player-3',
    'player-4',
    'player-5',
    'player-6',
    'player-7',
  ],
};

async function main() {
  // Create the team if it doesn't exist, or update its name.
  await prisma.fantasyTeam.upsert({
    where: {
      id: fantasyTeam.id,
    },
    update: {
      name: fantasyTeam.name,
    },
    create: {
      id: fantasyTeam.id,
      name: fantasyTeam.name,
    },
  });

  // Add each owned player without creating duplicates.
  for (const playerId of fantasyTeam.rosterPlayerIds) {
    await prisma.fantasyRosterPlayer.upsert({
      where: {
        fantasyTeamId_proPlayerId: {
          fantasyTeamId: fantasyTeam.id,
          proPlayerId: playerId,
        },
      },
      update: {},
      create: {
        fantasyTeamId: fantasyTeam.id,
        proPlayerId: playerId,
      },
    });
  }

  console.log(`Seeded ${fantasyTeam.name}`);
  console.log(`${fantasyTeam.rosterPlayerIds.length} roster players`);

  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('Seeding failed:', error);
  await prisma.$disconnect();
  process.exitCode = 1;
});