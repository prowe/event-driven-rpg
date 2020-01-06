import React, { useEffect } from 'react';
import {useEventBus} from './EventContext';
import Exits from './Exits';
import Nearby from './Nearby';
import PlayerConsole from './PlayerConsole';
import styles from './GameClient.module.css';
import NearbyItems from './NearbyItems';
import PlayerInventory from './PlayerInventory';

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
        <div className={styles.gameClient}>
            <h2 className={styles.header}>{player.name} ({player.id})</h2>
            <Nearby player={player} />
            <NearbyItems player={player} />
            <PlayerConsole player={player} />
            <Exits player={player} />
            <PlayerInventory player={player} />
        </div>
    );
}