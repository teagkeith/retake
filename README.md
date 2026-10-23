# rotate.

**Fantasy esports, built for the games we actually play.**

rotate. is a fantasy esports platform designed to bring the traditional fantasy league experience to competitive gaming.

Build a roster, manage your starting lineup, compete in head-to-head matchups, and follow your favorite esports players across a growing selection of games.

The goal is to make fantasy esports feel like a natural extension of the competitive gaming community.

<<<<<<< ours
> **Development status:** Early development. Core roster management and lineup persistence are functional, while player imports, fantasy scoring, and league management are still being built.
=======
Install the frontend and backend dependencies with `npm ci` and `npm --prefix server ci`.
Run `npm run dev` for the frontend and `npm --prefix server run dev` for the API.
The API requires the existing MySQL environment configuration and `server/certs/ca.pem`.

Before compiling the backend, generate its ignored Prisma client from the existing schema:

```sh
cd server
npx prisma generate --config prisma7.config.ts
```

This command requires `DATABASE_URL` in the environment; it does not apply migrations.

## Maintenance Checks

Run `npm run verify` from the repository root to check Prettier, ESLint, both test suites,
and both production builds. `npm run typecheck` and `npm --prefix server run typecheck`
also run the frontend and backend TypeScript checks individually.

Use `npm run format` to apply formatting. Generated Prisma files, migrations, dependencies,
build output, environment files, certificates, lockfiles, and bundled tooling metadata are
excluded from formatting. Dependencies and lockfiles should be updated deliberately.

Frontend and backend Vitest configurations select only their own source tests, including
after a build. Player mocks still referenced by tests are fixtures; the overview and
standings placeholder data remain part of the current UI.

## Current Features
>>>>>>> theirs

---

<<<<<<< ours
## Features

### Currently implemented

- **Fantasy rosters** — Load fantasy teams and their owned players from a MySQL database.
- **Lineup management** — Select up to five starters from an existing roster.
- **Draft persistence** — Save unfinished lineup changes without overwriting the officially submitted lineup.
- **Lineup submission** — Submit and resubmit eligible lineups before the scoring deadline.
- **Lineup restoration** — Restore submitted starters and saved drafts after refreshing the application.
- **Server-side validation** — Validate lineup size, player ownership, duplicates, and scoring deadlines.
- **Deadlock integration** — Retrieve match data from an external Deadlock API, normalize player statistics, and import match records into MySQL.
- **Automated tests** — Unit tests for existing data transformation and application logic.

### In development

- Real professional player and team imports
- Player profiles, team affiliations, and roster histories
- Verified player-account mapping
- Fantasy scoring engine
- Head-to-head league matchups
- League creation and management
- Authentication and user accounts
- Match history and fantasy performance tracking
- Support for additional esports titles

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| State management | Redux Toolkit |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL (Aiven) |
| ORM | Prisma |
| Testing | Vitest |
| Development tooling | VS Code, Prettier, Git |

The application is organized into a frontend and a separate API server.

## Project structure

```text
rotate/
├── src/
│   ├── features/
│   │   ├── league/
│   │   ├── players/
│   │   └── roster/
│   ├── App.tsx
│   └── ...
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── integrations/
│   │   │   └── deadlock/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── scripts/
│   │   └── index.ts
│   └── package.json
│
├── package.json
└── README.md
```

The frontend follows a feature-based structure, keeping domain-specific components, API functions, Redux state, and utilities together.

The backend handles database access, validation, external integrations, and match-data processing.

---

## Getting started

### Prerequisites

Before running the project locally, install:

- Node.js and npm
- Git
- A MySQL database
- A code editor such as Visual Studio Code

### 1. Clone the repository

```bash
git clone https://github.com/teagkeith/retake.git
cd retake
```

### 2. Install dependencies

Install frontend dependencies from the project root:

```bash
npm install
```

Install backend dependencies separately:

```bash
cd server
npm install
```

### 3. Configure the database

The backend uses Prisma with MySQL.

Configure the backend environment variables required by your database connection, following the configuration in `server/src/lib/prisma.ts`.

For the current Aiven setup, this includes the appropriate database connection credentials and TLS certificate configuration.

**Never commit database passwords, connection secrets, private certificates, or `.env` files containing credentials.**

### 4. Prepare Prisma

From the `server` directory:

```bash
npx prisma generate
npx prisma migrate deploy
```

This generates the Prisma client and applies existing database migrations.

### 5. Start the backend

From `server/`:

```bash
npm run dev
```

The API runs locally at:

```text
http://localhost:3001
```

Verify that the backend is running:

```text
GET http://localhost:3001/api/health
```

### 6. Start the frontend

Open a second terminal in the project root:

```bash
npm run dev
```

The frontend runs locally at:

```text
http://localhost:5173
```

The development frontend communicates with the Express API on port `3001`.

**Note:** Some application data currently depends on development seed records, including a sample fantasy team and players. A fresh database may require seed data before roster features can be exercised.

---

## API overview

The backend exposes development endpoints for retrieving fantasy teams, managing lineups, and integrating Deadlock match data.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/teams/:teamId` | Retrieve a fantasy team and its roster |
| GET | `/api/lineups` | Retrieve lineup records |
| GET | `/api/lineups/:fantasyTeamId/:scoringWeekId` | Retrieve a specific saved lineup |
| POST | `/api/lineups` | Save a draft or submit a lineup |
| GET | `/api/deadlock/matches/:matchId` | Retrieve raw Deadlock match data |
| GET | `/api/deadlock/matches/:matchId/summary` | Retrieve normalized match statistics |

These endpoints are intended for local development and are not yet protected by production-ready authentication and authorization.

### Lineup submission example

```json
{
  "fantasyTeamId": "fantasy-team-1",
  "scoringWeekId": "week-1",
  "starterPlayerIds": [
    "player-1",
    "player-2",
    "player-3",
    "player-4",
    "player-5"
  ],
  "action": "submit"
}
```

Supported actions are `draft` and `submit`.

The backend validates the selected players against the fantasy team's owned roster before accepting changes.

---

## Lineup lifecycle

rotate. distinguishes between unfinished edits and officially submitted lineups.

**Draft**

A manager can save selections without committing them as the official lineup. These selections are stored separately in `draftPlayerIds`.

**Submitted**

A lineup becomes official when the manager submits it. The submitted players are stored in `starterPlayerIds`.

Managers can modify and resubmit their lineup before the scoring deadline.

**Locked**

Once the scoring deadline has passed, further lineup changes must be rejected.

The application currently uses a temporary development scoring-week configuration. Database-backed scoring schedules and complete automatic locking behavior are planned.

---

## Deadlock integration

The backend includes an initial Deadlock data pipeline that can:

1. Request match metadata from an external API.
2. Normalize match and player statistics into an internal representation.
3. Import matches and individual player-match statistics into MySQL.
4. Avoid duplicate match and player-stat records on repeated imports.

The current normalization pipeline handles foundational statistics such as kills, deaths, assists, and match duration.

**Important:** Public match data is not automatically verified professional competition. Future player imports will distinguish verified professional identities from ordinary game accounts before using their statistics for fantasy scoring.

---

## Development and testing

### TypeScript checks

Frontend:

```bash
npx tsc --noEmit
```

Backend:

```bash
cd server
npx tsc --noEmit
```

### Tests

Run the test commands configured in the respective `package.json` files.

For packages configured with an npm test script:

```bash
npm test
```

### Formatting

The project uses Prettier to help maintain consistent code formatting.

Code quality, import organization, linting, and repository-wide conventions are being refined as part of ongoing maintenance.

---

## Development roadmap

### Phase 1 — Application foundation

- [x] Frontend structure and navigation
- [x] Backend API
- [x] MySQL integration
- [x] Database-backed fantasy rosters
- [x] Persistent lineup drafts
- [x] Persistent lineup submissions
- [x] Lineup resubmission before deadline
- [x] Initial Deadlock match integration
- [ ] Complete production-ready lineup locking and authorization

### Phase 2 — Professional player database

- [ ] Professional esports teams
- [ ] Verified professional player profiles
- [ ] Player-to-team relationships
- [ ] External account identity mapping
- [ ] Reliable player and team imports
- [ ] Match statistics linked to professional players

### Phase 3 — Fantasy competition

- [ ] Configurable fantasy scoring
- [ ] Player fantasy point calculations
- [ ] Weekly matchups
- [ ] League standings
- [ ] Match results and performance history

### Phase 4 — Platform expansion

- [ ] User authentication
- [ ] League creation and invitations
- [ ] Drafting and player transactions
- [ ] Additional esports titles
- [ ] Production deployment

---

## Project vision

Fantasy sports have built communities around competition, strategy, and following individual players.

rotate. aims to bring that same experience to esports, with a flexible platform that can support multiple competitive games rather than being built around a single title.

The initial development focus includes VALORANT as a planned fantasy title and Deadlock as an active match-data integration.

As the platform grows, the goal is to support game-specific statistics, scoring formats, professional rosters, and league structures without sacrificing a consistent fantasy experience.

---

## License

No public license has been specified yet. All rights reserved unless a license is added to the repository.
=======
## Development Status
>>>>>>> theirs
