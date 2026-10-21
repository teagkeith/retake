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


app.listen(PORT, () => {
  console.log(`Rotate API running at http://localhost:${PORT}`);
});
