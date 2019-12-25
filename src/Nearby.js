import React, { useEffect, useContext, useReducer } from 'react';
import CurrentPlayerContext from './CurrentPlayerContext';
import {useEventBus} from './EventContext';
import {filter} from 'rxjs/operators';

function calculateDelta(a, b) {
    return {
        deltaX: a.x - b.x,
        deltaY: a.y - b.y
    };
}

function isMovementEvent(event) {
    return event.name === 'character-moved';
}

export default function Nearby() {
    const {subject} = useEventBus();
    const {player} = useContext(CurrentPlayerContext);

    function nearbyPlayerReducer(nearby, event) {
        const nearbyEntry = {
            ...event.actor,
            ...event.newLocation
        };

        nearby[nearbyEntry.id] = nearbyEntry;
        const currentPlayerLocation = nearby[player.id];

        return Object.entries(nearby)
            .filter(([key, value]) => {
                if (!currentPlayerLocation) {
                    return true;
                }
                const delta = calculateDelta(currentPlayerLocation, value);
                return Math.abs(delta.deltaX) <= 3 && Math.abs(delta.deltaY) <=2;
            })
            .reduce((newNearby, [key, value]) => {
                newNearby[key] = value;
                return newNearby;
            }, {});
    }

    const [nearbyPlayers, onEvent] = useReducer(nearbyPlayerReducer, {});

    useEffect(() => {
        const subscripton = subject.pipe(filter(isMovementEvent))
            .subscribe({next: onEvent});
        return () => subscripton.unsubscribe();
    }, [subject]);

    return (
        <ul>
            {Object.values(nearbyPlayers).map(({id, x, y}) => <li key={id}>{id} ({x},{y})</li>)}
        </ul>
    );
}