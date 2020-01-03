import React, { useState, useEffect } from 'react';
import {useEventBus} from './EventContext';
import styles from './GlobalTimeline.module.css';

export default function GlobalTimeline() {
    const {subject} = useEventBus();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        function appendEvent(event) {
            setEvents((currentEvents) => {
                const newEvents = [...currentEvents, event]
                if (newEvents.length > 10) {
                    newEvents.pop();
                }
                return newEvents;
            })
        }

        subject.subscribe({
            next: appendEvent
        });
    }, [subject]);

    return (
        <ul className={styles.timeline}>
            {events.map((event) => <li key={event.id}>{JSON.stringify(event)}</li>)}
        </ul>
    );
}