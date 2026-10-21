import { useState } from 'react';

// Redux 
import { useAppDispatch, useAppSelector } from './app/hooks';
import { toggleStarter, saveLineup } from './features/roster/store/lineupSlice';

import {
  selectStarterIds,
  selectLineupError,
  selectLineupMatch,
  selectSavedPlayers,
} from './features/roster/store/lineSelectors';

import './App.css';
import OverviewPage from './features/dashboard/pages/OverviewPage';
import RosterPage from './features/roster/components/RosterPage';
import AppLayout from './layouts/AppLayout';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster'>('overview');

  const dispatch = useAppDispatch();
  const starterIds = useAppSelector(selectStarterIds);
  const err = useAppSelector(selectLineupError);


  const lineupMatch = useAppSelector(selectLineupMatch);

  const savedPlayers = useAppSelector(selectSavedPlayers);

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="leagueContent">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'roster' && (
          <RosterPage
            starterIds={starterIds}
            toggleStarter={(playerId) => dispatch(toggleStarter(playerId))}
            saveLineup={() => dispatch(saveLineup())}
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
