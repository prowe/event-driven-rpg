import React, { useRef, useEffect, useReducer } from 'react';
import { useEventBus } from './EventContext';
import { filter } from 'rxjs/operators';

function reduceItemEvent(inventory, event) {
    const item = event.item;
    switch (event.name) {
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

export default function PlayerInventory({player}) {
    const {subject, broadcastEvent} = useEventBus();
    const currentArea = useRef();
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
            return ['item-dropped', 'item-obtained'].includes(event.name)
                && event.actor.id === player.id;
        }

        const subscription = subject.pipe(filter(isItemEvent))
            .subscribe({next: onInventoryEvent});
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
                    return <li key={item.id}>{item.name} <button onClick={drop}>Drop</button></li>
                })}
            </ul>
        </div>
    )
}