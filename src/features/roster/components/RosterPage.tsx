import './RosterPage.css';
import type { FantasyPlayer } from '../../league/api/fantasyTeamApi';
import PlayerCard from './PlayerCard';

interface RosterPageProps {
  rosterPlayerIds: string[];
  starterIds: string[];
  toggleStarter: (playerId: string) => void;
  saveDraft: () => void;
  saveLineup: () => void;
  lineupMatch: boolean;
  err: string;
  savedStarterIds: string[];
  draftSaved: boolean;
  isLineupLocked: boolean;
  teamPlayers: FantasyPlayer[];
  isLineupFinalized: boolean;
}

function RosterPage({
  starterIds,
  toggleStarter,
  saveDraft,
  saveLineup,
  lineupMatch,
  err,
  savedStarterIds,
  rosterPlayerIds,
  draftSaved,
  isLineupLocked,
  teamPlayers,
  isLineupFinalized,
}: RosterPageProps) {
  const ownedPlayers = teamPlayers
    .filter((player) => rosterPlayerIds.includes(player.id))
    .map((player) => ({
      id: player.id,
      name: player.displayName,
      team: 'Unassigned',
      role: 'Unknown',
      kills: null,
      deaths: null,
      assists: null,
      fantasyPoints: null,
    }));
  const savedLineupPlayers = savedStarterIds
    .map((id) => ownedPlayers.find((player) => player.id === id))
    .filter((player) => player !== undefined);

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
          {isLineupFinalized && (
            <p className="lineup-status">
              This lineup is locked because the scoring deadline has passed.
            </p>
          )}
          <div className="lineupActions">
            <button
              type="button"
              className="saveDraftButton"
              onClick={saveDraft}
              disabled={isLineupFinalized}
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={saveLineup}
              disabled={
                isLineupLocked || isLineupFinalized || lineupMatch || starterIds.length !== 5
              }
            >
              Submit Lineup
            </button>
          </div>
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

        {isLineupLocked && savedLineupPlayers.length === 5 ? (
          <p className="status-saved">Scoring week locked. Your submitted lineup is final.</p>
        ) : isLineupLocked ? (
          <p className="status-warning">
            Submission deadline passed. No lineup was submitted for this scoring week.
          </p>
        ) : draftSaved ? (
          <p className="status-saved">Draft saved successfully</p>
        ) : lineupMatch && savedLineupPlayers.length === 5 ? (
          <p className="status-saved">Lineup submitted and up to date</p>
        ) : starterIds.length < 5 ? (
          <p className="status-incomplete">
            Select {5 - starterIds.length} more starters, or save your draft
          </p>
        ) : (
          <p className="status-warning">You have unsubmitted changes</p>
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

          <span className="savedLineupCount">{savedLineupPlayers.length} / 5</span>
        </header>

        <div className="savedLineupPlayers">
          {savedLineupPlayers.map((player) => (
            <div className="savedPlayer" key={player.id}>
              <div className="savedPlayerIdentity">
                <p className="savedPlayerName">{player.name}</p>
                <p className="savedPlayerTeam">{player.team}</p>
              </div>

              <span className="savedPlayerPoints">
                {player.fantasyPoints === null ? '—' : `${player.fantasyPoints} PTS`}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Player Cards */}
      <section className="rosterContent" aria-label="Available players">
        {ownedPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isStarter={starterIds.includes(player.id)}
            onToggleStarter={() => {
              if (!isLineupFinalized) {
                toggleStarter(player.id);
              }
            }}
            disabled={isLineupFinalized || isLineupLocked}
          />
        ))}
      </section>
    </div>
  );
}

export default RosterPage;
