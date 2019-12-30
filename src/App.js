import React, { useState } from 'react';
import {EventBusProvider} from './EventContext.tsx';
import Timeline from './Timeline';
import GameClient from './GameClient';
import Chance from 'chance';
import shortid from 'shortid';
import AreaController from './AreaController.tsx';
const chance = new Chance();

function App() {
  const [players, setPlayers] = useState([]);

  function addPlayer() {
    const newPlayer = {
      id: shortid.generate(),
      name: chance.first()
    };

    setPlayers((currentPlayers) => [...currentPlayers, newPlayer]);
  }

  return (
    <div className="App">
      <EventBusProvider>
        <Timeline />
        <AreaController />

        <button onClick={addPlayer}>Add Player</button>
        {players.map(player => <GameClient key={player.id} player={player} />)}
      </EventBusProvider>
    </div>
  );
}

export default App;
