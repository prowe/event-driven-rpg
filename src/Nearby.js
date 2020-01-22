import React, { useEffect, useReducer } from 'react';
import {useEventBus} from './EventContext';
import {filter} from 'rxjs/operators';
import styles from './Nearby.module.css';

function reduceCurrentPlayerEvent(currentState, event) {
    switch (event.name) {
    case 'entered-area':
        return {
            ...currentState,
            areaId: event.areaId
        };
    case 'exited-area':
        return {
            ...currentState,
            nearby: currentState.nearby
                .filter(e => e.areaId !== event.areaId)
        };
    case 'observed-area':
        const dedupMap = new Map();
        currentState.nearby.forEach(entry => {
            dedupMap.set(entry.id, entry);
        });
        event.nearby.forEach(entry => {
            dedupMap.set(entry.id, {
                ...entry,
                areaId: event.areaId
            });
        });

        return {
            ...currentState,
            nearby: [...dedupMap.values()]
        };
    case 'changed-target':
        return {
            ...currentState,
            target: event.target
        };
    default:
        return currentState;
    }
}

function reduceOtherEvent(currentState, event) {
    if (event.areaId !== currentState.areaId) {
        return currentState;
    }
    switch (event.name) {
        case 'entered-area':
            const entry = {
                ...event.actor,
                areaId: event.areaId
            };

            return {
                ...currentState,
                nearby: currentState.nearby
                    .filter(e => e.id !== entry.id)
                    .concat([entry])
            };
        case 'exited-area':
            return {
                ...currentState,
                nearby: currentState.nearby
                    .filter(e => e.id !== event.actor.id)
            };
        default:
            return currentState;
    }
}

export default function Nearby({player}) {
    function nearbyEventReducer(currentState, event) {
        return event.actor.id === player.id
            ? reduceCurrentPlayerEvent(currentState, event)
            : reduceOtherEvent(currentState, event);
    }

    const {subject, broadcastEvent} = useEventBus();
    const [nearbyState, onEvent] = useReducer(nearbyEventReducer, {areaId: undefined, nearby: []});

    useEffect(() => {
        function isReleventEvent(event) {
            const eventNames = ['entered-area', 'exited-area', 'observed-area', 'changed-target'];
            return eventNames.includes(event.name);
        }

        const subscripton = subject.pipe(filter(isReleventEvent))
            .subscribe({next: onEvent});
        return () => subscripton.unsubscribe();
    }, [player.id, subject]);

    return (
        <div style={{gridArea: 'Nearby'}}>
            <h3>Nearby {nearbyState.areaId}</h3>
            <ul>
                {nearbyState.nearby.map(entry => {
                    const isTarget = nearbyState.target && nearbyState.target.id === entry.id;
                    function toggleTarget() {
                        const target = isTarget ? undefined : {
                            id: entry.id,
                            name: entry.name
                        };
                        broadcastEvent({
                            name: 'changed-target',
                            actor: {
                                id: player.id,
                                name: player.name
                            },
                            areaId: nearbyState.areaId,
                            target
                        });
                    }
                    return (
                        <li key={entry.id}>
                            {entry.name}
                            <button className={isTarget && styles.targetedTargetButton} onClick={toggleTarget}>Target</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}