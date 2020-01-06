import React, { useEffect, useReducer, useState, useRef } from 'react';
import {useEventBus} from './EventContext';
import {filter} from 'rxjs/operators';

function NearbyItem({item, player}) {
    const {broadcastEvent} = useEventBus();

    function pickup() {
        broadcastEvent({
            name: 'try-pickup-item',
            actor: {
                id: player.id,
                name: player.name
            },
            areaId: item.areaId,
            item: {
                id: item.id,
                name: item.name
            }
        });
    }
    return <li key={item.id}>{item.name} <button onClick={pickup}>Pickup</button></li>;
}

export default function NearbyItems({player}) {
    const areaRef = useRef();
    const {subject} = useEventBus();

    function nearbyItemEventReducer(items, event) {
        const {areaId, actor, item} = event;

        if (event.name === 'item-dropped' && areaId === areaRef.current) {
            return items
                .filter(e => e.id !== item.id)
                .concat([{...item, areaId}]);
        }

        if (event.name === 'item-obtained' && areaId === areaRef.current) {
            return items
                .filter(e => e.id !== item.id);
        }

        if (actor.id === player.id) {
            switch (event.name) {
                case 'entered-area':
                    areaRef.current = areaId;
                    return items
                        .filter(e => e.areaId === areaId);
                case 'observed-area':
                    const dedupMap = new Map();
                    items.forEach(entry => {
                        dedupMap.set(entry.id, entry);
                    });
                    event.items.forEach(entry => {
                        dedupMap.set(entry.id, {
                            ...entry,
                            areaId
                        });
                    });
                    return [...dedupMap.values()];
                default:
                    return items;
            }
        }
        return items;
    }

    const [nearbyItems, onEvent] = useReducer(nearbyItemEventReducer, []);

    useEffect(() => {
        function isReleventEvent(event) {
            return ['item-dropped', 'item-obtained', 'observed-area', 'entered-area'].includes(event.name);
        }

        const subscripton = subject.pipe(filter(isReleventEvent))
            .subscribe({next: onEvent});
        return () => subscripton.unsubscribe();
    }, [player.id, subject]);

    return (
        <div style={{gridArea: 'NearbyItems'}}>
            <h3>Nearby Items</h3>
            <ul>
                {nearbyItems.map(item => <NearbyItem player={player} item={item} />)}
            </ul>
        </div>
    );
}