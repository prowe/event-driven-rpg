import React from 'react';
import MovementControls from './MovementControls';
import CurrentPlayerContext from './CurrentPlayerContext';

function App() {
  return (
    <div className="App">
      <CurrentPlayerContext.Provider value={{id: '1'}}>
        <MovementControls />
      </CurrentPlayerContext.Provider>
    </div>
  );
}

export default App;
