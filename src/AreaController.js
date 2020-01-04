import { useEffect, useRef } from 'react';
import { useEventBus } from './EventContext';
import getAreas from './areas';

export default function AreaController() {
    const {subject, broadcastEvent} = useEventBus();
    const areas = useRef(null);

    useEffect(() => {
        areas.current = getAreas();

        const subscriptions = areas.current
            .map(area => area.subscribe(subject, broadcastEvent));

        return () => subscriptions.forEach(sub => sub.unsubscribe());
    }, [subject, broadcastEvent]);

    return null;
}