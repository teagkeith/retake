import './StandingsCard.css';

const teams = [
  {
    id: 1,
    name: 'Apex Predators',
    wins: 11,
    losses: 3,
    rank: 1,
  },
  {
    id: 2,
    name: 'Gridiron Guardians',
    wins: 10,
    losses: 4,
    rank: 2,
  },
  {
    id: 3,
    name: 'Blitz Brigade',
    wins: 9,
    losses: 5,
    rank: 3,
  },
  {
    id: 4,
    name: 'Endzone Empires',
    wins: 8,
    losses: 6,
    rank: 4,
  },
  {
    id: 5,
    name: 'Sonic Boom',
    wins: 7,
    losses: 7,
    rank: 5,
  },
  {
    id: 6,
    name: 'Redzone Rebels',
    wins: 5,
    losses: 9,
    rank: 6,
  },
  {
    id: 7,
    name: 'Valkyrie FC',
    wins: 4,
    losses: 10,
    rank: 7,
  },
  {
    id: 8,
    name: 'Shadow Knights',
    wins: 2,
    losses: 12,
    rank: 8,
  },
];

function StandingsCard() {
  const currentTeamId = 3;

  return (
    <section className="standingsCard">
      <header className="standingsHeader">
        <h2>League Standings</h2>
        <p>Regular Season</p>
      </header>
      <table className="standingsTable">
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Team</th>
            <th scope="col">W-L</th>
          </tr>
        </thead>

        <tbody>
          {teams.map((team) => {
            const isCurrentTeam = team.id === currentTeamId;

            return (
              <tr key={team.id} className={`teamRow ${isCurrentTeam ? 'currentTeam' : ''}`}>
                <td className="teamRank">{team.rank}</td>
                <td className="teamName">
                  {team.name}
                  {isCurrentTeam && <span className="currentTeamLabel">YOU</span>}
                </td>
                <td className="winLoss">
                  {team.wins} - {team.losses}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default StandingsCard;
