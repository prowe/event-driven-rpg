import React, { useState, useEffect, useReducer, useRef } from 'react';
import { useEventBus } from './EventContext';
import { filter } from 'rxjs/operators';
import styles from './PlayerConsole.module.css';

function timelineEntryReducer(currentEntries, entry) {
    return [...currentEntries, entry].slice(-5);
}

export default function PlayerConsole({player}) {
    const {subject, broadcastEvent} = useEventBus();
    const currentAreaRef = useRef(undefined);
    const [timelineEntries, appendTimelineEntry] = useReducer(timelineEntryReducer, []);
    const [commandValue, setCommand] = useState('');

    useEffect(() => {
        function ObserveAreaEntry({description}) {
            return <span>{description}</span>;
        }

        function isObserveAreaEvent(event) {
            return event.name === 'observed-area' &&
                event.actor.id === player.id;
        }

        function onObserveAreaEvent({id, timestamp, area, areaId}) {
            appendTimelineEntry({
                id,
                timestamp,
                component: ObserveAreaEntry,
                props: {
                    description: area.description
                }
            });
            currentAreaRef.current = areaId;
        }

        const subscription = subject.pipe(filter(isObserveAreaEvent))
            .subscribe({next: onObserveAreaEvent});
        return () => subscription.unsubscribe();
    }, [subject, appendTimelineEntry, player.id]);

    useEffect(() => {
        function CharacterSpeaks({timestamp, actor, message}) {
            return (
                <span><strong>{actor.name} - </strong>{message}</span>
            );
        }

        function isLocalCharacterSpeaksEvent(event) {
            return event.name === 'character-speaks' &&
                event.areaId === currentAreaRef.current;
        }

        function onCharacterSpeaksEvent({id, timestamp, actor, message}) {
            appendTimelineEntry({
                id,
                timestamp,
                component: CharacterSpeaks,
                props: {
                    actor,
                    message
                }
            });
        }

        const subscription = subject.pipe(filter(isLocalCharacterSpeaksEvent))
            .subscribe({next: onCharacterSpeaksEvent});
        return () => subscription.unsubscribe();
    }, [subject, appendTimelineEntry, player.id]);

    function onCommandChange(event) {
        setCommand(event.target.value);
    }

    function onCommandSubmit(event) {
        event.preventDefault();
        broadcastEvent({
            name: 'character-speaks',
            areaId: currentAreaRef.current,
            message: commandValue,
            actor: {
                id: player.id,
                name: player.name
            }
        });
        setCommand('');
    }

    return (
        <div className={styles.container}>
            <ul className={styles.timeline}>
                {timelineEntries.map(entry => {
                    const timestampString = new Date(Date.parse(entry.timestamp)).toLocaleTimeString(undefined, {
                        fractionalSecondDigits: 0,
                        timeStyle: 'short'
                    });

                    return (
                        <li key={entry.id} >
                            <span className={styles.timelineEntryTimestamp}>{timestampString}</span>
                            <entry.component {...entry.props} />
                        </li>
                    );
                })}
            </ul>
            <form className={styles.commandForm} onSubmit={onCommandSubmit}>
                <input value={commandValue} onChange={onCommandChange} />
            </form>
        </div>
    );
}