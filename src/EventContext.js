import React, { useContext } from 'react';
import {Subject} from 'rxjs';

const eventBusContext = React.createContext();

export function EventBusProvider({children}) {
    const subject = new Subject();
    function broadcastEvent(event) {
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