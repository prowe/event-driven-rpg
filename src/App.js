import React, { useState } from 'react';
import {EventBusProvider} from './EventContext';
import GlobalTimeline from './GlobalTimeline';
import GameClient from './GameClient';
import Chance from 'chance';
import shortid from 'shortid';
import AreaController from './AreaController';
import ItemController from './ItemController';
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
        <GlobalTimeline />
        <ItemController />
        <AreaController />

        <button onClick={addPlayer}>Add Player</button>
        {players.map(player => <GameClient key={player.id} player={player} />)}
      </EventBusProvider>
    </div>
  );
}

export default App;
