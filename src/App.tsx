import { useState } from 'react';

import './App.css';
import { players } from './features/roster/data/players';
import OverviewPage from './features/dashboard/pages/OverviewPage';
import RosterPage from './features/roster/pages/RosterPage';
import AppLayout from './layouts/AppLayout';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster'>('overview');
  const [starterIds, setStarterIds] = useState<number[]>([]);
  const [savedStarterIds, setSavedStarterIds] = useState<number[]>([]);
  const [err, setErr] = useState('');

  function toggleStarter(playerId: number) {
    if (starterIds.includes(playerId)) {
      setStarterIds((currentIds) => currentIds.filter((id) => id !== playerId));

      setErr('');
      return;
    }

    if (starterIds.length >= 5) {
      setErr('You can only have 5 starters at once.');
      return;
    }

    setStarterIds((currentIds) => [...currentIds, playerId]);
    setErr('');
  }

  function saveLineup() {
    if (starterIds.length !== 5) {
      setErr(`You have ${starterIds.length}/5 starters selected.`);
      return;
    } else {
      setErr('Lineup Saved!');
      setSavedStarterIds([...starterIds]);
    }
  }

  const lineupMatch =
    starterIds.length === savedStarterIds.length &&
    starterIds.every((id) => savedStarterIds.includes(id));

  const savedPlayers = savedStarterIds
    .map((id) => players.find((player) => player.id === id))
    .filter((player) => player !== undefined);

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="leagueContent">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'roster' && (
          <RosterPage
            starterIds={starterIds}
            toggleStarter={toggleStarter}
            saveLineup={saveLineup}
            lineupMatch={lineupMatch}
            err={err}
            savedPlayers={savedPlayers}
          />
        )}
      </div>
    </AppLayout>
  );
}

export default App;
