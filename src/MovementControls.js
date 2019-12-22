import React, {useState, useContext, useEffect} from 'react';
import {filter} from 'rxjs/operators';
import styles from './MovementControls.module.css';
import CurrentPlayerContext from './CurrentPlayerContext';
import {useEventBus} from './EventContext';

export default function MovementControls() {
    const {subject, broadcastEvent} = useEventBus();
    const {player, setPlayer} = useContext(CurrentPlayerContext);
    const playerId = player.id;

    useEffect(() => {
        function isMovementEvent(event) {
            return event.name === 'character-moved' &&
                event.actor.id === playerId;
        }

        function next(event) {
            setPlayer((player) => {
                return {
                    ...player,
                    location: event.newLocation
                };
            });
        }

        const subscription = subject
            .pipe(filter(isMovementEvent))
            .subscribe({next});
        return () => subscription.unsubscribe();
    }, [subject, setPlayer, playerId])

    function onWillMove(deltaX, deltaY) {
        const {x, y} = player.location;

        broadcastEvent({
            name: 'character-moved',
            location: player.location,
            actor: {
                id: player.id
            },
            newLocation: {
                x: x + deltaX,
                y: y + deltaY
            }
        })
    }

    return (
        <div className={styles.controls}>
            <button className={styles.northButton} onClick={() => onWillMove(0, 1)}>N</button>
            <button className={styles.eastButton} onClick={() => onWillMove(1, 0)}>E</button>
            <button className={styles.southButton} onClick={() => onWillMove(0, -1)}>S</button>
            <button className={styles.westButton} onClick={() => onWillMove(-1, 0)}>W</button>
            <div className={styles.currentPosition}>
                {player.location.x},{player.location.y}
            </div>
        </div>
    );
}
