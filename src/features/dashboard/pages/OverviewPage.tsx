import StandingsCard from '../../league/components/StandingsCard';
import MatchupCard from '../../matchups/components/MatchupCard';
import StatCard from '../components/StatCard';
import './Overviewpage.css';
import { Trophy, Swords, Zap, Users } from 'lucide-react';

const leagueStats = [
  {
    id: 1,
    title: 'League Rank',
    value: '3rd',
    subtitle: 'Out of 8 teams',
    icon: Trophy,
  },
  {
    id: 2,
    title: 'Season Record',
    value: '0-0',
    subtitle: 'Regular season',
    icon: Swords,
  },
  {
    id: 3,
    title: 'Fantasy Points',
    value: '0',
    subtitle: 'Total season points',
    icon: Zap,
  },
  {
    id: 4,
    title: 'Active Starters',
    value: '0',
    subtitle: 'Out of 5 slots',
    icon: Users,
  },
];

function OverviewPage() {
  return (
    <div className="overviewPage">
      <header className="leagueHeader">
        <div className="leagueStatus">
          <h1>My Fantasy League</h1>
          <p>8 Teams • Head-to-Head • Week 1</p>
        </div>
        <span className="gameBadge">VALORANT</span>
      </header>
      <div className="leagueContent">
        <div className="overviewContent">
          <div className="welcomeHeader">
            <h1>Welcome Back!</h1>
            <p>Your fantasy roster is ready for the next matchup</p>
          </div>

          <div className="personalPerformance">
            {leagueStats.map((stat) => (
              <StatCard
                key={stat.id}
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                icon={stat.icon}
              />
            ))}
          </div>

          <div className="dashboardPanels">
            <MatchupCard
              week={1}
              homeTeam="Home"
              awayTeam="Away"
              homeScore={0}
              awayScore={0}
              status="upcoming"
            />

            <StandingsCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewPage;
