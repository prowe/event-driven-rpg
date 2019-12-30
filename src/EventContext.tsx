import React, { useContext } from 'react';
import {Subject, Observable} from 'rxjs';
import shortid from 'shortid';
import GameEvent from './GameEvent';

interface EventContext {
    readonly subject: Observable<GameEvent>;
    readonly broadcastEvent: (event: GameEvent) => void;
}

const subject = new Subject<GameEvent>();

function broadcastEvent(event: GameEvent) {
    // event.id = shortid.generate();
    // event.timestamp = new Date(Date.now()).toISOString();
    subject.next(event);
}

const context = React.createContext<EventContext>({subject, broadcastEvent});

export function EventBusProvider({children}) {
    return (
        <context.Provider value={{subject, broadcastEvent}}>
            {children}
        </context.Provider>
    );
}

export function useEventBus(): EventContext {
    const {subject, broadcastEvent} = useContext(context);
    return {subject, broadcastEvent};
}