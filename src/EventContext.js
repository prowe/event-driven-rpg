import React, { useContext } from 'react';
import {Subject} from 'rxjs';
import shortid from 'shortid';

const eventBusContext = React.createContext();

export function EventBusProvider({children}) {
    const subject = new Subject();
    function broadcastEvent(event) {
        event.id = shortid.generate();
        event.timestamp = new Date(Date.now()).toISOString();
        subject.next(event);
    }

    return (
        <eventBusContext.Provider value={{subject, broadcastEvent}}>
            {children}
        </eventBusContext.Provider>
    );
}

export function useEventBus() {
    const {subject, broadcastEvent} = useContext(eventBusContext);
    return {subject, broadcastEvent};
}