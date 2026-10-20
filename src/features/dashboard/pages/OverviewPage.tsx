import StatCard from '../components/StatCard';
const leagueStats = [
  {
    id: 1,
    title: 'League Rank',
    value: '3rd',
  },
  {
    id: 2,
    title: 'Season Record',
    value: '0-0',
  },
];

function OverviewPage() {
  return (
    <>
      <header>
        <div className="leagueStatus">
          <h1>My Fantasy League</h1>
          <p>8 Teams • Head-to-Head • Week 1</p>
        </div>
        <h2>VALORANT</h2>
      </header>
      <div className="leagueContent">
        <div className="overviewContent">
          <h1>Welcome Back!</h1>
          <p>Your fantasy roster is ready for the next matchup</p>
          <div className="personalPerformance">
            {leagueStats.map((stat) => (
              <StatCard title={stat.title} value={stat.value} key={stat.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default OverviewPage;
