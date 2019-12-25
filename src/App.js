import React, { useState } from 'react';
import MovementControls from './MovementControls';
import CurrentPlayerContext from './CurrentPlayerContext';
import {EventBusProvider} from './EventContext';
import Timeline from './Timeline';
import Nearby from './Nearby';

function GameClient({playerId}) {
  const [player, setPlayer] = useState({
    id: playerId,
    location: {
      x: 0,
      y: 0
    }
  });

  return (
    <CurrentPlayerContext.Provider value={{player, setPlayer}}>
      <Nearby />
      <Timeline />
      <MovementControls />
    </CurrentPlayerContext.Provider>
  );
}

function App() {
  return (
    <div className="App">
      <EventBusProvider>
        <GameClient playerId="1" />
        <GameClient playerId="2" />
      </EventBusProvider>
    </div>
  );
}

export default App;
