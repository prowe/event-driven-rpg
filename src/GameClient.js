import React, { useEffect } from 'react';
import {useEventBus} from './EventContext';
import Exits from './Exits';
import Nearby from './Nearby';

export default function GameClient({player}) {
    const {broadcastEvent} = useEventBus();

    useEffect(() => {
        broadcastEvent({
            name: 'entered-area',
            areaId: 'start',
            actor: {
                id: player.id,
                name: player.name
            }
        });
    }, [player, broadcastEvent])

    return (
        <div>
            <h2>{player.name} ({player.id})</h2>
            <Nearby player={player} />
            <Exits player={player} />
        </div>
    );
}