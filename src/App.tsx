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
  const [starterIds, setStarterIds] = useState<number[]>([1,2]);

  function toggleStarter(playerId: number){
   setStarterIds(currentIds => {
    if (currentIds.includes(playerId)) {
      return currentIds.filter(id => id !== playerId);
    } else {
      return [...currentIds, playerId];
    }
   });
  } 

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
      
      {
        activeTab === "overview" && (
        <div className="overviewContent">
          <h1>Welcome Back!</h1>
          <p>Your fantasy roster is ready for the next matchup</p>
          <div className='personalPerformance'>
          {
            leagueStats.map((stat) => (
              <StatCard title={stat.title} value={stat.value} key={stat.id}/>
            ))
          }
          </div> 
        </div>
      )}
      
      {
        activeTab === "roster" && (
          <div className='rosterContent'>
            {
              players.map((player) => (
                <PlayerCard key={player.id} player={player}  isStarter={starterIds.includes(player.id)} onToggleStarter={() => toggleStarter(player.id)}/>
              )
            )}
          </div>
        )
      }
    </div>
    </>
  )
}

export default App


{/* <div className='peronalPreformance'>
        {
          leagueStats.map((stat) => (
            <StatCard key={stat.id} title={stat.title} value={stat.value} />
          ))
        }
      </div> */}