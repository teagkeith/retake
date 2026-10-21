import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma.js';

const app = express();
const PORT = 3001;


app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.use(express.json());


app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    application: 'Rotate API',
  });
});

app.get('/api/lineups', async (_req, res) => {
  try {
    const lineups = await prisma.fantasyLineup.findMany();

    res.json(lineups);
  } catch (error) {
    console.error('Failed to retrieve lineups:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.get('/api/teams/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await prisma.fantasyTeam.findUnique({
      where: {
        id: teamId,
      },
      include: {
        roster: true,
      },
    });

    if (!team) {
      res.status(404).json({ error: 'Fantasy team not found' });
      return;
    }

    res.json({
      id: team.id,
      name: team.name,
      rosterPlayerIds: team.roster.map((player) => player.proPlayerId),
    });
  } catch (error) {
    console.error('Failed to retrieve fantasy team:', error);
    res.status(500).json({ error: 'Could not retrieve fantasy team' });
  }
});

app.listen(PORT, () => {
  console.log(`Rotate API running at http://localhost:${PORT}`);
});
