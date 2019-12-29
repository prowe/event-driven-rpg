import { useEffect, useRef } from 'react';
import { useEventBus } from './EventContext';
import areas from './areas';
import { filter } from 'rxjs/operators';

function buildActorsByAreaMap() {
    return areas.reduce((actorsByArea, area) => {
        return {
            ...actorsByArea,
            [area.id]: new Map()
        }
    }, {});
}

export default function AreaController() {
    const {subject, broadcastEvent} = useEventBus();
    const actorsByArea = useRef(buildActorsByAreaMap());

    useEffect(() => {
        function isEnterAreaEvent(event) {
            return event.name === 'entered-area';
        }

        function next({areaId, actor}) {
            const areaActors = actorsByArea.current[areaId];
            areaActors.set(actor.id, actor);
            console.log('area actors', areaId, areaActors);

            const area = areas.find(({id}) => id === areaId);
            if (area) {
                broadcastEvent({
                    name: 'observed-area',
                    actor,
                    areaId,
                    area,
                    nearby: [...areaActors.values()]
                });
            }
        }

        const subscription = subject
            .pipe(filter(isEnterAreaEvent))
            .subscribe({next});
        return () => subscription.unsubscribe();
    }, [subject, broadcastEvent]);

    useEffect(() => {
        function isExitedAreaEvent(event) {
            return event.name === 'exited-area';
        }

        function next({areaId, actor}) {
            const areaActors = actorsByArea.current[areaId];
            areaActors.delete(actor.id);
        }

        const subscription = subject
            .pipe(filter(isExitedAreaEvent))
            .subscribe({next});
        return () => subscription.unsubscribe();
    }, [subject]);

    return null;
}