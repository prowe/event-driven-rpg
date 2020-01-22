import React, { useRef, useEffect, useReducer, useState } from 'react';
import { useEventBus } from './EventContext';
import { filter } from 'rxjs/operators';

function reduceItemEvent(inventory, event) {
    const item = event.item;
    switch (event.name) {
        case 'item-given':
        case 'item-dropped':
            return inventory
                .filter(e => e.id !== item.id);
        case 'item-obtained':
            return inventory
                .filter(e => e.id !== item.id)
                .concat([item]);
        default:
            return inventory;
    }
}

function useCurrentTarget(subject, playerId) {
    const [currentTarget, setCurrentTarget] = useState();

    useEffect(() => {
        function isPlayerTargetEvent(event) {
            return ['changed-target'].includes(event.name)
                && event.actor.id === playerId;
        }

        function next(event) {
            setCurrentTarget(event.target);
        }

        const subscription = subject.pipe(filter(isPlayerTargetEvent))
            .subscribe({next});
        return () => subscription.unsubscribe();
    }, [subject, playerId]);

    return currentTarget;
}

export default function PlayerInventory({player}) {
    const {subject, broadcastEvent} = useEventBus();
    const currentArea = useRef();
    const currentTarget = useCurrentTarget(subject, player.id);
    const [inventory, onInventoryEvent] = useReducer(reduceItemEvent, []);

    useEffect(() => {
        function isPlayerEnterArea(event) {
            return event.name === 'entered-area'
                && event.actor.id === player.id;
        }

        const subscription = subject.pipe(filter(isPlayerEnterArea))
            .subscribe({next: (event) => currentArea.current = event.areaId});
        return () => subscription.unsubscribe();
    }, [subject, player.id]);

    useEffect(() => {
        function isItemEvent(event) {
            return ['item-dropped', 'item-obtained', 'item-given'].includes(event.name)
                && event.actor.id === player.id;
        }

        function next(event) {
            onInventoryEvent({
                ...event,
                iAmActor: event.actor.id === player.id,
                iamTarget: event.target && event.target.id === player.id
            });
        }

        const subscription = subject.pipe(filter(isItemEvent))
            .subscribe({next});
        return () => subscription.unsubscribe();
    }, [subject, player.id]);

    return (
        <div style={{gridArea: 'PlayerInventory'}}>
            <h3>Inventory</h3>
            <ul>
                {inventory.map(item => {
                    function drop() {
                        broadcastEvent({
                            name: 'item-dropped',
                            areaId: currentArea.current,
                            actor: {
                                id: player.id,
                                name: player.name
                            },
                            item: {
                                id: item.id,
                                name: item.name
                            }
                        });
                    }

                    function give() {
                        broadcastEvent({
                            name: 'item-given',
                            areaId: currentArea.current,
                            actor: {
                                id: player.id,
                                name: player.name
                            },
                            item: {
                                id: item.id,
                                name: item.name
                            },
                            target: currentTarget
                        });
                    }

                    return (
                        <li key={item.id}>
                            {item.name}
                            <button onClick={drop}>Drop</button>
                            {<button onClick={give} disabled={!currentTarget}>Give</button>}
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}