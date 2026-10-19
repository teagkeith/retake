import { useState } from 'react';

import './App.css'
import { players } from './data/players';
import StatCard from './components/StatCard'
import PlayerCard from './components/PlayerCard';


const leagueStats = [
  {
    id: 1,
    title: "League Rank",
    value: "3rd",
  },
  {
    id: 2,
    title: "Season Record",
    value: "0-0",
  }
];

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [starterIds, setStarterIds] = useState<number[]>([]);
  const [savedStarterIds, setSavedStarterIds] = useState<number[]>([]);
  const [err, setErr] = useState("")


  function toggleStarter(playerId: number) {
    if (starterIds.includes(playerId)) {
      setStarterIds(currentIds =>
        currentIds.filter(id => id !== playerId)
      );

      setErr("");
      return;
    }

    if (starterIds.length >= 5) {
      setErr("You can only have 5 starters at once.");
      return;
    }

    setStarterIds(currentIds => [...currentIds, playerId]);
    setErr("");
  }

  function saveLineup() {
    if(starterIds.length !== 5) {
      setErr(`You have ${starterIds.length}/5 starters selected.`);
      return;
    } else {
      setErr("Lineup Saved!")
       setSavedStarterIds([...starterIds]);
    }
  }

  const lineupMatch = starterIds.length === savedStarterIds.length && 
                    starterIds.every(id => savedStarterIds.includes(id));

  
  const savedPlayers = savedStarterIds
  .map(id => players.find(player => player.id === id))
  .filter(player => player !== undefined);

  return (
    <>
      <header>
        <div className='leagueStatus'>
          <h1>My Fantasy League</h1>
          <p>8 Teams • Head-to-Head • Week 1</p>
        </div>
        <h2>VALORANT</h2>
      </header>
      <button onClick={() => setActiveTab("overview")}>Overview</button>
      <button onClick={() => setActiveTab("roster")}>Roster</button>
      <div className='leagueContent'>
        {activeTab === "overview" && (
          <div className="overviewContent">
            <h1>Welcome Back!</h1>
            <p>Your fantasy roster is ready for the next matchup</p>
            <div className='personalPerformance'>
              {leagueStats.map((stat) => (
                <StatCard title={stat.title} value={stat.value} key={stat.id} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "roster" && (
          <>
            <div className='rosterContent'>
              <p>{err}</p>
              {players.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isStarter={starterIds.includes(player.id)}
                  onToggleStarter={() => toggleStarter(player.id)}
                />
              ))}
            </div>
            <button onClick={saveLineup} disabled={lineupMatch || starterIds.length !== 5}>Save Lineup</button>
            
          </>
        )}
        {lineupMatch ? (
          <p className="status-saved">Lineup is up to date</p>
          ) : (
          <p className="status-warning">You have unsaved changes</p>
        )}




        <div className="savedLineup">
          {savedPlayers.map(player => (
            <p key={player.id}>{player.name} - {player.team} - {player.fantasyPoints}</p>
          ))}
        </div>
      </div>
    </>
  );
}


export default App

