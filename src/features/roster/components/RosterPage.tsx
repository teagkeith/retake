import './RosterPage.css';
import PlayerCard from '../components/PlayerCard';
import { mockProPlayers } from '../../players/data/mockProPlayers';
import { mockProTeams } from '../../players/data/mockProTeams';
import { mockPlayerPerformances } from '../../players/data/mockPlayerPerformances';
import { buildPlayerCardData } from '../../players/utils/buildPlayerCardData';
import type { PlayerCardData } from '../utils/toPlayerCardData';

interface RosterPageProps {
  rosterPlayerIds: string[];
  starterIds: string[];
  toggleStarter: (playerId: string) => void;
  saveLineup: () => void;
  lineupMatch: boolean;
  err: string;
  savedPlayers: PlayerCardData[];
}

const rosterPlayers = buildPlayerCardData(
  mockProPlayers,
  mockProTeams,
  mockPlayerPerformances,
  'week-1',
);

function RosterPage({
  starterIds,
  toggleStarter,
  saveLineup,
  lineupMatch,
  err,
  savedPlayers,
  rosterPlayerIds,
}: RosterPageProps) {
  const ownedPlayers = rosterPlayers.filter((player) => rosterPlayerIds.includes(player.id));
  return (
    <div className="rosterPage">
      {/* Page Header */}
      <header className="rosterHeader">
        <div>
          <h1>My Roster</h1>
          <p>Manage your fantasy starting lineup.</p>
        </div>

        <span className="rosterCount">{starterIds.length} / 5 STARTERS</span>
      </header>

      {/* Lineup Manager */}
      <section className="lineupManager">
        <div className="lineupManagerHeader">
          <h2>Starting Lineup</h2>

          <button
            type="button"
            onClick={saveLineup}
            disabled={lineupMatch || starterIds.length !== 5}
          >
            Submit Lineup
          </button>
        </div>

        <div
          className="lineupProgress"
          role="progressbar"
          aria-label="Starting lineup slots filled"
          aria-valuemin={0}
          aria-valuemax={5}
          aria-valuenow={starterIds.length}
        >
          <div
            className="lineupProgressFill"
            style={{ width: `${(starterIds.length / 5) * 100}%` }}
          />
        </div>

        {starterIds.length < 5 ? (
          <p className="status-incomplete">Select {5 - starterIds.length} more starters</p>
        ) : lineupMatch ? (
          <p className="status-saved">Lineup is up to date</p>
        ) : (
          <p className="status-warning">You have unsaved changes</p>
        )}

        {err && (
          <p className="rosterMessage" role="status">
            {err}
          </p>
        )}
      </section>

      {/* Saved Starting Five */}
      <section className="savedLineup">
        <header className="savedLineupHeader">
          <div className="savedLineupTitle">
            <h2>Saved Starting Five</h2>
            <p>Your currently committed lineup</p>
          </div>

          <span className="savedLineupCount">{savedPlayers.length} / 5</span>
        </header>

        <div className="savedLineupPlayers">
          {savedPlayers.length > 0 ? (
            savedPlayers.map((player) => (
              <div className="savedPlayer" key={player.id}>
                <div className="savedPlayerIdentity">
                  <p className="savedPlayerName">{player.name}</p>
                  <p className="savedPlayerTeam">{player.team}</p>
                </div>

                <span className="savedPlayerPoints">
                  {player.fantasyPoints === null ? '—' : `${player.fantasyPoints} PTS`}
                </span>
              </div>
            ))
          ) : (
            <p className="savedLineupEmpty">
              No lineup saved yet. Select five starters and save your lineup.
            </p>
          )}
        </div>
      </section>

      {/* Player Cards */}
      <section className="rosterContent" aria-label="Available players">
        {ownedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isStarter={starterIds.includes(player.id)}
            onToggleStarter={() => toggleStarter(player.id)}
          />
        ))}
      </section>
    </div>
  );
}

export default RosterPage;
