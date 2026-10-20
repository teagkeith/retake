import './MatchupCard.css';

interface MatchupCardProps {
  week: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'upcoming' | 'live' | 'final';
}

function MatchupCard({ week, homeTeam, awayTeam, homeScore, awayScore, status }: MatchupCardProps) {
  const homeTeamInitials = homeTeam.slice(0, 2).toUpperCase();
  const awayTeamInitials = awayTeam.slice(0, 2).toUpperCase();
  return (
    <section className="matchupCard">
      <header className="matchupHeader">
        <div className="matchupDetails">
          <h2>Weekly Matchup</h2>
          <p>Week {week}</p>
        </div>

        <span className={`matchupStatus ${status}`}>
          {status === 'final' ? 'Final' : status === 'live' ? 'Live' : 'Upcoming'}
        </span>
      </header>

      <div className="matchupTeams">
        <div className="matchupTeam">
          <div className="teamAvatar">{homeTeamInitials}</div>
          <p>{homeTeam}</p>
          <h2>{homeScore.toFixed(1)}</h2>
        </div>

        <div className="matchupVersus">
          <span>VS</span>
        </div>

        <div className="matchupTeam">
          <div className="teamAvatar">{awayTeamInitials}</div>
          <p>{awayTeam}</p>
          <h2>{awayScore.toFixed(1)}</h2>
        </div>
      </div>
      <div className="matchupInfo">
        <div className="projectedPoints">
          <p>Projected Points</p>
          <h2>-</h2>
          <p>Awaiting Projections</p>
        </div>
        <div className="scoringPeriod">
          <p>Scoring Period</p>
          <h2>Week {week}</h2>
          <p>Regular season</p>
        </div>
      </div>
      <footer className="matchupFooter">
        <p>Matchup has not started</p>
        <span>Matchup Details →</span>
      </footer>
    </section>
  );
}

export default MatchupCard;
