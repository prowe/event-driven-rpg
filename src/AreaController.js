import React, { useEffect } from 'react';
import { useEventBus } from './EventContext';
import areas from './areas';
import { filter } from 'rxjs/operators';


export default function AreaController() {
    const {subject, broadcastEvent} = useEventBus();

    useEffect(() => {
        function isEnterAreaEvent(event) {
            return event.name === 'entered-area';
        }

        function next({areaId, actor}) {
            const area = areas.find(({id}) => id === areaId);
            if (area) {
                broadcastEvent({
                    name: 'observed-area',
                    actor,
                    areaId,
                    area
                });
            }
        }

        const subscription = subject
            .pipe(filter(isEnterAreaEvent))
            .subscribe({next});
        return () => subscription.unsubscribe();
    }, [subject, broadcastEvent]);

    return null;
}