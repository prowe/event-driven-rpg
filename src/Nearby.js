import React, { useEffect, useContext, useReducer, useState } from 'react';
import {useEventBus} from './EventContext';
import {filter} from 'rxjs/operators';


export default function Nearby({player}) {
    function nearbyEventReducer(currentState, event) {
        // FIXME: lot of odd race conditions
        const {actor, areaId, name} = event;
        if (actor.id === player.id) {
            // if (currentState.currentAreaId !== event.areaId
            //     && name === 'entered-area') {
            //     return {
            //         areaId,
            //         nearby: {
            //             [actor.id]: actor
            //         }
            //     };
            // }
            if (name === 'observed-area') {
                const nearby = event.nearby.reduce((nearby, actor) => {
                    return {
                        ...nearby,
                        [actor.id]: actor
                    };
                }, {});
                console.log(player.id, 'observed: ', nearby)
                return {
                    areaId,
                    nearby
                };
            }
        } else {
            if (currentState.areaId === areaId) {
                if (name === 'entered-area') {
                    return {
                        areaId,
                        nearby: {
                            ...currentState.nearby,
                            [actor.id]: actor
                        }
                    };
                }
                if (name === 'exited-area') {
                    const nearby = currentState.nearby;
                    delete nearby[actor.id];
                    return {
                        areaId,
                        nearby
                    };
                }
            }
        }

        return currentState;
    }

    const {subject} = useEventBus();
    const [nearbyState, onEvent] = useReducer(nearbyEventReducer, {areaId: undefined, nearby: {}});

    useEffect(() => {
        function isReleventEvent(event) {
            const eventNames = ['entered-area', 'exited-area', 'observed-area'];
            return eventNames.includes(event.name);
        }

        const subscripton = subject.pipe(filter(isReleventEvent))
            .subscribe({next: onEvent});
        return () => subscripton.unsubscribe();
    }, [player.id, subject]);

    return (
        <div>
            <h3>Nearby {nearbyState.areaId}</h3>
            <ul>
                {Object.values(nearbyState.nearby).map(actor => <li key={actor.id}>{actor.name}</li>)}
            </ul>
        </div>
    );
}