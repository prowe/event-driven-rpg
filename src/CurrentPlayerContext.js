import React from 'react';

const playerContext = React.createContext();

export default playerContext;
export const Provider = playerContext.Provider;
export const Consumer = playerContext.Consumer;