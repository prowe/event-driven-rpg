import { useEffect, useRef } from 'react';
import { useEventBus } from './EventContext';
import areas from './areas';
import { filter } from 'rxjs/operators';
import GameEvent, { ActorIdentity } from './GameEvent';
import { Observable } from 'rxjs';

interface ActorsByArea {
    [key: string]: Map<string, ActorIdentity>
}

function buildActorsByAreaMap(): ActorsByArea {
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
        function isEnterAreaEvent(event: GameEvent) {
            return event.name === 'entered-area';
        }

        function next({areaId, actor}: GameEvent) {
            const areaActors = actorsByArea.current[areaId];
            areaActors.set(actor.id, actor);

            const area = areas.find(({id}) => id === areaId);
            if (area) {
                broadcastEvent({
                    name: 'observed-area',
                    actor,
                    areaId,
                    area,
                    nearby: Array.from(areaActors.values())
                });
            }
        }

        const subscription = (subject as Observable<GameEvent>)
            .pipe(filter(isEnterAreaEvent))
            .subscribe({next});
        return () => subscription.unsubscribe();
    }, [subject, broadcastEvent]);

    useEffect(() => {
        function isExitedAreaEvent(event: GameEvent) {
            return event.name === 'exited-area';
        }

        function next({areaId, actor}: GameEvent) {
            const areaActors = actorsByArea.current[areaId];
            areaActors.delete(actor.id);
        }

        const subscription = (subject as Observable<GameEvent>)
            .pipe(filter(isExitedAreaEvent))
            .subscribe({next});
        return () => subscription.unsubscribe();
    }, [subject]);

    return null;
}